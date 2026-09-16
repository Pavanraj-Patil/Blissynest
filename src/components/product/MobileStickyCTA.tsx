import { ShoppingBag, Check } from "lucide-react";
import { BuyNowOrViewCartButton } from "./BuyNowOrViewCartButton";

type MobileStickyCTAProps = {
  onAddToCart: () => void;
  onBuyNow: () => void;
  added?: boolean;
  addToCartLabel?: string;
  buyNowLabel?: string;
  disabled?: boolean;
};

export function MobileStickyCTA({
  onAddToCart,
  onBuyNow,
  added = false,
  addToCartLabel = "Add to Cart",
  buyNowLabel = "Buy Now",
  disabled = false,
}: MobileStickyCTAProps) {
  return (
    <div className="md:hidden sticky bottom-0 z-30 -mx-4 mt-8 flex gap-3 border-t border-charcoal/10 bg-cream/95 backdrop-blur px-4 py-3 shadow-[0_-4px_12px_rgba(0,0,0,0.06)]">
      <button
        type="button"
        onClick={onAddToCart}
        disabled={disabled}
        className="flex-1 inline-flex items-center justify-center gap-2 rounded-full border border-charcoal/70 px-4 py-3 text-xs font-semibold tracking-[0.1em] uppercase text-charcoal disabled:opacity-40 disabled:pointer-events-none"
      >
        {added ? <Check size={14} /> : <ShoppingBag size={14} />}
        {added ? "Added" : addToCartLabel}
      </button>
      <BuyNowOrViewCartButton
        onBuyNow={onBuyNow}
        buyNowLabel={buyNowLabel}
        disabled={disabled}
        iconSize={14}
        className="flex-1 inline-flex items-center justify-center gap-2 rounded-full bg-olive text-cream px-4 py-3 text-xs font-semibold tracking-[0.1em] uppercase disabled:opacity-40 disabled:pointer-events-none"
      />
    </div>
  );
}
