import Link from "next/link";
import { Gift } from "lucide-react";
import { getSiteSettings } from "@/lib/site-settings";

// Real, DB-backed threshold (see /admin/settings) — this used to hardcode
// "₹999" as literal text, which would've silently gone stale the moment an
// admin changed the actual checkout threshold in Settings.
export async function TopBar() {
  const { freeShippingThreshold } = await getSiteSettings();

  return (
    <div className="bg-charcoal text-cream/90 text-xs">
      <div className="mx-auto max-w-[1440px] px-4 md:px-8 h-9 flex items-center justify-between">
        <p className="flex items-center gap-1.5 truncate">
          <Gift size={13} className="text-terracotta-light shrink-0" />
          <span className="truncate">
            Free Shipping on all orders above ₹{freeShippingThreshold.toLocaleString("en-IN")}
          </span>
        </p>
        <div className="hidden sm:flex items-center gap-1.5 text-cream/75 shrink-0">
          <Link href="/track-order" className="hover:text-cream transition-colors">
            Track Order
          </Link>
          <span className="text-cream/30">|</span>
          <Link href="/help" className="hover:text-cream transition-colors">
            Help
          </Link>
          <span className="text-cream/30">|</span>
          <Link
            href="/corporate"
            className="hover:text-cream transition-colors"
          >
            Corporate Gifting
          </Link>
        </div>
      </div>
    </div>
  );
}
