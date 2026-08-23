"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, Star } from "lucide-react";
import { cn } from "@/lib/cn";

type ProductCardProps = {
  name: string;
  price: number;
  rating: number;
  reviews: number;
  image: string;
  href?: string;
  layout?: "grid" | "list";
  priority?: boolean;
  badge?: string;
};

export function ProductCard({
  name,
  price,
  rating,
  reviews,
  image,
  href = "#",
  layout = "grid",
  priority = false,
  badge,
}: ProductCardProps) {
  const [wishlisted, setWishlisted] = useState(false);

  const stars = (
    <div className="mt-1 flex items-center gap-1">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={12}
          className={
            i < rating
              ? "fill-gold text-gold"
              : "fill-charcoal/15 text-charcoal/15"
          }
        />
      ))}
      <span className="text-xs text-ink-muted ml-1">({reviews})</span>
    </div>
  );

  const wishlistButton = (
    <button
      type="button"
      aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
      aria-pressed={wishlisted}
      onClick={(e) => {
        e.preventDefault();
        setWishlisted((v) => !v);
      }}
      className={cn(
        "flex h-8 w-8 items-center justify-center rounded-full bg-white/90 shadow-sm transition-colors shrink-0",
        wishlisted
          ? "text-terracotta-dark"
          : "text-charcoal hover:text-terracotta-dark"
      )}
    >
      <Heart size={15} className={wishlisted ? "fill-current" : ""} />
    </button>
  );

  if (layout === "list") {
    return (
      <div className="group flex items-center gap-4 rounded-2xl border border-charcoal/10 bg-white p-3 sm:p-4">
        <Link
          href={href}
          className="relative block h-24 w-24 sm:h-28 sm:w-28 shrink-0 overflow-hidden rounded-xl bg-cream-dark"
        >
          <Image
            src={image}
            alt={name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="112px"
          />
        </Link>
        <div className="min-w-0 flex-1">
          <Link
            href={href}
            className="text-sm sm:text-base font-medium text-charcoal hover:text-terracotta-dark transition-colors"
          >
            {name}
          </Link>
          <p className="mt-1 text-sm font-semibold text-charcoal">
            ₹{price.toLocaleString("en-IN")}
          </p>
          {stars}
        </div>
        {wishlistButton}
      </div>
    );
  }

  return (
    <div className="group w-full">
      <div className="relative block aspect-square overflow-hidden rounded-2xl bg-cream-dark">
        <Link href={href} className="absolute inset-0">
          <Image
            src={image}
            alt={name}
            fill
            priority={priority}
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(min-width: 1024px) 19vw, 45vw"
          />
        </Link>
        <div className="absolute top-3 right-3">{wishlistButton}</div>
        {badge && (
          <span className="absolute bottom-3 left-3 rounded-full bg-charcoal/90 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-cream">
            {badge}
          </span>
        )}
      </div>
      <div className="mt-3">
        <Link
          href={href}
          className="text-sm font-medium text-charcoal hover:text-terracotta-dark transition-colors"
        >
          {name}
        </Link>
        <p className="mt-1 text-sm font-semibold text-charcoal">
          ₹{price.toLocaleString("en-IN")}
        </p>
        {stars}
      </div>
    </div>
  );
}
