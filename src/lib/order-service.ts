import { db } from "@/lib/db";
import type { z } from "zod";
import type { createOrderSchema } from "@/lib/validations/order";
import {
  isRazorpayConfigured,
  getRazorpayKeyId,
  createRazorpayOrder,
  getRazorpayOrder,
  verifyPaymentSignature,
} from "@/lib/razorpay";
import { createShipmentForOrder } from "@/lib/shipping-service";

type CreateOrderInput = z.infer<typeof createOrderSchema>;

const paymentMethodToEnum = {
  card: "CARD",
  upi: "UPI",
  netbanking: "NETBANKING",
  cod: "COD",
} as const;

function generateOrderNumber(): string {
  const random = Math.floor(1000 + Math.random() * 9000);
  return `BLS${Date.now().toString().slice(-6)}${random}`;
}

export type AccountOrderItemDTO = {
  productId: string | null;
  slug: string | null;
  name: string;
  image: string;
  qty: number;
  reviewed: boolean;
};

export type AccountOrderDTO = {
  id: string;
  orderNumber: string;
  date: string;
  status: "Delivered" | "Shipped" | "Processing";
  items: AccountOrderItemDTO[];
  total: number;
};

const statusToDisplay: Record<string, AccountOrderDTO["status"]> = {
  DELIVERED: "Delivered",
  SHIPPED: "Shipped",
  PACKED: "Processing",
  CONFIRMED: "Processing",
  PLACED: "Processing",
  CANCELLED: "Processing",
};

export async function getOrdersForUser(userId: string): Promise<AccountOrderDTO[]> {
  const [orders, reviews] = await Promise.all([
    db.order.findMany({
      where: { userId },
      include: { items: { include: { product: { select: { slug: true } } } } },
      orderBy: { createdAt: "desc" },
    }),
    db.review.findMany({ where: { userId }, select: { orderId: true, productId: true } }),
  ]);

  const reviewedKeys = new Set(reviews.map((r) => `${r.orderId}:${r.productId}`));

  return orders.map((order) => ({
    id: order.id,
    orderNumber: order.orderNumber,
    date: order.createdAt.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }),
    status: statusToDisplay[order.status] ?? "Processing",
    items: order.items.map((item) => ({
      productId: item.productId,
      slug: item.product?.slug ?? null,
      name: item.productName,
      image: item.productImage,
      qty: item.quantity,
      reviewed: item.productId ? reviewedKeys.has(`${order.id}:${item.productId}`) : false,
    })),
    total: Math.round(order.total / 100),
  }));
}

type ErrorResult = { error: string; status: number };

// Every order-placement path (COD, Razorpay create, Razorpay verify) funnels
// through one of these two sources — an authenticated user's real server
// Cart row, or a guest's client-submitted {slug, quantity} list. Keeping
// this as a discriminated union means the pricing/coupon/shipping/GST math
// below is written exactly once and shared by both paths.
export type GuestCartItemInput = { slug: string; quantity: number };
export type CartSource =
  | { kind: "account"; userId: string }
  | { kind: "guest"; email: string; phone: string; items: GuestCartItemInput[] };

type ResolvedLineItem = {
  productId: string;
  slug: string;
  name: string;
  image: string;
  quantity: number;
  unitPrice: number; // paise, always from a live Product row — never client-supplied
  customization?: unknown;
};

type ResolvedCart = {
  items: ResolvedLineItem[];
  buyerEmail: string;
  cartIdToClear?: string; // only set for the account path
};

type ResolveResult = ErrorResult | ResolvedCart;

