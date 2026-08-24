import {
  Flame,
  Gem,
  PartyPopper,
  Gift,
  Sparkles,
  Heart,
  Star,
  Snowflake,
  Sun,
  Leaf,
  type LucideIcon,
} from "lucide-react";

// A curated set rather than a free-text icon name, so the admin banner form
// is a dropdown (guaranteed to render something) instead of a text field
// that could reference an icon that doesn't exist.
export const bannerIcons: Record<string, LucideIcon> = {
  flame: Flame,
  gem: Gem,
  "party-popper": PartyPopper,
  gift: Gift,
  sparkles: Sparkles,
  heart: Heart,
  star: Star,
  snowflake: Snowflake,
  sun: Sun,
  leaf: Leaf,
};

export const bannerIconOptions = Object.keys(bannerIcons) as (keyof typeof bannerIcons)[];

export function getBannerIcon(key: string): LucideIcon {
  return bannerIcons[key] ?? Sparkles;
}

// Same reasoning as the icon map — a handful of named presets instead of
// exposing raw Tailwind gradient classes in a text field.
export const bannerGradients: Record<string, { label: string; classes: string }> = {
  terracotta: { label: "Terracotta", classes: "from-terracotta-dark to-terracotta" },
  "charcoal-olive": { label: "Charcoal → Olive", classes: "from-charcoal to-olive-dark" },
  olive: { label: "Olive", classes: "from-olive-dark to-olive" },
  gold: { label: "Gold", classes: "from-gold to-terracotta-light" },
  charcoal: { label: "Charcoal", classes: "from-charcoal to-charcoal-light" },
};

export const bannerGradientOptions = Object.keys(bannerGradients) as (keyof typeof bannerGradients)[];

export function getBannerGradientClasses(key: string): string {
  return bannerGradients[key]?.classes ?? bannerGradients.olive.classes;
}
