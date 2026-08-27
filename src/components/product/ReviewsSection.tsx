import { Star, BadgeCheck, MessageSquareText } from "lucide-react";
import type { ApprovedReview } from "@/lib/review-service";

type ReviewsSectionProps = {
  reviews: ApprovedReview[];
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

export function ReviewsSection({ reviews }: ReviewsSectionProps) {
  return (
    <div>
      <h2 className="font-serif text-2xl text-charcoal mb-6">Customer Reviews</h2>

      {reviews.length === 0 ? (
        <div className="flex flex-col items-center rounded-2xl border border-charcoal/10 bg-cream-dark/40 px-6 py-10 text-center">
          <MessageSquareText size={28} className="text-charcoal/20" strokeWidth={1.5} />
          <p className="mt-3 text-sm text-charcoal">No reviews yet</p>
          <p className="mt-1 text-xs text-ink-muted max-w-xs">
            Be the first to share what you thought — reviews from customers who bought this
            show up here.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6">
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
      )}
    </div>
  );
}
