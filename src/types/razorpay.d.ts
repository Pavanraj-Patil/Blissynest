// Minimal shape for Razorpay's Checkout.js — just what this app actually
// uses, not the full SDK surface.
export type RazorpayCheckoutOptions = {
  key: string;
  amount: number;
  currency: string;
  order_id: string;
  name: string;
  description?: string;
  prefill?: { name?: string; contact?: string; email?: string };
  // Restricting to a single enabled method (others explicitly "0") makes
  // Checkout.js skip its own method-selection tab and open straight into
  // that method's entry form — used to honor the choice already made on
  // our own Payment Method step instead of asking again.
  method?: { card?: string; netbanking?: string; upi?: string; wallet?: string };
  theme?: { color?: string };
  handler: (response: {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
  }) => void;
  modal?: { ondismiss?: () => void };
};

export type RazorpayCheckoutInstance = {
  open: () => void;
};

declare global {
  interface Window {
    Razorpay?: new (options: RazorpayCheckoutOptions) => RazorpayCheckoutInstance;
  }
}
