import { z } from "zod";

const customizationSchema = z
  .object({
    textLines: z.array(z.string().max(200)).max(10),
    font: z.string().min(1),
    colorHex: z.string().min(1),
    variant: z.string().optional(),
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
