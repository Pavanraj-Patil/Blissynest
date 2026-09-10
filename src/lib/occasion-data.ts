import {
  Cake,
  Heart,
  Gem,
  Home,
  Mail,
  Sparkles,
  Flame,
  User,
  HeartHandshake,
  Users,
  Baby,
  type LucideIcon,
} from "lucide-react";
import { categoryIcons, type AudienceSlug } from "@/lib/shop-mock-data";
import { slugify } from "@/lib/slugify";

export type OccasionSlug =
  | "birthday"
  | "anniversary"
  | "wedding"
  | "housewarming"
  | "thank-you"
  | "just-because"
  | "festivals";

export const occasionSlugs: OccasionSlug[] = [
  "birthday",
  "anniversary",
  "wedding",
  "housewarming",
  "thank-you",
  "just-because",
  "festivals",
];

export type OccasionContent = {
  label: string;
  title: string;
  subtitle: string;
  breadcrumbLabel: string;
  icon: LucideIcon;
};

export const occasionContent: Record<OccasionSlug, OccasionContent> = {
  birthday: {
    label: "Birthday",
    title: "Birthday Gifts",
    subtitle:
      "Thoughtful gifts to make their birthday as special and unforgettable as they are.",
    breadcrumbLabel: "Birthday Gifts",
    icon: Cake,
  },
  anniversary: {
    label: "Anniversary",
    title: "Anniversary Gifts",
    subtitle:
      "Romantic gifts to celebrate their love story, one beautiful year at a time.",
    breadcrumbLabel: "Anniversary Gifts",
    icon: Heart,
  },
  wedding: {
    label: "Wedding",
    title: "Wedding Gifts",
    subtitle: "Timeless gifts to celebrate the beginning of their forever.",
    breadcrumbLabel: "Wedding Gifts",
    icon: Gem,
  },
  housewarming: {
    label: "Housewarming",
    title: "Housewarming Gifts",
    subtitle:
      "Thoughtful gifts to welcome them home and make it feel like theirs.",
    breadcrumbLabel: "Housewarming Gifts",
    icon: Home,
  },
  "thank-you": {
    label: "Thank You",
    title: "Thank You Gifts",
    subtitle: "Heartfelt gifts to say thank you, beautifully.",
    breadcrumbLabel: "Thank You Gifts",
    icon: Mail,
  },
  "just-because": {
    label: "Just Because",
    title: "Just Because Gifts",
    subtitle: "No reason needed — thoughtful gifts for absolutely any moment.",
    breadcrumbLabel: "Just Because Gifts",
    icon: Sparkles,
  },
  festivals: {
    label: "Festivals",
    title: "Festival Gifts",
    subtitle:
      "Festive gifts to celebrate the season and the people who make it special.",
    breadcrumbLabel: "Festival Gifts",
    icon: Flame,
  },
};

export function isOccasionSlug(value: string): value is OccasionSlug {
  return (occasionSlugs as string[]).includes(value);
}

export const audiencePillLabels: Record<AudienceSlug, string> = {
  her: "For Her",
  him: "For Him",
  parents: "For Parents",
  couples: "For Couples",
  friends: "For Friends",
};

export const audiencePillIcons: Record<AudienceSlug, LucideIcon> = {
  her: Heart,
  him: User,
  parents: Home,
  couples: HeartHandshake,
  friends: Users,
};

export type OccasionPillFilter = {
  type: "audience" | "category" | "recipient";
  value: string;
  label: string;
};

/**
 * "recipient"-type pills group one or more existing `product.recipients`
 * tags under one label — e.g. "For Kids" matches products already tagged
 * "Son" or "Daughter" (real tags used across the her/him audience catalog),
 * not a fabricated audience with no backing products.
 */
export const recipientPillGroups: Record<string, string[]> = {
  kids: ["Son", "Daughter"],
};

export const recipientPillIcons: Record<string, LucideIcon> = {
  kids: Baby,
};

