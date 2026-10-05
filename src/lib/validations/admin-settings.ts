import { z } from "zod";

export const siteSettingsSchema = z.object({
  gstRatePercent: z.coerce.number().min(0).max(100),
  freeShippingThreshold: z.coerce.number().min(0), // rupees
  standardShippingFee: z.coerce.number().min(0), // rupees
  codEnabled: z.boolean(),
  topBarEnabled: z.boolean(),
  maintenanceMode: z.boolean(),
  maintenanceMessage: z.string().trim().max(500).optional().default(""),
  // A <input type="datetime-local"> value ("YYYY-MM-DDTHH:mm"), or "" /
  // null to clear it. Interpreted as the server's own local time zone when
  // saved — see updateSiteSettings.
  maintenanceReturnAt: z.string().trim().optional().nullable(),
});

export type SiteSettingsInput = z.infer<typeof siteSettingsSchema>;
