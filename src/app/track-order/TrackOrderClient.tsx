"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { PackageCheck, PackageSearch, Truck, Home, CheckCircle2, Ban } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { PageHero } from "@/components/pages/PageHero";
import { ShopFooter } from "@/components/shop/ShopFooter";
import { cn } from "@/lib/cn";
import type { TrackOrderDTO } from "@/lib/order-service";

const trackingSteps = [
  { icon: CheckCircle2, label: "Order Placed", note: "We've got your order." },
  { icon: PackageCheck, label: "Packed", note: "Wrapped and boxed with care." },
  { icon: Truck, label: "Shipped", note: "On its way to you." },
  { icon: Home, label: "Delivered", note: "Delivered. Enjoy!" },
];

type TrackOrderContent = { eyebrow: string; heading: string; subcopy: string };

export function TrackOrderClient({ content: rawContent }: { content: Record<string, unknown> }) {
  const content = rawContent as TrackOrderContent;
  const searchParams = useSearchParams();
  // Arriving from the account page's "Track this order" link, both are
  // already known — the account already has this order and the signed-in
  // user's own email, so re-asking for them here would just be redundant.
  const prefillOrderNumber = searchParams.get("orderNumber") ?? "";
  const prefillEmail = searchParams.get("email") ?? "";

  const [result, setResult] = useState<TrackOrderDTO | null>(null);
  // Starts true when we're about to auto-run a lookup on mount, so there's
  // no gap where the form briefly looks idle before that fetch resolves.
  const [loading, setLoading] = useState(() => Boolean(prefillOrderNumber && prefillEmail));
  const [error, setError] = useState<string | null>(null);

  // Pure data fetch, no state-setting of its own — callers (the mount
  // effect and the submit handler) each apply the result in their own
  // `.then()`, which is what keeps a setState call from ever running
  // synchronously inside an effect body.
  async function lookupOrder(
    orderNumber: string,
    email: string
  ): Promise<{ order: TrackOrderDTO } | { error: string }> {
    try {
      const res = await fetch(
        `/api/orders/track?orderNumber=${encodeURIComponent(orderNumber)}&email=${encodeURIComponent(email)}`
      );
      const data = await res.json();
      if (!res.ok) {
        return { error: data.error ?? "We couldn't find that order." };
      }
      return { order: data.order };
    } catch {
      return { error: "Something went wrong. Please try again." };
    }
  }

  useEffect(() => {
    if (!prefillOrderNumber || !prefillEmail) return;
    lookupOrder(prefillOrderNumber, prefillEmail).then((outcome) => {
      if ("error" in outcome) setError(outcome.error);
      else setResult(outcome.order);
      setLoading(false);
    });
    // Intentionally only on mount — this is a one-time "arrived with known
    // details" lookup, not something that should re-run if the user then
    // edits the form fields (which don't feed back into the URL).
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const orderNumber = String(formData.get("orderNumber") ?? "").trim();
    const email = String(formData.get("email") ?? "").trim();
    if (!orderNumber || !email) return;
    setLoading(true);
    setError(null);
    setResult(null);
    lookupOrder(orderNumber, email).then((outcome) => {
      if ("error" in outcome) setError(outcome.error);
      else setResult(outcome.order);
      setLoading(false);
    });
  }

  const field =
    "mt-2 w-full rounded-xl border border-charcoal/12 bg-white px-4 py-3 text-sm text-charcoal placeholder:text-ink-muted focus:border-olive focus:outline-none";
  const label = "text-xs font-semibold uppercase tracking-[0.1em] text-charcoal-light";

  return (
    <>
      <Header />
      <main>
        <PageHero
          crumbs={[{ label: "Home", href: "/" }, { label: "Track Order" }]}
          eyebrow={content.eyebrow}
          title={content.heading}
          intro={content.subcopy}
        >
          <form onSubmit={handleSubmit} className="max-w-md space-y-4">
            <label className="block">
              <span className={label}>Order Number</span>
              <input
                required
                name="orderNumber"
                type="text"
                defaultValue={prefillOrderNumber}
                placeholder="BN-2026-XXXXXX"
                className={field}
              />
            </label>
            <label className="block">
              <span className={label}>Email</span>
              <input
                required
                name="email"
                type="email"
                defaultValue={prefillEmail}
                placeholder="you@example.com"
                className={field}
              />
            </label>

            {error && <p className="text-sm text-terracotta-dark">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="rounded-full bg-olive px-8 py-3.5 text-xs font-semibold uppercase tracking-[0.1em] text-cream transition-colors hover:bg-olive-dark disabled:opacity-60"
            >
              {loading ? "Tracking…" : "Track Order"}
            </button>
          </form>
        </PageHero>

        <div className="mx-auto max-w-[900px] px-4 md:px-8 py-12 md:py-16">
          {!result && !loading && !error && (
            <p className="text-center text-sm leading-relaxed text-ink-muted">
              Your order number is in the confirmation email we sent. It starts with{" "}
              <span className="font-medium text-charcoal">BN-</span>.
            </p>
          )}

          {result && result.stepIndex === -1 && (
            <div className="rounded-[2rem] border border-charcoal/10 bg-white p-8 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-charcoal/5 text-charcoal-light">
                <Ban size={20} />
              </div>
              <p className="mt-3 text-sm font-semibold text-charcoal">Order {result.orderNumber}</p>
              <p className="mt-1 text-sm text-ink-muted">This order was cancelled.</p>
            </div>
          )}

          {result && result.stepIndex !== -1 && (
            <div className="rounded-[2rem] border border-charcoal/10 bg-white p-6 shadow-[0_18px_50px_-30px_rgba(42,38,33,0.35)] sm:p-10">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-muted">Order</p>
                  <p className="mt-0.5 font-serif text-2xl text-charcoal">{result.orderNumber}</p>
                </div>
                <div className="flex items-center gap-1.5 rounded-full bg-olive/10 px-4 py-2 text-xs font-medium text-olive-dark">
                  <PackageSearch size={14} />
                  {trackingSteps[result.stepIndex].label}
                </div>
              </div>

              <ol className="mt-8 grid gap-6 md:grid-cols-4 md:gap-4">
                {trackingSteps.map((step, i) => {
                  const done = i <= result.stepIndex;
                  return (
                    <li key={step.label} className="relative flex gap-4 md:block">
                      {i < trackingSteps.length - 1 && (
                        <span
                          aria-hidden
                          className={cn(
                            "absolute left-[19px] top-10 h-[calc(100%-1rem)] w-px border-l md:left-10 md:top-[19px] md:h-px md:w-[calc(100%-2.5rem)] md:border-l-0 md:border-t",
                            i < result.stepIndex ? "border-olive" : "border-charcoal/20"
                          )}
                        />
                      )}
                      <span
                        className={cn(
                          "relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border",
                          done ? "border-olive bg-olive text-cream" : "border-charcoal/20 bg-white text-charcoal/35"
                        )}
                      >
                        <step.icon size={16} />
                      </span>
                      <div className="md:mt-3">
                        <p className={cn("text-sm font-semibold", done ? "text-charcoal" : "text-ink-muted")}>{step.label}</p>
                        <p className="mt-0.5 text-xs leading-relaxed text-ink-muted">{step.note}</p>
                      </div>
                    </li>
                  );
                })}
              </ol>

              {(result.stepIndex < trackingSteps.length - 1 && result.estimatedDelivery) || result.trackingNumber ? (
                <div className="mt-8 space-y-1.5 border-t border-charcoal/25 pt-5 text-sm text-ink-muted">
                  {result.stepIndex < trackingSteps.length - 1 && result.estimatedDelivery && (
                    <p>
                      Estimated delivery by{" "}
                      <span className="font-medium text-charcoal">
                        {new Date(result.estimatedDelivery).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "long",
                        })}
                      </span>
                    </p>
                  )}
                  {result.trackingNumber && (
                    <p>
                      Tracking #{result.trackingNumber}
                      {result.carrierName ? ` via ${result.carrierName}` : ""}
                    </p>
                  )}
                </div>
              ) : null}
            </div>
          )}
        </div>
      </main>
      <ShopFooter />
    </>
  );
}
