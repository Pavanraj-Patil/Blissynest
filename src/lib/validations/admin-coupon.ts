import { z } from "zod";

// discountValue is percent (0-100) for PERCENT, or plain rupees for FLAT —
// converted to paise at the service layer, same boundary pattern as
// admin-product.ts's prices.
export const adminCouponSchema = z
  .object({
    code: z.string().trim().min(1, "Code is required").toUpperCase(),
    discountType: z.enum(["PERCENT", "FLAT"]),
    discountValue: z.coerce.number().min(0, "Can't be negative"),
    minOrderValue: z.coerce.number().min(0).default(0),
    usageLimit: z.coerce.number().int().min(0).optional(),
    active: z.boolean().default(true),
    firstOrderOnly: z.boolean().default(false),
  })
  .refine((data) => data.discountType !== "PERCENT" || data.discountValue <= 100, {
    message: "A percent discount can't exceed 100",
    path: ["discountValue"],
  });

export type AdminCouponInput = z.infer<typeof adminCouponSchema>;
