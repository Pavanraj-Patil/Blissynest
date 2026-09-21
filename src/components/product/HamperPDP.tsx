"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ShoppingBag, Check } from "lucide-react";
import { cn } from "@/lib/cn";
import { ProductGallery } from "./ProductGallery";
import { Breadcrumb } from "@/components/shop/Breadcrumb";
import { RatingStars } from "./RatingStars";
import { FeatureIconRow } from "./FeatureIconRow";
import { WhatsInsideList } from "./WhatsInsideList";
import { AccordionItem } from "./Accordion";
import { ShareIconButton } from "./ShareIconButton";
import { PdpWishlistButton } from "./PdpWishlistButton";
import { ReviewsSection } from "./ReviewsSection";
import { MobileStickyCTA } from "./MobileStickyCTA";
import { BuyNowOrViewCartButton } from "./BuyNowOrViewCartButton";
import { CustomerImageUploader } from "./CustomerImageUploader";
import { RelatedProducts } from "./RelatedProducts";
import { AddedToCartModal } from "./AddedToCartModal";
import type { HamperProduct } from "@/lib/product-mock-data";
import type { RelatedProduct } from "@/lib/product-adapters";
import type { ApprovedReview } from "@/lib/review-service";
import { useCart } from "@/lib/cart-context";

// Matches CustomisablePDP.tsx's own map exactly — a hamper's optional
// personalisation reuses the same three font choices.
const fontClassMap: Record<string, string> = {
  Serif: "font-serif",
  Script: "font-serif italic",
  Modern: "font-sans uppercase tracking-wide",
};

