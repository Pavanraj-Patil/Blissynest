import {
  Cake,
  Heart,
  Gem,
  Home,
  Mail,
  Sparkles,
  Flame,
  Gift,
  PackageCheck,
  Wand2,
  Truck,
  Users,
  Briefcase,
  PartyPopper,
  PackageOpen,
  CalendarDays,
  Clock,
  MapPin,
  RotateCcw,
  Ban,
  Wallet,
  MessageCircle,
  PackageSearch,
  HelpCircle,
  Phone,
  type LucideIcon,
} from "lucide-react";

// Shared icon key registry for content-block LIST fields that need an
// icon per row (occasion tiles, feature strip, corporate checklist).
// Separate from src/components/product/icon-map.ts, which is
// Product-specs-specific — keeping each feature's icon set small and
// purpose-built rather than one giant shared map every feature drags in.
export const contentIconMap: Record<string, LucideIcon> = {
  Cake,
  Heart,
  Gem,
  Home,
  Mail,
  Sparkles,
  Flame,
  Gift,
  PackageCheck,
  Wand2,
  Truck,
  Users,
  Briefcase,
  PartyPopper,
  PackageOpen,
  CalendarDays,
  Clock,
  MapPin,
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
  return contentIconMap[key] ?? Gift;
}
