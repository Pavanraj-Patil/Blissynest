import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/admin/require-admin";
import { createCoupon } from "@/lib/admin/coupon-service";
import { adminCouponSchema } from "@/lib/validations/admin-coupon";
import { firstIssueMessage } from "@/lib/validations/format-error";

export async function POST(request: Request) {
  const check = await requireAdminApi("coupons");
  if ("error" in check) {
    return NextResponse.json({ error: check.error }, { status: check.status });
  }

  const body = await request.json().catch(() => null);
  const parsed = adminCouponSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: firstIssueMessage(parsed.error) },
      { status: 400 }
    );
  }

  const result = await createCoupon(parsed.data);
  if ("error" in result) {
    return NextResponse.json({ error: result.error }, { status: result.status });
  }
  return NextResponse.json(result, { status: 201 });
}
