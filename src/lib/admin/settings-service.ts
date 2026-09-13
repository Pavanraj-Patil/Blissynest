import { db } from "@/lib/db";
import type { SiteSettingsInput } from "@/lib/validations/admin-settings";

export { getSiteSettings } from "@/lib/site-settings";

export async function updateSiteSettings(input: SiteSettingsInput): Promise<void> {
  await db.siteSettings.update({
    where: { id: "singleton" },
    data: {
      gstRatePercent: input.gstRatePercent,
      freeShippingThreshold: Math.round(input.freeShippingThreshold * 100),
      standardShippingFee: Math.round(input.standardShippingFee * 100),
      codEnabled: input.codEnabled,
      topBarEnabled: input.topBarEnabled,
    },
  });
}
