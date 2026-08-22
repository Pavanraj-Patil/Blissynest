"use client";

import { useState } from "react";
import { ShoppingBag, Zap } from "lucide-react";
import { ProductGallery } from "./ProductGallery";
import { RatingStars } from "./RatingStars";
import { QuantityStepper } from "./QuantityStepper";
import { FeatureIconRow } from "./FeatureIconRow";
import { WhatsInsideList } from "./WhatsInsideList";
import { DeliveryCheck } from "./DeliveryCheck";
import { AccordionItem } from "./Accordion";
import { ShareIconButton } from "./ShareIconButton";
import { ReviewsSection } from "./ReviewsSection";
import { MobileStickyCTA } from "./MobileStickyCTA";
import { RelatedProducts } from "./RelatedProducts";
import type { HamperProduct } from "@/lib/product-mock-data";
import { getRelatedProducts, getProductReviews } from "@/lib/product-mock-data";

export function HamperPDP({ product }: { product: HamperProduct }) {
  const [quantity, setQuantity] = useState(1);
  const [addNote, setAddNote] = useState(false);
  const related = getRelatedProducts(product);
  const reviews = getProductReviews(product);

  const total =
    product.price * quantity + (addNote && product.personalNote ? product.personalNote.price : 0);

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

            <div className="mt-5">
              <FeatureIconRow items={product.benefits} />
            </div>

            <div className="mt-7">
              <h2 className="text-sm font-semibold text-charcoal mb-3">
                What&rsquo;s Inside
              </h2>
              <WhatsInsideList items={product.whatsInside} />
            </div>

            {product.personalNote && (
              <div className="mt-6 border-t border-charcoal/10 pt-5">
                <h3 className="text-sm font-semibold text-charcoal mb-2.5">
                  Add a Personal Touch
                </h3>
                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={addNote}
                    onChange={(e) => setAddNote(e.target.checked)}
                    className="h-4 w-4 rounded border-charcoal/25 accent-olive"
                  />
                  <span className="text-sm text-charcoal-light">
                    {product.personalNote.label}
                  </span>
                  <span className="text-sm text-charcoal-light ml-auto">
                    +₹{product.personalNote.price}
                  </span>
                </label>
              </div>
            )}

            <div className="mt-6 flex items-center gap-4">
              <QuantityStepper value={quantity} onChange={setQuantity} />
              <p className="text-sm text-ink-muted">
                Total:{" "}
                <span className="font-semibold text-charcoal">
                  ₹{total.toLocaleString("en-IN")}
                </span>
              </p>
            </div>

            <div className="mt-6">
              <DeliveryCheck />
            </div>

            <div className="mt-6">
              <AccordionItem title="Product Details" defaultOpen>
                <p>{product.productDetails.description}</p>
              </AccordionItem>
              <AccordionItem title="Delivery & Returns">
                <p>{product.productDetails.delivery}</p>
              </AccordionItem>
              {product.productDetails.care && (
                <AccordionItem title="Care Instructions">
                  <p>{product.productDetails.care}</p>
                </AccordionItem>
              )}
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