// Turns a CartSource into server-trusted line items. The account branch is
// the pre-existing behavior (read the signed-in user's server Cart). The
// guest branch re-derives price/name/image from live Product rows for
// whatever slugs the client submitted — client-supplied price is never
// trusted, same rule as everywhere else in this app (see
// BACKEND_HANDOFF.md Section 30 / prisma/schema.prisma header).
async function resolveCartSource(source: CartSource): Promise<ResolveResult> {
  if (source.kind === "account") {
    const cart = await db.cart.findUnique({
      where: { userId: source.userId },
      include: { items: { include: { product: true } } },
    });
    if (!cart || cart.items.length === 0) {
      return { error: "Your cart is empty.", status: 400 };
    }

    const user = await db.user.findUnique({ where: { id: source.userId } });
    if (!user) {
      return { error: "User not found.", status: 404 };
    }

    // Fast pre-check, not the authoritative guard (that's persistOrder's
    // transactional decrement) — just avoids opening a Razorpay session or
    // showing "placing order..." for something we already know won't fit.
    const insufficient = cart.items.find((item) => item.quantity > item.product.stockQuantity);
    if (insufficient) {
      return {
        error: `"${insufficient.product.name}" only has ${insufficient.product.stockQuantity} left in stock.`,
        status: 409,
      };
    }

    return {
      items: cart.items.map((item) => ({
        productId: item.productId,
        slug: item.product.slug,
        name: item.product.name,
        image: (item.product.images as string[])[0],
        quantity: item.quantity,
        unitPrice: item.product.basePrice,
        customization: item.customization ?? undefined,
      })),
      buyerEmail: user.email,
      cartIdToClear: cart.id,
    };
  }

  // Guest path — collapse duplicate slugs (a hand-crafted request could
  // repeat one) and drop anything with a non-positive quantity before
  // ever touching the DB.
  const qtyBySlug = new Map<string, number>();
  for (const { slug, quantity } of source.items) {
    if (!slug || quantity < 1) continue;
    qtyBySlug.set(slug, (qtyBySlug.get(slug) ?? 0) + quantity);
  }
  if (qtyBySlug.size === 0) {
    return { error: "Your cart is empty.", status: 400 };
  }

  const products = await db.product.findMany({
    where: { slug: { in: [...qtyBySlug.keys()] }, status: "PUBLISHED" },
  });
  const bySlug = new Map(products.map((p) => [p.slug, p]));

  const missing = [...qtyBySlug.keys()].filter((slug) => !bySlug.has(slug));
  if (missing.length > 0) {
    return {
      error: "Some items in your cart are no longer available. Please review your cart and try again.",
      status: 409,
    };
  }

  // Fast pre-check — see the matching comment in the account branch above.
  for (const [slug, quantity] of qtyBySlug) {
    const product = bySlug.get(slug)!;
    if (quantity > product.stockQuantity) {
      return {
        error: `"${product.name}" only has ${product.stockQuantity} left in stock.`,
        status: 409,
      };
    }
  }

  const items: ResolvedLineItem[] = [...qtyBySlug.entries()].map(([slug, quantity]) => {
    const product = bySlug.get(slug)!;
    return {
      productId: product.id,
      slug: product.slug,
      name: product.name,
      image: (product.images as string[])[0],
      quantity,
      unitPrice: product.basePrice,
    };
  });

  return { items, buyerEmail: source.email };
}

type PricingResult =
  | ErrorResult
  | (ResolvedCart & {
      subtotal: number;
      discount: number;
      couponCode: string | null;
      shippingCost: number;
      gstAmount: number;
      total: number;
    });

export type CouponDiscountResult =
  | { discount: number; couponCode: string }
  | { error: string };

// The one place coupon math happens — both order pricing (below) and the
// checkout page's live "Apply" preview (src/app/api/coupons/validate)
// call this, so a discount shown before checkout can never diverge from
// what actually gets charged.
export async function resolveCouponDiscount(
  couponCode: string,
  subtotal: number
): Promise<CouponDiscountResult> {
  const coupon = await db.coupon.findUnique({ where: { code: couponCode.toUpperCase() } });
  if (!coupon || !coupon.active) {
    return { error: "That coupon code isn't valid." };
  }
  if (subtotal < coupon.minOrderValue) {
    return { error: "Your order doesn't meet this coupon's minimum value." };
  }
  const discount =
    coupon.discountType === "PERCENT"
      ? Math.round((subtotal * coupon.discountValue) / 100)
      : Math.min(coupon.discountValue, subtotal);
  return { discount, couponCode: coupon.code };
}

