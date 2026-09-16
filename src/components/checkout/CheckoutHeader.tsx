import Image from "next/image";
import Link from "next/link";
import { Lock } from "lucide-react";

// Deliberately minimal — checkout drops the full site nav (category
// dropdowns, search, wishlist/cart icons) and the promotional top strip so
// nothing pulls a shopper away right before they pay. The logo still links
// home for anyone who wants to leave on purpose. Standard "distraction-free
// checkout" pattern — see CheckoutPageClient for where this replaces Header.
export function CheckoutHeader() {
  return (
    <header className="border-b border-charcoal/10 bg-cream">
      <div className="mx-auto max-w-[1440px] px-4 md:px-8 h-16 md:h-20 flex items-center justify-between">
        <Link href="/" className="shrink-0">
          <Image
            src="/mini_logo.png"
            alt="Blissynest"
            width={64}
            height={64}
            priority
            className="block h-8 w-8 min-[380px]:hidden"
          />
          <Image
            src="/blissynest-logo.png"
            alt="Blissynest"
            width={210}
            height={42}
            priority
            className="hidden h-7 w-auto min-[380px]:block md:h-9"
          />
        </Link>
        <p className="flex items-center gap-1.5 text-xs sm:text-sm text-ink-muted">
          <Lock size={13} />
          Secure Checkout
        </p>
      </div>
    </header>
  );
}
