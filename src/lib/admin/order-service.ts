import { db } from "@/lib/db";
import { paiseToRupees } from "@/lib/currency";
import type { Prisma, OrderStatus, PaymentStatus } from "@/generated/prisma/client";
import { emailOrderStatus } from "@/lib/order-emails";

export type AdminOrderListItem = {
  id: string;
  orderNumber: string;
  buyerName: string;
  buyerEmail: string;
  itemCount: number;
  paymentMethod: string;
  paymentStatus: string;
  status: string;
  total: number;
  createdAt: Date;
};

export async function getOrdersForAdmin(params: {
  q?: string;
  status?: string;
  paymentStatus?: string;
  page: number;
  pageSize: number;
}): Promise<{ orders: AdminOrderListItem[]; total: number }> {
  const { q, status, paymentStatus, page, pageSize } = params;

  const where: Prisma.OrderWhereInput = {
    ...(q && {
      OR: [
        { orderNumber: { contains: q } },
        { buyerName: { contains: q } },
        { buyerEmail: { contains: q } },
      ],
    }),
    ...(status && { status: status as OrderStatus }),
    ...(paymentStatus && { paymentStatus: paymentStatus as PaymentStatus }),
  };

  const [orders, total] = await Promise.all([
    db.order.findMany({
      where,
      include: { items: { select: { id: true } } },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    db.order.count({ where }),
  ]);

  return {
    orders: orders.map((o) => ({
      id: o.id,
      orderNumber: o.orderNumber,
      buyerName: o.buyerName,
      buyerEmail: o.buyerEmail,
      itemCount: o.items.length,
      paymentMethod: o.paymentMethod,
      paymentStatus: o.paymentStatus,
      status: o.status,
      total: paiseToRupees(o.total),
      createdAt: o.createdAt,
    })),
    total,
  };
}

export async function getOrderForAdmin(id: string) {
  const order = await db.order.findUnique({
    where: { id },
    include: {
      items: { include: { product: { select: { slug: true } } } },
      user: { select: { name: true, email: true } },
    },
  });
  if (!order) return null;

  return {
    ...order,
    subtotal: paiseToRupees(order.subtotal),
    discount: paiseToRupees(order.discount),
    shippingCost: paiseToRupees(order.shippingCost),
    gstAmount: paiseToRupees(order.gstAmount),
    total: paiseToRupees(order.total),
    items: order.items.map((item) => ({
      ...item,
      unitPrice: paiseToRupees(item.unitPrice),
    })),
  };
}

class ReinstateStockError extends Error {
  constructor(public productName: string) {
    super(`Not enough stock: ${productName}`);
  }
}

export async function updateOrderAdmin(
  id: string,
  input: {
    status?: OrderStatus;
    paymentStatus?: PaymentStatus;
    trackingNumber?: string;
    carrierName?: string;
  }
): Promise<{ error: string; status: number } | { success: true }> {
  const order = await db.order.findUnique({ where: { id }, include: { items: true } });
  if (!order) return { error: "Order not found.", status: 404 };

  const cancelling = input.status === "CANCELLED" && order.status !== "CANCELLED";
  // The reverse: bringing a cancelled order back to life has to take the
  // stock (and coupon use) again, or inventory would drift upward.
  const reinstating = order.status === "CANCELLED" && !!input.status && input.status !== "CANCELLED";

  try {
  await db.$transaction(async (tx) => {
    await tx.order.update({
      where: { id },
      data: {
        ...(input.status && { status: input.status }),
        ...(input.paymentStatus && { paymentStatus: input.paymentStatus }),
        ...(input.trackingNumber !== undefined && { trackingNumber: input.trackingNumber || null }),
        ...(input.carrierName !== undefined && { carrierName: input.carrierName || null }),
        ...(input.status === "DELIVERED" && !order.deliveredAt && { deliveredAt: new Date() }),
      },
    });

    // A cancelled order gives its stock back (placing the order took it) and
    // frees up the coupon use — otherwise every cancellation would silently
    // shrink inventory and burn a single-use coupon.
    if (cancelling) {
      for (const item of order.items) {
        if (!item.productId) continue;
        await tx.product.updateMany({
          where: { id: item.productId },
          data: { stockQuantity: { increment: item.quantity }, inStock: true },
        });
      }
      if (order.couponCode) {
        await tx.coupon.updateMany({
          where: { code: order.couponCode, usedCount: { gt: 0 } },
          data: { usedCount: { decrement: 1 } },
        });
      }
    }

    if (reinstating) {
      for (const item of order.items) {
        if (!item.productId) continue;
        const result = await tx.product.updateMany({
          where: { id: item.productId, stockQuantity: { gte: item.quantity } },
          data: { stockQuantity: { decrement: item.quantity } },
        });
        if (result.count === 0) throw new ReinstateStockError(item.productName);
        await tx.product.updateMany({
          where: { id: item.productId, stockQuantity: 0, inStock: true },
          data: { inStock: false },
        });
      }
      if (order.couponCode) {
        await tx.coupon.updateMany({ where: { code: order.couponCode }, data: { usedCount: { increment: 1 } } });
      }
    }
  });
  } catch (err) {
    if (err instanceof ReinstateStockError) {
      return { error: `Can't reinstate this order — "${err.productName}" doesn't have enough stock left.`, status: 409 };
    }
    throw err;
  }

  // Tell the customer about the milestones that matter; only on a real change.
  if (input.status && input.status !== order.status && (input.status === "SHIPPED" || input.status === "DELIVERED" || input.status === "CANCELLED")) {
    void emailOrderStatus(id, input.status);
  }

  return { success: true };
}
