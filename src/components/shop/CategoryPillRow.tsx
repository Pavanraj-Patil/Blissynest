import { Gift, Flower2, Heart, Crown, Home, Droplet, Gem, Plus, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/cn";

const categoryIcons: Record<string, LucideIcon> = {
  all: Gift,
  "self-care": Flower2,
  personalised: Heart,
  "luxury-edit": Crown,
  "home-living": Home,
  beauty: Droplet,
  jewellery: Gem,
  "add-ons": Plus,
};

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
  const items: PillItem[] = [
    { slug: "all", label: "All", icon: allIcon },
    ...categories,
  ];

  return (
    <div className="flex gap-5 sm:gap-8 overflow-x-auto scrollbar-none -mx-4 px-4 sm:mx-0 sm:px-0">
      {items.map((item) => {
        const Icon = item.icon ?? categoryIcons[item.slug] ?? Gift;
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
                "flex h-14 w-14 items-center justify-center rounded-full border transition-colors",
                isActive
                  ? "border-terracotta text-terracotta bg-terracotta/10"
                  : "border-charcoal/15 text-charcoal-light hover:border-charcoal/30"
              )}
            >
              <Icon size={22} strokeWidth={1.5} />
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
