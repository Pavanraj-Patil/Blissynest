import { Star } from "lucide-react";

type RatingStarsProps = {
  rating: number;
  reviews: number;
  size?: number;
};

export function RatingStars({ rating, reviews, size = 16 }: RatingStarsProps) {
  // Nothing to show until a real review exists.
  if (reviews <= 0) return null;

  return (
    <div className="flex items-center gap-1.5">
      <div className="flex items-center gap-0.5">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            size={size}
            className={
              i < rating
                ? "fill-gold text-gold"
                : "fill-charcoal/15 text-charcoal/15"
            }
          />
        ))}
      </div>
      <span className="text-sm text-ink-muted">({reviews} reviews)</span>
    </div>
  );
}
