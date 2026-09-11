import { z } from "zod";

// Covers both product types that attach customization to a cart line:
// Customisable (textLines/font/colorHex/variant — all populated together)
// and Standalone (variants only — a label->selected-option map, since a
// Standalone product can define multiple variant groups at once, e.g.
// Color and Size). A single cart line only ever populates one "shape" or
// the other, but both live on this one optional object rather than two
// separate cart-item fields.
export const customizationSchema = z
  .object({
    textLines: z.array(z.string().max(200)).max(10).optional(),
    font: z.string().min(1).optional(),
    colorHex: z.string().min(1).optional(),
    variant: z.string().optional(),
    variants: z.record(z.string(), z.string()).optional(),
  })
  .optional();

export const addCartItemSchema = z.object({
  slug: z.string().min(1),
  quantity: z.coerce.number().int().min(1).max(20).default(1),
  customization: customizationSchema,
});

export const updateCartItemSchema = z.object({
  id: z.string().min(1),
  quantity: z.coerce.number().int().min(0).max(20),
});

export const mergeCartSchema = z.object({
  items: z
    .array(
      z.object({
        slug: z.string().min(1),
        quantity: z.coerce.number().int().min(1).max(20),
        customization: customizationSchema,
      })
    )
    .max(100),
});
