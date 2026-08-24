import { z } from "zod";

export const siteSettingsSchema = z.object({
  gstRatePercent: z.coerce.number().min(0).max(100),
  freeShippingThreshold: z.coerce.number().min(0), // rupees
  standardShippingFee: z.coerce.number().min(0), // rupees
});

export type SiteSettingsInput = z.infer<typeof siteSettingsSchema>;
