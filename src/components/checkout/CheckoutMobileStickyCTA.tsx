import { ArrowRight, ChevronRight } from "lucide-react";

// Mirrors src/components/product/MobileStickyCTA.tsx's sticky-bottom
// mechanics (same reasoning) — rendered as a direct child of <main> by the
// caller (not inside the padded/max-width content wrapper) so it sits flush
// against the viewport edges without needing offsetting negative margins,
// and doesn't leave the wrapper's bottom padding as dead space below it.
// Only rendered once the Review step is reached, so there's no "disabled"
// state to design for here; it simply isn't in the tree before then.
export function CheckoutMobileStickyCTA({
  total,
  onPlaceOrder,
  placingOrder,
}: {
  total: number;
  onPlaceOrder: () => void;
  placingOrder: boolean;
}) {
  function scrollToSummary() {
    document.getElementById("order-summary")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <div className="md:hidden sticky bottom-0 z-30 mt-6 flex items-center justify-between gap-3 border-t border-charcoal/10 bg-cream/95 backdrop-blur px-4 py-3 shadow-[0_-4px_12px_rgba(0,0,0,0.06)]">
      <button
        type="button"
        onClick={scrollToSummary}
        className="text-left"
        aria-label="View full order summary"
      >
        <span className="flex items-center gap-0.5 text-[10px] uppercase tracking-wide text-ink-muted hover:text-charcoal transition-colors">
          View Total
          <ChevronRight size={11} />
        </span>
        <p className="font-serif text-lg text-charcoal">₹{total.toLocaleString("en-IN")}</p>
      </button>
      <button
        type="button"
        onClick={onPlaceOrder}
        disabled={placingOrder}
        className="inline-flex items-center justify-center gap-2 rounded-xl bg-olive text-cream px-6 py-3 text-xs font-semibold tracking-[0.1em] uppercase hover:bg-olive-dark transition-colors disabled:opacity-60"
      >
        {placingOrder ? "Placing…" : "Place Order"}
        {!placingOrder && <ArrowRight size={14} />}
      </button>
    </div>
  );
}
