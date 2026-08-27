import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { resolveCouponDiscount } from "@/lib/order-service";
import { validateCouponSchema } from "@/lib/validations/coupon";
import { rupeesToPaise, paiseToRupees } from "@/lib/currency";

// POST /api/coupons/validate — signed-in users only; guests are asked to
// sign in to use a coupon (see CheckoutPageClient's coupon-panel gating).
// Real-time preview for the checkout page's "Apply" button, backed by the
// exact same math order placement uses (resolveCouponDiscount), so the
// discount shown here can never diverge from what's actually charged.
export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Sign in to apply a coupon code." }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const parsed = validateCouponSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid request" },
      { status: 400 }
    );
  }

  const subtotalPaise = rupeesToPaise(parsed.data.subtotal);
  const result = await resolveCouponDiscount(parsed.data.code, subtotalPaise);
  if ("error" in result) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  return NextResponse.json({
    coupon: { code: result.couponCode, discount: paiseToRupees(result.discount) },
  });
}
