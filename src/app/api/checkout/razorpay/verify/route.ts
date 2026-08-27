import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { verifyAndCreateOrder, resolveCartSourceForRequest } from "@/lib/order-service";
import { razorpayVerifySchema } from "@/lib/validations/order";

// POST /api/checkout/razorpay/verify — called from the client's Razorpay
// Checkout.js success handler. Verifies the payment signature and only then
// creates the real order (signed-in user or guest).
export async function POST(request: Request) {
  const session = await auth();

  const body = await request.json().catch(() => null);
  const parsed = razorpayVerifySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid request" },
      { status: 400 }
    );
  }

  const { razorpayOrderId, razorpayPaymentId, razorpaySignature, ...orderInput } = parsed.data;

  const source = resolveCartSourceForRequest(session, orderInput);
  if ("error" in source) {
    return NextResponse.json({ error: source.error }, { status: source.status });
  }

  const result = await verifyAndCreateOrder(source, orderInput, {
    orderId: razorpayOrderId,
    paymentId: razorpayPaymentId,
    signature: razorpaySignature,
  });
  if ("error" in result) {
    return NextResponse.json({ error: result.error }, { status: result.status });
  }
  return NextResponse.json(result, { status: 201 });
}
