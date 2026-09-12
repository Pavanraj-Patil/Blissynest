import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { collectionContent, isCollectionSlug, type CollectionSlug } from "@/lib/collection-mock-data";
import { db } from "@/lib/db";
import { toListProduct } from "@/lib/product-adapters";
import { TopBar } from "@/components/layout/TopBar";
import { getPageContent } from "@/lib/content-service";
import { CollectionPageClient } from "./CollectionPageClient";

const bannerFieldBySlug: Record<CollectionSlug, string> = {
  minimalist: "minimalistBanner",
  celebration: "celebrationBanner",
  luxury: "luxuryBanner",
  hampers: "hampersBanner",
};

type Props = {
  params: Promise<{ collection: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { collection } = await params;

  if (!isCollectionSlug(collection)) {
    return { title: "Collections | Blissynest" };
  }

  const content = collectionContent[collection];
  return {
    title: `${content.title} | Blissynest`,
    description: content.subtitle,
  };
}

export default async function CollectionPage({ params }: Props) {
  const { collection } = await params;

  if (!isCollectionSlug(collection)) {
    notFound();
  }
  const slug: CollectionSlug = collection;

  const [rows, layoutContent] = await Promise.all([
    db.product.findMany({
      where: { status: "PUBLISHED", collectionSlug: slug },
      orderBy: [{ sortRank: { sort: "asc", nulls: "last" } }, { createdAt: "asc" }],
    }),
    getPageContent("layout"),
  ]);
  const bannerImage = layoutContent["collection-banners"]?.[bannerFieldBySlug[slug]] as string | undefined;

  return (
    <>
      <TopBar />
      <CollectionPageClient
        collection={slug}
        initialProducts={rows.map(toListProduct)}
        bannerImage={bannerImage}
      />
    </>
  );
}