/**
 * Which quick-filter pills make sense per occasion, and why they differ:
 * - Birthday & Just Because apply broadly across relationships, so they keep
 *   most/all audiences. Birthday also adds "For Kids" (recipient-type, see
 *   above) since kids' birthdays are one of the most common real cases.
 * - Anniversary & Wedding are inherently couple-centric — the Friends pill
 *   is dropped (its products still show under "All" if tagged, just not
 *   offered as a dedicated quick filter).
 * - Housewarming is about the *space*, not the relationship, so it swaps to
 *   product-type categories (Home & Living, Self Care, Personalised) instead
 *   of audiences.
 * - Thank You & Festivals skew toward Friends/Family, matching how those
 *   occasions are actually gifted.
 * Every pill maps to a real, existing product field (audience, category, or
 * recipient tag) — nothing here is a fabricated bucket with fake counts.
 */
export const occasionPills: Record<OccasionSlug, OccasionPillFilter[]> = {
  birthday: [
    { type: "audience", value: "her", label: "For Her" },
    { type: "audience", value: "him", label: "For Him" },
    { type: "recipient", value: "kids", label: "For Kids" },
    { type: "audience", value: "friends", label: "For Friends" },
    { type: "audience", value: "parents", label: "For Parents" },
    { type: "category", value: "luxury-edit", label: "Luxury Edit" },
  ],
  anniversary: [
    { type: "audience", value: "couples", label: "For Couples" },
    { type: "audience", value: "her", label: "For Her" },
    { type: "audience", value: "him", label: "For Him" },
    { type: "audience", value: "parents", label: "For Parents" },
    { type: "category", value: "luxury-edit", label: "Luxury Edit" },
    { type: "category", value: "add-ons", label: "Add-ons" },
  ],
  wedding: [
    { type: "audience", value: "couples", label: "For Couples" },
    { type: "audience", value: "her", label: "For Her" },
    { type: "audience", value: "him", label: "For Him" },
    { type: "audience", value: "friends", label: "For Friends" },
    { type: "category", value: "luxury-edit", label: "Luxury Edit" },
    { type: "category", value: "add-ons", label: "Add-ons" },
  ],
  housewarming: [
    { type: "category", value: "home-living", label: "Home & Living" },
    { type: "category", value: "self-care", label: "Self Care" },
    { type: "category", value: "personalised", label: "Personalised" },
    { type: "audience", value: "couples", label: "For Couples" },
    { type: "audience", value: "friends", label: "For Friends" },
    { type: "category", value: "add-ons", label: "Add-ons" },
  ],
  "thank-you": [
    { type: "audience", value: "friends", label: "For Friends" },
    { type: "audience", value: "her", label: "For Her" },
    { type: "audience", value: "him", label: "For Him" },
    { type: "category", value: "personalised", label: "Personalised" },
    { type: "category", value: "add-ons", label: "Add-ons" },
  ],
  "just-because": [
    { type: "audience", value: "her", label: "For Her" },
    { type: "audience", value: "him", label: "For Him" },
    { type: "audience", value: "parents", label: "For Parents" },
    { type: "audience", value: "couples", label: "For Couples" },
    { type: "audience", value: "friends", label: "For Friends" },
  ],
  festivals: [
    { type: "audience", value: "parents", label: "For Parents" },
    { type: "audience", value: "friends", label: "For Friends" },
    { type: "audience", value: "her", label: "For Her" },
    { type: "audience", value: "him", label: "For Him" },
    { type: "category", value: "add-ons", label: "Add-ons" },
  ],
};

export function getOccasionPillIcon(pill: OccasionPillFilter): LucideIcon {
  if (pill.type === "audience") return audiencePillIcons[pill.value as AudienceSlug];
  if (pill.type === "recipient") return recipientPillIcons[pill.value] ?? Baby;
  return categoryIcons[pill.value] ?? categoryIcons["add-ons"];
}

// Kept in sync with slugify(label) used by MadeForTheMoment's occasion cards.
export const occasionLabelBySlug: Record<OccasionSlug, string> = Object.fromEntries(
  occasionSlugs.map((slug) => [slug, occasionContent[slug].label])
) as Record<OccasionSlug, string>;

if (process.env.NODE_ENV !== "production") {
  occasionSlugs.forEach((slug) => {
    const expected = slugify(occasionContent[slug].label);
    if (expected !== slug) {
      throw new Error(
        `occasion-data: slug "${slug}" doesn't match slugify(label) "${expected}"`
      );
    }
  });
}
