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

export const guestCartItemSchema = z.object({
  slug: z.string().trim().min(1),
  quantity: z.number().int().min(1).max(20),
});

export const createOrderSchema = z.object({
  shippingAddress: shippingAddressSchema,
  paymentMethod: paymentMethodSchema,
  isGift: z.boolean().default(false),
  giftNote: z.string().trim().max(500).optional(),
  hidePricesOnSlip: z.boolean().default(false),
  couponCode: z.string().trim().optional(),
  // Guest-only — optional here since Zod has no auth context; the route
  // handler (via resolveCartSourceForRequest) requires these when there's
  // no session.
  guestEmail: z.string().trim().email().optional(),
  guestPhone: z.string().trim().min(1).optional(),
  guestItems: z.array(guestCartItemSchema).max(50).optional(),
});

export const razorpayCheckoutSessionSchema = z.object({
  couponCode: z.string().trim().optional(),
  guestEmail: z.string().trim().email().optional(),
  guestPhone: z.string().trim().min(1).optional(),
  guestItems: z.array(guestCartItemSchema).max(50).optional(),
});

export const razorpayVerifySchema = createOrderSchema.extend({
  razorpayOrderId: z.string().min(1),
  razorpayPaymentId: z.string().min(1),
  razorpaySignature: z.string().min(1),
});
