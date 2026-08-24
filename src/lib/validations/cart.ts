import { z } from "zod";

export const addCartItemSchema = z.object({
  slug: z.string().min(1),
  quantity: z.coerce.number().int().min(1).max(20).default(1),
});

export const updateCartItemSchema = z.object({
  slug: z.string().min(1),
  quantity: z.coerce.number().int().min(0).max(20),
});

export const mergeCartSchema = z.object({
  items: z
    .array(
      z.object({
        slug: z.string().min(1),
        quantity: z.coerce.number().int().min(1).max(20),
      })
    )
    .max(100),
});
