import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/admin/require-admin";
import { db } from "@/lib/db";
import type { Prisma, OrderStatus, PaymentStatus } from "@/generated/prisma/client";
import { csvResponse, toCsv } from "@/lib/csv";

// GET /admin/orders/export?q=&status=&paymentStatus= — every order matching
// the list's filters (all pages) as a CSV, for accounting / GST filing / a
// courier's bulk-upload sheet. Amounts are in rupees.
export async function GET(request: Request) {
  const check = await requireAdminApi("orders");
  if ("error" in check) return NextResponse.json({ error: check.error }, { status: check.status });

  const url = new URL(request.url);
  const q = url.searchParams.get("q")?.trim();
  const status = url.searchParams.get("status");
  const paymentStatus = url.searchParams.get("paymentStatus");

  const where: Prisma.OrderWhereInput = {
    ...(q && { OR: [{ orderNumber: { contains: q } }, { buyerName: { contains: q } }, { buyerEmail: { contains: q } }] }),
    ...(status && { status: status as OrderStatus }),
    ...(paymentStatus && { paymentStatus: paymentStatus as PaymentStatus }),
  };

  const orders = await db.order.findMany({ where, include: { items: true }, orderBy: { createdAt: "desc" } });
  const rupees = (paise: number) => paise / 100;
  const ist = (d: Date) => d.toLocaleString("en-IN", { timeZone: "Asia/Kolkata", dateStyle: "medium", timeStyle: "short" });

  const rows = orders.map((o) => {
    const a = (o.shippingAddress ?? {}) as Record<string, string | undefined>;
    return [
      o.orderNumber,
      ist(o.createdAt),
      o.buyerName,
      o.buyerEmail,
      o.buyerPhone,
      o.items.map((i) => `${i.productName} x${i.quantity}`).join("; "),
      rupees(o.subtotal),
      rupees(o.discount),
      o.couponCode ?? "",
      rupees(o.shippingCost),
      rupees(o.gstAmount),
      rupees(o.total),
      o.paymentMethod,
      o.paymentStatus,
      o.status,
      o.trackingNumber ?? "",
      o.carrierName ?? "",
      [a.line1, a.line2].filter(Boolean).join(", "),
      a.city ?? "",
      a.state ?? "",
      a.pincode ?? "",
    ];
  });

  const csv = toCsv(
    ["Order", "Placed (IST)", "Customer", "Email", "Phone", "Items", "Subtotal", "Discount", "Coupon", "Shipping", "GST", "Total", "Payment method", "Payment status", "Order status", "Tracking", "Carrier", "Address", "City", "State", "Pincode"],
    rows
  );
  return csvResponse(`blissynest-orders-${new Date().toISOString().slice(0, 10)}.csv`, csv);
}
