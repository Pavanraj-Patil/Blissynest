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

  let payload: { event?: string; payload?: { payment?: { entity?: Record<string, unknown> } } };
  try {
    payload = JSON.parse(rawBody);
  } catch {
    // A signature-verified body that isn't valid JSON shouldn't happen from
    // the real Razorpay, but failing closed with 400 (not a retry-worthy
    // 500) is still the right response if it ever does.
    return NextResponse.json({ error: "Malformed payload" }, { status: 400 });
  }
  const event = payload.event as string;
  const payment = payload.payload?.payment?.entity as { id: string; order_id: string } | undefined;

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

  // The dedup row is written only AFTER processing succeeds (see below),
  // deliberately: Razorpay retries on any non-2xx response, and if this
  // event were marked "seen" before the work below actually completed, a
  // transient failure (a DB hiccup, say) would record the event as handled
  // while silently never updating the order — then the retry that should
  // have fixed it would just see the dedup row and no-op instead. Keep
  // retrying this at least once worth failing loudly for, over losing a
  // payment update silently.
  try {
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
  } catch (err) {
    console.error("[razorpay webhook] processing failed", event, payment.id, err);
    return NextResponse.json({ error: "Processing failed" }, { status: 500 });
  }

  try {
    await db.webhookEvent.create({ data: { provider: "razorpay", eventId } });
  } catch (err) {
    // A concurrent retry of the same event already recorded it (unique
    // constraint) — the work above is idempotent either way, so this is a
    // benign race, not a real failure.
    if (!(err instanceof Error) || !err.message.includes("Unique constraint")) {
      console.error("[razorpay webhook] failed to record dedup row", eventId, err);
    }
  }

  return NextResponse.json({ received: true });
}
