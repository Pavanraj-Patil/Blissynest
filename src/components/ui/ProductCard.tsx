"use client";

import Link from "next/link";
import { Heart, Star } from "lucide-react";
import { cn } from "@/lib/cn";
import { useWishlist } from "@/lib/wishlist-context";
import { FadeImage } from "@/components/ui/FadeImage";

type ProductCardProps = {
  name: string;
  price: number;
  rating: number;
  reviews: number;
  image: string;
  href?: string;
  priority?: boolean;
  badge?: string;
  inStock?: boolean;
};

export function ProductCard({
  name,
  price,
  rating,
  reviews,
  image,
  href = "#",
  priority = false,
  badge,
  inStock = true,
}: ProductCardProps) {
  const { isWishlisted, toggleItem } = useWishlist();
  const slug = href.replace(/^\/product\//, "");
  const wishlisted = isWishlisted(slug);

  // No stars until there are real reviews — an empty "(0)" row would only
  // advertise that nobody has bought this yet.
  const stars =
    reviews > 0 ? (
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
  ) : null;

  const wishlistButton = (
    <button
      type="button"
      aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
      aria-pressed={wishlisted}
      onClick={(e) => {
        e.preventDefault();
        toggleItem({ slug, name, price, image, rating, reviews });
      }}
      className={cn(
        "flex h-9 w-9 items-center justify-center rounded-full bg-white/90 shadow-sm transition-colors shrink-0",
        wishlisted
          ? "text-terracotta-dark"
          : "text-charcoal hover:text-terracotta-dark"
      )}
    >
      <Heart size={15} className={wishlisted ? "fill-current" : ""} />
    </button>
  );

  return (
    <div className="group w-full">
      <div className="relative block aspect-square overflow-hidden rounded-2xl bg-cream-dark">
        <Link href={href} className="absolute inset-0">
          <FadeImage
            src={image}
            alt={name}
            fill
            priority={priority}
            className={cn(
              "object-cover transition-[opacity,transform] duration-500 group-hover:scale-105",
              !inStock && "opacity-50"
            )}
            sizes="(min-width: 1024px) 19vw, 45vw"
          />
        </Link>
        <div className="absolute top-3 right-3">{wishlistButton}</div>
        {!inStock ? (
          <span className="absolute bottom-3 left-3 rounded-full bg-terracotta-dark px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-cream">
            Out of Stock
          </span>
        ) : (
          badge && (
            <span className="absolute bottom-3 left-3 rounded-full bg-charcoal/90 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-cream">
              {badge}
            </span>
          )
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
