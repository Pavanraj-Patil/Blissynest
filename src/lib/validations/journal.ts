import { z } from "zod";

const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export const journalInputSchema = z.object({
  title: z.string().trim().min(1, "Title is required").max(180),
  slug: z
    .string()
    .trim()
    .min(1, "Web address is required")
    .max(120)
    .regex(slugPattern, "Use lowercase letters, numbers and single dashes only"),
  tag: z.string().trim().min(1, "Tag is required").max(60),
  excerpt: z.string().trim().min(1, "A short summary is required").max(400),
  image: z.string().trim().min(1, "A photo is required"),
  imageAlt: z.string().trim().max(190).default(""),
  body: z.string().trim().min(1, "The article text is required"),
  ctaTitle: z.string().trim().max(190).default(""),
  ctaBody: z.string().trim().max(500).default(""),
  ctaLabel: z.string().trim().max(190).default(""),
  ctaHref: z.string().trim().max(190).default(""),
  published: z.boolean().default(false),
  publishedAt: z.coerce.date(),
});

export type JournalInput = z.infer<typeof journalInputSchema>;
