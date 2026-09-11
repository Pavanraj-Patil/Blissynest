import { z } from "zod";

// Matches the AudienceSlug values the frontend already uses everywhere
// (src/lib/shop-mock-data.ts) — lowercase in the URL/UI, uppercase as the
// Prisma enum. This is the one place that mapping happens.
export const audienceSlugToEnum = {
  her: "HER",
  him: "HIM",
  parents: "PARENTS",
  couples: "COUPLES",
  kids: "KIDS",
} as const;

export type AudienceSlug = keyof typeof audienceSlugToEnum;

export const audienceEnumToSlug = Object.fromEntries(
  Object.entries(audienceSlugToEnum).map(([slug, enumValue]) => [enumValue, slug])
) as Record<(typeof audienceSlugToEnum)[AudienceSlug], AudienceSlug>;

export const sortOptions = ["best-selling", "price-asc", "price-desc", "rating", "newest"] as const;
export type SortOption = (typeof sortOptions)[number];

// Query params for GET /api/products — mirrors the filters already built
// into the frontend's catalogue pages (BACKEND_HANDOFF.md Section 9), just
// server-side now. Every field optional; an empty query returns the full
// published catalogue, same as landing on /shop with no filters applied.
export const productListQuerySchema = z.object({
  audience: z.enum(Object.keys(audienceSlugToEnum) as [AudienceSlug, ...AudienceSlug[]]).optional(),
  category: z.string().optional(),
  collection: z.string().optional(),
  occasion: z.string().optional(), // e.g. "Birthday" — matches Product.occasionTags entries
  recipient: z.string().optional(), // matches Product.recipientTags entries
  priceMin: z.coerce.number().int().min(0).optional(),
  priceMax: z.coerce.number().int().min(0).optional(),
  sort: z.enum(sortOptions).default("best-selling"),
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(48).default(24),
});

export type ProductListQuery = z.infer<typeof productListQuerySchema>;
