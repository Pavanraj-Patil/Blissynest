"use client";

import { Heart } from "lucide-react";
import { cn } from "@/lib/cn";
import { useWishlist } from "@/lib/wishlist-context";

type PdpWishlistButtonProps = {
  slug: string;
  name: string;
  price: number;
  image: string;
  rating: number;
  reviews: number;
};

export function PdpWishlistButton({
  slug,
  name,
  price,
  image,
  rating,
  reviews,
}: PdpWishlistButtonProps) {
  const { isWishlisted, toggleItem } = useWishlist();
  const active = isWishlisted(slug);

  return (
    <button
      type="button"
      aria-label={active ? "Remove from wishlist" : "Add to wishlist"}
      aria-pressed={active}
      onClick={() => toggleItem({ slug, name, price, image, rating, reviews })}
      className={cn(
        "flex h-8 w-8 items-center justify-center rounded-full transition-colors",
        active
          ? "text-terracotta-dark"
          : "text-charcoal-light hover:text-terracotta-dark hover:bg-cream-dark"
      )}
    >
      <Heart size={16} className={active ? "fill-current" : ""} />
    </button>
  );
}
