import type { Metadata } from "next";
import { TopBar } from "@/components/layout/TopBar";
import { CartPageClient } from "./CartPageClient";

export const metadata: Metadata = {
  title: "My Cart | Blissynest",
  description: "Review the items in your Blissynest cart before checkout.",
};

export default function CartPage() {
  return (
    <>
      <TopBar />
      <CartPageClient />
    </>
  );
}
