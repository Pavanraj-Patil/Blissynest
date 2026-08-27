"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ShoppingBag, Zap, Check } from "lucide-react";
import { ProductGallery } from "./ProductGallery";
import { RatingStars } from "./RatingStars";
import { QuantityStepper } from "./QuantityStepper";
import { FeatureIconRow } from "./FeatureIconRow";
import { WhatsInsideList } from "./WhatsInsideList";
import { DeliveryCheck } from "./DeliveryCheck";
import { AccordionItem } from "./Accordion";
import { ShareIconButton } from "./ShareIconButton";
import { PdpWishlistButton } from "./PdpWishlistButton";
import { ReviewsSection } from "./ReviewsSection";
import { MobileStickyCTA } from "./MobileStickyCTA";
import { RelatedProducts } from "./RelatedProducts";
import { AddedToCartModal } from "./AddedToCartModal";
import type { HamperProduct } from "@/lib/product-mock-data";
import type { RelatedProduct } from "@/lib/product-adapters";
import type { ApprovedReview } from "@/lib/review-service";
import { useCart } from "@/lib/cart-context";

export function HamperPDP({
  product,
  related,
  reviews,
}: {
  product: HamperProduct;
  related: RelatedProduct[];
  reviews: ApprovedReview[];
}) {
  const router = useRouter();
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [addNote, setAddNote] = useState(false);
  const [added, setAdded] = useState(false);
  const [cartModalOpen, setCartModalOpen] = useState(false);

  const unitPrice =
    product.price + (addNote && product.personalNote ? product.personalNote.price : 0);
  const total = unitPrice * quantity;

  function handleAddToCart() {
    addItem(
      { slug: product.slug, name: product.name, price: unitPrice, image: product.images[0] },
      quantity
    );
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
    setCartModalOpen(true);
  }

  function handleBuyNow() {
    addItem(
      { slug: product.slug, name: product.name, price: unitPrice, image: product.images[0] },
      quantity
    );
    router.push("/cart");
  }

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
              <button
                onClick={handleAddToCart}
                disabled={!product.inStock}
                className="flex-1 inline-flex items-center justify-center gap-2 rounded-full border border-charcoal/70 px-7 py-3.5 text-xs font-semibold tracking-[0.12em] uppercase text-charcoal hover:bg-charcoal hover:text-cream transition-colors disabled:opacity-40 disabled:pointer-events-none"
              >
                {added ? <Check size={15} /> : <ShoppingBag size={15} />}
                {added ? "Added" : "Add to Cart"}
              </button>
              <button
                onClick={handleBuyNow}
                disabled={!product.inStock}
                className="flex-1 inline-flex items-center justify-center gap-2 rounded-full bg-olive text-cream px-7 py-3.5 text-xs font-semibold tracking-[0.12em] uppercase hover:bg-olive-dark transition-colors disabled:opacity-40 disabled:pointer-events-none"
              >
                <Zap size={15} />
                Buy Now
              </button>
            </div>
            <div aria-hidden className="hidden lg:block lg:h-24" />
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
        price={unitPrice}
        quantity={quantity}
      />
    </div>
  );
}
