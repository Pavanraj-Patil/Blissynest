"use client";

import Image from "next/image";
import { Gift, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/cn";
import { categoryIcons } from "@/lib/shop-mock-data";
import { useSiteContent } from "@/lib/site-content-context";

type PillItem = { slug: string; label: string; icon?: LucideIcon };

type CategoryPillRowProps = {
  categories: PillItem[];
  selected: string | null;
  onSelect: (slug: string | null) => void;
  allIcon?: LucideIcon;
};

export function CategoryPillRow({
  categories,
  selected,
  onSelect,
  allIcon,
}: CategoryPillRowProps) {
  const { categoryPillImages } = useSiteContent();

  const items: PillItem[] = [
    { slug: "all", label: "All", icon: allIcon },
    ...categories,
  ];

  return (
    <div className="flex gap-5 sm:gap-8 overflow-x-auto scrollbar-none -mx-4 px-4 sm:mx-0 sm:px-0">
      {items.map((item) => {
        const Icon = item.icon ?? categoryIcons[item.slug] ?? Gift;
        const photo = categoryPillImages[item.slug];
        const isActive =
          item.slug === "all" ? selected === null : selected === item.slug;
        return (
          <button
            key={item.slug}
            type="button"
            onClick={() => onSelect(item.slug === "all" ? null : item.slug)}
            className="flex flex-col items-center gap-2 shrink-0"
          >
            <span
              className={cn(
                "relative flex h-14 w-14 items-center justify-center overflow-hidden rounded-full border transition-colors",
                isActive
                  ? "border-terracotta text-terracotta bg-terracotta/10"
                  : "border-charcoal/15 text-charcoal-light hover:border-charcoal/30"
              )}
            >
              {photo ? (
                <Image src={photo} alt="" fill className="object-cover" sizes="56px" />
              ) : (
                <Icon size={22} strokeWidth={1.5} />
              )}
            </span>
            <span
              className={cn(
                "text-xs font-medium whitespace-nowrap",
                isActive ? "text-terracotta-dark" : "text-charcoal-light"
              )}
            >
              {item.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
