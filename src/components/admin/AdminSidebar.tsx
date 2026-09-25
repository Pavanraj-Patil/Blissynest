"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { ExternalLink } from "lucide-react";
import { cn } from "@/lib/cn";
import { adminNavSections, dashboardNavItem, type AdminNavItem, type AdminNavCounts } from "./admin-nav";
import type { AdminAccess } from "@/lib/admin/require-admin";

function canSeeItem(item: AdminNavItem, access: AdminAccess): boolean {
  if (item.superAdminOnly) return access.role === "SUPER_ADMIN";
  if (!item.permission) return true;
  return access.role === "SUPER_ADMIN" || access.permissions.includes(item.permission);
}

function NavLink({ item, active, count }: { item: AdminNavItem; active: boolean; count?: number }) {
  return (
    <Link
      href={item.href}
      className={cn(
        "flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm transition-colors",
        active
          ? "bg-olive/10 text-olive-dark font-medium"
          : "text-charcoal-light hover:bg-charcoal/5 hover:text-charcoal"
      )}
    >
      <item.icon size={17} strokeWidth={1.75} />
      <span className="flex-1">{item.label}</span>
      {!!count && (
        <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-terracotta-dark px-1.5 text-[10px] font-semibold text-cream">
          {count > 99 ? "99+" : count}
        </span>
      )}
    </Link>
  );
}

function isActive(pathname: string, href: string): boolean {
  if (href === "/admin") return pathname === "/admin";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function AdminSidebar({
  onNavigate,
  counts,
  access,
}: {
  onNavigate?: () => void;
  counts?: AdminNavCounts;
  access: AdminAccess;
}) {
  const pathname = usePathname();
  const visibleSections = adminNavSections
    .map((section) => ({ ...section, items: section.items.filter((item) => canSeeItem(item, access)) }))
    .filter((section) => section.items.length > 0);

  return (
    <div className="flex h-full flex-col bg-cream-dark" onClick={onNavigate}>
      <div className="flex items-center gap-2 px-5 py-5">
        <Image src="/logo-mark.png" alt="" width={28} height={28} className="h-7 w-7" />
        <div>
          <p className="font-serif text-lg leading-tight text-charcoal">Blissynest</p>
          <p className="text-[10px] tracking-[0.15em] uppercase text-ink-muted">Admin</p>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 pb-4 space-y-5">
        <div>
          <NavLink item={dashboardNavItem} active={isActive(pathname, dashboardNavItem.href)} />
        </div>

        {visibleSections.map((section) => (
          <div key={section.title}>
            <p className="px-3 pb-1.5 text-[10px] font-semibold tracking-[0.12em] uppercase text-ink-muted">
              {section.title}
            </p>
            <div className="space-y-0.5">
              {section.items.map((item) => (
                <NavLink
                  key={item.href}
                  item={item}
                  active={isActive(pathname, item.href)}
                  count={item.countKey ? counts?.[item.countKey] : undefined}
                />
              ))}
            </div>
          </div>
        ))}
      </nav>

      <div className="border-t border-charcoal/10 p-3">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm text-charcoal-light hover:bg-charcoal/5 hover:text-charcoal transition-colors"
        >
          <ExternalLink size={17} strokeWidth={1.75} />
          View Store
        </Link>
      </div>
    </div>
  );
}
