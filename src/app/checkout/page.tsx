import type { Metadata } from "next";
import { CheckoutPageClient } from "./CheckoutPageClient";

export const metadata: Metadata = {
  title: "Checkout | Blissynest",
  description: "Review your order and complete your Blissynest purchase.",
};

// No TopBar here on purpose — its Track Order/Help/Corporate Gifting links
// are exactly the kind of "way out of checkout" a distraction-free checkout
// avoids (see CheckoutHeader). It comes back everywhere else on the site.
export default function CheckoutPage() {
  return <CheckoutPageClient />;
}
