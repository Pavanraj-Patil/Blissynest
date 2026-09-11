import {
  Cake,
  Gem,
  Home,
  Wand2,
  Users,
  Briefcase,
  PartyPopper,
  PackageOpen,
  CalendarDays,
  RotateCcw,
  Ban,
  Wallet,
  MessageCircle,
  PackageSearch,
  HelpCircle,
  Phone,
  type LucideIcon,
} from "lucide-react";
import { iconMap } from "@/components/product/icon-map";

// Shared icon key registry for content-block LIST fields that need an
// icon per row (occasion tiles, feature strip, corporate checklist).
// Builds on src/components/product/icon-map.ts's set rather than
// redeclaring the icons the two features have in common.
export const contentIconMap: Record<string, LucideIcon> = {
  ...iconMap,
  Cake,
  Gem,
  Home,
  Wand2,
  Users,
  Briefcase,
  PartyPopper,
  PackageOpen,
  CalendarDays,
  RotateCcw,
  Ban,
  Wallet,
  MessageCircle,
  PackageSearch,
  HelpCircle,
  Phone,
};

export const contentIconOptions = Object.keys(contentIconMap);

// `key` is only ever "" when an admin deliberately picked the icon field's
// "None" option (see RepeatingListField's select kind) — that's an
// intentional "no icon here" choice, not a broken/legacy value, so it
// returns null rather than silently falling back to a default icon.
// Anything else unrecognized (a genuinely stale/renamed key) still falls
// back to Gift so old content doesn't go icon-less by accident.
export function getContentIcon(key: string): LucideIcon | null {
  if (!key) return null;
  return contentIconMap[key] ?? contentIconMap.Gift;
}
