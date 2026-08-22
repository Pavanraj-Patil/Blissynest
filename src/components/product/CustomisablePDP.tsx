"use client";

import { useState } from "react";
import { ShoppingBag, Zap } from "lucide-react";
import { cn } from "@/lib/cn";
import { ProductGallery } from "./ProductGallery";
import { RatingStars } from "./RatingStars";
import { QuantityStepper } from "./QuantityStepper";
import { FeatureIconRow } from "./FeatureIconRow";
import { VariantPills } from "./VariantPills";
import { DeliveryCheck } from "./DeliveryCheck";
import { AccordionItem } from "./Accordion";
import { ShareIconButton } from "./ShareIconButton";
import { ReviewsSection } from "./ReviewsSection";
import { MobileStickyCTA } from "./MobileStickyCTA";
import { RelatedProducts } from "./RelatedProducts";
import { getIcon } from "./icon-map";
import type { CustomisableProduct } from "@/lib/product-mock-data";
import { getRelatedProducts, getProductReviews } from "@/lib/product-mock-data";

const fontClassMap: Record<string, string> = {
  Serif: "font-serif",
  Script: "font-serif italic",
  Modern: "font-sans uppercase tracking-wide",
};

export function CustomisablePDP({ product }: { product: CustomisableProduct }) {
  const [quantity, setQuantity] = useState(1);
  const [textValues, setTextValues] = useState<string[]>(
    product.textLines.map(() => "")
  );
  const [font, setFont] = useState(product.fonts[0]);
  const [color, setColor] = useState(product.colors[0]?.hex ?? "#2a2621");
  const [variant, setVariant] = useState(product.variantOptions?.[0] ?? "");
  const related = getRelatedProducts(product);
  const reviews = getProductReviews(product);

  const fontClass = fontClassMap[font] ?? "font-serif";

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

            <div className="mt-5">
              <FeatureIconRow items={product.benefits} />
            </div>

            <div className="mt-7 grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
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

              <div>
                <h2 className="text-sm font-semibold text-charcoal mb-1">Preview</h2>
                <div className="mt-4 flex h-full min-h-[10rem] items-center justify-center rounded-xl border border-charcoal/15 bg-cream-dark px-4 py-8 text-center">
                  <p className={cn("leading-relaxed", fontClass)} style={{ color }}>
                    {product.textLines.map((line, i) => (
                      <span key={line.label} className="block text-lg">
                        {textValues[i] || line.placeholder}
                      </span>
                    ))}
                  </p>
                </div>
              </div>
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

            <div className="mt-6">
              <DeliveryCheck />
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
