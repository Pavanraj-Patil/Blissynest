"use client";

import Image from "next/image";
import { Gift, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/cn";
import { categoryIcons } from "@/lib/shop-mock-data";
import { getPillImage } from "@/lib/pill-images";
import { useSiteContent } from "@/lib/site-content-context";

type PillItem = { slug: string; label: string; icon?: LucideIcon };

type CategoryPillRowProps = {
  categories: PillItem[];
  selected: string | null;
  onSelect: (slug: string | null) => void;
  allIcon?: LucideIcon;
  // Which audience page the row is on ("him", "her"...), for the few pills
  // whose illustration differs by audience.
  scope?: string;
};

export function CategoryPillRow({
  categories,
  selected,
  onSelect,
  allIcon,
  scope,
}: CategoryPillRowProps) {
  const { categoryPillImages } = useSiteContent();

  const items: PillItem[] = [
    { slug: "all", label: "All", icon: allIcon },
    ...categories,
  ];

  return (
    <div className="flex items-start gap-3 sm:gap-6 overflow-x-auto scrollbar-none -mx-4 px-4 sm:mx-0 sm:px-0 pb-1">
      {items.map((item) => {
        const Icon = item.icon ?? categoryIcons[item.slug] ?? Gift;
        // A picture uploaded in Site Content wins over the built-in illustration.
        const picture = categoryPillImages[item.slug] || getPillImage(item.slug, scope);
        const isActive =
          item.slug === "all" ? selected === null : selected === item.slug;
        return (
          <button
            key={item.slug}
            type="button"
            onClick={() => onSelect(item.slug === "all" ? null : item.slug)}
            aria-pressed={isActive}
            className="group flex w-[84px] shrink-0 flex-col items-center gap-2 sm:w-[96px]"
          >
            <span
              className={cn(
                "relative flex h-[76px] w-[76px] items-center justify-center transition-transform duration-200 sm:h-[88px] sm:w-[88px]",
                "group-hover:-translate-y-0.5",
                isActive && "scale-105"
              )}
            >
              {picture ? (
                <Image src={picture} alt="" fill className="object-contain" sizes="88px" />
              ) : (
                <span
                  className={cn(
                    "flex h-16 w-16 items-center justify-center rounded-full border transition-colors sm:h-[72px] sm:w-[72px]",
                    isActive
                      ? "border-terracotta bg-terracotta/10 text-terracotta"
                      : "border-charcoal/15 bg-cream-dark text-charcoal-light"
                  )}
                >
                  <Icon size={24} strokeWidth={1.5} />
                </span>
              )}
            </span>
            <span
              className={cn(
                "rounded-full px-2.5 py-0.5 text-center text-xs font-medium leading-tight transition-colors",
                isActive ? "bg-terracotta text-cream" : "text-charcoal-light group-hover:text-charcoal"
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
