import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { createRazorpayCheckoutSession, resolveCartSourceForRequest } from "@/lib/order-service";
import { razorpayCheckoutSessionSchema } from "@/lib/validations/order";
import { firstIssueMessage } from "@/lib/validations/format-error";
import { checkRateLimit, getClientIp, tooManyRequestsResponse } from "@/lib/rate-limit";

// POST /api/checkout/razorpay/create — prices the cart (signed-in user's
// server cart, or a guest's submitted items) and opens a Razorpay order for
// that amount. Nothing is persisted to our Order table here; see
// verify/route.ts.
export async function POST(request: Request) {
  const session = await auth();

  // Same key pattern and limit as COD order creation (orders/route.ts) —
  // this is the other half of placing an order, and was the one checkout
  // endpoint with no cap on repeated calls (each one opens a real order
  // against our Razorpay account).
  const limitKey = session?.user?.id
    ? `razorpay-create:user:${session.user.id}`
    : `razorpay-create:ip:${getClientIp(request)}`;
  const limit = checkRateLimit(limitKey, 10, 10 * 60 * 1000);
  if (!limit.allowed) return tooManyRequestsResponse(limit.retryAfterSeconds!);

  const body = await request.json().catch(() => ({}));
  const parsed = razorpayCheckoutSessionSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: firstIssueMessage(parsed.error) },
      { status: 400 }
    );
  }

  const source = resolveCartSourceForRequest(session, parsed.data);
  if ("error" in source) {
    return NextResponse.json({ error: source.error }, { status: source.status });
  }

  try {
    const result = await createRazorpayCheckoutSession(source, parsed.data);
    if ("error" in result) {
      return NextResponse.json({ error: result.error }, { status: result.status });
    }
    return NextResponse.json(result);
  } catch (err) {
    // Razorpay's API itself failed (outage, bad keys, network) — this used
    // to throw uncaught, which the client sees as a non-JSON 500 and reports
    // as a generic connection problem. Catching it here at least logs the
    // real cause server-side and returns a proper JSON error.
    console.error("[razorpay] order creation failed", err);
    return NextResponse.json(
      { error: "Couldn't start payment right now. Please try again in a moment." },
      { status: 502 }
    );
  }
}
