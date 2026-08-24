import type { Metadata } from "next";
import { db } from "@/lib/db";
import { toListProduct } from "@/lib/product-adapters";
import { TopBar } from "@/components/layout/TopBar";
import { PersonalisedPageClient } from "./PersonalisedPageClient";

export const metadata: Metadata = {
  title: "Personalised Gifts | Blissynest",
  description:
    "Thoughtful gifts made uniquely theirs — engraved, monogrammed, and made to remember.",
};

export default async function PersonalisedPage() {
  const rows = await db.product.findMany({
    where: { status: "PUBLISHED", category: "personalised" },
    orderBy: { createdAt: "asc" },
  });

  return (
    <>
      <TopBar />
      <PersonalisedPageClient initialProducts={rows.map(toListProduct)} />
    </>
  );
}
