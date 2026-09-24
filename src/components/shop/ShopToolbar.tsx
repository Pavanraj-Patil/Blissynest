"use client";

import { SlidersHorizontal } from "lucide-react";
import { SelectDropdown } from "@/components/ui/SelectDropdown";

export type SortOption =
  | "best-selling"
  | "price-asc"
  | "price-desc"
  | "rating"
  | "newest";

export const sortLabels: Record<SortOption, string> = {
  "best-selling": "Best Selling",
  "price-asc": "Price: Low to High",
  "price-desc": "Price: High to Low",
  rating: "Customer Rating",
  newest: "Newest",
};

type ShopToolbarProps = {
  resultCount: number;
  sort: SortOption;
  onSortChange: (sort: SortOption) => void;
  onOpenFilters: () => void;
  activeFilterCount: number;
};

export function ShopToolbar({
  resultCount,
  sort,
  onSortChange,
  onOpenFilters,
  activeFilterCount,
}: ShopToolbarProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-y-3 gap-x-2 sm:gap-x-4 py-4 border-b border-charcoal/10">
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        <button
          type="button"
          onClick={onOpenFilters}
          aria-label="Filter"
          className="lg:hidden inline-flex items-center gap-1.5 rounded-lg border border-charcoal/15 px-3 py-2.5 text-sm text-charcoal"
        >
          <SlidersHorizontal size={15} />
          <span className="hidden sm:inline">Filter</span>
          {activeFilterCount > 0 && (
            <span className="flex h-4 w-4 items-center justify-center rounded-full bg-terracotta text-[10px] font-semibold text-white">
              {activeFilterCount}
            </span>
          )}
        </button>
        <p className="text-sm text-ink-muted whitespace-nowrap">
          <span className="hidden sm:inline">{resultCount} products</span>
          <span className="sm:hidden">{resultCount} results</span>
        </p>
      </div>

      <div className="flex items-center gap-2 sm:gap-3 min-w-0">
        <SelectDropdown
          compact
          showPlaceholderOption={false}
          value={sort}
          onChange={(v) => onSortChange(v as SortOption)}
          options={(Object.keys(sortLabels) as SortOption[]).map((key) => ({
            value: key,
            label: sortLabels[key],
          }))}
          triggerClassName="max-w-[9rem] sm:max-w-none"
          panelClassName="right-0 left-auto"
        />
      </div>
    </div>
  );
}
