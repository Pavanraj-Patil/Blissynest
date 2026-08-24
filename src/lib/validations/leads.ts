import { z } from "zod";

export const newsletterSchema = z.object({
  email: z.string().trim().toLowerCase().email("Enter a valid email address"),
});

export const contactMessageSchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
  email: z.string().trim().toLowerCase().email("Enter a valid email address"),
  subject: z.string().trim().min(1, "Subject is required"),
  message: z.string().trim().min(1, "Message is required"),
});

export const corporateLeadSchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
  workEmail: z.string().trim().toLowerCase().email("Enter a valid work email"),
  phone: z.string().trim().min(1, "Phone is required"),
  companyName: z.string().trim().min(1, "Company name is required"),
  teamSize: z.string().trim().optional(),
  interest: z.string().trim().optional(),
  intent: z.enum(["QUOTE", "CONSULTATION"]).default("QUOTE"),
  message: z.string().trim().optional(),
  downloadedCatalogue: z.boolean().default(false),
});
