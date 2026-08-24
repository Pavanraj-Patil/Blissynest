import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { createRazorpayCheckoutSession } from "@/lib/order-service";
import { razorpayCheckoutSessionSchema } from "@/lib/validations/order";

// POST /api/checkout/razorpay/create — prices the signed-in user's cart and
// opens a Razorpay order for that amount. Nothing is persisted to our Order
// table here; see verify/route.ts.
export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => ({}));
  const parsed = razorpayCheckoutSessionSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid request" },
      { status: 400 }
    );
  }

  const result = await createRazorpayCheckoutSession(session.user.id, parsed.data.couponCode);
  if ("error" in result) {
    return NextResponse.json({ error: result.error }, { status: result.status });
  }
  return NextResponse.json(result);
}
