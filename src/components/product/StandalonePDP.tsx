"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ShoppingBag, Check } from "lucide-react";
import { ProductGallery } from "./ProductGallery";
import { Breadcrumb } from "@/components/shop/Breadcrumb";
import { RatingStars } from "./RatingStars";
import { QuantityStepper } from "./QuantityStepper";
import { VariantPills } from "./VariantPills";
import { AccordionItem } from "./Accordion";
import { ShareIconButton } from "./ShareIconButton";
import { PdpWishlistButton } from "./PdpWishlistButton";
import { ReviewsSection } from "./ReviewsSection";
import { MobileStickyCTA } from "./MobileStickyCTA";
import { BuyNowOrViewCartButton } from "./BuyNowOrViewCartButton";
import { RelatedProducts } from "./RelatedProducts";
import { AddedToCartModal } from "./AddedToCartModal";
import type { StandaloneProduct } from "@/lib/product-mock-data";
import type { RelatedProduct } from "@/lib/product-adapters";
import type { ApprovedReview } from "@/lib/review-service";
import { useCart } from "@/lib/cart-context";

export function StandalonePDP({
  product,
  related,
  reviews,
  breadcrumbCategory,
}: {
  product: StandaloneProduct;
  related: RelatedProduct[];
  reviews: ApprovedReview[];
  breadcrumbCategory: string;
}) {
  const router = useRouter();
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [cartModalOpen, setCartModalOpen] = useState(false);
  const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>(
    () =>
      Object.fromEntries(
        (product.variants ?? []).map((v) => [v.label, v.options[0]])
      )
  );
  const hasVariants = (product.variants?.length ?? 0) > 0;

  // The gallery follows whichever selected variant option has its own
  // images attached (see admin ProductForm's "Variant Images"); the first
  // group with a match wins, falling back to the product's own photos when
  // none of the current selections have an override.
  const activeImages = useMemo(() => {
    for (const group of product.variants ?? []) {
      const selected = selectedVariants[group.label];
      const override = product.variantImages?.[`${group.label}::${selected}`];
      if (override && override.length > 0) return override;
    }
    return product.images;
  }, [product.variants, product.variantImages, product.images, selectedVariants]);

  function handleAddToCart() {
    addItem(
      {
        slug: product.slug,
        name: product.name,
        price: product.price,
        image: product.images[0],
        ...(hasVariants && { customization: { variants: selectedVariants } }),
      },
      quantity
    );
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
    setCartModalOpen(true);
  }

  function handleBuyNow() {
    addItem(
      {
        slug: product.slug,
        name: product.name,
        price: product.price,
        image: product.images[0],
        ...(hasVariants && { customization: { variants: selectedVariants } }),
      },
      quantity
    );
    router.push("/cart");
  }

  return (
    <div>
      <div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10 lg:gap-16">
          <div className="min-w-0">
            <div className="md:sticky md:top-28 md:flex md:flex-col md:gap-4">
              <div className="hidden md:block">
                <Breadcrumb
                  items={[
                    { label: "Home", href: "/" },
                    { label: "Shop", href: "/shop" },
                    { label: breadcrumbCategory },
                    { label: product.name },
                  ]}
                />
              </div>
              {/* Keyed by the image set itself so ProductGallery's internal
                  "active thumbnail" index resets to 0 when switching to a
                  variant with a different (or shorter) image set — otherwise
                  a stale index could point past the end of the new array. */}
              <ProductGallery key={activeImages.join("|")} images={activeImages} name={product.name} />
            </div>
          </div>

          <div className="min-w-0 md:flex md:flex-col">
            <div className="flex items-start justify-between gap-3">
              <h1 className="font-serif text-2xl sm:text-3xl text-charcoal">
                {product.name}
              </h1>
              <div className="flex items-center gap-1 shrink-0">
                <PdpWishlistButton
                  slug={product.slug}
                  name={product.name}
                  price={product.price}
                  image={product.images[0]}
                  rating={product.rating}
                  reviews={product.reviews}
                />
                <ShareIconButton productName={product.name} />
              </div>
            </div>
            <div className="mt-2">
              <RatingStars rating={product.rating} reviews={product.reviews} />
            </div>
            <p className="mt-3 text-2xl font-semibold text-charcoal">
              ₹{product.price.toLocaleString("en-IN")}
            </p>
            <p className="text-xs text-ink-muted -mt-1">Inclusive of all taxes</p>
            {!product.inStock && (
              <p className="mt-2 text-xs font-semibold uppercase tracking-wide text-terracotta-dark">
                Out of Stock
              </p>
            )}

            {product.tagline && (
              <p className="mt-4 text-sm text-charcoal-light leading-relaxed max-w-md">
                {product.tagline}
              </p>
            )}

            {hasVariants && (
              <div className="mt-6 space-y-6">
                {product.variants!.map((v) => (
                  <VariantPills
                    key={v.label}
                    label={v.label}
                    options={v.options}
                    selected={selectedVariants[v.label]}
                    onSelect={(option) =>
                      setSelectedVariants((prev) => ({ ...prev, [v.label]: option }))
                    }
                  />
                ))}
              </div>
            )}

            <div className="mt-6">
              <QuantityStepper value={quantity} onChange={setQuantity} />
            </div>

            <div className="mt-6">
              <AccordionItem title="Description" defaultOpen>
                <p>{product.productDetails.description}</p>
              </AccordionItem>
              {product.productDetails.materials && (
                <AccordionItem title="Ingredients / Materials">
                  <p>{product.productDetails.materials}</p>
                </AccordionItem>
              )}
              {product.productDetails.dimensions && (
                <AccordionItem title="Dimensions & Weight">
                  <p>{product.productDetails.dimensions}</p>
                </AccordionItem>
              )}
              {product.productDetails.howToUse && (
                <AccordionItem title="How to Use">
                  <p>{product.productDetails.howToUse}</p>
                </AccordionItem>
              )}
              {product.productDetails.care && (
                <AccordionItem title="Care Instructions">
                  <p>{product.productDetails.care}</p>
                </AccordionItem>
              )}
              <AccordionItem title="Delivery & Returns">
                <p>{product.productDetails.delivery}</p>
              </AccordionItem>
            </div>

            <div className="mt-6 hidden md:flex md:mt-auto gap-3 md:sticky md:bottom-0 md:z-10 md:rounded-t-2xl md:border-t md:border-charcoal/10 md:bg-cream/95 md:backdrop-blur md:p-4 md:shadow-lg">
              <button
                onClick={handleAddToCart}
                disabled={!product.inStock}
                className="flex-1 inline-flex items-center justify-center gap-2 rounded-full border border-charcoal/70 px-7 py-3.5 text-xs font-semibold tracking-[0.12em] uppercase text-charcoal hover:bg-charcoal hover:text-cream transition-colors disabled:opacity-40 disabled:pointer-events-none"
              >
                {added ? <Check size={15} /> : <ShoppingBag size={15} />}
                {added ? "Added" : "Add to Cart"}
              </button>
              <BuyNowOrViewCartButton
                onBuyNow={handleBuyNow}
                disabled={!product.inStock}
                className="flex-1 inline-flex items-center justify-center gap-2 rounded-full bg-olive text-cream px-7 py-3.5 text-xs font-semibold tracking-[0.12em] uppercase hover:bg-olive-dark transition-colors disabled:opacity-40 disabled:pointer-events-none"
              />
            </div>
          </div>
        </div>

        <ReviewsSection reviews={reviews} />

        <MobileStickyCTA
          onAddToCart={handleAddToCart}
          onBuyNow={handleBuyNow}
          added={added}
          disabled={!product.inStock}
        />
      </div>

      <div className="mt-14">
        <RelatedProducts products={related} />
      </div>

      <AddedToCartModal
        open={cartModalOpen}
        onClose={() => setCartModalOpen(false)}
        name={product.name}
        image={product.images[0]}
        price={product.price}
        quantity={quantity}
      />
    </div>
  );
}
