import { z } from "zod";

export const updateOrderSchema = z.object({
  status: z.enum(["PLACED", "CONFIRMED", "PACKED", "SHIPPED", "DELIVERED", "CANCELLED"]).optional(),
  paymentStatus: z.enum(["PENDING", "PAID", "FAILED", "REFUNDED"]).optional(),
  trackingNumber: z.string().trim().max(191).optional(),
  carrierName: z.string().trim().max(191).optional(),
});
