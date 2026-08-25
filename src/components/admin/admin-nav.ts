import type { LucideIcon } from "lucide-react";
import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  Tag,
  Image as ImageIcon,
  Users,
  Star,
  Building2,
  Mail,
  Send,
  Settings,
  FileText,
} from "lucide-react";

export type AdminNavItem = { label: string; href: string; icon: LucideIcon };
export type AdminNavSection = { title: string; items: AdminNavItem[] };

// Every entry here maps to a real Prisma model — no section exists for
// something this app doesn't actually track yet (email campaigns, returns,
// and abandoned-cart recovery all have no backing data model, so they're
// not in this list rather than being dead-end stubs).
export const adminNavSections: AdminNavSection[] = [
  {
    title: "Orders",
    items: [{ label: "Orders", href: "/admin/orders", icon: ShoppingBag }],
  },
  {
    title: "Catalogue",
    items: [
      { label: "Products", href: "/admin/products", icon: Package },
      { label: "Coupons", href: "/admin/coupons", icon: Tag },
    ],
  },
  {
    title: "Marketing",
    items: [
      { label: "Banners", href: "/admin/banners", icon: ImageIcon },
      { label: "Site Content", href: "/admin/content", icon: FileText },
    ],
  },
  {
    title: "Customers",
    items: [
      { label: "Customers", href: "/admin/customers", icon: Users },
      { label: "Reviews", href: "/admin/reviews", icon: Star },
    ],
  },
  {
    title: "Leads",
    items: [
      { label: "Corporate Leads", href: "/admin/leads/corporate", icon: Building2 },
      { label: "Contact Messages", href: "/admin/leads/contact", icon: Mail },
      { label: "Newsletter", href: "/admin/leads/newsletter", icon: Send },
    ],
  },
  {
    title: "Settings",
    items: [{ label: "Site Settings", href: "/admin/settings", icon: Settings }],
  },
];

export const dashboardNavItem: AdminNavItem = {
  label: "Dashboard",
  href: "/admin",
  icon: LayoutDashboard,
};
