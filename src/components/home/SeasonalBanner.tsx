import { getActiveBanners } from "@/lib/banner-service";
import { SeasonalBannerCarousel } from "./SeasonalBannerCarousel";

// Real, DB-backed (see prisma/schema.prisma's Banner model and
// /admin/banners) — this used to be a hardcoded array that could only be
// changed by editing code and redeploying.
export async function SeasonalBanner() {
  const banners = await getActiveBanners();
  if (banners.length === 0) return null;

  // Pass the icon/gradient *keys* across the Server → Client boundary, not
  // resolved components — React component references (functions) can't be
  // serialized as client component props, only rendered as actual JSX.
  // SeasonalBannerCarousel resolves them client-side.
  const slides = banners.map((b) => ({
    id: b.id,
    title: b.title,
    subtitle: b.subtitle,
    href: b.href,
    iconKey: b.icon,
    gradientKey: b.gradient,
  }));

  return <SeasonalBannerCarousel slides={slides} />;
}
