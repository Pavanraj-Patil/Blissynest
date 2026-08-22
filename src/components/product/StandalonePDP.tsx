"use client";

import { useState } from "react";
import { ShoppingBag, Zap } from "lucide-react";
import { ProductGallery } from "./ProductGallery";
import { RatingStars } from "./RatingStars";
import { QuantityStepper } from "./QuantityStepper";
import { VariantPills } from "./VariantPills";
import { DeliveryCheck } from "./DeliveryCheck";
import { AccordionItem } from "./Accordion";
import { ShareIconButton } from "./ShareIconButton";
import { ReviewsSection } from "./ReviewsSection";
import { MobileStickyCTA } from "./MobileStickyCTA";
import { RelatedProducts } from "./RelatedProducts";
import type { StandaloneProduct } from "@/lib/product-mock-data";
import { getRelatedProducts, getProductReviews } from "@/lib/product-mock-data";

export function StandalonePDP({ product }: { product: StandaloneProduct }) {
  const [quantity, setQuantity] = useState(1);
  const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>(
    () =>
      Object.fromEntries(
        (product.variants ?? []).map((v) => [v.label, v.options[0]])
      )
  );
  const related = getRelatedProducts(product);
  const reviews = getProductReviews(product);
  const hasVariants = (product.variants?.length ?? 0) > 0;

  return (
    <div>
      <div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
          <div>
            <div className="lg:sticky lg:top-24">
              <ProductGallery images={product.images} name={product.name} />
            </div>
          </div>

          <div>
            <div className="flex items-start justify-between gap-3">
              <h1 className="font-serif text-2xl sm:text-3xl text-charcoal">
                {product.name}
              </h1>
              <ShareIconButton productName={product.name} />
            </div>
            <div className="mt-2">
              <RatingStars rating={product.rating} reviews={product.reviews} />
            </div>
            <p className="mt-3 text-2xl font-semibold text-charcoal">
              ₹{product.price.toLocaleString("en-IN")}
            </p>
            <p className="text-xs text-ink-muted -mt-1">Inclusive of all taxes</p>

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
              <DeliveryCheck />
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

            <div className="mt-6 hidden lg:flex gap-3 lg:sticky lg:bottom-4 lg:z-10 lg:rounded-2xl lg:border lg:border-charcoal/10 lg:bg-cream/95 lg:backdrop-blur lg:p-4 lg:shadow-lg">
              <button className="flex-1 inline-flex items-center justify-center gap-2 rounded-full border border-charcoal/70 px-7 py-3.5 text-xs font-semibold tracking-[0.12em] uppercase text-charcoal hover:bg-charcoal hover:text-cream transition-colors">
                <ShoppingBag size={15} />
                Add to Cart
              </button>
              <button className="flex-1 inline-flex items-center justify-center gap-2 rounded-full bg-olive text-cream px-7 py-3.5 text-xs font-semibold tracking-[0.12em] uppercase hover:bg-olive-dark transition-colors">
                <Zap size={15} />
                Buy Now
              </button>
            </div>
            <div aria-hidden className="hidden lg:block lg:h-24" />
          </div>
        </div>

        <div className="mt-14">
          <ReviewsSection reviews={reviews} />
        </div>

        <MobileStickyCTA />
      </div>

      <div className="mt-14">
        <RelatedProducts products={related} />
      </div>
    </div>
  );
}
