"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signOutToHome } from "@/lib/sign-out";
import { Menu, Search, ChevronDown, LogOut, User as UserIcon } from "lucide-react";
import { ConfirmDialog } from "./ConfirmDialog";

export function AdminTopbar({
  adminName,
  role,
  onOpenSidebar,
}: {
  adminName: string;
  role: "ADMIN" | "SUPER_ADMIN";
  onOpenSidebar: () => void;
}) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [signOutConfirmOpen, setSignOutConfirmOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const q = query.trim();
    if (!q) return;
    router.push(`/admin/products?q=${encodeURIComponent(q)}`);
  }

  const initials = adminName
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <header className="flex items-center gap-3 border-b border-charcoal/10 bg-white px-4 sm:px-6 py-3">
      <button
        type="button"
        onClick={onOpenSidebar}
        aria-label="Open menu"
        className="lg:hidden flex h-9 w-9 items-center justify-center rounded-lg text-charcoal-light hover:bg-cream-dark transition-colors shrink-0"
      >
        <Menu size={19} />
      </button>

      <form onSubmit={handleSearch} className="flex-1 max-w-md">
        <label className="relative block">
          <Search
            size={16}
            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-charcoal/35"
          />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search products by name…"
            className="w-full rounded-lg border border-charcoal/15 bg-cream/50 py-2.5 pl-10 pr-3.5 text-sm text-charcoal placeholder:text-ink-muted focus:outline-none focus:border-olive"
          />
        </label>
      </form>

      <div className="ml-auto relative shrink-0" ref={menuRef}>
        <button
          type="button"
          onClick={() => setMenuOpen((v) => !v)}
          className="flex items-center gap-2.5 rounded-xl px-2 py-1.5 hover:bg-cream-dark transition-colors"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-olive/15 text-xs font-semibold text-olive-dark">
            {initials || <UserIcon size={15} />}
          </span>
          <span className="hidden sm:block text-left">
            <span className="block text-sm font-medium text-charcoal leading-tight">{adminName}</span>
            <span className="block text-[11px] text-ink-muted leading-tight">
              {role === "SUPER_ADMIN" ? "Super Admin" : "Admin"}
            </span>
          </span>
          <ChevronDown size={15} className="hidden sm:block text-charcoal/40" />
        </button>

        {menuOpen && (
          <div className="absolute right-0 top-full mt-2 z-20 w-48 rounded-2xl border border-charcoal/10 bg-white p-1.5 shadow-lg">
            <Link
              href="/admin/account"
              onClick={() => setMenuOpen(false)}
              className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm text-charcoal hover:bg-cream-dark transition-colors"
            >
              <UserIcon size={16} className="text-charcoal-light" />
              My account &amp; password
            </Link>
            <button
              type="button"
              onClick={() => {
                setMenuOpen(false);
                setSignOutConfirmOpen(true);
              }}
              className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm text-charcoal hover:bg-cream-dark transition-colors"
            >
              <LogOut size={16} className="text-charcoal-light" />
              Sign Out
            </button>
          </div>
        )}
      </div>

      <ConfirmDialog
        open={signOutConfirmOpen}
        title="Sign out?"
        description="You'll need to sign in again to access the admin dashboard."
        confirmLabel="Sign Out"
        onConfirm={signOutToHome}
        onCancel={() => setSignOutConfirmOpen(false)}
      />
    </header>
  );
}
