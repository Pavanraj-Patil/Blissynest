"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Trash2, ShieldCheck, Truck, Gift, Loader2 } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Breadcrumb } from "@/components/shop/Breadcrumb";
import { QuantityStepper } from "@/components/product/QuantityStepper";
import { RemoveFromCartDialog } from "@/components/cart/RemoveFromCartDialog";
import { useCart, type CartItem } from "@/lib/cart-context";
import { useWishlist } from "@/lib/wishlist-context";

const FREE_SHIPPING_THRESHOLD = 999;

function EmptyCart() {
  return (
    <div className="flex flex-col items-center text-center py-20 px-4">
      <Image
        src="/empty-cart.png"
        alt=""
        width={384}
        height={256}
        className="h-auto w-64 sm:w-72"
      />
      <h1 className="mt-2 font-serif text-2xl text-charcoal">
        Your cart is waiting to be filled
      </h1>
      <p className="mt-2 text-sm text-ink-muted max-w-sm">
        No gifts here yet. Go find something thoughtful — we&rsquo;ll keep it
        safe here until you&rsquo;re ready.
      </p>
      <Link
        href="/shop"
        className="mt-7 inline-flex items-center gap-2 rounded-full bg-olive text-cream px-7 py-3.5 text-xs font-semibold tracking-[0.12em] uppercase hover:bg-olive-dark transition-colors"
      >
        Continue Shopping
        <ArrowRight size={14} />
      </Link>
    </div>
  );
}

function CartLoading() {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-24 text-ink-muted">
      <h1 className="sr-only">My Cart</h1>
      <Loader2 size={22} className="animate-spin text-olive" />
      <p className="text-sm">Loading your cart…</p>
    </div>
  );
}

