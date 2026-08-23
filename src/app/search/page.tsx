import type { Metadata } from "next";
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

export default function SearchPage() {
  return <SearchPageClient />;
}
