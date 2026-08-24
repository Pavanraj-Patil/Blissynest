import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import type { Audience } from "@/generated/prisma/client";
import { toProductDetail, toRelatedProduct } from "@/lib/product-adapters";
import { getApprovedReviewsForProduct } from "@/lib/review-service";
import { ProductPageClient } from "./ProductPageClient";

type Props = {
  params: Promise<{ slug: string }>;
};

async function getPublishedProduct(slug: string) {
  const product = await db.product.findUnique({ where: { slug } });
  if (!product || product.status !== "PUBLISHED") return null;
  return product;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await getPublishedProduct(slug);

  if (!product) {
    return { title: "Product Not Found | Blissynest" };
  }

  return {
    title: `${product.name} | Blissynest`,
    description:
      product.tagline ?? `${product.name} — thoughtfully curated gifts from Blissynest.`,
  };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = await getPublishedProduct(slug);

  if (!product) {
    notFound();
  }

  const relatedSlugs = product.relatedSlugs as string[];
  const relatedRows =
    relatedSlugs.length > 0
      ? await db.product.findMany({
          where: { slug: { in: relatedSlugs }, status: "PUBLISHED" },
        })
      : await db.product.findMany({
          where: {
            status: "PUBLISHED",
            id: { not: product.id },
            category: product.category,
            ...(product.audience ? { audience: product.audience as Audience } : {}),
          },
          take: 4,
        });

  const reviews = await getApprovedReviewsForProduct(product.id);

  return (
    <ProductPageClient
      product={toProductDetail(product)}
      related={relatedRows.map(toRelatedProduct)}
      reviews={reviews}
    />
  );
}
