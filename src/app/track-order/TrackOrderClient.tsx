"use client";

import { useState } from "react";
import { PackageCheck, PackageSearch, Truck, Home, CheckCircle2 } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Breadcrumb } from "@/components/shop/Breadcrumb";
import { ShopFooter } from "@/components/shop/ShopFooter";
import { cn } from "@/lib/cn";

const trackingSteps = [
  { icon: CheckCircle2, label: "Order Placed" },
  { icon: PackageCheck, label: "Packed" },
  { icon: Truck, label: "Shipped" },
  { icon: Home, label: "Delivered" },
];

function estimatedDelivery(): string {
  const date = new Date();
  date.setDate(date.getDate() + 2);
  return date.toLocaleDateString("en-IN", { day: "numeric", month: "long" });
}

export function TrackOrderClient() {
  const [result, setResult] = useState<{ orderNumber: string; step: number } | null>(null);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const orderNumber = String(formData.get("orderNumber") ?? "").trim();
    if (!orderNumber) return;

    // Deterministic mock step from the order number, so the same number
    // always shows the same status instead of a random one.
    let hash = 0;
    for (let i = 0; i < orderNumber.length; i++) hash = (hash * 31 + orderNumber.charCodeAt(i)) >>> 0;
    setResult({ orderNumber, step: hash % trackingSteps.length });
  }

  return (
    <>
      <Header />
      <main>
        <div className="mx-auto max-w-[1440px] px-4 md:px-8 pt-5">
          <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Track Order" }]} />
        </div>

        <div className="mx-auto max-w-[1440px] px-4 md:px-8 pt-6 pb-10 text-center">
          <p className="eyebrow text-terracotta-dark mb-2">Where&rsquo;s My Order?</p>
          <h1 className="font-serif text-3xl md:text-4xl text-charcoal">Track Your Order</h1>
          <p className="mt-3 text-sm text-ink-muted max-w-xl mx-auto">
            Enter your order number and email to see the latest status.
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
                type="email"
                placeholder="you@example.com"
                className="mt-1.5 w-full rounded-lg border border-charcoal/15 px-3.5 py-2.5 text-sm text-charcoal placeholder:text-ink-muted focus:outline-none focus:border-olive"
              />
            </label>
            <button
              type="submit"
              className="w-full rounded-xl bg-olive text-cream px-6 py-3.5 text-xs font-semibold tracking-[0.1em] uppercase hover:bg-olive-dark transition-colors"
            >
              Track Order
            </button>
          </form>

          {result && (
            <div className="mt-6 rounded-2xl border border-charcoal/10 bg-white p-6 sm:p-8">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-ink-muted">Order</p>
                  <p className="text-sm font-semibold text-charcoal">{result.orderNumber}</p>
                </div>
                <div className="flex items-center gap-1.5 rounded-full bg-olive/10 px-3 py-1.5 text-xs font-medium text-olive-dark">
                  <PackageSearch size={13} />
                  {trackingSteps[result.step].label}
                </div>
              </div>

              <div className="mt-6 flex items-center">
                {trackingSteps.map((step, i) => (
                  <div key={step.label} className="flex flex-1 items-center last:flex-none">
                    <div className="flex flex-col items-center gap-1.5">
                      <div
                        className={cn(
                          "flex h-8 w-8 items-center justify-center rounded-full border-2",
                          i <= result.step
                            ? "border-olive bg-olive text-cream"
                            : "border-charcoal/15 text-charcoal/30"
                        )}
                      >
                        <step.icon size={14} />
                      </div>
                      <span
                        className={cn(
                          "text-[10px] text-center leading-tight",
                          i <= result.step ? "text-charcoal font-medium" : "text-ink-muted"
                        )}
                      >
                        {step.label}
                      </span>
                    </div>
                    {i < trackingSteps.length - 1 && (
                      <div
                        className={cn(
                          "mx-1.5 h-0.5 flex-1 -mt-4",
                          i < result.step ? "bg-olive" : "bg-charcoal/10"
                        )}
                      />
                    )}
                  </div>
                ))}
              </div>

              {result.step < trackingSteps.length - 1 && (
                <p className="mt-6 text-center text-xs text-ink-muted">
                  Estimated delivery by{" "}
                  <span className="font-medium text-charcoal">{estimatedDelivery()}</span>
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
