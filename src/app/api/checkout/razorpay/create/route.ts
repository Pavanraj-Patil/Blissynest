import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { createRazorpayCheckoutSession, resolveCartSourceForRequest } from "@/lib/order-service";
import { razorpayCheckoutSessionSchema } from "@/lib/validations/order";

// POST /api/checkout/razorpay/create — prices the cart (signed-in user's
// server cart, or a guest's submitted items) and opens a Razorpay order for
// that amount. Nothing is persisted to our Order table here; see
// verify/route.ts.
export async function POST(request: Request) {
  const session = await auth();

  const body = await request.json().catch(() => ({}));
  const parsed = razorpayCheckoutSessionSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid request" },
      { status: 400 }
    );
  }

  const source = resolveCartSourceForRequest(session, parsed.data);
  if ("error" in source) {
    return NextResponse.json({ error: source.error }, { status: source.status });
  }

  const result = await createRazorpayCheckoutSession(source, parsed.data.couponCode);
  if ("error" in result) {
    return NextResponse.json({ error: result.error }, { status: result.status });
  }
  return NextResponse.json(result);
}
