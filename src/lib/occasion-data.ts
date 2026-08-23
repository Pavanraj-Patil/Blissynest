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
  Briefcase,
  type LucideIcon,
} from "lucide-react";
import type { AudienceSlug } from "@/lib/shop-mock-data";
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
  colleagues: "For Colleagues",
};

export const audiencePillIcons: Record<AudienceSlug, LucideIcon> = {
  her: Heart,
  him: User,
  parents: Home,
  couples: HeartHandshake,
  friends: Users,
  colleagues: Briefcase,
};

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
