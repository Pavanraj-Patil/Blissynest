import { requireAdmin } from "@/lib/admin/require-admin";
import { getAllBannersForAdmin } from "@/lib/banner-service";
import { BannerManager } from "./BannerManager";

export default async function AdminBannersPage() {
  await requireAdmin();
  const banners = await getAllBannersForAdmin();

  return (
    <div className="max-w-[900px] mx-auto space-y-5">
      <div>
        <h1 className="font-serif text-2xl text-charcoal">Banners</h1>
        <p className="mt-1 text-sm text-ink-muted">
          The rotating &ldquo;Featured This Season&rdquo; carousel on the homepage. Only active
          banners show, in sort-order.
        </p>
      </div>

      <BannerManager initial={banners} />
    </div>
  );
}
