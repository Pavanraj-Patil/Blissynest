import { z } from "zod";
import { PHONE_ERROR, PINCODE_ERROR, normalizeIndianMobile } from "@/lib/phone";
import { canonicalState } from "@/lib/india-locations";

// Indian mobile number — any common way of typing it is accepted, and the
// value that comes out is the bare 10 digits, so every stored phone number
// has one consistent format.
export const phoneField = z
  .string()
  .trim()
  .refine((v) => normalizeIndianMobile(v) !== null, PHONE_ERROR)
  .transform((v) => normalizeIndianMobile(v) as string);

export const pincodeField = z.string().trim().regex(/^[1-9]\d{5}$/, PINCODE_ERROR);

// One of India's states / union territories, saved in the list's own spelling.
export const stateField = z
  .string()
  .trim()
  .refine((v) => canonicalState(v) !== null, "Choose a valid state")
  .transform((v) => canonicalState(v) as string);
