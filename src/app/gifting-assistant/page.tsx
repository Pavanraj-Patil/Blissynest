import type { Metadata } from "next";
import { db } from "@/lib/db";
import { toListProduct } from "@/lib/product-adapters";
import { TopBar } from "@/components/layout/TopBar";
import { getPageContent } from "@/lib/content-service";
import { GiftingAssistantPageClient } from "./GiftingAssistantPageClient";

export const metadata: Metadata = {
  title: "Gifting Assistant | Blissynest",
  description: "Tell us who you're gifting and we'll help you find the perfect match.",
};

export default async function GiftingAssistantPage() {
  const content = await getPageContent("gifting-assistant");
  const header = content.header as { eyebrow: string; heading: string; intro: string };
  const rows = await db.product.findMany({
    where: { status: "PUBLISHED", corporateOnly: false },
    orderBy: [{ sortRank: { sort: "asc", nulls: "last" } }, { createdAt: "asc" }],
  });

  return (
    <>
      <TopBar />
      <GiftingAssistantPageClient initialProducts={rows.map(toListProduct)} header={header} />
    </>
  );
}
