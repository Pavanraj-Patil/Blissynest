import type { Metadata } from "next";
import { audienceShopContent, audienceSlugs, type AudienceSlug } from "@/lib/shop-mock-data";
import { AudienceShopPageClient } from "./AudienceShopPageClient";

type Props = {
  params: Promise<{ audience: string }>;
};

function isAudienceSlug(value: string): value is AudienceSlug {
  return (audienceSlugs as string[]).includes(value);
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { audience } = await params;

  if (!isAudienceSlug(audience)) {
    return { title: "Shop | Blissynest" };
  }

  const content = audienceShopContent[audience];
  return {
    title: `${content.title} | Blissynest`,
    description: content.subtitle,
  };
}

export default function AudienceShopPage({ params }: Props) {
  return <AudienceShopPageClient params={params} />;
}
