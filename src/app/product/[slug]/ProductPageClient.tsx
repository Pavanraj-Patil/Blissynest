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
    <ProductPageShell
      breadcrumbCategory={product.breadcrumbCategory}
      productName={product.name}
    >
      {product.pdpType === "hamper" && (
        <HamperPDP product={product} related={related} reviews={reviews} />
      )}
      {product.pdpType === "customisable" && (
        <CustomisablePDP product={product} related={related} reviews={reviews} />
      )}
      {product.pdpType === "standalone" && (
        <StandalonePDP product={product} related={related} reviews={reviews} />
      )}
    </ProductPageShell>
  );
}
