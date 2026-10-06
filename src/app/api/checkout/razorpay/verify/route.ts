import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { verifyAndCreateOrder, resolveCartSourceForRequest } from "@/lib/order-service";
import { razorpayVerifySchema } from "@/lib/validations/order";
import { firstIssueMessage } from "@/lib/validations/format-error";
import { checkRateLimit, getClientIp, tooManyRequestsResponse } from "@/lib/rate-limit";

// POST /api/checkout/razorpay/verify — called from the client's Razorpay
// Checkout.js success handler. Verifies the payment signature and only then
// creates the real order (signed-in user or guest).
export async function POST(request: Request) {
  const session = await auth();

  // Generous on purpose: the customer has already paid by the time this is
  // called, so this only guards against scripted abuse (signature-guessing),
  // never against a genuine retry after a dropped connection.
  const limitKey = session?.user?.id
    ? `razorpay-verify:user:${session.user.id}`
    : `razorpay-verify:ip:${getClientIp(request)}`;
  const limit = checkRateLimit(limitKey, 20, 10 * 60 * 1000);
  if (!limit.allowed) return tooManyRequestsResponse(limit.retryAfterSeconds!);

  const body = await request.json().catch(() => null);
  const parsed = razorpayVerifySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: firstIssueMessage(parsed.error) },
      { status: 400 }
    );
  }

  const { razorpayOrderId, razorpayPaymentId, razorpaySignature, ...orderInput } = parsed.data;

  const source = resolveCartSourceForRequest(session, orderInput);
  if ("error" in source) {
    return NextResponse.json({ error: source.error }, { status: source.status });
  }

  try {
    const result = await verifyAndCreateOrder(source, orderInput, {
      orderId: razorpayOrderId,
      paymentId: razorpayPaymentId,
      signature: razorpaySignature,
    });
    if ("error" in result) {
      return NextResponse.json({ error: result.error }, { status: result.status });
    }
    return NextResponse.json(result, { status: 201 });
  } catch (err) {
    // A real payment already happened by this point — this is the webhook's
    // job to recover (see recoverPaidOrder in order-service.ts), so the
    // message reassures rather than implying the money is at risk.
    console.error("[razorpay] verify/create order failed", err);
    return NextResponse.json(
      {
        error:
          "Payment succeeded but confirming your order failed. Please contact support with your payment details — your payment is safe.",
      },
      { status: 502 }
    );
  }
}
