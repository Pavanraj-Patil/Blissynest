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
import type { Cart, CartItem, Product, User } from "@/generated/prisma/client";

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

type PricingResult =
  | ErrorResult
  | {
      cart: Cart & { items: (CartItem & { product: Product })[] };
      user: User;
      subtotal: number;
      discount: number;
      couponCode: string | null;
      shippingCost: number;
      gstAmount: number;
      total: number;
    };

// The one and only place order pricing is computed — always from the
// signed-in user's real server cart and the live Product/Coupon/SiteSettings
// rows, never from anything the client submits. Matches the same
// server-trusted-pricing principle used throughout (see prisma/schema.prisma
// header and src/app/api/products' comments). Shared by the COD path and
// both Razorpay endpoints so pricing logic exists in exactly one place.
async function computeOrderPricing(userId: string, couponCode?: string): Promise<PricingResult> {
  const cart = await db.cart.findUnique({
    where: { userId },
    include: { items: { include: { product: true } } },
  });

  if (!cart || cart.items.length === 0) {
    return { error: "Your cart is empty.", status: 400 };
  }

  const user = await db.user.findUnique({ where: { id: userId } });
  if (!user) {
    return { error: "User not found.", status: 404 };
  }

  const subtotal = cart.items.reduce((sum, item) => sum + item.product.basePrice * item.quantity, 0);

  let discount = 0;
  let resolvedCouponCode: string | null = null;
  if (couponCode) {
    const coupon = await db.coupon.findUnique({ where: { code: couponCode.toUpperCase() } });
    if (coupon && coupon.active && subtotal >= coupon.minOrderValue) {
      discount =
        coupon.discountType === "PERCENT"
          ? Math.round((subtotal * coupon.discountValue) / 100)
          : Math.min(coupon.discountValue, subtotal);
      resolvedCouponCode = coupon.code;
    }
  }

  const settings = await db.siteSettings.findUnique({ where: { id: "singleton" } });
  const freeShippingThreshold = settings?.freeShippingThreshold ?? 99900;
  const standardShippingFee = settings?.standardShippingFee ?? 9900;
  const shippingCost = subtotal === 0 || subtotal >= freeShippingThreshold ? 0 : standardShippingFee;
  const gstRatePercent = settings?.gstRatePercent ?? 0;
  const gstAmount = Math.round(((subtotal - discount) * gstRatePercent) / 100);

  const total = Math.max(0, subtotal - discount + shippingCost + gstAmount);

  return { cart, user, subtotal, discount, couponCode: resolvedCouponCode, shippingCost, gstAmount, total };
}

export type CreateOrderResult =
  | ErrorResult
  | {
      orderNumber: string;
      total: number;
      shippingAddress: CreateOrderInput["shippingAddress"];
    };

async function persistOrder(params: {
  userId: string;
  input: CreateOrderInput;
  pricing: Exclude<PricingResult, ErrorResult>;
  paymentStatus: "PENDING" | "PAID";
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
}): Promise<CreateOrderResult> {
  const { userId, input, pricing } = params;
  const orderNumber = generateOrderNumber();

  const orderId = await db.$transaction(async (tx) => {
    const order = await tx.order.create({
      data: {
        orderNumber,
        userId,
        shippingAddress: input.shippingAddress,
        buyerName: input.shippingAddress.name,
        buyerPhone: input.shippingAddress.phone,
        buyerEmail: pricing.user.email,
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
      data: pricing.cart.items.map((item) => ({
        orderId: order.id,
        productId: item.productId,
        productName: item.product.name,
        productImage: (item.product.images as string[])[0],
        quantity: item.quantity,
        unitPrice: item.product.basePrice,
        customization: item.customization ?? undefined,
      })),
    });

    if (pricing.couponCode) {
      await tx.coupon.update({
        where: { code: pricing.couponCode },
        data: { usedCount: { increment: 1 } },
      });
    }

    await tx.cartItem.deleteMany({ where: { cartId: pricing.cart.id } });

    return order.id;
  });

  // Best-effort, non-blocking: the order is already placed (and paid, if
  // applicable) regardless of whether Shiprocket is configured or reachable.
  void createShipmentForOrder(orderId);

  return {
    orderNumber,
    total: Math.round(pricing.total / 100),
    shippingAddress: input.shippingAddress,
  };
}

// Cash on Delivery — no payment gateway involved, order is placed
// immediately with paymentStatus PENDING (collected on delivery).
export async function createOrderForUser(
  userId: string,
  input: CreateOrderInput
): Promise<CreateOrderResult> {
  const pricing = await computeOrderPricing(userId, input.couponCode);
  if ("error" in pricing) return pricing;

  return persistOrder({ userId, input, pricing, paymentStatus: "PENDING" });
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
  userId: string,
  couponCode?: string
): Promise<RazorpaySessionResult> {
  if (!isRazorpayConfigured()) {
    return {
      error: "Online payments aren't set up yet — please choose Cash on Delivery.",
      status: 503,
    };
  }

  const pricing = await computeOrderPricing(userId, couponCode);
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
// the cart fresh (same principle as the COD path — never trust the client),
// and cross-checks that against what was actually charged before creating
// the order. Pricing is intentionally recomputed rather than trusted from
// step 1's session, matching this app's "always compute from live DB state"
// rule; the amount cross-check exists specifically to catch the rare case
// where the cart changed in the seconds between opening and completing the
// Razorpay modal.
export async function verifyAndCreateOrder(
  userId: string,
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

  const pricing = await computeOrderPricing(userId, input.couponCode);
  if ("error" in pricing) return pricing;

  const rzpOrder = await getRazorpayOrder(razorpay.orderId);
  if (rzpOrder.amount !== pricing.total) {
    return {
      error: "Your order changed since payment was started — please contact support before retrying.",
      status: 409,
    };
  }

  return persistOrder({
    userId,
    input,
    pricing,
    paymentStatus: "PAID",
    razorpayOrderId: razorpay.orderId,
    razorpayPaymentId: razorpay.paymentId,
  });
}
