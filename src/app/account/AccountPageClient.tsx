"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { LogOut } from "lucide-react";
import { TopBar } from "@/components/layout/TopBar";
import { Header } from "@/components/layout/Header";
import { Breadcrumb } from "@/components/shop/Breadcrumb";
import { ShopFooter } from "@/components/shop/ShopFooter";
import { ProfileSection } from "@/components/account/ProfileSection";
import { OrdersSection } from "@/components/account/OrdersSection";
import { AddressesSection } from "@/components/account/AddressesSection";
import { WishlistSection } from "@/components/account/WishlistSection";
import { SettingsSection } from "@/components/account/SettingsSection";
import { accountUser, accountOrders, accountAddresses } from "@/lib/account-data";
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

function AccountDashboard() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialTab = searchParams.get("tab");
  const [activeTab, setActiveTab] = useState<TabKey>(
    isTabKey(initialTab) ? initialTab : "profile"
  );

  const initials = accountUser.name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <>
      <TopBar />
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
              <h1 className="font-serif text-xl text-charcoal">{accountUser.name}</h1>
              <p className="mt-0.5 text-sm text-ink-muted">
                {accountUser.email} · {accountUser.phone}
              </p>
              <p className="mt-1 text-xs text-charcoal-light">
                Member since {accountUser.memberSince} · Demo profile — sign-in isn&rsquo;t wired up yet
              </p>
            </div>
            <button
              type="button"
              onClick={() => router.push("/")}
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
            {activeTab === "profile" && <ProfileSection user={accountUser} />}
            {activeTab === "orders" && <OrdersSection orders={accountOrders} />}
            {activeTab === "addresses" && <AddressesSection initial={accountAddresses} />}
            {activeTab === "wishlist" && <WishlistSection />}
            {activeTab === "settings" && <SettingsSection />}
          </div>
        </div>
      </main>
      <ShopFooter />
    </>
  );
}

export function AccountPageClient() {
  return (
    <Suspense fallback={null}>
      <AccountDashboard />
    </Suspense>
  );
}
