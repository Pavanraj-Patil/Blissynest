import type { Metadata } from "next";
import Link from "next/link";
import { PackageSearch, ArrowRight } from "lucide-react";
import { TopBar } from "@/components/layout/TopBar";
import { Header } from "@/components/layout/Header";
import { Breadcrumb } from "@/components/shop/Breadcrumb";
import { ShopFooter } from "@/components/shop/ShopFooter";

export const metadata: Metadata = {
  title: "Order History | Blissynest",
  description: "Sign in to see your past Blissynest orders.",
};

export default function OrderHistoryPage() {
  return (
    <>
      <TopBar />
      <Header />
      <main>
        <div className="mx-auto max-w-[1440px] px-4 md:px-8 pt-5">
          <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Order History" }]} />
        </div>

        <div className="flex flex-col items-center text-center py-20 px-4">
          <div className="flex h-24 w-24 items-center justify-center rounded-full bg-cream-dark">
            <PackageSearch size={38} className="text-olive/40" strokeWidth={1.5} />
          </div>
          <h1 className="mt-6 font-serif text-2xl text-charcoal">No order history yet</h1>
          <p className="mt-2 text-sm text-ink-muted max-w-sm">
            Accounts aren&rsquo;t live in this demo, so there&rsquo;s nothing to show
            here yet. In the meantime, you can always check a specific order
            by its order number.
          </p>
          <div className="mt-7 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <Link
              href="/account"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-olive text-cream px-7 py-3.5 text-xs font-semibold tracking-[0.12em] uppercase hover:bg-olive-dark transition-colors"
            >
              Sign In
              <ArrowRight size={14} />
            </Link>
            <Link
              href="/track-order"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-charcoal/20 px-7 py-3.5 text-xs font-semibold tracking-[0.12em] uppercase text-charcoal hover:bg-cream-dark transition-colors"
            >
              Track an Order
            </Link>
          </div>
        </div>
      </main>
      <ShopFooter />
    </>
  );
}
