import { z } from "zod";
import { bannerIconOptions, bannerGradientOptions } from "@/lib/banner-presets";

export const bannerInputSchema = z.object({
  title: z.string().trim().min(1, "Title is required"),
  subtitle: z.string().trim().min(1, "Subtitle is required"),
  href: z.string().trim().min(1, "Link is required"),
  icon: z.enum(bannerIconOptions as [string, ...string[]]),
  gradient: z.enum(bannerGradientOptions as [string, ...string[]]),
  sortOrder: z.coerce.number().int().default(0),
  active: z.boolean().default(true),
});

export type BannerInput = z.infer<typeof bannerInputSchema>;
