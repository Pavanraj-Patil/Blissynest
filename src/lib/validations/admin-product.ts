import { z } from "zod";

// The admin product form. Deliberately doesn't cover every field on the
// Product model — see AdminProductForm's comments for what's out of scope
// in this first pass (changing slug/pdpType after creation) and why.
export const adminProductSchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
  tagline: z.string().trim().optional(),
  pdpType: z.enum(["HAMPER", "STANDALONE", "CUSTOMISABLE"]),
  audience: z.array(z.enum(["HER", "HIM", "PARENTS", "COUPLES", "KIDS"])).default([]),
  // Not a fixed z.enum here: valid values depend on whether collectionSlug is
  // set (shopCategories' slugs when unset, that collection's own category
  // list when set — see CheckboxGroupField usage in ProductForm.tsx) so the
  // UI enforces the right vocabulary rather than this schema.
  category: z.array(z.string().trim().min(1)).min(1, "Pick at least one category"),
  collectionSlug: z.string().trim().optional(),
  breadcrumbCategory: z.string().trim().optional(),
  occasionTags: z.array(z.string()).default([]),
  recipientTags: z.array(z.string()).default([]),
  // Hand-picked "You may also like" slugs, in display order. Empty means the
  // product page falls back to matching by shared category/audience.
  relatedSlugs: z.array(z.string().trim().min(1)).max(8, "Pick at most 8 related products").default([]),
  attribute: z.string().trim().optional(),
  badge: z.enum(["BESTSELLER", "NEW", ""]).optional(),
  basePrice: z.coerce.number().int().min(0, "Price can't be negative"),
  compareAtPrice: z.coerce.number().int().min(0).optional(),
  images: z.array(z.string().trim().min(1)).min(1, "At least one image URL is required"),
  stockQuantity: z.coerce.number().int().min(0),
  codAvailable: z.boolean().default(true),
  featured: z.boolean().default(false),
  corporateOnly: z.boolean().default(false),
  corporateNeeds: z.array(z.string()).default([]),
  sortRank: z.coerce.number().int().optional(),
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]),
  description: z.string().trim().min(1, "Description is required"),
  materials: z.string().trim().optional(),
  dimensions: z.string().trim().optional(),
  howToUse: z.string().trim().optional(),
  care: z.string().trim().optional(),
  delivery: z.string().trim().min(1, "Delivery copy is required"),
  // Hamper-only
  whatsInside: z
    .array(z.object({ name: z.string().min(1), subtitle: z.string(), qty: z.string() }))
    .optional(),
  personalNoteLabel: z.string().trim().optional(),
  personalNotePrice: z.coerce.number().int().min(0).optional(),
  // Standalone-only
  variants: z
    .array(z.object({ label: z.string().min(1), options: z.array(z.string().min(1)) }))
    .optional(),
  // Standalone-only — per-variant-option image overrides, keyed by
  // "<label>::<option>" (see prisma/schema.prisma's Product.variantImages).
  variantImages: z.record(z.string(), z.array(z.string().min(1))).optional(),
  // Customisable-only
  textLines: z
    .array(
      z.object({
        label: z.string().min(1),
        required: z.boolean(),
        maxLength: z.coerce.number().int().min(1),
        placeholder: z.string(),
      })
    )
    .optional(),
  fonts: z.array(z.string().min(1)).optional(),
  // Lets shoppers upload their own photos as part of the customisation
  // (Customisable, and a personalisable Hamper). Absent = feature off.
  imageUpload: z
    .object({ maxImages: z.coerce.number().int().min(1).max(10), required: z.boolean() })
    .optional(),
  colors: z.array(z.object({ name: z.string().min(1), hex: z.string().min(1) })).optional(),
  variantLabel: z.string().trim().optional(),
  variantOptions: z.array(z.string().min(1)).optional(),
  specs: z
    .array(z.object({ icon: z.string().min(1), label: z.string().min(1), value: z.string().min(1) }))
    .optional(),
});

export type AdminProductInput = z.infer<typeof adminProductSchema>;
