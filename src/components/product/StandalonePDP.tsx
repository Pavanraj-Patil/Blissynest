"use client";

import { useState } from "react";
import { ShoppingBag, Zap, Sparkles } from "lucide-react";
import { ProductGallery } from "./ProductGallery";
import { RatingStars } from "./RatingStars";
import { QuantityStepper } from "./QuantityStepper";
import { VariantPills } from "./VariantPills";
import { DeliveryCheck } from "./DeliveryCheck";
import { AccordionItem } from "./Accordion";
import { PerfectForTags } from "./PerfectForTags";
import { ShareProduct } from "./ShareProduct";
import { RelatedProducts } from "./RelatedProducts";
import type { StandaloneProduct } from "@/lib/product-mock-data";
import { getRelatedProducts } from "@/lib/product-mock-data";

export function StandalonePDP({ product }: { product: StandaloneProduct }) {
  const [quantity, setQuantity] = useState(1);
  const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>(
    () =>
      Object.fromEntries(
        (product.variants ?? []).map((v) => [v.label, v.options[0]])
      )
  );
  const related = getRelatedProducts(product);

  return (
    <div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
        <ProductGallery images={product.images} name={product.name} />

        <div>
          <h1 className="font-serif text-2xl sm:text-3xl text-charcoal">
            {product.name}
          </h1>
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

          <div className="mt-6 space-y-6">
            {(product.variants ?? []).map((v) => (
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

          <div className="mt-6">
            <QuantityStepper value={quantity} onChange={setQuantity} />
          </div>

          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            <button className="inline-flex items-center justify-center gap-2 rounded-full border border-charcoal/70 px-7 py-3.5 text-xs font-semibold tracking-[0.12em] uppercase text-charcoal hover:bg-charcoal hover:text-cream transition-colors">
              <ShoppingBag size={15} />
              Add to Cart
            </button>
            <button className="inline-flex items-center justify-center gap-2 rounded-full bg-olive text-cream px-7 py-3.5 text-xs font-semibold tracking-[0.12em] uppercase hover:bg-olive-dark transition-colors">
              <Zap size={15} />
              Buy Now
            </button>
          </div>

          <div className="mt-6">
            <DeliveryCheck />
          </div>
        </div>
      </div>

      <div className="mt-14 grid grid-cols-1 lg:grid-cols-2 gap-14">
        <div>
          <h2 className="text-sm font-semibold text-charcoal mb-4">
            Product Highlights
          </h2>
          <ul className="space-y-2.5">
            {product.highlights.map((h) => (
              <li key={h} className="flex items-start gap-2.5 text-sm text-charcoal-light">
                <Sparkles size={15} className="text-gold shrink-0 mt-0.5" />
                {h}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="text-sm font-semibold text-charcoal mb-4">
            Why You&rsquo;ll Love It
          </h2>
          <p className="text-sm text-charcoal-light leading-relaxed">
            {product.whyYoullLoveText}
          </p>
        </div>
      </div>

      <div className="mt-14 max-w-2xl">
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
        <div className="pt-5">
          <ShareProduct productName={product.name} />
        </div>
      </div>

      {product.perfectFor && (
        <div className="mt-14">
          <PerfectForTags tags={product.perfectFor} />
        </div>
      )}

      <div className="mt-14">
        <RelatedProducts products={related} />
      </div>
    </div>
  );
}
