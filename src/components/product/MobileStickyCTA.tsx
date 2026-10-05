import { ShoppingBag, Check } from "lucide-react";
import { BuyNowOrViewCartButton } from "./BuyNowOrViewCartButton";
import { Spinner } from "@/components/ui/Spinner";

type MobileStickyCTAProps = {
  productSlug: string;
  onAddToCart: () => void;
  onBuyNow: () => void;
  added?: boolean;
  adding?: boolean;
  buying?: boolean;
  addToCartLabel?: string;
  buyNowLabel?: string;
  disabled?: boolean;
  // Shown above the buttons when the last add-to-cart/buy-now attempt
  // failed (network hiccup, session expired, product gone, etc.) — see the
  // try/catch around each PDP's handleAddToCart/handleBuyNow.
  error?: string | null;
};

export function MobileStickyCTA({
  productSlug,
  onAddToCart,
  onBuyNow,
  added = false,
  adding = false,
  buying = false,
  addToCartLabel = "Add to Cart",
  buyNowLabel = "Buy Now",
  disabled = false,
  error,
}: MobileStickyCTAProps) {
  return (
    <div className="md:hidden sticky bottom-0 z-30 -mx-4 mt-8 border-t border-charcoal/10 bg-cream/95 backdrop-blur px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] shadow-[0_-4px_12px_rgba(0,0,0,0.06)]">
      {error && <p className="mb-2 text-center text-xs font-medium text-terracotta-dark">{error}</p>}
      <div className="flex gap-3">
        <button
          type="button"
          onClick={onAddToCart}
          disabled={disabled}
          className="flex-1 inline-flex items-center justify-center gap-2 rounded-full border border-charcoal/70 px-4 py-3 text-xs font-semibold tracking-[0.1em] uppercase text-charcoal disabled:opacity-40 disabled:pointer-events-none"
        >
          {adding ? <Spinner size={14} /> : added ? <Check size={14} /> : <ShoppingBag size={14} />}
          {adding ? "Adding…" : added ? "Added" : addToCartLabel}
        </button>
        <BuyNowOrViewCartButton
          productSlug={productSlug}
          onBuyNow={onBuyNow}
          buyNowLabel={buyNowLabel}
          disabled={disabled}
          loading={buying}
          iconSize={14}
          className="flex-1 inline-flex items-center justify-center gap-2 rounded-full bg-olive text-cream px-4 py-3 text-xs font-semibold tracking-[0.1em] uppercase disabled:opacity-40 disabled:pointer-events-none"
        />
      </div>
    </div>
  );
}