// The one and only place order pricing is computed — always from
// server-resolved line items and the live Coupon/SiteSettings rows, never
// from anything the client submits directly. Shared by the COD path and
// both Razorpay endpoints, for both account and guest sources.
async function computeOrderPricing(source: CartSource, couponCode?: string): Promise<PricingResult> {
  const resolved = await resolveCartSource(source);
  if ("error" in resolved) return resolved;

  const subtotal = resolved.items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);

  let discount = 0;
  let resolvedCouponCode: string | null = null;
  // Coupons are an account-only perk — a couponCode smuggled onto a guest
  // order (bypassing the UI, which already hides the coupon panel for
  // guests) is silently ignored here rather than trusted.
  if (couponCode && source.kind === "account") {
    const result = await resolveCouponDiscount(couponCode, subtotal);
    if (!("error" in result)) {
      discount = result.discount;
      resolvedCouponCode = result.couponCode;
    }
  }

  const settings = await db.siteSettings.findUnique({ where: { id: "singleton" } });
  const freeShippingThreshold = settings?.freeShippingThreshold ?? 99900;
  const standardShippingFee = settings?.standardShippingFee ?? 9900;
  const shippingCost = subtotal === 0 || subtotal >= freeShippingThreshold ? 0 : standardShippingFee;
  const gstRatePercent = settings?.gstRatePercent ?? 0;
  const gstAmount = Math.round(((subtotal - discount) * gstRatePercent) / 100);

  const total = Math.max(0, subtotal - discount + shippingCost + gstAmount);

  return { ...resolved, subtotal, discount, couponCode: resolvedCouponCode, shippingCost, gstAmount, total };
}

export type CreateOrderResult =
  | ErrorResult
  | {
      orderNumber: string;
      total: number;
      shippingAddress: CreateOrderInput["shippingAddress"];
    };

// Thrown inside persistOrder's transaction when a live stock check loses a
// race (someone else bought the last unit between the pre-check and now) —
// caught outside the transaction and turned into a friendly error result.
// Throwing aborts the transaction, so no order/decrement is left partially
// applied.
class InsufficientStockError extends Error {
  constructor(public productName: string) {
    super(`Insufficient stock: ${productName}`);
  }
}

async function persistOrder(params: {
  source: CartSource;
  input: CreateOrderInput;
  pricing: Exclude<PricingResult, ErrorResult>;
  paymentStatus: "PENDING" | "PAID";
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
}): Promise<CreateOrderResult> {
  const { source, input, pricing } = params;
  const orderNumber = generateOrderNumber();
  const userId = source.kind === "account" ? source.userId : null;
  // Guests type a contact number up front (parallel to buyerEmail) since the
  // shipping address's phone may belong to a gift recipient instead of the
  // buyer. Account orders keep sourcing buyerPhone from the shipping address
  // — unchanged — since there's no account-level phone to prefer instead.
  const buyerPhone = source.kind === "guest" ? source.phone : input.shippingAddress.phone;

  let orderId: string;
  try {
    orderId = await db.$transaction(async (tx) => {
      const order = await tx.order.create({
        data: {
          orderNumber,
          userId,
          shippingAddress: input.shippingAddress,
          buyerName: input.shippingAddress.name,
          buyerPhone,
          buyerEmail: pricing.buyerEmail,
          isGift: input.isGift,
          giftNote: input.giftNote,
          hidePricesOnSlip: input.hidePricesOnSlip,
          subtotal: pricing.subtotal,
          discount: pricing.discount,
          couponCode: pricing.couponCode,
          shippingCost: pricing.shippingCost,
          gstAmount: pricing.gstAmount,
          total: pricing.total,
          paymentMethod: paymentMethodToEnum[input.paymentMethod],
          paymentStatus: params.paymentStatus,
          razorpayOrderId: params.razorpayOrderId,
          razorpayPaymentId: params.razorpayPaymentId,
        },
      });

      await tx.orderItem.createMany({
        data: pricing.items.map((item) => ({
          orderId: order.id,
          productId: item.productId,
          productName: item.name,
          productImage: item.image,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          customization: item.customization ?? undefined,
        })),
      });

      // Race-safe decrement: the conditional WHERE means this only succeeds
      // if enough stock is still there *right now* — two simultaneous
      // buyers for the last unit can't both win. A lost race throws, which
      // rolls back the whole transaction (order included), rather than
      // leaving a paid/placed order with no stock behind it.
      for (const item of pricing.items) {
        const result = await tx.product.updateMany({
          where: { id: item.productId, stockQuantity: { gte: item.quantity } },
          data: { stockQuantity: { decrement: item.quantity } },
        });
        if (result.count === 0) {
          throw new InsufficientStockError(item.name);
        }
        // Keeps the denormalized `inStock` flag in sync the moment quantity
        // actually reaches 0 — safe from a race with another order because
        // the update above already holds this row's lock for the rest of
        // the transaction.
        await tx.product.updateMany({
          where: { id: item.productId, stockQuantity: 0, inStock: true },
          data: { inStock: false },
        });
      }

      if (pricing.couponCode) {
        await tx.coupon.update({
          where: { code: pricing.couponCode },
          data: { usedCount: { increment: 1 } },
        });
      }

      if (pricing.cartIdToClear) {
        await tx.cartItem.deleteMany({ where: { cartId: pricing.cartIdToClear } });
      }

      return order.id;
    });
  } catch (err) {
    if (err instanceof InsufficientStockError) {
      return {
        error: `Sorry, "${err.productName}" just sold out while you were checking out. Please update your cart and try again.`,
        status: 409,
      };
    }
    throw err;
  }

  // Best-effort, non-blocking: the order is already placed (and paid, if
  // applicable) regardless of whether Shiprocket is configured or reachable.
  void createShipmentForOrder(orderId);

  return {
    orderNumber,
    total: Math.round(pricing.total / 100),
    shippingAddress: input.shippingAddress,
  };
}

