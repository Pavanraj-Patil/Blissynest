import { db } from "@/lib/db";
import type { Coupon } from "@/generated/prisma/client";
import type { AdminCouponInput } from "@/lib/validations/admin-coupon";

// minOrderValue and FLAT discountValue are rupees in the form, paise in
// the DB — same boundary conversion as everywhere else in this app.
function toPaiseFields(input: AdminCouponInput) {
  return {
    code: input.code,
    discountType: input.discountType,
    discountValue:
      input.discountType === "FLAT" ? Math.round(input.discountValue * 100) : Math.round(input.discountValue),
    minOrderValue: Math.round(input.minOrderValue * 100),
    usageLimit: input.usageLimit ?? null,
    active: input.active,
  };
}

export async function getAllCouponsForAdmin(): Promise<Coupon[]> {
  return db.coupon.findMany({ orderBy: { createdAt: "desc" } });
}

export async function createCoupon(
  input: AdminCouponInput
): Promise<{ error: string; status: number } | { coupon: Coupon }> {
  const existing = await db.coupon.findUnique({ where: { code: input.code } });
  if (existing) {
    return { error: `A coupon with code "${input.code}" already exists.`, status: 409 };
  }
  const coupon = await db.coupon.create({ data: toPaiseFields(input) });
  return { coupon };
}

export async function updateCoupon(
  id: string,
  input: AdminCouponInput
): Promise<{ error: string; status: number } | { coupon: Coupon }> {
  const result = await db.coupon.updateMany({ where: { id }, data: toPaiseFields(input) });
  if (result.count === 0) return { error: "Coupon not found.", status: 404 };
  const coupon = await db.coupon.findUnique({ where: { id } });
  return { coupon: coupon! };
}

export async function setCouponActive(id: string, active: boolean): Promise<void> {
  await db.coupon.updateMany({ where: { id }, data: { active } });
}

export async function deleteCoupon(id: string): Promise<void> {
  // Order.couponCode is a plain string snapshot, not a foreign key — a
  // coupon can always be safely deleted even if past orders used it.
  await db.coupon.deleteMany({ where: { id } });
}
