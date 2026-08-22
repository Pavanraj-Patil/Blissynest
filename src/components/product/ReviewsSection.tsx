import { Star, BadgeCheck } from "lucide-react";
import { getRatingBreakdown, type ProductReview } from "@/lib/product-mock-data";

type ReviewsSectionProps = {
  rating: number;
  reviewCount: number;
  reviews: ProductReview[];
};

function Stars({ value, size = 14 }: { value: number; size?: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={size}
          className={
            i < value ? "fill-gold text-gold" : "fill-charcoal/15 text-charcoal/15"
          }
        />
      ))}
    </div>
  );
}

export function ReviewsSection({ rating, reviewCount, reviews }: ReviewsSectionProps) {
  const breakdown = getRatingBreakdown(rating);

  return (
    <div>
      <h2 className="font-serif text-2xl text-charcoal mb-6">Customer Reviews</h2>

      <div className="flex flex-col sm:flex-row gap-8 sm:gap-14 pb-8 border-b border-charcoal/10">
        <div className="flex sm:flex-col items-center sm:items-start gap-3 sm:gap-2 shrink-0">
          <span className="text-4xl font-semibold text-charcoal">
            {rating.toFixed(1)}
          </span>
          <div>
            <Stars value={Math.round(rating)} size={16} />
            <p className="text-xs text-ink-muted mt-1">
              Based on {reviewCount} ratings
            </p>
          </div>
        </div>

        <div className="flex-1 max-w-sm space-y-1.5">
          {breakdown.map((row) => (
            <div key={row.stars} className="flex items-center gap-2.5">
              <span className="w-3 text-xs text-charcoal-light">{row.stars}</span>
              <Star size={11} className="fill-gold text-gold shrink-0" />
              <div className="flex-1 h-1.5 rounded-full bg-charcoal/10 overflow-hidden">
                <div
                  className="h-full rounded-full bg-gold"
                  style={{ width: `${row.pct}%` }}
                />
              </div>
              <span className="w-8 text-right text-xs text-ink-muted">
                {row.pct}%
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6 pt-8">
        {reviews.map((review, i) => (
          <div key={i}>
            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-cream-dark text-sm font-semibold text-charcoal">
                {review.name.charAt(0)}
              </span>
              <div>
                <p className="flex items-center gap-1.5 text-sm font-medium text-charcoal">
                  {review.name}
                  {review.verified && (
                    <span className="flex items-center gap-1 text-xs font-normal text-olive">
                      <BadgeCheck size={13} />
                      Verified
                    </span>
                  )}
                </p>
                <div className="flex items-center gap-2 mt-0.5">
                  <Stars value={review.rating} />
                  <span className="text-xs text-ink-muted">{review.date}</span>
                </div>
              </div>
            </div>
            <p className="mt-2.5 text-sm text-charcoal-light leading-relaxed">
              {review.comment}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
