import { Flame, Gem, PartyPopper, type LucideIcon } from "lucide-react";

export type SeasonalSlide = {
  id: string;
  title: string;
  subtitle: string;
  href: string;
  icon: LucideIcon;
  gradient: string;
};

/**
 * Rotating seasonal/festival promo slides shown in the SeasonalBanner on the
 * homepage. Swap or reorder these by hand as festivals/seasons change —
 * there's no CMS behind this, it's just a hand-curated list.
 */
export const seasonalSlides: SeasonalSlide[] = [
  {
    id: "diwali",
    title: "The Diwali Edit",
    subtitle: "Diyas, sweets, and hampers for the festival of light.",
    href: "/occasions/festivals",
    icon: Flame,
    gradient: "from-terracotta-dark to-terracotta",
  },
  {
    id: "wedding-season",
    title: "Wedding Season Is Here",
    subtitle: "Timeless gifts for every wedding on your calendar.",
    href: "/occasions/wedding",
    icon: Gem,
    gradient: "from-charcoal to-olive-dark",
  },
  {
    id: "new-year",
    title: "Ring In the New Year",
    subtitle: "Toast to fresh beginnings with something memorable.",
    href: "/occasions/festivals",
    icon: PartyPopper,
    gradient: "from-olive-dark to-olive",
  },
];
