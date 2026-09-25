import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { resolveCouponDiscount } from "@/lib/order-service";
import { validateCouponSchema } from "@/lib/validations/coupon";
import { rupeesToPaise, paiseToRupees } from "@/lib/currency";
import { checkRateLimit, tooManyRequestsResponse } from "@/lib/rate-limit";
import { firstIssueMessage } from "@/lib/validations/format-error";

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

  // Keyed by user id — without this, a signed-in attacker could script
  // guesses against the coupon code space (codes are short, human-typeable
  // strings, not high-entropy tokens).
  const limit = checkRateLimit(`coupon-validate:${session.user.id}`, 10, 5 * 60 * 1000);
  if (!limit.allowed) return tooManyRequestsResponse(limit.retryAfterSeconds!);

  const body = await request.json().catch(() => null);
  const parsed = validateCouponSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: firstIssueMessage(parsed.error) },
      { status: 400 }
    );
  }

  const subtotalPaise = rupeesToPaise(parsed.data.subtotal);
  const result = await resolveCouponDiscount(parsed.data.code, subtotalPaise, session.user.id);
  if ("error" in result) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  return NextResponse.json({
    coupon: { code: result.couponCode, discount: paiseToRupees(result.discount) },
  });
}
