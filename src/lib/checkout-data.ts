import {
  CreditCard,
  Smartphone,
  Landmark,
  Banknote,
  type LucideIcon,
} from "lucide-react";

export type Address = {
  id: string;
  label: string;
  name: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  pincode: string;
  phone: string;
};

export const seedAddresses: Address[] = [
  {
    id: "addr-1",
    label: "Home",
    name: "Meera Kapoor",
    line1: "221 Green Park Society, Koregaon Park",
    city: "Pune",
    state: "Maharashtra",
    pincode: "411001",
    phone: "98765 43210",
  },
];

export type PaymentMethod = {
  key: string;
  label: string;
  description: string;
  icon: LucideIcon;
};

export const paymentMethods: PaymentMethod[] = [
  {
    key: "card",
    label: "Credit / Debit Card",
    description: "Visa, Mastercard, RuPay & more",
    icon: CreditCard,
  },
  {
    key: "upi",
    label: "UPI",
    description: "Pay via any UPI app",
    icon: Smartphone,
  },
  {
    key: "netbanking",
    label: "Net Banking",
    description: "All major banks supported",
    icon: Landmark,
  },
  {
    key: "cod",
    label: "Cash on Delivery",
    description: "Pay when your order arrives",
    icon: Banknote,
  },
];

// Maps our own payment-method selection to Razorpay Checkout.js's `method`
// option (COD has no entry — it never reaches Razorpay). Explicitly
// disabling the other methods, rather than only enabling the chosen one,
// is what makes Checkout.js skip its method-selection tab entirely.
export const razorpayMethodFlags: Record<string, { card: string; netbanking: string; upi: string; wallet: string }> = {
  card: { card: "1", netbanking: "0", upi: "0", wallet: "0" },
  upi: { card: "0", netbanking: "0", upi: "1", wallet: "0" },
  netbanking: { card: "0", netbanking: "1", upi: "0", wallet: "0" },
};

export const FREE_SHIPPING_THRESHOLD = 999;
export const STANDARD_SHIPPING_FEE = 99;

export function generateOrderNumber(): string {
  const random = Math.floor(1000 + Math.random() * 9000);
  return `BLS${Date.now().toString().slice(-6)}${random}`;
}
