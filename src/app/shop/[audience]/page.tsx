import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { audienceShopContent, audienceSlugs, type AudienceSlug } from "@/lib/shop-mock-data";
import { audienceSlugToEnum } from "@/lib/validations/product";
import { db } from "@/lib/db";
import { toListProduct } from "@/lib/product-adapters";
import { TopBar } from "@/components/layout/TopBar";
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

export default async function AudienceShopPage({ params }: Props) {
  const { audience } = await params;

  if (!isAudienceSlug(audience)) {
    notFound();
  }

  const rows = await db.product.findMany({
    where: {
      status: "PUBLISHED",
      corporateOnly: false,
      audience: { array_contains: audienceSlugToEnum[audience] },
    },
    orderBy: [{ sortRank: { sort: "asc", nulls: "last" } }, { createdAt: "asc" }],
  });

  return (
    <>
      <TopBar />
      <AudienceShopPageClient audience={audience} initialProducts={rows.map(toListProduct)} />
    </>
  );
}
