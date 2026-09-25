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
  BookOpen,
  ShieldCheck,
} from "lucide-react";
import type { AdminPermission } from "@/lib/admin/permissions";

// The three nav items that carry a live "needs attention" count, fetched
// server-side in admin/layout.tsx and matched back to a nav item by this
// key — kept as a named type (not just `string`) so a typo here is a
// compile error, not a silently-missing badge.
export type AdminNavCountKey = "pendingReviews" | "newCorporateLeads" | "unreadContactMessages";
export type AdminNavCounts = Record<AdminNavCountKey, number>;

export type AdminNavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
  countKey?: AdminNavCountKey;
  // Which delegable permission unlocks this item — omitted means every
  // admin/super-admin can see it regardless of their permission set.
  permission?: AdminPermission;
  // Deliberately separate from `permission` — this item isn't part of the
  // delegable system at all (see requireSuperAdmin), so it's gated by role
  // directly rather than by anything a super admin could grant.
  superAdminOnly?: boolean;
};
export type AdminNavSection = { title: string; items: AdminNavItem[] };

// Every entry here maps to a real Prisma model — no section exists for
// something this app doesn't actually track yet (email campaigns, returns,
// and abandoned-cart recovery all have no backing data model, so they're
// not in this list rather than being dead-end stubs).
export const adminNavSections: AdminNavSection[] = [
  {
    title: "Orders",
    items: [{ label: "Orders", href: "/admin/orders", icon: ShoppingBag, permission: "orders" }],
  },
  {
    title: "Catalogue",
    items: [
      { label: "Products", href: "/admin/products", icon: Package, permission: "products" },
      { label: "Coupons", href: "/admin/coupons", icon: Tag, permission: "coupons" },
    ],
  },
  {
    title: "Marketing",
    items: [
      { label: "Banners", href: "/admin/banners", icon: ImageIcon, permission: "banners" },
      { label: "Site Content", href: "/admin/content", icon: FileText, permission: "content" },
      { label: "Journal", href: "/admin/journal", icon: BookOpen, permission: "content" },
    ],
  },
  {
    title: "Customers",
    items: [
      { label: "Customers", href: "/admin/customers", icon: Users, permission: "customers" },
      {
        label: "Reviews",
        href: "/admin/reviews",
        icon: Star,
        countKey: "pendingReviews",
        permission: "reviews",
      },
    ],
  },
  {
    title: "Leads",
    items: [
      {
        label: "Corporate Leads",
        href: "/admin/leads/corporate",
        icon: Building2,
        countKey: "newCorporateLeads",
        permission: "leads",
      },
      {
        label: "Contact Messages",
        href: "/admin/leads/contact",
        icon: Mail,
        countKey: "unreadContactMessages",
        permission: "leads",
      },
      { label: "Newsletter", href: "/admin/leads/newsletter", icon: Send, permission: "leads" },
    ],
  },
  {
    title: "Settings",
    items: [{ label: "Site Settings", href: "/admin/settings", icon: Settings, permission: "settings" }],
  },
  {
    title: "Team",
    items: [{ label: "Admins", href: "/admin/admins", icon: ShieldCheck, superAdminOnly: true }],
  },
];

export const dashboardNavItem: AdminNavItem = {
  label: "Dashboard",
  href: "/admin",
  icon: LayoutDashboard,
};
