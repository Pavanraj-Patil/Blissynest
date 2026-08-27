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
  verified: boolean;
};

export async function getApprovedReviewsForProduct(productId: string): Promise<ApprovedReview[]> {
  const reviews = await db.review.findMany({
    where: { productId, status: "APPROVED" },
    include: { user: { select: { name: true, email: true } } },
    orderBy: { createdAt: "desc" },
  });

  return reviews.map((r) => ({
    name: r.authorName ?? r.user?.name ?? r.user?.email.split("@")[0] ?? "Anonymous",
    rating: r.rating,
    date: r.createdAt.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }),
    comment: r.comment,
    // Only a review tied to a real order is an actual verified purchase —
    // admin-authored reviews (no orderId) never claim that badge.
    verified: !!r.orderId,
  }));
}

// Admin writing a review directly — no real customer/order behind it, so
// there's no one else who needs to moderate it: it goes straight to
// APPROVED and the product's rating updates immediately.
export async function createAdminReview(input: {
  productId: string;
  authorName: string;
  rating: number;
  comment: string;
}): Promise<{ error: string; status: number } | { id: string }> {
  const product = await db.product.findUnique({ where: { id: input.productId }, select: { id: true } });
  if (!product) return { error: "Product not found.", status: 404 };

  const review = await db.review.create({
    data: {
      productId: input.productId,
      authorName: input.authorName,
      rating: input.rating,
      comment: input.comment,
      status: "APPROVED",
    },
  });

  await recomputeProductRating(input.productId);

  return { id: review.id };
}

export async function deleteReview(reviewId: string): Promise<ErrorResult | { success: true }> {
  const review = await db.review.findUnique({ where: { id: reviewId } });
  if (!review) return { error: "Review not found.", status: 404 };

  await db.review.delete({ where: { id: reviewId } });

  // Only an approved review was ever counted into the product's rating —
  // recompute so a deleted review's stars don't linger in the average.
  if (review.status === "APPROVED") {
    await recomputeProductRating(review.productId);
  }

  return { success: true };
}

export type AdminReview = {
  id: string;
  productName: string;
  productSlug: string;
  productImage: string;
  customerName: string;
  customerEmail: string | null;
  isAdminAuthored: boolean;
  rating: number;
  comment: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  createdAt: Date;
};

export async function getReviewsForAdmin(
  status?: "PENDING" | "APPROVED" | "REJECTED",
  productQuery?: string
): Promise<AdminReview[]> {
  const reviews = await db.review.findMany({
    where: {
      ...(status ? { status } : {}),
      ...(productQuery ? { product: { name: { contains: productQuery } } } : {}),
    },
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
    customerName: r.authorName ?? r.user?.name ?? r.user?.email ?? "—",
    customerEmail: r.user?.email ?? null,
    isAdminAuthored: !r.orderId,
    rating: r.rating,
    comment: r.comment,
    status: r.status,
    createdAt: r.createdAt,
  }));
}

// Recomputes a product's displayed rating/reviewCount from its APPROVED
// reviews only. Called only for one specific product right after a review
// event happens to it (an approval, an admin-authored review, or a
// deletion) — never swept across the catalogue, so the seed's placeholder
// rating/reviewCount on every other untouched product (documented in
// prisma/schema.prisma) is left alone. When a product's last real approved
// review is removed, this correctly resets it to 0/0 rather than leaving a
// stale average from a review that no longer exists.
export async function recomputeProductRating(productId: string): Promise<void> {
  const approved = await db.review.findMany({ where: { productId, status: "APPROVED" }, select: { rating: true } });
  const avg = approved.length > 0 ? approved.reduce((sum, r) => sum + r.rating, 0) / approved.length : 0;
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
