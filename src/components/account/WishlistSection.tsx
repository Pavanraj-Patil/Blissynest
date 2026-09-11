"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, ArrowRight, Loader2 } from "lucide-react";
import { useWishlist } from "@/lib/wishlist-context";

export function WishlistSection() {
  const { items, loading } = useWishlist();

  if (loading) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-2xl border border-charcoal/10 bg-white px-6 py-16 text-center text-ink-muted">
        <Loader2 size={20} className="animate-spin text-olive" />
        <p className="text-sm">Loading your wishlist…</p>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center rounded-2xl border border-charcoal/10 bg-white px-6 py-16 text-center">
        <Heart size={32} className="text-charcoal/20" strokeWidth={1.5} />
        <p className="mt-3 text-sm text-charcoal">Your wishlist is empty</p>
        <p className="mt-1 text-xs text-ink-muted">
          Tap the heart on anything you love to save it here.
        </p>
        <Link
          href="/shop"
          className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-terracotta-dark hover:text-terracotta transition-colors"
        >
          Browse the shop
          <ArrowRight size={14} />
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {items.slice(0, 6).map((item) => (
          <Link
            key={item.slug}
            href={`/product/${item.slug}`}
            className="group rounded-2xl border border-charcoal/10 bg-white p-3"
          >
            <div className="relative aspect-square overflow-hidden rounded-xl bg-cream-dark">
              <Image
                src={item.image}
                alt={item.name}
                fill
                className="object-cover group-hover:scale-105 transition-transform"
                sizes="200px"
              />
            </div>
            <p className="mt-2.5 truncate text-sm text-charcoal">{item.name}</p>
            <p className="text-sm font-semibold text-charcoal">
              ₹{item.price.toLocaleString("en-IN")}
            </p>
          </Link>
        ))}
      </div>

      <Link
        href="/wishlist"
        className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-terracotta-dark hover:text-terracotta transition-colors"
      >
        View full wishlist ({items.length})
        <ArrowRight size={14} />
      </Link>
    </div>
  );
}
