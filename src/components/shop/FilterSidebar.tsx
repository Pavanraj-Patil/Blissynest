"use client";

import { useState, type ReactNode } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { PriceRangeSlider } from "./PriceRangeSlider";

type CountedOption = { label: string; count: number };

type FilterSidebarProps = {
  priceBounds: { min: number; max: number; step: number };
  priceMin: number;
  priceMax: number;
  onPriceChange: (min: number, max: number) => void;

  occasions?: CountedOption[];
  selectedOccasions?: string[];
  onToggleOccasion?: (label: string) => void;

  recipients: CountedOption[];
  selectedRecipients: string[];
  onToggleRecipient: (label: string) => void;

  onClearAll: () => void;
  compact?: boolean;
};

function Section({
  title,
  children,
  collapsible = true,
  defaultOpen = true,
}: {
  title: string;
  children: ReactNode;
  collapsible?: boolean;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="py-5 border-b border-charcoal/10 last:border-b-0">
      <button
        type="button"
        onClick={() => collapsible && setOpen((v) => !v)}
        className="flex w-full items-center justify-between text-sm font-semibold text-charcoal"
      >
        {title}
        {collapsible &&
          (open ? (
            <ChevronUp size={16} className="text-charcoal/50" />
          ) : (
            <ChevronDown size={16} className="text-charcoal/50" />
          ))}
      </button>
      {open && <div className="mt-4">{children}</div>}
    </div>
  );
}

function CheckboxRow({
  label,
  count,
  checked,
  onChange,
}: {
  label: string;
  count: number;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <label className="flex items-center justify-between gap-2 py-1.5 cursor-pointer group">
      <span className="flex items-center gap-2.5">
        <input
          type="checkbox"
          checked={checked}
          onChange={onChange}
          className="h-4 w-4 rounded border-charcoal/25 text-olive accent-olive"
        />
        <span className="text-sm text-charcoal-light group-hover:text-charcoal transition-colors">
          {label}
        </span>
      </span>
      <span className="text-xs text-ink-muted">({count})</span>
    </label>
  );
}

function ShowMoreList<T extends { label: string; count: number }>({
  items,
  visibleCount,
  selected,
  onToggle,
}: {
  items: T[];
  visibleCount: number;
  selected: string[];
  onToggle: (label: string) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const shown = expanded ? items : items.slice(0, visibleCount);
  const remaining = items.length - visibleCount;

  return (
    <div>
      {shown.map((item) => (
        <CheckboxRow
          key={item.label}
          label={item.label}
          count={item.count}
          checked={selected.includes(item.label)}
          onChange={() => onToggle(item.label)}
        />
      ))}
      {!expanded && remaining > 0 && (
        <button
          type="button"
          onClick={() => setExpanded(true)}
          className="mt-1.5 text-xs font-medium text-terracotta-dark hover:text-terracotta transition-colors"
        >
          + {remaining} more
        </button>
      )}
    </div>
  );
}

export function FilterSidebar({
  priceBounds,
  priceMin,
  priceMax,
  onPriceChange,
  occasions,
  selectedOccasions,
  onToggleOccasion,
  recipients,
  selectedRecipients,
  onToggleRecipient,
  onClearAll,
  compact = false,
}: FilterSidebarProps) {
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

      {occasions && occasions.length > 0 && onToggleOccasion && (
        <Section title="Occasion" defaultOpen={!compact}>
          <ShowMoreList
            items={occasions}
            visibleCount={4}
            selected={selectedOccasions ?? []}
            onToggle={onToggleOccasion}
          />
        </Section>
      )}

      <Section title="Recipient" defaultOpen={!compact}>
        <ShowMoreList
          items={recipients}
          visibleCount={4}
          selected={selectedRecipients}
          onToggle={onToggleRecipient}
        />
      </Section>
    </div>
  );
}
