import { ShoppingBag, Zap } from "lucide-react";

type MobileStickyCTAProps = {
  addToCartLabel?: string;
  buyNowLabel?: string;
};

export function MobileStickyCTA({
  addToCartLabel = "Add to Cart",
  buyNowLabel = "Buy Now",
}: MobileStickyCTAProps) {
  return (
    <div className="lg:hidden sticky bottom-0 z-30 -mx-4 mt-8 flex gap-3 border-t border-charcoal/10 bg-cream/95 backdrop-blur px-4 py-3 shadow-[0_-4px_12px_rgba(0,0,0,0.06)]">
      <button className="flex-1 inline-flex items-center justify-center gap-2 rounded-full border border-charcoal/70 px-4 py-3 text-xs font-semibold tracking-[0.1em] uppercase text-charcoal">
        <ShoppingBag size={14} />
        {addToCartLabel}
      </button>
      <button className="flex-1 inline-flex items-center justify-center gap-2 rounded-full bg-olive text-cream px-4 py-3 text-xs font-semibold tracking-[0.1em] uppercase">
        <Zap size={14} />
        {buyNowLabel}
      </button>
    </div>
  );
}
