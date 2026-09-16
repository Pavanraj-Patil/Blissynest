import { ArrowRight, ChevronRight } from "lucide-react";
import type { CheckoutStep } from "./CheckoutStepper";

// Mirrors src/components/product/MobileStickyCTA.tsx's sticky-bottom
// mechanics (same reasoning) — rendered as a direct child of <main> by the
// caller (not inside the padded/max-width content wrapper) so it sits flush
// against the viewport edges without needing offsetting negative margins.
//
// Present across all three steps (not just Review) so the primary action is
// always in the same place on mobile — previously each step's own "Continue"
// button was a regular inline button the shopper had to scroll down to find;
// this stays pinned and just relabels itself per step.
export function CheckoutMobileStickyCTA({
  step,
  onContinueAddress,
  canContinueAddress,
  onContinuePayment,
  canContinuePayment,
  total,
  onPlaceOrder,
  placingOrder,
}: {
  step: CheckoutStep;
  onContinueAddress: () => void;
  canContinueAddress: boolean;
  onContinuePayment: () => void;
  canContinuePayment: boolean;
  total: number;
  onPlaceOrder: () => void;
  placingOrder: boolean;
}) {
  function scrollToSummary() {
    document.getElementById("order-summary")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  if (step === 1) {
    return (
      <div className="md:hidden sticky bottom-0 z-30 mt-6 border-t border-charcoal/10 bg-cream/95 backdrop-blur px-4 py-3 shadow-[0_-4px_12px_rgba(0,0,0,0.06)]">
        <button
          type="button"
          onClick={onContinueAddress}
          disabled={!canContinueAddress}
          className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-olive text-cream px-6 py-3.5 text-xs font-semibold tracking-[0.1em] uppercase hover:bg-olive-dark transition-colors disabled:opacity-40 disabled:pointer-events-none"
        >
          Continue to Payment
          <ArrowRight size={14} />
        </button>
      </div>
    );
  }

  if (step === 2) {
    return (
      <div className="md:hidden sticky bottom-0 z-30 mt-6 border-t border-charcoal/10 bg-cream/95 backdrop-blur px-4 py-3 shadow-[0_-4px_12px_rgba(0,0,0,0.06)]">
        <button
          type="button"
          onClick={onContinuePayment}
          disabled={!canContinuePayment}
          className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-olive text-cream px-6 py-3.5 text-xs font-semibold tracking-[0.1em] uppercase hover:bg-olive-dark transition-colors disabled:opacity-40 disabled:pointer-events-none"
        >
          Continue to Review
          <ArrowRight size={14} />
        </button>
      </div>
    );
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