export function CartPageClient() {
  const { items, loading, updateQuantity, removeItem, subtotal } = useCart();
  const { isWishlisted, toggleItem: toggleWishlistItem } = useWishlist();
  const [removingItem, setRemovingItem] = useState<CartItem | null>(null);

  const remainingForFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);

  function handleRemove() {
    if (!removingItem) return;
    removeItem(removingItem.id);
    setRemovingItem(null);
  }

  function handleMoveToWishlist() {
    if (!removingItem) return;
    // toggleItem *toggles* — guard so re-removing an already-wishlisted
    // cart line can't accidentally take it back off the wishlist too.
    if (!isWishlisted(removingItem.slug)) {
      toggleWishlistItem({
        slug: removingItem.slug,
        name: removingItem.name,
        price: removingItem.price,
        image: removingItem.image,
        // Cart lines don't carry rating/review-count; the signed-in path
        // ignores these anyway (only `slug` is sent, see wishlist-context's
        // authenticated toggleItem), and a guest's copy is discarded and
        // re-resolved from the real product on their next sign-in merge.
        rating: 0,
        reviews: 0,
      });
    }
    removeItem(removingItem.id);
    setRemovingItem(null);
  }

  return (
    <>
      <Header />
      <main>
        <div className="mx-auto max-w-[1440px] px-4 md:px-8 pt-5">
          <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Cart" }]} />
        </div>

        {loading ? (
          <CartLoading />
        ) : items.length === 0 ? (
          <EmptyCart />
        ) : (
          <div className="mx-auto max-w-[1440px] px-4 md:px-8 py-8">
            <div className="flex items-end justify-between gap-4 mb-8">
              <div>
                <h1 className="font-serif text-2xl md:text-3xl text-charcoal">My Cart</h1>
                <p className="mt-1 text-sm text-ink-muted">
                  {items.length} item{items.length === 1 ? "" : "s"} in your cart
                </p>
              </div>
              <Link
                href="/shop"
                className="hidden sm:inline-flex items-center gap-1.5 text-sm font-medium text-charcoal hover:text-terracotta-dark transition-colors"
              >
                Continue Shopping
                <ArrowRight size={15} />
              </Link>
            </div>

            {remainingForFreeShipping > 0 ? (
              <div className="mb-6 rounded-xl bg-cream-dark px-4 py-3 text-sm text-charcoal-light">
                <Truck size={14} className="inline mr-2 -mt-0.5 text-terracotta" />
                Add <span className="font-semibold text-charcoal">₹{remainingForFreeShipping.toLocaleString("en-IN")}</span> more to unlock free shipping.
              </div>
            ) : (
              <div className="mb-6 rounded-xl bg-olive/10 px-4 py-3 text-sm text-olive-dark">
                <Truck size={14} className="inline mr-2 -mt-0.5" />
                You&rsquo;ve unlocked free shipping on this order.
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-[1fr_300px] lg:grid-cols-[1fr_360px] gap-6 md:gap-8 lg:gap-10">
              <div className="min-w-0 space-y-4">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex gap-4 rounded-2xl border border-charcoal/10 bg-white p-4"
                  >
                    <Link
                      href={`/product/${item.slug}`}
                      className="relative h-24 w-24 sm:h-28 sm:w-28 shrink-0 overflow-hidden rounded-xl bg-cream-dark"
                    >
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                        sizes="112px"
                      />
                    </Link>

                    <div className="flex min-w-0 flex-1 flex-col justify-between">
                      <div className="flex items-start justify-between gap-3">
                        <Link
                          href={`/product/${item.slug}`}
                          className="text-sm sm:text-base font-medium text-charcoal hover:text-terracotta-dark transition-colors"
                        >
                          {item.name}
                        </Link>
                        <button
                          type="button"
                          aria-label="Remove item"
                          onClick={() => setRemovingItem(item)}
                          className="shrink-0 text-charcoal/40 hover:text-terracotta-dark transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                      <p className="text-sm text-ink-muted">
                        ₹{item.price.toLocaleString("en-IN")} each
                      </p>

                      {item.customization && (
                        <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-ink-muted">
                          {item.customization.textLines &&
                            item.customization.textLines.filter(Boolean).length > 0 && (
                              <span>
                                &ldquo;{item.customization.textLines.filter(Boolean).join(" / ")}&rdquo;
                              </span>
                            )}
                          {item.customization.colorHex && (
                            <span className="inline-flex items-center gap-1.5">
                              <span
                                aria-hidden
                                className="h-3 w-3 rounded-full border border-charcoal/15"
                                style={{ backgroundColor: item.customization.colorHex }}
                              />
                              {item.customization.font}
                            </span>
                          )}
                          {item.customization.variant && <span>{item.customization.variant}</span>}
                          {item.customization.variants &&
                            Object.entries(item.customization.variants).map(([label, value]) => (
                              <span key={label}>
                                {label}: {value}
                              </span>
                            ))}
                          {item.customization.imageUrls && item.customization.imageUrls.length > 0 && (
                            <span className="flex items-center gap-1.5">
                              {item.customization.imageUrls.map((src, i) => (
                                // Plain <img>: shopper-uploaded file on the R2 host, tiny preview.
                                // eslint-disable-next-line @next/next/no-img-element
                                <img
                                  key={src}
                                  src={src}
                                  alt={`Your photo ${i + 1}`}
                                  className="h-9 w-9 rounded-md border border-charcoal/10 object-cover"
                                />
                              ))}
                            </span>
                          )}
                        </div>
                      )}

                      <div className="mt-2 flex items-center justify-between gap-3">
                        <QuantityStepper
                          value={item.quantity}
                          onChange={(q) => updateQuantity(item.id, q)}
                          max={20}
                        />
                        <p className="text-sm font-semibold text-charcoal">
                          ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="min-w-0">
                <div className="rounded-3xl border border-charcoal/10 bg-white p-6">
                  <h2 className="font-serif text-lg text-charcoal">Order Summary</h2>

                  <div className="mt-5 space-y-3 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-ink-muted">Subtotal</span>
                      <span className="text-charcoal">₹{subtotal.toLocaleString("en-IN")}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-ink-muted">Shipping</span>
                      <span className="text-charcoal">
                        {remainingForFreeShipping > 0 ? "Calculated at checkout" : "Free"}
                      </span>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-charcoal/10 flex items-center justify-between">
                    <span className="font-semibold text-charcoal">Total</span>
                    <span className="font-serif text-xl text-charcoal">
                      ₹{subtotal.toLocaleString("en-IN")}
                    </span>
                  </div>

                  <Link
                    href="/checkout"
                    className="mt-6 w-full inline-flex items-center justify-center gap-2 rounded-xl bg-olive text-cream px-6 py-3.5 text-xs font-semibold tracking-[0.1em] uppercase hover:bg-olive-dark transition-colors"
                  >
                    Proceed to Checkout
                    <ArrowRight size={14} />
                  </Link>

                  <div className="mt-5 flex items-center gap-2 text-xs text-ink-muted">
                    <ShieldCheck size={14} className="text-olive shrink-0" />
                    Secure checkout, always.
                  </div>
                </div>

                <div className="mt-4 rounded-2xl bg-cream-dark px-5 py-4 flex items-start gap-2.5">
                  <Gift size={16} className="text-terracotta shrink-0 mt-0.5" />
                  <p className="text-xs text-ink-muted leading-relaxed">
                    Every order is wrapped in signature Blissynest packaging,
                    ready to gift straight out of the box.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <RemoveFromCartDialog
        open={removingItem !== null}
        item={removingItem}
        onClose={() => setRemovingItem(null)}
        onRemove={handleRemove}
        onMoveToWishlist={handleMoveToWishlist}
      />
    </>
  );
}
