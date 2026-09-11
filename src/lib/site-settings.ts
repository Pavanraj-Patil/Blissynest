import { db } from "@/lib/db";

// Read-only, used by both the public storefront (TopBar's free-shipping
// banner) and the admin settings page — not admin-specific logic, just
// site config. src/lib/admin/settings-service.ts owns the write side.
export async function getSiteSettings() {
  const settings = await db.siteSettings.upsert({
    where: { id: "singleton" },
    update: {},
    create: { id: "singleton" },
  });
  return {
    gstRatePercent: settings.gstRatePercent,
    freeShippingThreshold: Math.round(settings.freeShippingThreshold / 100),
    standardShippingFee: Math.round(settings.standardShippingFee / 100),
    codEnabled: settings.codEnabled,
  };
}
