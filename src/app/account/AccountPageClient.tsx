"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Breadcrumb } from "@/components/shop/Breadcrumb";
import { ShopFooter } from "@/components/shop/ShopFooter";
import { ProfileSection } from "@/components/account/ProfileSection";
import { OrdersSection } from "@/components/account/OrdersSection";
import { AddressesSection } from "@/components/account/AddressesSection";
import { WishlistSection } from "@/components/account/WishlistSection";
import { SettingsSection } from "@/components/account/SettingsSection";
import { accountUser } from "@/lib/account-data";
import type { AccountOrderDTO } from "@/lib/order-service";
import type { Address } from "@/lib/checkout-data";
import { cn } from "@/lib/cn";

const tabs = [
  { key: "profile", label: "Profile" },
  { key: "orders", label: "Orders" },
  { key: "addresses", label: "Addresses" },
  { key: "wishlist", label: "Wishlist" },
  { key: "settings", label: "Settings" },
] as const;

type TabKey = (typeof tabs)[number]["key"];

function isTabKey(value: string | null): value is TabKey {
  return tabs.some((t) => t.key === value);
}

type SessionUser = { name: string | null; email: string | null };

function AccountDashboard({
  user,
  orders,
  addresses,
}: {
  user: SessionUser;
  orders: AccountOrderDTO[];
  addresses: Address[];
}) {
  const searchParams = useSearchParams();
  const initialTab = searchParams.get("tab");
  const [activeTab, setActiveTab] = useState<TabKey>(
    isTabKey(initialTab) ? initialTab : "profile"
  );

  // Real signed-in name/email, layered over the demo profile's phone/member-
  // since — those two fields don't exist on the real User model yet (no
  // phone-collection step anywhere in the app), so they stay placeholder
  // until that's added.
  const displayName = user.name ?? user.email ?? "Blissynest Member";
  const profileUser = {
    ...accountUser,
    name: displayName,
    email: user.email ?? accountUser.email,
  };

  const initials = displayName
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <>
      <Header />
      <main>
        <div className="mx-auto max-w-[1440px] px-4 md:px-8 pt-5">
          <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "My Account" }]} />
        </div>

        <div className="mx-auto max-w-[1440px] px-4 md:px-8 pt-6 pb-10">
          <div className="flex flex-col sm:flex-row sm:items-center gap-5 rounded-2xl bg-cream-dark px-6 py-6">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-gold/20 font-serif text-xl text-charcoal">
              {initials}
            </div>
            <div className="min-w-0 flex-1">
              <h1 className="font-serif text-xl text-charcoal">{displayName}</h1>
              <p className="mt-0.5 text-sm text-ink-muted">{profileUser.email}</p>
              <p className="mt-1 text-xs text-charcoal-light">
                Orders and addresses are real. Settings below is still demo
                data — not yet saved per-account
              </p>
            </div>
            <button
              type="button"
              onClick={() => signOut({ callbackUrl: "/" })}
              className="inline-flex shrink-0 items-center justify-center gap-1.5 rounded-full border border-charcoal/15 px-5 py-2.5 text-xs font-semibold tracking-[0.08em] uppercase text-charcoal hover:bg-white transition-colors"
            >
              <LogOut size={13} />
              Sign Out
            </button>
          </div>

          <div className="mt-6 flex gap-2 overflow-x-auto scrollbar-none border-b border-charcoal/10">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveTab(tab.key)}
                className={cn(
                  "shrink-0 border-b-2 px-4 py-3 text-sm font-medium transition-colors",
                  activeTab === tab.key
                    ? "border-olive text-charcoal"
                    : "border-transparent text-ink-muted hover:text-charcoal"
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="mt-6">
            {activeTab === "profile" && <ProfileSection user={profileUser} />}
            {activeTab === "orders" && <OrdersSection orders={orders} />}
            {activeTab === "addresses" && <AddressesSection initial={addresses} />}
            {activeTab === "wishlist" && <WishlistSection />}
            {activeTab === "settings" && <SettingsSection />}
          </div>
        </div>
      </main>
      <ShopFooter />
    </>
  );
}

export function AccountPageClient({
  user,
  orders,
  addresses,
}: {
  user: SessionUser;
  orders: AccountOrderDTO[];
  addresses: Address[];
}) {
  return (
    <Suspense fallback={null}>
      <AccountDashboard user={user} orders={orders} addresses={addresses} />
    </Suspense>
  );
}
