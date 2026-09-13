import type { Metadata } from "next";
import { db } from "@/lib/db";
import { toRelatedProduct } from "@/lib/product-adapters";
import { TopBar } from "@/components/layout/TopBar";
import { SearchPageClient } from "./SearchPageClient";

type Props = {
  searchParams: Promise<{ q?: string }>;
};

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const { q } = await searchParams;
  if (q) {
    return {
      title: `Search results for "${q}" | Blissynest`,
      description: `Browse Blissynest gifts matching "${q}".`,
    };
  }
  return {
    title: "Search | Blissynest",
    description: "Search the Blissynest catalogue for the perfect gift.",
  };
}

export default async function SearchPage({ searchParams }: Props) {
  const { q } = await searchParams;
  const query = (q ?? "").trim();

  const rows = query
    ? await db.product.findMany({
        where: { status: "PUBLISHED", corporateOnly: false, name: { contains: query } },
        orderBy: { reviewCount: "desc" },
      })
    : [];

  return (
    <>
      <TopBar />
      <SearchPageClient query={query} initialResults={rows.map(toRelatedProduct)} />
    </>
  );
}
