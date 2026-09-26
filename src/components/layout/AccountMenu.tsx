"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { signOutToHome } from "@/lib/sign-out";
import { User, LogOut, LayoutDashboard } from "lucide-react";
import { AccountAuthModal } from "./AccountAuthModal";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";

export function AccountMenu() {
  const { data: session, status } = useSession();
  const [authOpen, setAuthOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [signOutConfirmOpen, setSignOutConfirmOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (status === "authenticated") {
    const label = session.user?.name ?? session.user?.email ?? "Account";
    return (
      <div className="relative" ref={ref}>
        <button
          type="button"
          aria-label="Account menu"
          onClick={() => setMenuOpen((v) => !v)}
          className="-m-2 p-2 hover:text-terracotta-dark transition-colors"
        >
          <User size={19} />
        </button>

        {menuOpen && (
          <div className="absolute right-0 top-full mt-2 z-20 w-52 rounded-2xl border border-charcoal/10 bg-white p-1.5 shadow-lg">
            <p className="truncate px-3 pt-2 pb-1.5 text-xs text-ink-muted">
              Signed in as <span className="font-medium text-charcoal">{label}</span>
            </p>
            <Link
              href="/account"
              onClick={() => setMenuOpen(false)}
              className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm text-charcoal hover:bg-cream-dark transition-colors"
            >
              <LayoutDashboard size={16} className="text-charcoal-light" />
              My Account
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

        <ConfirmDialog
          open={signOutConfirmOpen}
          title="Sign out?"
          description="You'll need to sign in again to access your account."
          confirmLabel="Sign Out"
          onConfirm={signOutToHome}
          onCancel={() => setSignOutConfirmOpen(false)}
        />
      </div>
    );
  }

  return (
    <>
      <button
        type="button"
        aria-label="Account"
        onClick={() => setAuthOpen(true)}
        className="-m-2 p-2 hover:text-terracotta-dark transition-colors"
      >
        <User size={19} />
      </button>

      <AccountAuthModal open={authOpen} onClose={() => setAuthOpen(false)} />
    </>
  );
}
