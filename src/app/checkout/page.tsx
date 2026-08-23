"use client";

import { useState } from "react";
import Link from "next/link";
import {
  MapPin,
  CreditCard,
  Gift,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  Lock,
  ShieldCheck,
  BadgeCheck,
  EyeOff,
  RotateCcw,
  ShoppingBag,
} from "lucide-react";
import { TopBar } from "@/components/layout/TopBar";
import { Header } from "@/components/layout/Header";
import { Breadcrumb } from "@/components/shop/Breadcrumb";
import { ShopFooter } from "@/components/shop/ShopFooter";
import { CheckoutStepper, type CheckoutStep } from "@/components/checkout/CheckoutStepper";
import { AddressStep } from "@/components/checkout/AddressStep";
import { OrderSummarySidebar } from "@/components/checkout/OrderSummarySidebar";
import { OrderConfirmation } from "@/components/checkout/OrderConfirmation";
import { useCart } from "@/lib/cart-context";
import { cn } from "@/lib/cn";
import {
  seedAddresses,
  paymentMethods,
  coupons,
  calculateDiscount,
  generateOrderNumber,
  FREE_SHIPPING_THRESHOLD,
  STANDARD_SHIPPING_FEE,
  type Address,
  type Coupon,
} from "@/lib/checkout-data";

const trustBadges = [
  { icon: ShieldCheck, label: "Secure Payments" },
  { icon: BadgeCheck, label: "100% Safe & Reliable" },
  { icon: EyeOff, label: "Privacy Protected" },
  { icon: RotateCcw, label: "Easy Returns" },
];

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

