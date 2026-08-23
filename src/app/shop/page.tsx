import type { Metadata } from "next";
import { ShopPageClient } from "./ShopPageClient";

export const metadata: Metadata = {
  title: "Shop All Gifts | Blissynest",
  description: "Every gift, every occasion — beautifully curated just for you.",
};

export default function ShopPage() {
  return <ShopPageClient />;
}
