import { z } from "zod";
import { phoneField, pincodeField, stateField } from "./common";

export const addressInputSchema = z.object({
  label: z.string().trim().min(1).max(50),
  name: z.string().trim().min(1).max(100),
  line1: z.string().trim().min(1).max(150),
  line2: z.string().trim().max(150).optional(),
  city: z.string().trim().min(1).max(100),
  state: stateField,
  pincode: pincodeField,
  phone: phoneField,
});

export type AddressInput = z.infer<typeof addressInputSchema>;