export function HamperPDP({
  product,
  related,
  reviews,
  breadcrumbCategory,
}: {
  product: HamperProduct;
  related: RelatedProduct[];
  reviews: ApprovedReview[];
  breadcrumbCategory: string;
}) {
  const router = useRouter();
  const { addItem } = useCart();
  const quantity = 1;
  const [added, setAdded] = useState(false);
  const [cartModalOpen, setCartModalOpen] = useState(false);
  const [textValues, setTextValues] = useState<string[]>(
    (product.textLines ?? []).map(() => "")
  );
  const [font, setFont] = useState(product.fonts?.[0]);
  const [color, setColor] = useState(product.colors?.[0]?.hex);

  const unitPrice = product.price;

  const [photoUrls, setPhotoUrls] = useState<string[]>([]);

  // Only present when this hamper has personalisation configured — matches
  // the shape CustomisablePDP.tsx already builds and sends through cart/
  // checkout, so nothing downstream needs to know a hamper produced it.
  const customization =
    product.textLines || product.imageUpload
      ? {
          textLines: textValues,
          font,
          colorHex: color,
          ...(photoUrls.length > 0 && { imageUrls: photoUrls }),
        }
      : undefined;

  // A hamper that requires the shopper's photo can't be bought without one.
  const missingRequiredPhoto = Boolean(product.imageUpload?.required) && photoUrls.length === 0;
  const purchaseBlocked = !product.inStock || missingRequiredPhoto;

  function handleAddToCart() {
    addItem(
      {
        slug: product.slug,
        name: product.name,
        price: unitPrice,
        image: product.images[0],
        customization,
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
        price: unitPrice,
        image: product.images[0],
        customization,
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
              <ProductGallery images={product.images} name={product.name} />
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

            <div className="mt-5">
              <FeatureIconRow items={product.benefits} />
            </div>

            {product.imageUpload && (
              <div className="mt-7 border-t border-charcoal/10 pt-5">
                <CustomerImageUploader
                  value={photoUrls}
                  onChange={setPhotoUrls}
                  maxImages={product.imageUpload.maxImages}
                  required={product.imageUpload.required}
                />
              </div>
            )}

            {product.textLines && product.textLines.length > 0 && (
              <div className="mt-7 border-t border-charcoal/10 pt-5">
                <h2 className="text-sm font-semibold text-charcoal mb-1">
                  Personalise This Hamper
                </h2>
                <p className="text-xs text-ink-muted mb-4">
                  Make it uniquely yours with a name, date, or a short message.
                </p>
                <div className="space-y-4">
                  {product.textLines.map((line, i) => (
                    <label key={line.label} className="block">
                      <span className="flex items-center justify-between text-xs text-charcoal-light mb-1.5">
                        <span>
                          {line.label}{" "}
                          {line.required ? (
                            <span className="text-terracotta">(Required)</span>
                          ) : (
                            "(Optional)"
                          )}
                        </span>
                        <span className="text-ink-muted">
                          {textValues[i].length}/{line.maxLength}
                        </span>
                      </span>
                      <input
                        type="text"
                        maxLength={line.maxLength}
                        placeholder={line.placeholder}
                        value={textValues[i]}
                        onChange={(e) =>
                          setTextValues((prev) =>
                            prev.map((v, idx) => (idx === i ? e.target.value : v))
                          )
                        }
                        className="w-full rounded-lg border border-charcoal/15 px-3 py-2.5 text-sm text-charcoal focus:outline-none focus:border-olive"
                      />
                    </label>
                  ))}
                </div>

                {product.fonts && product.fonts.length > 0 && (
                  <div className="mt-4">
                    <p className="text-sm font-semibold text-charcoal mb-2.5">Font Style</p>
                    <div className="flex gap-2">
                      {product.fonts.map((f) => (
                        <button
                          key={f}
                          type="button"
                          onClick={() => setFont(f)}
                          aria-pressed={font === f}
                          className={cn(
                            "rounded-lg border px-4 py-2 text-sm transition-colors",
                            font === f
                              ? "border-olive bg-olive text-cream"
                              : "border-charcoal/15 text-charcoal-light hover:border-charcoal/30"
                          )}
                        >
                          <span className={fontClassMap[f]}>Aa</span> {f}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {product.colors && product.colors.length > 0 && (
                  <div className="mt-4">
                    <p className="text-sm font-semibold text-charcoal mb-2.5">Text Color</p>
                    <div className="flex gap-2.5">
                      {product.colors.map((c) => (
                        <button
                          key={c.hex}
                          type="button"
                          aria-label={c.name}
                          aria-pressed={color === c.hex}
                          onClick={() => setColor(c.hex)}
                          className={cn(
                            "h-8 w-8 rounded-full border-2 transition-transform",
                            color === c.hex
                              ? "border-charcoal scale-110"
                              : "border-transparent"
                          )}
                          style={{ backgroundColor: c.hex }}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            <div className="mt-6">
              <AccordionItem title="Product Details" defaultOpen>
                <p>{product.productDetails.description}</p>
              </AccordionItem>
              <AccordionItem title="What's Inside">
                <WhatsInsideList items={product.whatsInside} />
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

            <div className="mt-6 hidden md:flex md:mt-auto gap-3 md:sticky md:bottom-0 md:z-10 md:rounded-t-2xl md:border-t md:border-charcoal/10 md:bg-cream/95 md:backdrop-blur md:p-4 md:shadow-lg">
              <button
                onClick={handleAddToCart}
                disabled={purchaseBlocked}
                className="flex-1 inline-flex items-center justify-center gap-2 rounded-full border border-charcoal/70 px-7 py-3.5 text-xs font-semibold tracking-[0.12em] uppercase text-charcoal hover:bg-charcoal hover:text-cream transition-colors disabled:opacity-40 disabled:pointer-events-none"
              >
                {added ? <Check size={15} /> : <ShoppingBag size={15} />}
                {added ? "Added" : "Add to Cart"}
              </button>
              <BuyNowOrViewCartButton
                productSlug={product.slug}
                onBuyNow={handleBuyNow}
                disabled={purchaseBlocked}
                className="flex-1 inline-flex items-center justify-center gap-2 rounded-full bg-olive text-cream px-7 py-3.5 text-xs font-semibold tracking-[0.12em] uppercase hover:bg-olive-dark transition-colors disabled:opacity-40 disabled:pointer-events-none"
              />
            </div>
          </div>
        </div>

        <ReviewsSection reviews={reviews} />

        <MobileStickyCTA
          productSlug={product.slug}
          onAddToCart={handleAddToCart}
          onBuyNow={handleBuyNow}
          added={added}
          disabled={purchaseBlocked}
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
