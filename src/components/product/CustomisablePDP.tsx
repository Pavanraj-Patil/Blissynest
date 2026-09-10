"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ShoppingBag, Zap, Check } from "lucide-react";
import { cn } from "@/lib/cn";
import { ProductGallery } from "./ProductGallery";
import { Breadcrumb } from "@/components/shop/Breadcrumb";
import { RatingStars } from "./RatingStars";
import { QuantityStepper } from "./QuantityStepper";
import { FeatureIconRow } from "./FeatureIconRow";
import { VariantPills } from "./VariantPills";
import { AccordionItem } from "./Accordion";
import { ShareIconButton } from "./ShareIconButton";
import { PdpWishlistButton } from "./PdpWishlistButton";
import { ReviewsSection } from "./ReviewsSection";
import { MobileStickyCTA } from "./MobileStickyCTA";
import { RelatedProducts } from "./RelatedProducts";
import { AddedToCartModal } from "./AddedToCartModal";
import { getIcon } from "./icon-map";
import type { CustomisableProduct } from "@/lib/product-mock-data";
import type { RelatedProduct } from "@/lib/product-adapters";
import type { ApprovedReview } from "@/lib/review-service";
import { useCart } from "@/lib/cart-context";

const fontClassMap: Record<string, string> = {
  Serif: "font-serif",
  Script: "font-serif italic",
  Modern: "font-sans uppercase tracking-wide",
};

export function CustomisablePDP({
  product,
  related,
  reviews,
  breadcrumbCategory,
}: {
  product: CustomisableProduct;
  related: RelatedProduct[];
  reviews: ApprovedReview[];
  breadcrumbCategory: string;
}) {
  const router = useRouter();
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [cartModalOpen, setCartModalOpen] = useState(false);
  const [textValues, setTextValues] = useState<string[]>(
    product.textLines.map(() => "")
  );
  const [font, setFont] = useState(product.fonts[0]);
  const [color, setColor] = useState(product.colors[0]?.hex ?? "#2a2621");
  const [variant, setVariant] = useState(product.variantOptions?.[0] ?? "");

  const customization = {
    textLines: textValues,
    font,
    colorHex: color,
    ...(variant && { variant }),
  };

  function handleAddToCart() {
    addItem(
      {
        slug: product.slug,
        name: product.name,
        price: product.price,
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
        price: product.price,
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
          <div>
            <div className="lg:sticky lg:top-28 lg:flex lg:flex-col lg:gap-4">
              <div className="hidden lg:block">
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
            {product.tagline && (
              <p className="mt-2 text-sm text-ink-muted">{product.tagline}</p>
            )}
            <div className="mt-3">
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
              <h2 className="text-sm font-semibold text-charcoal mb-1">
                Personalise Your {product.name.replace("Personalised ", "")}
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
              <p className="mt-3 text-xs text-ink-muted">
                Please double-check your text. It will be printed exactly as
                entered.
              </p>
            </div>

            <div className="mt-6">
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

            <div className="mt-6">
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

            {product.variantLabel && product.variantOptions && (
              <div className="mt-6">
                <VariantPills
                  label={product.variantLabel}
                  options={product.variantOptions}
                  selected={variant}
                  onSelect={setVariant}
                />
              </div>
            )}

            <div className="mt-6">
              <QuantityStepper value={quantity} onChange={setQuantity} />
            </div>

            {product.specs && (
              <div className="mt-6 grid grid-cols-2 gap-4 rounded-2xl border border-charcoal/10 px-5 py-5">
                {product.specs.map((spec) => {
                  const Icon = getIcon(spec.icon);
                  return (
                    <div key={spec.label} className="flex items-center gap-2.5">
                      <Icon size={18} strokeWidth={1.5} className="text-terracotta shrink-0" />
                      <span>
                        <span className="block text-xs text-ink-muted">{spec.label}</span>
                        <span className="block text-sm font-medium text-charcoal">
                          {spec.value}
                        </span>
                      </span>
                    </div>
                  );
                })}
              </div>
            )}

            <div className="mt-6">
              <AccordionItem title="Product Details" defaultOpen>
                <p>{product.productDetails.description}</p>
              </AccordionItem>
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
        price={product.price}
        quantity={quantity}
      />
    </div>
  );
}
