import { requireAdmin } from "@/lib/admin/require-admin";
import { getAllCouponsForAdmin } from "@/lib/admin/coupon-service";
import { CouponManager } from "./CouponManager";

export default async function AdminCouponsPage() {
  await requireAdmin("coupons");
  const coupons = await getAllCouponsForAdmin();

  return (
    <div className="max-w-[900px] mx-auto space-y-5">
      <div>
        <h1 className="font-serif text-2xl text-charcoal">Coupons</h1>
        <p className="mt-1 text-sm text-ink-muted">
          Codes customers can apply at checkout for a discount.
        </p>
      </div>

      <CouponManager initial={coupons} />
    </div>
  );
}
