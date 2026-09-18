"use client";

import { useState } from "react";
import { Star, BadgeCheck, ArrowRight } from "lucide-react";
import type { ApprovedReview } from "@/lib/review-service";

type ReviewsSectionProps = {
  reviews: ApprovedReview[];
};

// Collapsed view caps at this many — below this count every review already
// fits, so the "See all" toggle would just add UI for nothing.
const PREVIEW_COUNT = 5;

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

function ReviewCard({ review }: { review: ApprovedReview }) {
  return (
    <div className="h-full rounded-2xl border border-charcoal/10 bg-white p-5">
      <div className="flex items-center gap-3">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-cream-dark text-sm font-semibold text-charcoal">
          {review.name.charAt(0)}
        </span>
        <div className="min-w-0">
          <p className="flex items-center gap-1.5 text-sm font-medium text-charcoal">
            <span className="truncate">{review.name}</span>
            {review.verified && (
              <span className="flex items-center gap-1 shrink-0 text-xs font-normal text-olive">
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
  );
}

export function ReviewsSection({ reviews }: ReviewsSectionProps) {
  const [showAll, setShowAll] = useState(false);

  if (reviews.length === 0) return null;

  const canExpand = reviews.length > PREVIEW_COUNT;

  return (
    <div className="mt-14">
      <div className="flex items-end justify-between gap-4 mb-6">
        <h2 className="font-serif text-2xl text-charcoal">
          Customer Reviews{" "}
          <span className="text-lg font-sans text-ink-muted">({reviews.length})</span>
        </h2>
        {canExpand && (
          <button
            type="button"
            onClick={() => setShowAll((v) => !v)}
            className="shrink-0 inline-flex items-center gap-1.5 text-sm font-medium text-charcoal hover:text-terracotta-dark transition-colors"
          >
            {showAll ? "Show less" : "See all"}
            <ArrowRight size={15} className={showAll ? "rotate-180" : ""} />
          </button>
        )}
      </div>

      {showAll ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-5">
          {reviews.map((review, i) => (
            <ReviewCard key={i} review={review} />
          ))}
        </div>
      ) : (
        <div className="flex gap-4 md:gap-5 overflow-x-auto scrollbar-none -mx-4 px-4 sm:mx-0 sm:px-0">
          {reviews.slice(0, PREVIEW_COUNT).map((review, i) => (
            <div key={i} className="shrink-0 w-[260px] sm:w-[280px]">
              <ReviewCard review={review} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
