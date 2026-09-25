import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { verifyWebhookSignature } from "@/lib/razorpay";
import { recoverPaidOrder } from "@/lib/order-service";

// POST /api/webhooks/razorpay — configure this URL in the Razorpay
// Dashboard (Settings → Webhooks) once RAZORPAY_WEBHOOK_SECRET is set.
//
// Limitation worth knowing: this app only creates an Order row once
// checkout's client-side verify call succeeds (see order-service.ts) — it
// never pre-creates a PENDING order before payment. So this webhook can
// only act as a safety net for orders that already exist (e.g. reconciling
// paymentStatus if the client's verify call succeeded but something else
// failed afterward); it can't recover a payment whose browser tab closed
// before verify ran. A more complete implementation would create a PENDING
// order at /checkout/razorpay/create time and let this webhook be the
// primary source of truth — a reasonable next step once this is live and
// that gap actually matters.
export async function POST(request: Request) {
  const rawBody = await request.text();
  const signature = request.headers.get("x-razorpay-signature");

  if (!signature || !verifyWebhookSignature(rawBody, signature)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const payload = JSON.parse(rawBody);
  const event = payload.event as string;
  const payment = payload.payload?.payment?.entity;

  if (!payment) {
    return NextResponse.json({ received: true });
  }

  const eventId = `${event}:${payment.id}`;
  const existing = await db.webhookEvent.findUnique({
    where: { provider_eventId: { provider: "razorpay", eventId } },
  });
  if (existing) {
    return NextResponse.json({ received: true });
  }
  await db.webhookEvent.create({ data: { provider: "razorpay", eventId } });

  if (event === "payment.captured") {
    const order = await db.order.findFirst({ where: { razorpayOrderId: payment.order_id } });
    if (order && order.paymentStatus !== "PAID") {
      await db.order.update({
        where: { id: order.id },
        data: { paymentStatus: "PAID", razorpayPaymentId: payment.id },
      });
    } else if (!order) {
      // Paid, but our confirmation call never arrived: build the order from
      // the snapshot taken when the payment was opened.
      await recoverPaidOrder(payment.order_id, payment.id);
    }
  } else if (event === "payment.failed") {
    const order = await db.order.findFirst({ where: { razorpayOrderId: payment.order_id } });
    if (order && order.paymentStatus === "PENDING") {
      await db.order.update({ where: { id: order.id }, data: { paymentStatus: "FAILED" } });
    }
  }

  return NextResponse.json({ received: true });
}
