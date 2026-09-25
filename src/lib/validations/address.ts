import { z } from "zod";
import { phoneField, pincodeField, stateField } from "./common";

export const addressInputSchema = z.object({
  label: z.string().trim().min(1),
  name: z.string().trim().min(1),
  line1: z.string().trim().min(1),
  line2: z.string().trim().optional(),
  city: z.string().trim().min(1),
  state: stateField,
  pincode: pincodeField,
  phone: phoneField,
});

export type AddressInput = z.infer<typeof addressInputSchema>;
