import { z } from "zod";

export const createReviewSchema = z.object({
  orderId: z.string().min(1),
  productId: z.string().min(1),
  rating: z.coerce.number().int().min(1).max(5),
  comment: z.string().trim().min(1, "Please add a few words about the product").max(2000),
});

export const moderateReviewSchema = z.object({
  status: z.enum(["APPROVED", "REJECTED"]),
});

export const createAdminReviewSchema = z.object({
  productId: z.string().min(1),
  authorName: z.string().trim().min(1, "Please enter a name").max(100),
  rating: z.coerce.number().int().min(1).max(5),
  comment: z.string().trim().min(1, "Please add a few words about the product").max(2000),
});
