import { z } from "zod";

export const addressInputSchema = z.object({
  label: z.string().trim().min(1),
  name: z.string().trim().min(1),
  line1: z.string().trim().min(1),
  line2: z.string().trim().optional(),
  city: z.string().trim().min(1),
  state: z.string().trim().min(1),
  pincode: z.string().trim().min(1),
  phone: z.string().trim().min(1),
});

export type AddressInput = z.infer<typeof addressInputSchema>;