// The one place that decides, per-request, whether an order is being placed
// by a signed-in user or a guest — shared by all three order-placement
// routes so the branch only exists once.
export function resolveCartSourceForRequest(
  session: { user?: { id?: string | null } } | null,
  body: { guestEmail?: string; guestPhone?: string; guestItems?: GuestCartItemInput[] }
): CartSource | ErrorResult {
  if (session?.user?.id) {
    return { kind: "account", userId: session.user.id };
  }
  if (!body.guestEmail || !body.guestPhone || !body.guestItems || body.guestItems.length === 0) {
    return { error: "Sign in or provide guest checkout details.", status: 401 };
  }
  return { kind: "guest", email: body.guestEmail, phone: body.guestPhone, items: body.guestItems };
}

// Cash on Delivery — no payment gateway involved, order is placed
// immediately with paymentStatus PENDING (collected on delivery).
export async function createOrder(source: CartSource, input: CreateOrderInput): Promise<CreateOrderResult> {
  const pricing = await computeOrderPricing(source, input.couponCode);
  if ("error" in pricing) return pricing;

  return persistOrder({ source, input, pricing, paymentStatus: "PENDING" });
}

export type RazorpaySessionResult =
  | ErrorResult
  | { razorpayOrderId: string; amount: number; currency: string; keyId: string };

// Step 1 of the card/UPI/net-banking flow: price the cart and open a
// Razorpay order for that exact amount. Nothing is written to our Order
// table yet — that only happens once the payment is verified (see
// verifyAndCreateOrder below), so an abandoned or failed payment never
// leaves a stray order behind.
export async function createRazorpayCheckoutSession(
  source: CartSource,
  couponCode?: string
): Promise<RazorpaySessionResult> {
  if (!isRazorpayConfigured()) {
    return {
      error: "Online payments aren't set up yet — please choose Cash on Delivery.",
      status: 503,
    };
  }

  const pricing = await computeOrderPricing(source, couponCode);
  if ("error" in pricing) return pricing;

  const rzpOrder = await createRazorpayOrder({
    amount: pricing.total,
    receipt: generateOrderNumber(),
  });

  return {
    razorpayOrderId: rzpOrder.id,
    amount: rzpOrder.amount,
    currency: rzpOrder.currency,
    keyId: getRazorpayKeyId(),
  };
}

