import Link from "next/link";
import { CheckCircle2, ArrowRight, Truck, Mail } from "lucide-react";

type OrderConfirmationProps = {
  orderNumber: string;
  total: number;
  addressSummary: string;
};

function estimatedDelivery(): string {
  const date = new Date();
  date.setDate(date.getDate() + 5);
  return date.toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });
}

export function OrderConfirmation({ orderNumber, total, addressSummary }: OrderConfirmationProps) {
  return (
    <div className="mx-auto max-w-xl text-center py-10 sm:py-16">
      <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-olive/10">
        <CheckCircle2 size={44} className="text-olive" strokeWidth={1.5} />
      </div>

      <h1 className="mt-6 font-serif text-3xl text-charcoal">
        Order placed successfully!
      </h1>
      <p className="mt-2 text-sm text-ink-muted">
        Thank you for gifting with Blissynest. We&rsquo;re already getting
        things ready.
      </p>

      <div className="mt-8 rounded-2xl border border-charcoal/10 bg-white p-6 text-left">
        <div className="flex items-center justify-between border-b border-charcoal/10 pb-4">
          <span className="text-sm text-ink-muted">Order Number</span>
          <span className="text-sm font-semibold text-charcoal">{orderNumber}</span>
        </div>
        <div className="flex items-center justify-between py-4 border-b border-charcoal/10">
          <span className="text-sm text-ink-muted">Order Total</span>
          <span className="text-sm font-semibold text-charcoal">
            ₹{total.toLocaleString("en-IN")}
          </span>
        </div>
        <div className="pt-4">
          <span className="text-sm text-ink-muted">Delivering to</span>
          <p className="mt-1 text-sm text-charcoal leading-relaxed">{addressSummary}</p>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
        <div className="rounded-2xl bg-cream-dark px-5 py-4 flex items-start gap-3">
          <Truck size={18} className="text-terracotta shrink-0 mt-0.5" />
          <div>
            <p className="text-xs font-semibold text-charcoal">Estimated Delivery</p>
            <p className="text-xs text-ink-muted mt-0.5">{estimatedDelivery()}</p>
          </div>
        </div>
        <div className="rounded-2xl bg-cream-dark px-5 py-4 flex items-start gap-3">
          <Mail size={18} className="text-terracotta shrink-0 mt-0.5" />
          <div>
            <p className="text-xs font-semibold text-charcoal">Confirmation</p>
            <p className="text-xs text-ink-muted mt-0.5">A summary has been noted for this order</p>
          </div>
        </div>
      </div>

      <Link
        href="/shop"
        className="mt-8 inline-flex items-center gap-2 rounded-full bg-olive text-cream px-7 py-3.5 text-xs font-semibold tracking-[0.12em] uppercase hover:bg-olive-dark transition-colors"
      >
        Continue Shopping
        <ArrowRight size={14} />
      </Link>
    </div>
  );
}
