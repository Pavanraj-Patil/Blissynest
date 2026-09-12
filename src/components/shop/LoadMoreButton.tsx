"use client";

import { ChevronDown } from "lucide-react";

export function LoadMoreButton({
  onClick,
  hasMore,
  shownCount,
  totalCount,
}: {
  onClick: () => void;
  hasMore: boolean;
  shownCount: number;
  totalCount: number;
}) {
  if (!hasMore) return null;

  const progress = totalCount > 0 ? Math.min(100, (shownCount / totalCount) * 100) : 0;

  return (
    <div className="flex flex-col items-center gap-4 pt-4 pb-2">
      <div className="flex w-full max-w-[220px] flex-col items-center gap-2">
        <div className="h-1 w-full overflow-hidden rounded-full bg-charcoal/10">
          <div
            className="h-full rounded-full bg-gradient-to-r from-terracotta to-gold transition-[width] duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-xs text-ink-muted">
          Showing <span className="font-medium text-charcoal">{shownCount}</span> of {totalCount}
        </p>
      </div>

      <button
        type="button"
        onClick={onClick}
        className="group inline-flex items-center gap-2 rounded-full border border-terracotta bg-terracotta px-8 py-3 text-xs font-semibold tracking-[0.12em] uppercase text-cream shadow-sm transition-all duration-200 hover:bg-terracotta-dark hover:border-terracotta-dark hover:shadow-md active:scale-[0.97]"
      >
        Show More
        <ChevronDown className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-y-0.5" />
      </button>
    </div>
  );
}