export default function CheckoutPage() {
  const { items, subtotal, clearCart } = useCart();

  const [step, setStep] = useState<CheckoutStep>(1);
  const [addresses, setAddresses] = useState<Address[]>(seedAddresses);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(
    seedAddresses[0]?.id ?? null
  );
  const [isGift, setIsGift] = useState(false);
  const [giftNote, setGiftNote] = useState("");
  const [hidePrices, setHidePrices] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<string | null>(null);
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [couponError, setCouponError] = useState<string | null>(null);

  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderNumber, setOrderNumber] = useState("");
  const [orderTotal, setOrderTotal] = useState(0);
  const [orderAddressSummary, setOrderAddressSummary] = useState("");

  const discount = calculateDiscount(appliedCoupon, subtotal);
  const shipping = subtotal === 0 || subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : STANDARD_SHIPPING_FEE;
  const total = Math.max(0, subtotal - discount + shipping);

  const selectedAddress = addresses.find((a) => a.id === selectedAddressId) ?? null;
  const selectedPaymentMethod = paymentMethods.find((m) => m.key === paymentMethod) ?? null;

  function handleAddAddress(values: Omit<Address, "id">) {
    const newAddress: Address = { ...values, id: `addr-${Date.now()}` };
    setAddresses((prev) => [...prev, newAddress]);
    setSelectedAddressId(newAddress.id);
  }

  function handleEditAddress(id: string, values: Omit<Address, "id">) {
    setAddresses((prev) => prev.map((a) => (a.id === id ? { ...values, id } : a)));
  }

  function handleDeleteAddress(id: string) {
    setAddresses((prev) => {
      const next = prev.filter((a) => a.id !== id);
      if (selectedAddressId === id) {
        setSelectedAddressId(next[0]?.id ?? null);
      }
      return next;
    });
  }

  function handleApplyCoupon(code: string) {
    const match = coupons.find((c) => c.code === code.toUpperCase());
    if (!match) {
      setCouponError("That coupon code isn't valid.");
      return;
    }
    const amount = calculateDiscount(match, subtotal);
    if (amount === 0) {
      setCouponError("Your order doesn't meet this coupon's minimum value.");
      return;
    }
    setAppliedCoupon(match);
    setCouponError(null);
  }

  function handleRemoveCoupon() {
    setAppliedCoupon(null);
    setCouponError(null);
  }

  function handlePlaceOrder() {
    if (!selectedAddress) return;
    setOrderNumber(generateOrderNumber());
    setOrderTotal(total);
    setOrderAddressSummary(
      `${selectedAddress.name}, ${selectedAddress.line1}${selectedAddress.line2 ? `, ${selectedAddress.line2}` : ""}, ${selectedAddress.city}, ${selectedAddress.state} - ${selectedAddress.pincode}`
    );
    setOrderPlaced(true);
    clearCart();
  }

  if (orderPlaced) {
    return (
      <>
        <TopBar />
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
          </div>
        </main>
        <ShopFooter />
      </>
    );
  }

  if (items.length === 0) {
    return (
      <>
        <TopBar />
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
        <ShopFooter />
      </>
    );
  }

  return (
    <>
      <TopBar />
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

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8">
            <div className="space-y-4">
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
                <AddressStep
                  addresses={addresses}
                  selectedId={selectedAddressId}
                  onSelect={setSelectedAddressId}
                  onAdd={handleAddAddress}
                  onEdit={handleEditAddress}
                  onDelete={handleDeleteAddress}
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
                  {paymentMethods.map((pm) => (
                    <label
                      key={pm.key}
                      className={cn(
                        "flex items-center gap-3 rounded-xl border p-4 cursor-pointer transition-colors",
                        paymentMethod === pm.key
                          ? "border-olive bg-olive/5"
                          : "border-charcoal/10 hover:border-charcoal/25"
                      )}
                    >
                      <input
                        type="radio"
                        name="payment"
                        checked={paymentMethod === pm.key}
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
                    This is a demo store — no payment details are collected.
                    Selecting a method just saves your preference for the order.
                  </p>

                  <button
                    type="button"
                    onClick={() => setStep(3)}
                    disabled={!paymentMethod}
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
                <div className="space-y-5">
                  <div className="rounded-xl bg-cream-dark p-4 space-y-2.5 text-sm">
                    <div className="flex items-start justify-between gap-4">
                      <span className="text-ink-muted shrink-0">Delivering to</span>
                      <span className="text-charcoal text-right">
                        {selectedAddress?.name} — {selectedAddress?.city}, {selectedAddress?.state}
                      </span>
                    </div>
                    <div className="flex items-start justify-between gap-4">
                      <span className="text-ink-muted shrink-0">Payment method</span>
                      <span className="text-charcoal text-right">
                        {selectedPaymentMethod?.label}
                      </span>
                    </div>
                    {isGift && (
                      <div className="flex items-start justify-between gap-4">
                        <span className="text-ink-muted shrink-0">Gift note</span>
                        <span className="text-charcoal text-right max-w-[65%]">
                          {giftNote || "No message added"}
                        </span>
                      </div>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={handlePlaceOrder}
                    className="inline-flex items-center gap-2 rounded-xl bg-olive text-cream px-7 py-3.5 text-xs font-semibold tracking-[0.1em] uppercase hover:bg-olive-dark transition-colors"
                  >
                    Place Order
                    <ArrowRight size={14} />
                  </button>
                </div>
              </StepSection>

              <div className="rounded-2xl bg-cream-dark px-6 py-6">
                <p className="flex items-center gap-2.5 text-sm font-semibold text-charcoal">
                  <ShieldCheck size={18} className="text-olive" />
                  Your order is safe with us
                </p>
                <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {trustBadges.map((b) => (
                    <div key={b.label} className="flex items-center gap-2">
                      <b.icon size={15} className="text-terracotta shrink-0" strokeWidth={1.5} />
                      <span className="text-xs text-charcoal-light">{b.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <OrderSummarySidebar
                items={items}
                subtotal={subtotal}
                discount={discount}
                shipping={shipping}
                total={total}
                appliedCoupon={appliedCoupon}
                onApplyCoupon={handleApplyCoupon}
                onRemoveCoupon={handleRemoveCoupon}
                couponError={couponError}
              />
            </div>
          </div>
        </div>
      </main>
      <ShopFooter />
    </>
  );
}
