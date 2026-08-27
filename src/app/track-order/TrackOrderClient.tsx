"use client";

import { useState } from "react";
import { PackageCheck, PackageSearch, Truck, Home, CheckCircle2, Ban } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Breadcrumb } from "@/components/shop/Breadcrumb";
import { ShopFooter } from "@/components/shop/ShopFooter";
import { cn } from "@/lib/cn";
import type { TrackOrderDTO } from "@/lib/order-service";

const trackingSteps = [
  { icon: CheckCircle2, label: "Order Placed" },
  { icon: PackageCheck, label: "Packed" },
  { icon: Truck, label: "Shipped" },
  { icon: Home, label: "Delivered" },
];

type TrackOrderContent = { eyebrow: string; heading: string; subcopy: string };

export function TrackOrderClient({ content: rawContent }: { content: Record<string, unknown> }) {
  const content = rawContent as TrackOrderContent;
  const [result, setResult] = useState<TrackOrderDTO | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const orderNumber = String(formData.get("orderNumber") ?? "").trim();
    const email = String(formData.get("email") ?? "").trim();
    if (!orderNumber || !email) return;

    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await fetch(
        `/api/orders/track?orderNumber=${encodeURIComponent(orderNumber)}&email=${encodeURIComponent(email)}`
      );
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "We couldn't find that order.");
        return;
      }
      setResult(data.order);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Header />
      <main>
        <div className="mx-auto max-w-[1440px] px-4 md:px-8 pt-5">
          <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Track Order" }]} />
        </div>

        <div className="mx-auto max-w-[1440px] px-4 md:px-8 pt-6 pb-10 text-center">
          <p className="eyebrow text-terracotta-dark mb-2">{content.eyebrow}</p>
          <h1 className="font-serif text-3xl md:text-4xl text-charcoal">{content.heading}</h1>
          <p className="mt-3 text-sm text-ink-muted max-w-xl mx-auto">
            {content.subcopy}
          </p>
        </div>

        <div className="mx-auto max-w-lg px-4 md:px-8 pb-16">
          <form
            onSubmit={handleSubmit}
            className="rounded-2xl border border-charcoal/10 bg-white p-6 sm:p-8 space-y-4"
          >
            <label className="block">
              <span className="text-xs font-medium text-charcoal">Order Number</span>
              <input
                required
                name="orderNumber"
                type="text"
                placeholder="BN-2026-XXXXXX"
                className="mt-1.5 w-full rounded-lg border border-charcoal/15 px-3.5 py-2.5 text-sm text-charcoal placeholder:text-ink-muted focus:outline-none focus:border-olive"
              />
            </label>
            <label className="block">
              <span className="text-xs font-medium text-charcoal">Email</span>
              <input
                required
                name="email"
                type="email"
                placeholder="you@example.com"
                className="mt-1.5 w-full rounded-lg border border-charcoal/15 px-3.5 py-2.5 text-sm text-charcoal placeholder:text-ink-muted focus:outline-none focus:border-olive"
              />
            </label>

            {error && <p className="text-sm text-terracotta-dark">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-olive text-cream px-6 py-3.5 text-xs font-semibold tracking-[0.1em] uppercase hover:bg-olive-dark transition-colors disabled:opacity-60"
            >
              {loading ? "Tracking…" : "Track Order"}
            </button>
          </form>

          {result && result.stepIndex === -1 && (
            <div className="mt-6 rounded-2xl border border-charcoal/10 bg-white p-6 sm:p-8 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-charcoal/5 text-charcoal-light">
                <Ban size={20} />
              </div>
              <p className="mt-3 text-sm font-semibold text-charcoal">Order {result.orderNumber}</p>
              <p className="mt-1 text-sm text-ink-muted">This order was cancelled.</p>
            </div>
          )}

          {result && result.stepIndex !== -1 && (
            <div className="mt-6 rounded-2xl border border-charcoal/10 bg-white p-6 sm:p-8">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-ink-muted">Order</p>
                  <p className="text-sm font-semibold text-charcoal">{result.orderNumber}</p>
                </div>
                <div className="flex items-center gap-1.5 rounded-full bg-olive/10 px-3 py-1.5 text-xs font-medium text-olive-dark">
                  <PackageSearch size={13} />
                  {trackingSteps[result.stepIndex].label}
                </div>
              </div>

              <div className="mt-6 flex items-center">
                {trackingSteps.map((step, i) => (
                  <div key={step.label} className="flex flex-1 items-center last:flex-none">
                    <div className="flex flex-col items-center gap-1.5">
                      <div
                        className={cn(
                          "flex h-8 w-8 items-center justify-center rounded-full border-2",
                          i <= result.stepIndex
                            ? "border-olive bg-olive text-cream"
                            : "border-charcoal/15 text-charcoal/30"
                        )}
                      >
                        <step.icon size={14} />
                      </div>
                      <span
                        className={cn(
                          "text-[10px] text-center leading-tight",
                          i <= result.stepIndex ? "text-charcoal font-medium" : "text-ink-muted"
                        )}
                      >
                        {step.label}
                      </span>
                    </div>
                    {i < trackingSteps.length - 1 && (
                      <div
                        className={cn(
                          "mx-1.5 h-0.5 flex-1 -mt-4",
                          i < result.stepIndex ? "bg-olive" : "bg-charcoal/10"
                        )}
                      />
                    )}
                  </div>
                ))}
              </div>

              {result.stepIndex < trackingSteps.length - 1 && result.estimatedDelivery && (
                <p className="mt-6 text-center text-xs text-ink-muted">
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
                <p className="mt-2 text-center text-xs text-ink-muted">
                  Tracking #{result.trackingNumber}
                  {result.carrierName ? ` via ${result.carrierName}` : ""}
                </p>
              )}
            </div>
          )}
        </div>
      </main>
      <ShopFooter />
    </>
  );
}
