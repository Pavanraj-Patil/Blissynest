"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ShoppingBag, ArrowRight, X, Star, Check, Loader2 } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Breadcrumb } from "@/components/shop/Breadcrumb";
import { useWishlist, type WishlistItem } from "@/lib/wishlist-context";
import { useCart } from "@/lib/cart-context";

function WishlistCard({ item }: { item: WishlistItem }) {
  const { removeItem } = useWishlist();
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  function handleAddToCart() {
    addItem(item);
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  }

  return (
    <div className="group relative rounded-2xl border border-charcoal/10 bg-white p-3 sm:p-4">
      <button
        type="button"
        aria-label="Remove from wishlist"
        onClick={() => removeItem(item.slug)}
        className="absolute top-5 right-5 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-charcoal shadow-sm hover:text-terracotta-dark transition-colors"
      >
        <X size={15} />
      </button>

      <Link href={`/product/${item.slug}`} className="relative block aspect-square overflow-hidden rounded-xl bg-cream-dark">
        <Image
          src={item.image}
          alt={item.name}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="(min-width: 1024px) 19vw, 45vw"
        />
      </Link>

      <div className="mt-3">
        <Link
          href={`/product/${item.slug}`}
          className="text-sm font-medium text-charcoal hover:text-terracotta-dark transition-colors"
        >
          {item.name}
        </Link>
        <p className="mt-1 text-sm font-semibold text-charcoal">
          ₹{item.price.toLocaleString("en-IN")}
        </p>
        <div className="mt-1 flex items-center gap-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              size={12}
              className={i < item.rating ? "fill-gold text-gold" : "fill-charcoal/15 text-charcoal/15"}
            />
          ))}
          <span className="text-xs text-ink-muted ml-1">({item.reviews})</span>
        </div>

        <button
          type="button"
          onClick={handleAddToCart}
          className={`mt-3 w-full inline-flex items-center justify-center gap-2 rounded-full px-4 py-2.5 text-xs font-semibold tracking-[0.08em] uppercase transition-colors ${
            added
              ? "bg-olive/10 text-olive-dark"
              : "border border-charcoal/70 text-charcoal hover:bg-charcoal hover:text-cream"
          }`}
        >
          {added ? (
            <>
              <Check size={14} />
              Added
            </>
          ) : (
            <>
              <ShoppingBag size={14} />
              Add to Cart
            </>
          )}
        </button>
      </div>
    </div>
  );
}

function EmptyWishlist() {
  return (
    <div className="flex flex-col items-center text-center py-20 px-4">
      <Image
        src="/empty-wishlist.png"
        alt=""
        width={384}
        height={256}
        className="h-auto w-64 sm:w-72"
      />
      <h1 className="mt-2 font-serif text-2xl text-charcoal">
        Your wishlist is feeling a little light
      </h1>
      <p className="mt-2 text-sm text-ink-muted max-w-sm">
        Save the gifts that catch your eye here, so they&rsquo;re ready and
        waiting whenever the moment calls for them.
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

function WishlistLoading() {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-24 text-ink-muted">
      <Loader2 size={22} className="animate-spin text-olive" />
      <p className="text-sm">Loading your wishlist…</p>
    </div>
  );
}

export function WishlistPageClient() {
  const { items, loading } = useWishlist();

  return (
    <>
      <Header />
      <main>
        <div className="mx-auto max-w-[1440px] px-4 md:px-8 pt-5">
          <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Wishlist" }]} />
        </div>

        {loading ? (
          <WishlistLoading />
        ) : items.length === 0 ? (
          <EmptyWishlist />
        ) : (
          <div className="mx-auto max-w-[1440px] px-4 md:px-8 py-8">
            <div className="flex items-end justify-between gap-4 mb-8">
              <div>
                <h1 className="font-serif text-2xl md:text-3xl text-charcoal">My Wishlist</h1>
                <p className="mt-1 text-sm text-ink-muted">
                  {items.length} item{items.length === 1 ? "" : "s"} saved
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

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {items.map((item) => (
                <WishlistCard key={item.slug} item={item} />
              ))}
            </div>
          </div>
        )}
      </main>
    </>
  );
}
