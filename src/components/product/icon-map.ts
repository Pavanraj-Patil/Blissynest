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

export function getIcon(name: string): LucideIcon {
  return iconMap[name] ?? Gift;
}
