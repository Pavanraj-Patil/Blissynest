import Image from "next/image";
import Link from "next/link";
import { Heart, Star } from "lucide-react";

type ProductCardProps = {
  name: string;
  price: number;
  rating: number;
  reviews: number;
  image: string;
};

export function ProductCard({
  name,
  price,
  rating,
  reviews,
  image,
}: ProductCardProps) {
  return (
    <div className="group shrink-0 w-[190px] sm:w-auto">
      <Link href="#" className="relative block aspect-square overflow-hidden rounded-2xl bg-cream-dark">
        <Image
          src={image}
          alt={name}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="(min-width: 1024px) 19vw, 45vw"
        />
        <button
          aria-label="Add to wishlist"
          className="absolute top-3 right-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-charcoal hover:text-terracotta-dark shadow-sm transition-colors"
        >
          <Heart size={15} />
        </button>
      </Link>
      <div className="mt-3">
        <Link href="#" className="text-sm font-medium text-charcoal hover:text-terracotta-dark transition-colors">
          {name}
        </Link>
        <p className="mt-1 text-sm font-semibold text-charcoal">
          ₹{price.toLocaleString("en-IN")}
        </p>
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
      </div>
    </div>
  );
}
