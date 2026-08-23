"use client";

import { cn } from "@/lib/cn";
import { PriceRangeSlider } from "@/components/shop/PriceRangeSlider";
import { Section, ShowMoreList } from "@/components/shop/FilterSidebar";

type CountedOption = { label: string; count: number };
type CountedCategory = { slug: string; label: string; count: number };

type CollectionFilterSidebarProps = {
  categories: CountedCategory[];
  selectedCategory: string | null;
  onSelectCategory: (slug: string | null) => void;

  priceBounds: { min: number; max: number; step: number };
  priceMin: number;
  priceMax: number;
  onPriceChange: (min: number, max: number) => void;

  attributeLabel?: string;
  attributes?: CountedOption[];
  selectedAttributes?: string[];
  onToggleAttribute?: (label: string) => void;

  occasions: CountedOption[];
  selectedOccasions: string[];
  onToggleOccasion: (label: string) => void;

  onClearAll: () => void;
  compact?: boolean;
};

function CategoryRow({
  label,
  count,
  active,
  onClick,
}: {
  label: string;
  count: number;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex w-full items-center justify-between gap-2 rounded-lg px-2.5 py-2 text-sm transition-colors",
        active
          ? "bg-olive/10 text-olive-dark font-medium"
          : "text-charcoal-light hover:bg-charcoal/5"
      )}
    >
      <span>{label}</span>
      <span className="text-xs text-ink-muted">({count})</span>
    </button>
  );
}

export function CollectionFilterSidebar({
  categories,
  selectedCategory,
  onSelectCategory,
  priceBounds,
  priceMin,
  priceMax,
  onPriceChange,
  attributeLabel,
  attributes,
  selectedAttributes,
  onToggleAttribute,
  occasions,
  selectedOccasions,
  onToggleOccasion,
  onClearAll,
  compact = false,
}: CollectionFilterSidebarProps) {
  const totalCount = categories.reduce((sum, c) => sum + c.count, 0);

  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <h2 className="font-serif text-lg text-charcoal">Filters</h2>
        <button
          type="button"
          onClick={onClearAll}
          className="text-xs font-medium text-terracotta-dark hover:text-terracotta transition-colors"
        >
          Clear all
        </button>
      </div>

      <Section title="Category" defaultOpen={!compact}>
        <div className="flex flex-col gap-0.5">
          <CategoryRow
            label="All Products"
            count={totalCount}
            active={selectedCategory === null}
            onClick={() => onSelectCategory(null)}
          />
          {categories.map((cat) => (
            <CategoryRow
              key={cat.slug}
              label={cat.label}
              count={cat.count}
              active={selectedCategory === cat.slug}
              onClick={() => onSelectCategory(cat.slug)}
            />
          ))}
        </div>
      </Section>

      <Section title="Price Range" collapsible={false}>
        <PriceRangeSlider
          min={priceBounds.min}
          max={priceBounds.max}
          step={priceBounds.step}
          valueMin={priceMin}
          valueMax={priceMax}
          onChange={onPriceChange}
        />
      </Section>

      {attributeLabel && attributes && attributes.length > 0 && onToggleAttribute && (
        <Section title={attributeLabel} defaultOpen={!compact}>
          <ShowMoreList
            items={attributes}
            visibleCount={5}
            selected={selectedAttributes ?? []}
            onToggle={onToggleAttribute}
          />
        </Section>
      )}

      <Section title="Occasion" defaultOpen={!compact}>
        <ShowMoreList
          items={occasions}
          visibleCount={4}
          selected={selectedOccasions}
          onToggle={onToggleOccasion}
        />
      </Section>
    </div>
  );
}
