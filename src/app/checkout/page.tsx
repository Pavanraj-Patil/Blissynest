import type { Metadata } from "next";
import { TopBar } from "@/components/layout/TopBar";
import { CheckoutPageClient } from "./CheckoutPageClient";

export const metadata: Metadata = {
  title: "Checkout | Blissynest",
  description: "Review your order and complete your Blissynest purchase.",
};

export default function CheckoutPage() {
  return (
    <>
      <TopBar />
      <CheckoutPageClient />
    </>
  );
}
