import { ProductPageShell } from "@/components/product/ProductPageShell";
import { HamperPDP } from "@/components/product/HamperPDP";
import { CustomisablePDP } from "@/components/product/CustomisablePDP";
import { StandalonePDP } from "@/components/product/StandalonePDP";
import type { ProductDetail } from "@/lib/product-mock-data";
import type { RelatedProduct } from "@/lib/product-adapters";
import type { ApprovedReview } from "@/lib/review-service";

export function ProductPageClient({
  product,
  related,
  reviews,
}: {
  product: ProductDetail;
  related: RelatedProduct[];
  reviews: ApprovedReview[];
}) {
  return (
    <ProductPageShell>
      {product.pdpType === "hamper" && (
        <HamperPDP
          product={product}
          related={related}
          reviews={reviews}
          breadcrumbCategory={product.breadcrumbCategory}
        />
      )}
      {product.pdpType === "customisable" && (
        <CustomisablePDP
          product={product}
          related={related}
          reviews={reviews}
          breadcrumbCategory={product.breadcrumbCategory}
        />
      )}
      {product.pdpType === "standalone" && (
        <StandalonePDP
          product={product}
          related={related}
          reviews={reviews}
          breadcrumbCategory={product.breadcrumbCategory}
        />
      )}
    </ProductPageShell>
  );
}
