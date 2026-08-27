import type { Metadata } from "next";
import { db } from "@/lib/db";
import { toListProduct } from "@/lib/product-adapters";
import { TopBar } from "@/components/layout/TopBar";
import { GiftingAssistantPageClient } from "./GiftingAssistantPageClient";

export const metadata: Metadata = {
  title: "Gifting Assistant | Blissynest",
  description: "Tell us who you're gifting and we'll help you find the perfect match.",
};

export default async function GiftingAssistantPage() {
  const rows = await db.product.findMany({
    where: { status: "PUBLISHED" },
    orderBy: [{ sortRank: { sort: "asc", nulls: "last" } }, { createdAt: "asc" }],
  });

  return (
    <>
      <TopBar />
      <GiftingAssistantPageClient initialProducts={rows.map(toListProduct)} />
    </>
  );
}
