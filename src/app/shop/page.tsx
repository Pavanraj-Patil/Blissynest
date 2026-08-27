import type { Metadata } from "next";
import { db } from "@/lib/db";
import { toListProduct } from "@/lib/product-adapters";
import { TopBar } from "@/components/layout/TopBar";
import { ShopPageClient } from "./ShopPageClient";

export const metadata: Metadata = {
  title: "Shop All Gifts | Blissynest",
  description: "Every gift, every occasion — beautifully curated just for you.",
};

export default async function ShopPage() {
  const rows = await db.product.findMany({
    where: { status: "PUBLISHED" },
    orderBy: [{ sortRank: { sort: "asc", nulls: "last" } }, { createdAt: "asc" }],
  });

  return (
    <>
      <TopBar />
      <ShopPageClient initialProducts={rows.map(toListProduct)} />
    </>
  );
}
