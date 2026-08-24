import { z } from "zod";

export const wishlistItemSchema = z.object({
  slug: z.string().min(1),
});

export const mergeWishlistSchema = z.object({
  slugs: z.array(z.string().min(1)).max(200),
});
