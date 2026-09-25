"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Tag, X, Info, Truck, PackageCheck, Clock, Heart, ChevronDown } from "lucide-react";
import { cn } from "@/lib/cn";
import type { CartItem } from "@/lib/cart-context";

type AppliedCoupon = { code: string; discount: number };

const trustItems = [
  { icon: Truck, title: "Free Delivery", subtitle: "On orders above ₹999" },
  { icon: PackageCheck, title: "Secure Packaging", subtitle: "Safe & premium packaging" },
  { icon: Clock, title: "On-time Delivery", subtitle: "Across India" },
  { icon: Heart, title: "Happiness Guaranteed", subtitle: "We're here to help" },
];

type OrderSummarySidebarProps = {
  items: CartItem[];
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  appliedCoupon: AppliedCoupon | null;
  onApplyCoupon: (code: string) => void;
  onRemoveCoupon: () => void;
  couponError: string | null;
  couponApplying?: boolean;
  // Coupons are an account-only perk — guests see a sign-in prompt instead
  // of the apply form.
  authenticated: boolean;
  onSignInClick: () => void;
  onPlaceOrder: () => void;
  placingOrder: boolean;
  placeOrderError: string | null;
  // Disabled until the Review step is reached — address and payment must
  // be confirmed first, matching the accordion's own step-gating.
  canPlaceOrder: boolean;
};

