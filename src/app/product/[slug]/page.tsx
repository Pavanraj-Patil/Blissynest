import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
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
  let relatedRows =
    relatedSlugs.length > 0
      ? await db.product.findMany({
          where: { slug: { in: relatedSlugs }, status: "PUBLISHED" },
        })
      : [];

  // Falls through to category/audience matching whenever the explicit list
  // is either unset OR every slug on it has since been archived (e.g. the
  // per-audience taxonomy migration archived old products without updating
  // the handful of other products that still pointed at them by slug) —
  // otherwise the page would silently show no "You may also like" section
  // at all instead of the same sensible fallback used for every other
  // product.
  if (relatedRows.length === 0) {
    relatedRows = await db.product.findMany({
      where: {
        status: "PUBLISHED",
        id: { not: product.id },
        // Both sides are arrays now — match anything sharing at least one
        // category or audience with this product, rather than requiring
        // an exact single value in common.
        OR: [
          ...(product.category as string[]).map((c) => ({ category: { array_contains: c } })),
          ...(product.audience as string[]).map((a) => ({ audience: { array_contains: a } })),
        ],
      },
      take: 4,
    });
  }

  const reviews = await getApprovedReviewsForProduct(product.id);

  return (
    <ProductPageClient
      product={toProductDetail(product)}
      related={relatedRows.map(toRelatedProduct)}
      reviews={reviews}
    />
  );
}