// Step 2: called from the client's Razorpay Checkout.js success handler.
// Verifies the payment is genuinely Razorpay's (HMAC signature), re-prices
// fresh (same principle as the COD path — never trust the client), and
// cross-checks that against what was actually charged before creating the
// order. Pricing is intentionally recomputed rather than trusted from step
// 1's session, matching this app's "always compute from live DB state"
// rule; the amount cross-check exists specifically to catch the rare case
// where the cart changed in the seconds between opening and completing the
// Razorpay modal.
export async function verifyAndCreateOrder(
  source: CartSource,
  input: CreateOrderInput,
  razorpay: { orderId: string; paymentId: string; signature: string }
): Promise<CreateOrderResult> {
  const validSignature = verifyPaymentSignature({
    orderId: razorpay.orderId,
    paymentId: razorpay.paymentId,
    signature: razorpay.signature,
  });
  if (!validSignature) {
    return { error: "Payment verification failed.", status: 400 };
  }

  const pricing = await computeOrderPricing(source, input.couponCode);
  if ("error" in pricing) return pricing;

  const rzpOrder = await getRazorpayOrder(razorpay.orderId);
  if (rzpOrder.amount !== pricing.total) {
    return {
      error: "Your order changed since payment was started — please contact support before retrying.",
      status: 409,
    };
  }

  return persistOrder({
    source,
    input,
    pricing,
    paymentStatus: "PAID",
    razorpayOrderId: razorpay.orderId,
    razorpayPaymentId: razorpay.paymentId,
  });
}

// ---------------------------------------------------------------------
// Guest order tracking — /track-order looks a real order up by order
// number + the email it was placed with, no account required.
// ---------------------------------------------------------------------

export type TrackOrderDTO = {
  orderNumber: string;
  status: "Placed" | "Packed" | "Shipped" | "Delivered" | "Cancelled";
  stepIndex: number; // 0-3 for the 4-stage tracker, -1 if cancelled
  placedAt: string; // ISO
  estimatedDelivery: string | null;
  deliveredAt: string | null;
  trackingNumber: string | null;
  carrierName: string | null;
  addressSummary: string;
  items: { name: string; image: string; qty: number }[];
  total: number; // rupees
};

const trackingStepIndex: Record<string, number> = {
  PLACED: 0,
  CONFIRMED: 0,
  PACKED: 1,
  SHIPPED: 2,
  DELIVERED: 3,
};
const trackingStepLabels: TrackOrderDTO["status"][] = ["Placed", "Packed", "Shipped", "Delivered"];

export async function getOrderForTracking(orderNumber: string, email: string): Promise<TrackOrderDTO | null> {
  const order = await db.order.findUnique({ where: { orderNumber }, include: { items: true } });
  if (!order) return null;
  // App-code case-insensitive compare rather than relying on the DB
  // column's collation to do it implicitly.
  if (order.buyerEmail.toLowerCase() !== email.trim().toLowerCase()) return null;

  const addr = order.shippingAddress as {
    name: string;
    line1: string;
    line2?: string;
    city: string;
    state: string;
    pincode: string;
  };
  const stepIndex = order.status === "CANCELLED" ? -1 : (trackingStepIndex[order.status] ?? 0);

  return {
    orderNumber: order.orderNumber,
    status: order.status === "CANCELLED" ? "Cancelled" : trackingStepLabels[stepIndex],
    stepIndex,
    placedAt: order.createdAt.toISOString(),
    estimatedDelivery: order.estimatedDelivery?.toISOString() ?? null,
    deliveredAt: order.deliveredAt?.toISOString() ?? null,
    trackingNumber: order.trackingNumber,
    carrierName: order.carrierName,
    addressSummary: `${addr.name}, ${addr.line1}${addr.line2 ? `, ${addr.line2}` : ""}, ${addr.city}, ${addr.state} - ${addr.pincode}`,
    items: order.items.map((item) => ({ name: item.productName, image: item.productImage, qty: item.quantity })),
    total: Math.round(order.total / 100),
  };
}
