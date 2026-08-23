"use client";

import type { ComponentProps } from "react";
import { X } from "lucide-react";
import { CollectionFilterSidebar } from "./CollectionFilterSidebar";

type SidebarProps = ComponentProps<typeof CollectionFilterSidebar>;

type CollectionMobileFilterDrawerProps = SidebarProps & {
  open: boolean;
  onClose: () => void;
  activeFilterCount: number;
};

export function CollectionMobileFilterDrawer({
  open,
  onClose,
  activeFilterCount,
  ...sidebarProps
}: CollectionMobileFilterDrawerProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      <div
        className="absolute inset-0 bg-charcoal/40"
        onClick={onClose}
        aria-hidden="true"
      />
      <div className="absolute inset-x-0 bottom-0 max-h-[88vh] flex flex-col rounded-t-3xl bg-white shadow-2xl">
        <div className="flex items-center justify-center pt-3">
          <span className="h-1.5 w-10 rounded-full bg-charcoal/15" />
        </div>
        <div className="flex items-center justify-between px-6 pt-3 pb-4 border-b border-charcoal/10">
          <h2 className="font-serif text-xl text-charcoal">Filters</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close filters"
            className="text-charcoal hover:text-terracotta-dark transition-colors"
          >
            <X size={22} />
          </button>
        </div>

        <div className="overflow-y-auto px-6 flex-1">
          <CollectionFilterSidebar {...sidebarProps} compact />
        </div>

        <div className="px-6 py-4 border-t border-charcoal/10 flex flex-col items-center gap-3">
          <button
            type="button"
            onClick={onClose}
            className="w-full inline-flex items-center justify-center rounded-xl bg-olive text-cream px-6 py-3.5 text-xs font-semibold tracking-[0.1em] uppercase hover:bg-olive-dark transition-colors"
          >
            Apply Filters {activeFilterCount > 0 ? `(${activeFilterCount})` : ""}
          </button>
          <button
            type="button"
            onClick={sidebarProps.onClearAll}
            className="text-xs font-medium text-terracotta-dark hover:text-terracotta transition-colors"
          >
            Clear All
          </button>
        </div>
      </div>
    </div>
  );
}
