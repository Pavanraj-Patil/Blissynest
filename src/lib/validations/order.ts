import { z } from "zod";

export const shippingAddressSchema = z.object({
  label: z.string().trim().min(1),
  name: z.string().trim().min(1),
  line1: z.string().trim().min(1),
  line2: z.string().trim().optional(),
  city: z.string().trim().min(1),
  state: z.string().trim().min(1),
  pincode: z.string().trim().min(1),
  phone: z.string().trim().min(1),
});

export const paymentMethodSchema = z.enum(["card", "upi", "netbanking", "cod"]);

export const createOrderSchema = z.object({
  shippingAddress: shippingAddressSchema,
  paymentMethod: paymentMethodSchema,
  isGift: z.boolean().default(false),
  giftNote: z.string().trim().max(500).optional(),
  hidePricesOnSlip: z.boolean().default(false),
  couponCode: z.string().trim().optional(),
});

export const razorpayCheckoutSessionSchema = z.object({
  couponCode: z.string().trim().optional(),
});

export const razorpayVerifySchema = createOrderSchema.extend({
  razorpayOrderId: z.string().min(1),
  razorpayPaymentId: z.string().min(1),
  razorpaySignature: z.string().min(1),
});
