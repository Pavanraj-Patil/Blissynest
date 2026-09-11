"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSession } from "next-auth/react";
import {
  MapPin,
  CreditCard,
  Gift,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  Lock,
  ShoppingBag,
} from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Breadcrumb } from "@/components/shop/Breadcrumb";
import { AccountAuthModal } from "@/components/layout/AccountAuthModal";
import { CheckoutStepper, type CheckoutStep } from "@/components/checkout/CheckoutStepper";
import { AddressStep } from "@/components/checkout/AddressStep";
import { OrderSummarySidebar } from "@/components/checkout/OrderSummarySidebar";
import { CheckoutMobileStickyCTA } from "@/components/checkout/CheckoutMobileStickyCTA";
import { OrderConfirmation } from "@/components/checkout/OrderConfirmation";
import { useCart } from "@/lib/cart-context";
import { cn } from "@/lib/cn";
import { loadRazorpayScript } from "@/lib/load-razorpay-script";
import {
  paymentMethods,
  razorpayMethodFlags,
  FREE_SHIPPING_THRESHOLD,
  STANDARD_SHIPPING_FEE,
  type Address,
} from "@/lib/checkout-data";

type AppliedCoupon = { code: string; discount: number };

function StepSection({
  stepNumber,
  currentStep,
  onOpen,
  icon: Icon,
  title,
  subtitle,
  children,
}: {
  stepNumber: 1 | 2 | 3;
  currentStep: CheckoutStep;
  onOpen: () => void;
  icon: typeof MapPin;
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  const isActive = currentStep === stepNumber;
  const isDone = currentStep > stepNumber;
  const isReachable = stepNumber <= currentStep;

  return (
    <div className="rounded-2xl border border-charcoal/10 bg-white overflow-hidden">
      <button
        type="button"
        onClick={() => isReachable && onOpen()}
        disabled={!isReachable}
        className="w-full flex items-center gap-3 px-5 py-4 text-left disabled:cursor-not-allowed"
      >
        <span
          className={cn(
            "flex h-9 w-9 items-center justify-center rounded-full shrink-0",
            isDone
              ? "bg-olive/10 text-olive"
              : isActive
                ? "bg-olive-dark text-cream"
                : "bg-cream-dark text-charcoal/30"
          )}
        >
          <Icon size={16} />
        </span>
        <div className="min-w-0 flex-1">
          <p className={cn("text-sm font-semibold", isReachable ? "text-charcoal" : "text-charcoal/40")}>
            {stepNumber}. {title}
          </p>
          <p className="text-xs text-ink-muted truncate">{subtitle}</p>
        </div>
        {isReachable &&
          (isActive ? (
            <ChevronUp size={16} className="text-charcoal/40 shrink-0" />
          ) : (
            <ChevronDown size={16} className="text-charcoal/40 shrink-0" />
          ))}
      </button>
      {isActive && <div className="px-5 pb-5 border-t border-charcoal/10 pt-5">{children}</div>}
    </div>
  );
}

function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function isValidPhone(value: string): boolean {
  return value.replace(/\D/g, "").length >= 10;
}

export function CheckoutPageClient() {
  const { status } = useSession();
  const { items, subtotal, clearCart } = useCart();
  const authenticated = status === "authenticated";

  const [step, setStep] = useState<CheckoutStep>(1);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [guestAddress, setGuestAddress] = useState<Address | null>(null);
  const [guestEmail, setGuestEmail] = useState("");
  const [guestPhone, setGuestPhone] = useState("");
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  const [isGift, setIsGift] = useState(false);
  const [giftNote, setGiftNote] = useState("");
  const [hidePrices, setHidePrices] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<string | null>(null);
  const [codEnabled, setCodEnabled] = useState(true);
  const [codIneligibleSlugs, setCodIneligibleSlugs] = useState<string[]>([]);
  const [appliedCoupon, setAppliedCoupon] = useState<AppliedCoupon | null>(null);
  const [couponError, setCouponError] = useState<string | null>(null);
  const [couponApplying, setCouponApplying] = useState(false);

  const [placingOrder, setPlacingOrder] = useState(false);
  const [placeOrderError, setPlaceOrderError] = useState<string | null>(null);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderNumber, setOrderNumber] = useState("");
  const [orderTotal, setOrderTotal] = useState(0);
  const [orderAddressSummary, setOrderAddressSummary] = useState("");
  const [authOpen, setAuthOpen] = useState(false);

  useEffect(() => {
    if (status !== "authenticated") return;
    fetch("/api/addresses")
      .then((res) => res.json())
      .then((data: { addresses: Address[] }) => {
        setAddresses(data.addresses);
        setSelectedAddressId((prev) => prev ?? data.addresses[0]?.id ?? null);
      })
      .catch(() => {});
  }, [status]);

  // Swapping to the confirmation view is a client-side state change, not a
  // real navigation, so the browser doesn't reset scroll on its own — the
  // user is usually scrolled down near "Place Order" at this point.
  useEffect(() => {
    if (orderPlaced) window.scrollTo(0, 0);
  }, [orderPlaced]);

  // Public, auth-agnostic check (works for guest carts too, which never
  // touch the server otherwise) — the real enforcement is server-side in
  // order-service.ts; this is only what decides whether the option is
  // offered at all. Keyed on the slug set (not `items` itself) so it
  // doesn't refetch on every quantity/customization change; skipped
  // entirely for an empty cart (nothing to check yet).
  const cartSlugsKey = [...new Set(items.map((i) => i.slug))].sort().join(",");
  useEffect(() => {
    if (!cartSlugsKey) return;
    fetch(`/api/checkout/cod-eligibility?slugs=${encodeURIComponent(cartSlugsKey)}`)
      .then((res) => res.json())
      .then((data: { codEnabled: boolean; ineligibleSlugs: string[] }) => {
        setCodEnabled(data.codEnabled);
        setCodIneligibleSlugs(data.ineligibleSlugs);
      })
      .catch(() => {});
  }, [cartSlugsKey]);

  const codAvailableForCart =
    codEnabled && !items.some((i) => codIneligibleSlugs.includes(i.slug));
  // Derived rather than synced back into `paymentMethod` via an effect —
  // if COD stops being offered (cart changed, or the eligibility check just
  // came back) while it was selected, every place that reads "what's
  // selected" should stop treating it as chosen, without a render-triggering
  // effect to reset the underlying state.
  const effectivePaymentMethod = paymentMethod === "cod" && !codAvailableForCart ? null : paymentMethod;

  const discount = appliedCoupon?.discount ?? 0;
  const shipping = subtotal === 0 || subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : STANDARD_SHIPPING_FEE;
  const total = Math.max(0, subtotal - discount + shipping);

  // Guests never get a persisted Address row (that API stays account-only) —
  // their one typed address lives only in this component's state and is
  // snapshotted onto the Order at placement time.
  const visibleAddresses = authenticated ? addresses : guestAddress ? [guestAddress] : [];
  const selectedAddress = visibleAddresses.find((a) => a.id === selectedAddressId) ?? null;
  const visiblePaymentMethods = paymentMethods.filter(
    (pm) => pm.key !== "cod" || codAvailableForCart
  );
  const selectedPaymentMethod = paymentMethods.find((m) => m.key === effectivePaymentMethod) ?? null;

  async function handleAddAddress(values: Omit<Address, "id">) {
    if (!authenticated) {
      const local: Address = { id: "guest-address", ...values };
      setGuestAddress(local);
      setSelectedAddressId(local.id);
      return;
    }
    const res = await fetch("/api/addresses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    const data = await res.json();
    if (!res.ok) return;
    setAddresses((prev) => [...prev, data.address]);
    setSelectedAddressId(data.address.id);
  }

  async function handleEditAddress(id: string, values: Omit<Address, "id">) {
    if (!authenticated) {
      setGuestAddress({ id, ...values });
      return;
    }
    const res = await fetch(`/api/addresses/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    const data = await res.json();
    if (!res.ok) return;
    setAddresses((prev) => prev.map((a) => (a.id === id ? data.address : a)));
  }

  async function handleDeleteAddress(id: string) {
    if (!authenticated) {
      setGuestAddress(null);
      setSelectedAddressId(null);
      return;
    }
    setAddresses((prev) => prev.filter((a) => a.id !== id));
    if (selectedAddressId === id) {
      setSelectedAddressId(addresses.find((a) => a.id !== id)?.id ?? null);
    }
    await fetch(`/api/addresses/${id}`, { method: "DELETE" });
  }

  function buildGuestFields() {
    if (authenticated) return {};
    return {
      guestEmail,
      guestPhone,
      guestItems: items.map((i) => ({ slug: i.slug, quantity: i.quantity, customization: i.customization })),
    };
  }

  async function handleApplyCoupon(code: string) {
    setCouponApplying(true);
    setCouponError(null);
    try {
      const res = await fetch("/api/coupons/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, subtotal }),
      });
      const data = await res.json();
      if (!res.ok) {
        setCouponError(data.error ?? "That coupon code isn't valid.");
        return;
      }
      setAppliedCoupon(data.coupon);
    } catch {
      setCouponError("Something went wrong. Please try again.");
    } finally {
      setCouponApplying(false);
    }
  }

  function handleRemoveCoupon() {
    setAppliedCoupon(null);
    setCouponError(null);
  }

  function buildShippingAddress() {
    if (!selectedAddress) return null;
    return {
      label: selectedAddress.label,
      name: selectedAddress.name,
      line1: selectedAddress.line1,
      line2: selectedAddress.line2,
      city: selectedAddress.city,
      state: selectedAddress.state,
      pincode: selectedAddress.pincode,
      phone: selectedAddress.phone,
    };
  }

  function applyOrderSuccess(data: { orderNumber: string; total: number }) {
    if (!selectedAddress) return;
    setOrderNumber(data.orderNumber);
    setOrderTotal(data.total);
    setOrderAddressSummary(
      `${selectedAddress.name}, ${selectedAddress.line1}${selectedAddress.line2 ? `, ${selectedAddress.line2}` : ""}, ${selectedAddress.city}, ${selectedAddress.state} - ${selectedAddress.pincode}`
    );
    setOrderPlaced(true);
    clearCart();
  }

  async function handlePlaceOrder() {
    if (!selectedAddress || !effectivePaymentMethod) return;
    setPlacingOrder(true);
    setPlaceOrderError(null);

    if (effectivePaymentMethod === "cod") {
      try {
        const res = await fetch("/api/orders", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            shippingAddress: buildShippingAddress(),
            paymentMethod: effectivePaymentMethod,
            isGift,
            giftNote: isGift ? giftNote : undefined,
            hidePricesOnSlip: isGift ? hidePrices : false,
            couponCode: appliedCoupon?.code,
            ...buildGuestFields(),
          }),
        });
        const data = await res.json();

        if (!res.ok) {
          setPlaceOrderError(data.error ?? "Something went wrong placing your order.");
          setPlacingOrder(false);
          return;
        }

        applyOrderSuccess(data);
      } catch {
        setPlaceOrderError("Something went wrong placing your order. Please try again.");
        setPlacingOrder(false);
      }
      return;
    }

    await handleRazorpayPayment();
  }

  async function handleRazorpayPayment() {
    if (!selectedAddress || !effectivePaymentMethod) return;

    const createRes = await fetch("/api/checkout/razorpay/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ couponCode: appliedCoupon?.code, ...buildGuestFields() }),
    });
    const session = await createRes.json();
    if (!createRes.ok) {
      setPlaceOrderError(session.error ?? "Couldn't start payment. Please try again.");
      setPlacingOrder(false);
      return;
    }

    const loaded = await loadRazorpayScript();
    if (!loaded || !window.Razorpay) {
      setPlaceOrderError("Couldn't load the payment gateway. Please check your connection and try again.");
      setPlacingOrder(false);
      return;
    }

    const razorpay = new window.Razorpay({
      key: session.keyId,
      amount: session.amount,
      currency: session.currency,
      order_id: session.razorpayOrderId,
      name: "Blissynest",
      description: "Order payment",
      prefill: { name: selectedAddress.name, contact: selectedAddress.phone },
      method: razorpayMethodFlags[effectivePaymentMethod],
      theme: { color: "#6b7a4f" },
      handler: async (response) => {
        try {
          const verifyRes = await fetch("/api/checkout/razorpay/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
              shippingAddress: buildShippingAddress(),
              paymentMethod: effectivePaymentMethod,
              isGift,
              giftNote: isGift ? giftNote : undefined,
              hidePricesOnSlip: isGift ? hidePrices : false,
              couponCode: appliedCoupon?.code,
              ...buildGuestFields(),
            }),
          });
          const data = await verifyRes.json();
          if (!verifyRes.ok) {
            setPlaceOrderError(data.error ?? "Payment succeeded but confirming your order failed. Please contact support.");
            setPlacingOrder(false);
            return;
          }
          applyOrderSuccess(data);
        } catch {
          setPlaceOrderError("Payment succeeded but confirming your order failed. Please contact support.");
          setPlacingOrder(false);
        }
      },
      modal: {
        ondismiss: () => {
          setPlaceOrderError("Payment was cancelled.");
          setPlacingOrder(false);
        },
      },
    });

    razorpay.open();
  }

  if (orderPlaced) {
    return (
      <>
        <Header />
        <main>
          <div className="mx-auto max-w-[1440px] px-4 md:px-8 pt-5">
            <Breadcrumb
              items={[{ label: "Home", href: "/" }, { label: "Order Confirmed" }]}
            />
          </div>
          <div className="mx-auto max-w-[1440px] px-4 md:px-8">
            <OrderConfirmation
              orderNumber={orderNumber}
              total={orderTotal}
              addressSummary={orderAddressSummary}
            />
            {!authenticated && (
              <div className="mx-auto max-w-xl mt-6 mb-16 rounded-2xl border border-charcoal/10 bg-cream-dark p-6 text-center">
                <p className="text-sm font-medium text-charcoal">Save this order to an account</p>
                <p className="mt-1 text-xs text-ink-muted">
                  Create a free account to track this and future orders in one place.
                </p>
                <button
                  type="button"
                  onClick={() => setAuthOpen(true)}
                  className="mt-4 inline-flex items-center gap-2 rounded-full bg-olive text-cream px-6 py-3 text-xs font-semibold tracking-[0.1em] uppercase hover:bg-olive-dark transition-colors"
                >
                  Create Account
                </button>
              </div>
            )}
          </div>
        </main>
        <AccountAuthModal
          open={authOpen}
          onClose={() => setAuthOpen(false)}
          initialMode="signup"
          initialName={guestAddress?.name ?? ""}
          initialEmail={guestEmail}
        />
      </>
    );
  }

  if (items.length === 0) {
    return (
      <>
        <Header />
        <main>
          <div className="mx-auto max-w-[1440px] px-4 md:px-8 pt-5">
            <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Checkout" }]} />
          </div>
          <div className="flex flex-col items-center text-center py-20 px-4">
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-cream-dark">
              <ShoppingBag size={38} className="text-olive/40" strokeWidth={1.5} />
            </div>
            <h1 className="mt-6 font-serif text-2xl text-charcoal">
              There&rsquo;s nothing to check out yet
            </h1>
            <p className="mt-2 text-sm text-ink-muted max-w-sm">
              Add a few thoughtful gifts to your cart first, then come back
              here when you&rsquo;re ready.
            </p>
            <Link
              href="/shop"
              className="mt-7 inline-flex items-center gap-2 rounded-full bg-olive text-cream px-7 py-3.5 text-xs font-semibold tracking-[0.12em] uppercase hover:bg-olive-dark transition-colors"
            >
              Continue Shopping
              <ArrowRight size={14} />
            </Link>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <Header />
      <main>
        <div className="mx-auto max-w-[1440px] px-4 md:px-8 pt-5">
          <Breadcrumb
            items={[
              { label: "Home", href: "/" },
              { label: "Cart", href: "/cart" },
              { label: "Checkout" },
            ]}
          />
        </div>

        <div className="mx-auto max-w-[1440px] px-4 md:px-8 pt-6 pb-4">
          <div className="flex items-end justify-between gap-4">
            <div>
              <h1 className="font-serif text-2xl md:text-3xl text-charcoal">Checkout</h1>
              <p className="mt-1 text-sm text-ink-muted">
                You&rsquo;re just a few steps away from thoughtful gifting ✨
              </p>
            </div>
            <p className="hidden sm:flex items-center gap-1.5 text-sm text-ink-muted shrink-0">
              <Lock size={13} />
              Secure Checkout
            </p>
          </div>
        </div>

        <div className="mx-auto max-w-[1440px] px-4 md:px-8 pb-16">
          <div className="mb-6">
            <CheckoutStepper current={step} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-[1fr_340px] lg:grid-cols-[1fr_380px] gap-6 lg:gap-8">
            <div className="min-w-0 space-y-4">
              <StepSection
                stepNumber={1}
                currentStep={step}
                onOpen={() => setStep(1)}
                icon={MapPin}
                title="Delivery Address"
                subtitle={
                  step > 1 && selectedAddress
                    ? `${selectedAddress.label} — ${selectedAddress.city}, ${selectedAddress.state}`
                    : "Where should we deliver your gifts?"
                }
              >
                {!authenticated && (
                  <div className="mb-4 space-y-2">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <label className="block">
                        <span className="text-xs font-medium text-charcoal">
                          Email (for order updates) <span className="text-terracotta-dark">*</span>
                        </span>
                        <input
                          type="email"
                          required
                          value={guestEmail}
                          onChange={(e) => setGuestEmail(e.target.value)}
                          placeholder="you@example.com"
                          className="mt-1.5 w-full rounded-lg border border-charcoal/15 px-3.5 py-2.5 text-sm text-charcoal placeholder:text-ink-muted focus:outline-none focus:border-olive"
                        />
                      </label>
                      <label className="block">
                        <span className="text-xs font-medium text-charcoal">
                          Mobile Number (for order updates) <span className="text-terracotta-dark">*</span>
                        </span>
                        <input
                          type="tel"
                          required
                          value={guestPhone}
                          onChange={(e) => setGuestPhone(e.target.value)}
                          placeholder="+91 98765 43210"
                          className="mt-1.5 w-full rounded-lg border border-charcoal/15 px-3.5 py-2.5 text-sm text-charcoal placeholder:text-ink-muted focus:outline-none focus:border-olive"
                        />
                      </label>
                    </div>
                    <button
                      type="button"
                      onClick={() => setAuthOpen(true)}
                      className="text-xs font-medium text-terracotta-dark hover:text-terracotta transition-colors"
                    >
                      Have an account? Sign in for faster checkout
                    </button>
                  </div>
                )}
                <AddressStep
                  addresses={visibleAddresses}
                  selectedId={selectedAddressId}
                  onSelect={setSelectedAddressId}
                  onAdd={handleAddAddress}
                  onEdit={handleEditAddress}
                  onDelete={handleDeleteAddress}
                  canContinue={authenticated || (isValidEmail(guestEmail) && isValidPhone(guestPhone))}
                  defaultPhone={!authenticated ? guestPhone : undefined}
                  isGift={isGift}
                  onToggleGift={setIsGift}
                  giftNote={giftNote}
                  onGiftNoteChange={setGiftNote}
                  hidePrices={hidePrices}
                  onToggleHidePrices={setHidePrices}
                  onContinue={() => setStep(2)}
                />
              </StepSection>

              <StepSection
                stepNumber={2}
                currentStep={step}
                onOpen={() => setStep(2)}
                icon={CreditCard}
                title="Payment Method"
                subtitle={
                  step > 2 && selectedPaymentMethod
                    ? selectedPaymentMethod.label
                    : "Choose a secure payment option"
                }
              >
                <div className="space-y-3">
                  {codEnabled && !codAvailableForCart && (
                    <p className="rounded-lg bg-cream-dark px-3.5 py-2.5 text-xs text-ink-muted">
                      Cash on Delivery isn&rsquo;t available for one or more items in your
                      cart — choose another payment method, or remove that item to pay on
                      delivery.
                    </p>
                  )}
                  {visiblePaymentMethods.map((pm) => (
                    <label
                      key={pm.key}
                      className={cn(
                        "flex items-center gap-3 rounded-xl border p-4 cursor-pointer transition-colors",
                        effectivePaymentMethod === pm.key
                          ? "border-olive bg-olive/5"
                          : "border-charcoal/10 hover:border-charcoal/25"
                      )}
                    >
                      <input
                        type="radio"
                        name="payment"
                        checked={effectivePaymentMethod === pm.key}
                        onChange={() => setPaymentMethod(pm.key)}
                        className="h-4 w-4 accent-olive shrink-0"
                      />
                      <pm.icon size={20} className="text-terracotta shrink-0" strokeWidth={1.5} />
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-charcoal">{pm.label}</p>
                        <p className="text-xs text-ink-muted">{pm.description}</p>
                      </div>
                    </label>
                  ))}

                  <p className="flex items-start gap-1.5 pt-1 text-xs text-ink-muted">
                    <Lock size={12} className="shrink-0 mt-0.5" />
                    Card, UPI and Net Banking are processed securely by Razorpay
                    — we never see or store your card or bank details.
                    {codAvailableForCart && " Cash on Delivery needs nothing upfront."}
                  </p>

                  <button
                    type="button"
                    onClick={() => setStep(3)}
                    disabled={!effectivePaymentMethod}
                    className="inline-flex items-center gap-2 rounded-xl bg-olive text-cream px-7 py-3.5 text-xs font-semibold tracking-[0.1em] uppercase hover:bg-olive-dark transition-colors disabled:opacity-40 disabled:pointer-events-none"
                  >
                    Continue to Review
                    <ArrowRight size={14} />
                  </button>
                </div>
              </StepSection>

              <StepSection
                stepNumber={3}
                currentStep={step}
                onOpen={() => setStep(3)}
                icon={Gift}
                title="Review Your Order"
                subtitle="Confirm everything before you place your order"
              >
                <div className="space-y-4">
                  <div className="rounded-xl border border-charcoal/10 p-4 flex items-start gap-3">
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-cream-dark text-olive shrink-0">
                      <MapPin size={16} />
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-3">
                        <p className="text-sm font-semibold text-charcoal">Delivery Address</p>
                        <button
                          type="button"
                          onClick={() => setStep(1)}
                          className="text-xs font-medium text-terracotta-dark hover:text-terracotta transition-colors shrink-0"
                        >
                          Change
                        </button>
                      </div>
                      {selectedAddress && (
                        <>
                          <p className="mt-1 text-sm text-charcoal">{selectedAddress.name}</p>
                          <p className="text-sm text-ink-muted leading-relaxed">
                            {selectedAddress.line1}
                            {selectedAddress.line2 ? `, ${selectedAddress.line2}` : ""}, {selectedAddress.city}, {selectedAddress.state} - {selectedAddress.pincode}
                          </p>
                          <p className="text-sm text-ink-muted mt-0.5">{selectedAddress.phone}</p>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="rounded-xl border border-charcoal/10 p-4 flex items-start gap-3">
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-cream-dark text-olive shrink-0">
                      <CreditCard size={16} />
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-3">
                        <p className="text-sm font-semibold text-charcoal">Payment Method</p>
                        <button
                          type="button"
                          onClick={() => setStep(2)}
                          className="text-xs font-medium text-terracotta-dark hover:text-terracotta transition-colors shrink-0"
                        >
                          Change
                        </button>
                      </div>
                      <p className="mt-1 text-sm text-charcoal">{selectedPaymentMethod?.label}</p>
                      <p className="text-sm text-ink-muted">{selectedPaymentMethod?.description}</p>
                    </div>
                  </div>

                  {isGift && (
                    <div className="rounded-xl border border-charcoal/10 p-4 flex items-start gap-3">
                      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-cream-dark text-olive shrink-0">
                        <Gift size={16} />
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-3">
                          <p className="text-sm font-semibold text-charcoal">Gift Note</p>
                          <button
                            type="button"
                            onClick={() => setStep(1)}
                            className="text-xs font-medium text-terracotta-dark hover:text-terracotta transition-colors shrink-0"
                          >
                            Change
                          </button>
                        </div>
                        <p className="mt-1 text-sm text-ink-muted">
                          {giftNote || "No message added"}
                        </p>
                        {hidePrices && (
                          <p className="mt-1 text-xs text-olive-dark">
                            Prices will be hidden on the packing slip
                          </p>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="rounded-xl border border-charcoal/10 p-4">
                    <p className="text-sm font-semibold text-charcoal mb-3">
                      Items ({items.reduce((sum, i) => sum + i.quantity, 0)})
                    </p>
                    <div className="space-y-3">
                      {items.map((item) => (
                        <div key={item.id} className="flex items-center gap-3">
                          <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-cream-dark">
                            <Image
                              src={item.image}
                              alt={item.name}
                              fill
                              className="object-cover"
                              sizes="48px"
                            />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm text-charcoal">{item.name}</p>
                            <p className="text-xs text-ink-muted">Qty: {item.quantity}</p>
                          </div>
                          <p className="text-sm font-medium text-charcoal shrink-0">
                            ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>
              </StepSection>
            </div>

            {/* min-w-0 overrides the grid item's default min-width:auto —
                without it, a grid track sizes to fit its content's
                min-content width even past its assigned column size, and
                this sidebar's content (price rows, trust-badge grid) is
                wide enough to blow out the 340px column and overflow the
                page horizontally. */}
            <div id="order-summary" className="min-w-0">
              <OrderSummarySidebar
                items={items}
                subtotal={subtotal}
                discount={discount}
                shipping={shipping}
                total={total}
                appliedCoupon={appliedCoupon}
                onApplyCoupon={handleApplyCoupon}
                onPlaceOrder={handlePlaceOrder}
                placingOrder={placingOrder}
                placeOrderError={placeOrderError}
                canPlaceOrder={step === 3}
                onRemoveCoupon={handleRemoveCoupon}
                couponError={couponError}
                couponApplying={couponApplying}
                authenticated={authenticated}
                onSignInClick={() => setAuthOpen(true)}
              />
            </div>
          </div>
        </div>

        {step === 3 && (
          <CheckoutMobileStickyCTA
            total={total}
            onPlaceOrder={handlePlaceOrder}
            placingOrder={placingOrder}
          />
        )}
      </main>
      <AccountAuthModal open={authOpen} onClose={() => setAuthOpen(false)} />
    </>
  );
}
