import type { Metadata } from "next";
import { getProductBySlug } from "@/lib/product-mock-data";
import { ProductPageClient } from "./ProductPageClient";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) {
    return { title: "Product Not Found | Blissynest" };
  }

  return {
    title: `${product.name} | Blissynest`,
    description:
      product.tagline ?? `${product.name} — thoughtfully curated gifts from Blissynest.`,
  };
}

export default function ProductPage({ params }: Props) {
  return <ProductPageClient params={params} />;
}