export function OrderSummarySidebar({
  items,
  subtotal,
  discount,
  shipping,
  total,
  appliedCoupon,
  onApplyCoupon,
  onRemoveCoupon,
  couponError,
  couponApplying = false,
  authenticated,
  onSignInClick,
  onPlaceOrder,
  placingOrder,
  placeOrderError,
  canPlaceOrder,
}: OrderSummarySidebarProps) {
  const [couponInput, setCouponInput] = useState("");
  // Collapsed by default on mobile — the full item-by-item breakdown, trust
  // grid, etc. used to render inline between the checkout steps, forcing a
  // long scroll just to get past it. Desktop is unaffected: the sidebar
  // there was never the thing standing between a shopper and the next step.
  const [mobileExpanded, setMobileExpanded] = useState(false);
  // Same collapsed-by-default treatment as the order summary above — an
  // always-open input + button was taking a full section for something most
  // shoppers don't have and won't use on a given visit.
  const [couponOpen, setCouponOpen] = useState(false);
  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <div>
      <div className="rounded-3xl border border-charcoal/10 bg-white p-6">
        <button
          type="button"
          onClick={() => setMobileExpanded((v) => !v)}
          className="w-full flex items-center justify-between md:hidden"
          aria-expanded={mobileExpanded}
        >
          <span className="text-sm font-medium text-charcoal">
            Order Summary <span className="text-ink-muted">({itemCount} items)</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="text-lg font-semibold text-charcoal">₹{total.toLocaleString("en-IN")}</span>
            <ChevronDown
              size={16}
              className={cn("text-charcoal/40 transition-transform", mobileExpanded && "rotate-180")}
            />
          </span>
        </button>

        <div className={cn(mobileExpanded ? "mt-5" : "hidden", "md:block md:mt-0")}>
        <div className="hidden md:flex items-center justify-between">
          <h2 className="font-serif text-lg text-charcoal">
            Order Summary <span className="text-sm font-sans text-ink-muted">({itemCount} items)</span>
          </h2>
          <Link
            href="/cart"
            className="text-sm font-medium text-terracotta-dark hover:text-terracotta transition-colors"
          >
            Edit Cart
          </Link>
        </div>

        <div className="mt-5 space-y-4">
          {items.map((item) => (
            <div key={item.id} className="flex items-center gap-3.5">
              <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-cream-dark">
                <Image src={item.image} alt={item.name} fill className="object-cover" sizes="64px" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-charcoal">{item.name}</p>
                <p className="text-xs text-ink-muted mt-0.5">Qty: {item.quantity}</p>
              </div>
              <p className="text-sm font-semibold text-charcoal shrink-0">
                ₹{(item.price * item.quantity).toLocaleString("en-IN")}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-5 pt-5 border-t border-charcoal/10 space-y-2.5 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-ink-muted">Subtotal ({itemCount} items)</span>
            <span className="text-charcoal">₹{subtotal.toLocaleString("en-IN")}</span>
          </div>
          {appliedCoupon && discount > 0 && (
            <div className="flex items-center justify-between">
              <span className="text-ink-muted flex items-center gap-1.5">
                Discount
                <span className="inline-flex items-center gap-1 rounded-full bg-olive/10 text-olive-dark text-xs font-medium px-2 py-0.5">
                  {appliedCoupon.code}
                  <button
                    type="button"
                    onClick={onRemoveCoupon}
                    aria-label="Remove coupon"
                    className="hover:text-olive transition-colors"
                  >
                    <X size={11} />
                  </button>
                </span>
              </span>
              <span className="text-olive-dark">-₹{discount.toLocaleString("en-IN")}</span>
            </div>
          )}
          <div className="flex items-center justify-between">
            <span className="text-ink-muted flex items-center gap-1.5">
              Shipping
              <Info size={12} className="text-charcoal/30" />
            </span>
            <span className="text-charcoal">
              {shipping === 0 ? "FREE" : `₹${shipping.toLocaleString("en-IN")}`}
            </span>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-charcoal/10 flex items-center justify-between">
          <div>
            <span className="font-semibold text-charcoal">Total Amount</span>
            <p className="text-xs text-ink-muted">Inclusive of all taxes</p>
          </div>
          <span className="text-2xl font-semibold text-charcoal">₹{total.toLocaleString("en-IN")}</span>
        </div>

        {discount > 0 && (
          <div className="mt-4 rounded-xl bg-olive/10 px-4 py-2.5 text-sm text-olive-dark flex items-center gap-2">
            <Truck size={14} className="shrink-0" />
            Yay! You&rsquo;re saving ₹{discount.toLocaleString("en-IN")} on this order.
          </div>
        )}

        <div className="mt-6 pt-5 border-t border-charcoal/10 grid grid-cols-2 gap-4">
          {trustItems.map((item) => (
            <div key={item.title} className="flex items-start gap-2">
              <item.icon size={16} className="text-terracotta shrink-0 mt-0.5" strokeWidth={1.5} />
              <div>
                <p className="text-xs font-semibold text-charcoal leading-tight">{item.title}</p>
                <p className="text-[11px] text-ink-muted mt-0.5 leading-tight">{item.subtitle}</p>
              </div>
            </div>
          ))}
        </div>
        </div>
      </div>

      <div className="mt-4 rounded-2xl border border-charcoal/10 bg-white p-5">
        <button
          type="button"
          onClick={() => setCouponOpen((v) => !v)}
          className="w-full flex items-center justify-between"
          aria-expanded={couponOpen}
        >
          <span className="flex items-center gap-2 text-sm font-medium text-charcoal">
            <Tag size={15} className="text-terracotta" />
            {appliedCoupon ? (
              <>
                Coupon applied
                <span className="inline-flex items-center rounded-full bg-olive/10 text-olive-dark text-xs font-medium px-2 py-0.5">
                  {appliedCoupon.code}
                </span>
              </>
            ) : (
              "Have a coupon code?"
            )}
          </span>
          <ChevronDown
            size={16}
            className={cn("text-charcoal/40 transition-transform shrink-0", couponOpen && "rotate-180")}
          />
        </button>

        {couponOpen && (
          <div className="mt-3">
            {authenticated ? (
              <>
                <p className="text-xs text-ink-muted">Apply your code and save on your order.</p>
                <div className="mt-3 flex gap-2">
                  <input
                    type="text"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && couponInput.trim() && !couponApplying) {
                        onApplyCoupon(couponInput.trim());
                      }
                    }}
                    placeholder="Enter coupon code"
                    className="flex-1 min-w-0 rounded-lg border border-charcoal/15 px-3.5 py-2.5 text-sm text-charcoal placeholder:text-ink-muted focus:outline-none focus:border-olive uppercase placeholder:normal-case"
                  />
                  <button
                    type="button"
                    disabled={couponApplying}
                    onClick={() => couponInput.trim() && onApplyCoupon(couponInput.trim())}
                    className="shrink-0 rounded-lg bg-olive text-cream px-5 py-2.5 text-xs font-semibold tracking-[0.08em] uppercase hover:bg-olive-dark transition-colors disabled:opacity-60"
                  >
                    {couponApplying ? "Checking…" : "Apply"}
                  </button>
                </div>
                {couponError && <p className="mt-2 text-xs text-terracotta-dark">{couponError}</p>}
              </>
            ) : (
              <p className="text-xs text-ink-muted">
                Coupons are an account perk —{" "}
                <button
                  type="button"
                  onClick={onSignInClick}
                  className="font-medium text-terracotta-dark hover:text-terracotta transition-colors"
                >
                  sign in
                </button>{" "}
                to apply one.
              </p>
            )}
          </div>
        )}
      </div>

      {placeOrderError && (
        <p className="mt-4 text-sm text-terracotta-dark">{placeOrderError}</p>
      )}

      {/* Hidden on mobile — CheckoutMobileStickyCTA covers this role there
          (rendered separately, pinned to the bottom of the screen) so both
          would otherwise show at once. */}
      <button
        type="button"
        onClick={onPlaceOrder}
        disabled={!canPlaceOrder || placingOrder}
        title={!canPlaceOrder ? "Complete the Address and Payment steps first" : undefined}
        className="mt-4 hidden md:inline-flex w-full items-center justify-center gap-2 rounded-xl bg-olive text-cream px-7 py-3.5 text-xs font-semibold tracking-[0.1em] uppercase hover:bg-olive-dark transition-colors disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-olive"
      >
        {placingOrder ? "Placing Order…" : "Place Order"}
        {!placingOrder && <ArrowRight size={14} />}
      </button>

      <p className="mt-3 text-center text-[11px] leading-relaxed text-ink-muted">
        By placing your order you agree to our{" "}
        <a href="/terms" target="_blank" rel="noopener" className="underline hover:text-terracotta-dark">
          Terms &amp; Conditions
        </a>{" "}
        and{" "}
        <a href="/privacy" target="_blank" rel="noopener" className="underline hover:text-terracotta-dark">
          Privacy Policy
        </a>
        .
      </p>
    </div>
  );
}
