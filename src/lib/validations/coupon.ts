import { z } from "zod";

// Customer-facing "apply coupon" check at checkout — subtotal arrives in
// plain rupees (what the client already tracks), converted to paise before
// touching resolveCouponDiscount, matching every other paise boundary in
// this app.
export const validateCouponSchema = z.object({
  code: z.string().trim().min(1),
  subtotal: z.coerce.number().min(0),
});
