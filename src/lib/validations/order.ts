import { z } from "zod";
import { customizationSchema } from "./cart";
import { phoneField, pincodeField, stateField } from "./common";

export const shippingAddressSchema = z.object({
  label: z.string().trim().min(1).max(50),
  name: z.string().trim().min(1).max(100),
  line1: z.string().trim().min(1).max(150),
  line2: z.string().trim().max(150).optional(),
  city: z.string().trim().min(1).max(100),
  state: stateField,
  pincode: pincodeField,
  phone: phoneField,
});

export const paymentMethodSchema = z.enum(["card", "upi", "netbanking", "cod"]);

export const guestCartItemSchema = z.object({
  slug: z.string().trim().min(1),
  quantity: z.number().int().min(1).max(20),
  customization: customizationSchema,
});

export const createOrderSchema = z.object({
  shippingAddress: shippingAddressSchema,
  paymentMethod: paymentMethodSchema,
  isGift: z.boolean().default(false),
  giftNote: z.string().trim().max(500).optional(),
  hidePricesOnSlip: z.boolean().default(false),
  couponCode: z.string().trim().max(40).optional(),
  // Guest-only — optional here since Zod has no auth context; the route
  // handler (via resolveCartSourceForRequest) requires these when there's
  // no session.
  guestEmail: z.string().trim().max(191).email().optional(),
  guestPhone: phoneField.optional(),
  guestItems: z.array(guestCartItemSchema).max(50).optional(),
});

// Same fields as placing an order: the payment snapshot has to carry the delivery
// details so a paid order can be recovered without the browser.
export const razorpayCheckoutSessionSchema = createOrderSchema;

export const razorpayVerifySchema = createOrderSchema.extend({
  razorpayOrderId: z.string().min(1),
  razorpayPaymentId: z.string().min(1),
  razorpaySignature: z.string().min(1),
});
