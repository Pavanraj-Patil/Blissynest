import { db } from "@/lib/db";
import { paiseToRupees } from "@/lib/currency";
import type { Prisma, OrderStatus, PaymentStatus } from "@/generated/prisma/client";

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

export async function updateOrderAdmin(
  id: string,
  input: {
    status?: OrderStatus;
    paymentStatus?: PaymentStatus;
    trackingNumber?: string;
    carrierName?: string;
  }
): Promise<{ error: string; status: number } | { success: true }> {
  const order = await db.order.findUnique({ where: { id } });
  if (!order) return { error: "Order not found.", status: 404 };

  await db.order.update({
    where: { id },
    data: {
      ...(input.status && { status: input.status }),
      ...(input.paymentStatus && { paymentStatus: input.paymentStatus }),
      ...(input.trackingNumber !== undefined && { trackingNumber: input.trackingNumber || null }),
      ...(input.carrierName !== undefined && { carrierName: input.carrierName || null }),
      ...(input.status === "DELIVERED" && !order.deliveredAt && { deliveredAt: new Date() }),
    },
  });

  return { success: true };
}
