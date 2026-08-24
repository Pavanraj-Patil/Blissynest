import type { Metadata } from "next";
import { TopBar } from "@/components/layout/TopBar";
import { ShopPageClient } from "./ShopPageClient";

export const metadata: Metadata = {
  title: "Shop All Gifts | Blissynest",
  description: "Every gift, every occasion — beautifully curated just for you.",
};

export default function ShopPage() {
  return (
    <>
      <TopBar />
      <ShopPageClient />
    </>
  );
}
