import { z } from "zod";
import { phoneField } from "./common";

export const newsletterSchema = z.object({
  email: z.string().trim().toLowerCase().max(191).email("Enter a valid email address"),
});

export const contactMessageSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100),
  email: z.string().trim().toLowerCase().max(191).email("Enter a valid email address"),
  subject: z.string().trim().min(1, "Subject is required").max(191),
  message: z.string().trim().min(1, "Message is required").max(5000),
});

export const corporateLeadSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100),
  workEmail: z.string().trim().toLowerCase().max(191).email("Enter a valid work email"),
  phone: phoneField,
  companyName: z.string().trim().min(1, "Company name is required").max(150),
  teamSize: z.string().trim().max(100).optional(),
  interest: z.string().trim().max(150).optional(),
  intent: z.enum(["QUOTE", "CONSULTATION"]).default("QUOTE"),
  message: z.string().trim().max(5000).optional(),
  downloadedCatalogue: z.boolean().default(false),
});
