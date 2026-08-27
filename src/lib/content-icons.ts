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

export function getContentIcon(key: string): LucideIcon {
  return contentIconMap[key] ?? contentIconMap.Gift;
}
