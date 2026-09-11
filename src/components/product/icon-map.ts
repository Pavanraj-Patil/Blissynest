import {
  ShieldCheck,
  Heart,
  PackageCheck,
  Lock,
  Flame,
  Coffee,
  Flower2,
  Droplet,
  Mail,
  Gift,
  Sparkles,
  MapPin,
  Weight,
  Clock,
  Truck,
  type LucideIcon,
} from "lucide-react";

export const iconMap: Record<string, LucideIcon> = {
  ShieldCheck,
  Heart,
  PackageCheck,
  Lock,
  Flame,
  Coffee,
  Flower2,
  Droplet,
  Mail,
  Gift,
  Sparkles,
  MapPin,
  Weight,
  Clock,
  Truck,
};

// `name` is only ever "" when an admin deliberately picked the spec-icon
// field's "None" option (see RepeatingListField's select kind) — an
// intentional "no icon here" choice, so this returns null instead of
// silently falling back to a default icon. An unrecognized non-empty name
// still falls back to Gift.
export function getIcon(name: string): LucideIcon | null {
  if (!name) return null;
  return iconMap[name] ?? Gift;
}
