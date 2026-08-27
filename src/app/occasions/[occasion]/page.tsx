import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { occasionContent, isOccasionSlug } from "@/lib/occasion-data";
import { db } from "@/lib/db";
import { toListProduct } from "@/lib/product-adapters";
import { TopBar } from "@/components/layout/TopBar";
import { OccasionPageClient } from "./OccasionPageClient";

type Props = {
  params: Promise<{ occasion: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { occasion } = await params;

  if (!isOccasionSlug(occasion)) {
    return { title: "Occasions | Blissynest" };
  }

  const content = occasionContent[occasion];
  return {
    title: `${content.title} | Blissynest`,
    description: content.subtitle,
  };
}

export default async function OccasionPage({ params }: Props) {
  const { occasion } = await params;

  if (!isOccasionSlug(occasion)) {
    notFound();
  }
  const content = occasionContent[occasion];

  const rows = await db.product.findMany({
    where: { status: "PUBLISHED", occasionTags: { array_contains: content.label } },
    orderBy: [{ sortRank: { sort: "asc", nulls: "last" } }, { createdAt: "asc" }],
  });

  return (
    <>
      <TopBar />
      <OccasionPageClient occasion={occasion} initialProducts={rows.map(toListProduct)} />
    </>
  );
}
