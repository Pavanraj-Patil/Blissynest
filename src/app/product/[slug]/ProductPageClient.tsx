"use client";

import { use } from "react";
import { notFound } from "next/navigation";
import { ProductPageShell } from "@/components/product/ProductPageShell";
import { HamperPDP } from "@/components/product/HamperPDP";
import { CustomisablePDP } from "@/components/product/CustomisablePDP";
import { StandalonePDP } from "@/components/product/StandalonePDP";
import { getProductBySlug } from "@/lib/product-mock-data";

export function ProductPageClient({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const product = getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  return (
    <ProductPageShell
      breadcrumbCategory={product.breadcrumbCategory}
      productName={product.name}
    >
      {product.pdpType === "hamper" && <HamperPDP product={product} />}
      {product.pdpType === "customisable" && <CustomisablePDP product={product} />}
      {product.pdpType === "standalone" && <StandalonePDP product={product} />}
    </ProductPageShell>
  );
}
