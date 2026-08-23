import type { Metadata } from "next";
import { collectionContent, isCollectionSlug } from "@/lib/collection-mock-data";
import { CollectionPageClient } from "./CollectionPageClient";

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

export default function CollectionPage({ params }: Props) {
  return <CollectionPageClient params={params} />;
}
