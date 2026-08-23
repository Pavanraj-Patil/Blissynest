"use client";

import { SlidersHorizontal, LayoutGrid, List } from "lucide-react";
import { cn } from "@/lib/cn";
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
  view: "grid" | "list";
  onViewChange: (view: "grid" | "list") => void;
  onOpenFilters: () => void;
  activeFilterCount: number;
};

export function ShopToolbar({
  resultCount,
  sort,
  onSortChange,
  view,
  onViewChange,
  onOpenFilters,
  activeFilterCount,
}: ShopToolbarProps) {
  return (
    <div className="flex items-center justify-between gap-4 py-4 border-b border-charcoal/10">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onOpenFilters}
          className="lg:hidden inline-flex items-center gap-2 rounded-lg border border-charcoal/15 px-3.5 py-2.5 text-sm text-charcoal"
        >
          <SlidersHorizontal size={15} />
          Filter
          {activeFilterCount > 0 && (
            <span className="flex h-4 w-4 items-center justify-center rounded-full bg-terracotta text-[10px] font-semibold text-white">
              {activeFilterCount}
            </span>
          )}
        </button>
        <p className="text-sm text-ink-muted">
          <span className="hidden sm:inline">{resultCount} products</span>
          <span className="sm:hidden">{resultCount} results</span>
        </p>
      </div>

      <div className="flex items-center gap-3">
        <SelectDropdown
          compact
          showPlaceholderOption={false}
          value={sort}
          onChange={(v) => onSortChange(v as SortOption)}
          options={(Object.keys(sortLabels) as SortOption[]).map((key) => ({
            value: key,
            label: sortLabels[key],
          }))}
          triggerClassName="max-w-[7.5rem] sm:max-w-none"
          panelClassName="right-0 left-auto"
        />

        <div className="flex items-center rounded-lg border border-charcoal/15 overflow-hidden">
          <button
            type="button"
            aria-label="Grid view"
            aria-pressed={view === "grid"}
            onClick={() => onViewChange("grid")}
            className={cn(
              "p-2.5",
              view === "grid" ? "bg-charcoal text-cream" : "text-charcoal-light"
            )}
          >
            <LayoutGrid size={16} />
          </button>
          <button
            type="button"
            aria-label="List view"
            aria-pressed={view === "list"}
            onClick={() => onViewChange("list")}
            className={cn(
              "p-2.5",
              view === "list" ? "bg-charcoal text-cream" : "text-charcoal-light"
            )}
          >
            <List size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
