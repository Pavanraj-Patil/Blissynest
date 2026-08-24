import { db } from "@/lib/db";

type ErrorResult = { error: string; status: number };

// Real reviews require a real order, but there's no fulfillment pipeline
// yet to move an Order from PLACED to DELIVERED (no admin order-management
// UI exists — see BACKEND_TODO). Gating this on `status === "DELIVERED"`
// would make the feature permanently unusable, since every order in the
// system is stuck at PLACED. So the check here is "this order is really
// yours and really contains this product" — not "has been delivered" —
// with this comment as the flag to tighten it later once order status
// updates exist.
export async function createReview(
  userId: string,
  input: { orderId: string; productId: string; rating: number; comment: string }
): Promise<{ error: string; status: number } | { id: string }> {
  const order = await db.order.findUnique({
    where: { id: input.orderId },
    include: { items: { where: { productId: input.productId } } },
  });

  if (!order || order.userId !== userId) {
    return { error: "Order not found.", status: 404 };
  }
  if (order.items.length === 0) {
    return { error: "That product isn't part of this order.", status: 400 };
  }

  const existing = await db.review.findUnique({
    where: { orderId_productId: { orderId: input.orderId, productId: input.productId } },
  });
  if (existing) {
    return { error: "You've already reviewed this product for this order.", status: 409 };
  }

  const review = await db.review.create({
    data: {
      productId: input.productId,
      userId,
      orderId: input.orderId,
      rating: input.rating,
      comment: input.comment,
    },
  });

  return { id: review.id };
}

export type ApprovedReview = {
  name: string;
  rating: number;
  date: string;
  comment: string;
  verified: true;
};

export async function getApprovedReviewsForProduct(productId: string): Promise<ApprovedReview[]> {
  const reviews = await db.review.findMany({
    where: { productId, status: "APPROVED" },
    include: { user: { select: { name: true, email: true } } },
    orderBy: { createdAt: "desc" },
  });

  return reviews.map((r) => ({
    name: r.user.name ?? r.user.email.split("@")[0],
    rating: r.rating,
    date: r.createdAt.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }),
    comment: r.comment,
    verified: true,
  }));
}

export type AdminReview = {
  id: string;
  productName: string;
  productSlug: string;
  productImage: string;
  customerName: string;
  customerEmail: string;
  rating: number;
  comment: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  createdAt: Date;
};

export async function getReviewsForAdmin(status?: "PENDING" | "APPROVED" | "REJECTED"): Promise<AdminReview[]> {
  const reviews = await db.review.findMany({
    where: status ? { status } : {},
    include: {
      product: { select: { name: true, slug: true, images: true } },
      user: { select: { name: true, email: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return reviews.map((r) => ({
    id: r.id,
    productName: r.product.name,
    productSlug: r.product.slug,
    productImage: (r.product.images as string[])[0],
    customerName: r.user.name ?? r.user.email,
    customerEmail: r.user.email,
    rating: r.rating,
    comment: r.comment,
    status: r.status,
    createdAt: r.createdAt,
  }));
}

// Recomputes a product's displayed rating/reviewCount from its APPROVED
// reviews only. Deliberately NOT wired to run automatically on every
// approval sweep across the catalogue — the existing rating/reviewCount on
// most products is still the seed's placeholder signal (documented as such
// in prisma/schema.prisma), and there's no real review yet for the vast
// majority of the 449-product catalogue. Zeroing all of them out the
// moment this feature ships would be a worse, more visible regression than
// leaving the placeholder in place a little longer. This function exists so
// a product's numbers become real *for that one product* the moment it has
// real approved reviews — call it from the moderation action.
export async function recomputeProductRating(productId: string): Promise<void> {
  const approved = await db.review.findMany({ where: { productId, status: "APPROVED" }, select: { rating: true } });
  if (approved.length === 0) return;
  const avg = approved.reduce((sum, r) => sum + r.rating, 0) / approved.length;
  await db.product.update({
    where: { id: productId },
    data: { rating: Math.round(avg * 10) / 10, reviewCount: approved.length },
  });
}

export async function moderateReview(
  reviewId: string,
  status: "APPROVED" | "REJECTED"
): Promise<ErrorResult | { success: true }> {
  const review = await db.review.findUnique({ where: { id: reviewId } });
  if (!review) return { error: "Review not found.", status: 404 };

  await db.review.update({ where: { id: reviewId }, data: { status } });

  if (status === "APPROVED") {
    await recomputeProductRating(review.productId);
  }

  return { success: true };
}
