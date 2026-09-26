import {
  orderConfirmationEmail,
  orderStatusEmail,
  passwordChangedEmail,
  passwordResetEmail,
  teamNotificationEmail,
  type EmailContext,
  type OrderEmailData,
} from "@/lib/email-templates";
import { getSiteUrl } from "@/lib/site-url";

// Example emails for the admin preview and "send me a test" button. They use
// made-up order details, never a real customer's.
export const emailTypes = [
  { key: "order-confirmation", label: "Order confirmation" },
  { key: "order-shipped", label: "Order shipped" },
  { key: "order-delivered", label: "Order delivered" },
  { key: "order-cancelled", label: "Order cancelled" },
  { key: "password-reset", label: "Password reset" },
  { key: "password-changed", label: "Password changed" },
  { key: "team", label: "Team alert" },
] as const;

export type EmailTypeKey = (typeof emailTypes)[number]["key"];

const sampleOrder: OrderEmailData = {
  orderNumber: "BN-2026-000123",
  buyerName: "Aarav Sharma",
  items: [
    { name: "The Gratitude Hamper", quantity: 1, unitPrice: 229900 },
    { name: "Personalised Coffee Mug", quantity: 2, unitPrice: 59900 },
  ],
  subtotal: 349700,
  discount: 20000,
  shippingCost: 0,
  total: 329700,
  paymentMethod: "ONLINE",
  paymentStatus: "PAID",
  address: "Aarav Sharma, 12 Rose Lane, Koregaon Park, Pune, Maharashtra, 411001, Phone: 9876543210",
  giftNote: "Happy birthday, Mom! Thank you for everything.",
  trackingNumber: "BLD123456789",
  carrierName: "Blue Dart",
};

export function isEmailTypeKey(value: unknown): value is EmailTypeKey {
  return emailTypes.some((t) => t.key === value);
}

export function buildSampleEmail(type: EmailTypeKey, ctx: EmailContext) {
  switch (type) {
    case "order-confirmation":
      return orderConfirmationEmail(sampleOrder, ctx);
    case "order-shipped":
      return orderStatusEmail(sampleOrder, "SHIPPED", ctx);
    case "order-delivered":
      return orderStatusEmail(sampleOrder, "DELIVERED", ctx);
    case "order-cancelled":
      return orderStatusEmail(sampleOrder, "CANCELLED", ctx);
    case "password-reset":
      return passwordResetEmail("Aarav Sharma", `${getSiteUrl()}/reset-password?token=example`, ctx);
    case "password-changed":
      return passwordChangedEmail("Aarav Sharma", ctx);
    default:
      return teamNotificationEmail(
        {
          title: "New order BN-2026-000123",
          fields: [
            ["Customer", "Aarav Sharma <aarav@example.com>"],
            ["Items", "The Gratitude Hamper × 1\nPersonalised Coffee Mug × 2"],
            ["Total", "₹3,297"],
            ["Payment", "ONLINE (PAID)"],
          ],
        },
        ctx
      );
  }
}
