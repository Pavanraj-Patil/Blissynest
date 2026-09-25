import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { toProductDetail, toRelatedProduct } from "@/lib/product-adapters";
import { getApprovedReviewsForProduct } from "@/lib/review-service";
import { getSiteUrl } from "@/lib/site-url";
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

  const description = productDescription(product);
  const image = firstImage(product.images);

  return {
    title: `${product.name} | Blissynest`,
    description,
    alternates: { canonical: `/product/${product.slug}` },
    openGraph: {
      type: "website",
      title: product.name,
      description,
      url: `/product/${product.slug}`,
      ...(image ? { images: [{ url: image }] } : {}),
    },
    twitter: { card: "summary_large_image", title: product.name, description, ...(image ? { images: [image] } : {}) },
  };
}

// Tagline if there is one, otherwise the start of the description — search
// results and share cards look far better with real copy than a generic line.
function productDescription(product: { name: string; tagline: string | null; productDetails: unknown }): string {
  if (product.tagline) return product.tagline;
  const details = product.productDetails as { description?: string } | null;
  const text = details?.description?.replace(/\s+/g, " ").trim();
  if (text) return text.length > 155 ? `${text.slice(0, 152).trimEnd()}…` : text;
  return `${product.name} — thoughtfully curated gifts from Blissynest.`;
}

function firstImage(images: unknown): string | null {
  return Array.isArray(images) && typeof images[0] === "string" ? images[0] : null;
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
        corporateOnly: false,
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

  const site = getSiteUrl();
  const images = (Array.isArray(product.images) ? (product.images as string[]) : [])
    .filter((u) => typeof u === "string")
    .map((u) => (u.startsWith("/") ? `${site}${u}` : u));
  // schema.org Product data lets Google show price/availability/stars in
  // results. Stars only once real reviews exist — never invented.
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: productDescription(product),
    image: images,
    sku: product.slug,
    brand: { "@type": "Brand", name: "Blissynest" },
    offers: {
      "@type": "Offer",
      url: `${site}/product/${product.slug}`,
      priceCurrency: "INR",
      price: product.basePrice / 100, // stored in paise
      availability: product.inStock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
    },
    ...(product.reviewCount > 0
      ? { aggregateRating: { "@type": "AggregateRating", ratingValue: product.rating, reviewCount: product.reviewCount } }
      : {}),
  };

  return (
    <>
      <script
        type="application/ld+json"
        // "<" escaped so a product name can never close the script tag.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replaceAll("<", String.fromCharCode(92) + "u003c") }}
      />
      <ProductPageClient
        product={toProductDetail(product)}
        related={relatedRows.map(toRelatedProduct)}
        reviews={reviews}
      />
    </>
  );
}
