"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Breadcrumb } from "@/components/shop/Breadcrumb";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { ProfileSection } from "@/components/account/ProfileSection";
import { OrdersSection } from "@/components/account/OrdersSection";
import { AddressesSection } from "@/components/account/AddressesSection";
import { WishlistSection } from "@/components/account/WishlistSection";
import { SettingsSection } from "@/components/account/SettingsSection";
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

type SessionUser = { name: string | null; email: string | null; phone: string | null };
type NotificationPrefs = { orders: boolean; promos: boolean; recs: boolean };

function AccountDashboard({
  user,
  hasPassword,
  notifications,
  orders,
  addresses,
}: {
  user: SessionUser;
  hasPassword: boolean;
  notifications: NotificationPrefs;
  orders: AccountOrderDTO[];
  addresses: Address[];
}) {
  const searchParams = useSearchParams();
  const initialTab = searchParams.get("tab");
  const [activeTab, setActiveTab] = useState<TabKey>(
    isTabKey(initialTab) ? initialTab : "profile"
  );
  // The menu's "Profile" / "Order History" links point at this same page with
  // a different ?tab=, which keeps this component mounted — re-apply the tab
  // whenever the param changes (see AudienceShopPageClient for the pattern).
  const [syncedTab, setSyncedTab] = useState(initialTab);
  if (initialTab !== syncedTab) {
    setSyncedTab(initialTab);
    setActiveTab(isTabKey(initialTab) ? initialTab : "profile");
  }
  const [signOutConfirmOpen, setSignOutConfirmOpen] = useState(false);

  const displayName = user.name ?? user.email ?? "Blissynest Member";
  const profileUser = {
    name: displayName,
    email: user.email ?? "",
    phone: user.phone ?? "",
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
          <div className="flex items-center gap-4 rounded-2xl bg-cream-dark px-5 py-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gold/20 font-serif text-lg text-charcoal">
              {initials}
            </div>
            <div className="min-w-0 flex-1">
              <h1 className="font-serif text-lg text-charcoal truncate">{displayName}</h1>
              <p className="mt-0.5 text-sm text-ink-muted truncate">{profileUser.email}</p>
            </div>
            <button
              type="button"
              onClick={() => setSignOutConfirmOpen(true)}
              className="inline-flex shrink-0 items-center gap-1 text-xs font-medium text-charcoal-light hover:text-terracotta-dark transition-colors"
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
                onClick={() => {
                  setActiveTab(tab.key);
                  // Keep the address bar in step with the visible tab, so the
                  // menu's tab links still register as a change afterwards.
                  window.history.replaceState(null, "", `/account?tab=${tab.key}`);
                }}
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
            {activeTab === "orders" && (
              <OrdersSection orders={orders} email={profileUser.email} />
            )}
            {activeTab === "addresses" && <AddressesSection initial={addresses} />}
            {activeTab === "wishlist" && <WishlistSection />}
            {activeTab === "settings" && (
              <SettingsSection hasPassword={hasPassword} initialNotifications={notifications} />
            )}
          </div>
        </div>
      </main>

      <ConfirmDialog
        open={signOutConfirmOpen}
        title="Sign out?"
        description="You'll need to sign in again to access your account."
        confirmLabel="Sign Out"
        onConfirm={() => signOut({ callbackUrl: "/" })}
        onCancel={() => setSignOutConfirmOpen(false)}
      />
    </>
  );
}

export function AccountPageClient({
  user,
  hasPassword,
  notifications,
  orders,
  addresses,
}: {
  user: SessionUser;
  hasPassword: boolean;
  notifications: NotificationPrefs;
  orders: AccountOrderDTO[];
  addresses: Address[];
}) {
  return (
    <Suspense fallback={null}>
      <AccountDashboard
        user={user}
        hasPassword={hasPassword}
        notifications={notifications}
        orders={orders}
        addresses={addresses}
      />
    </Suspense>
  );
}
