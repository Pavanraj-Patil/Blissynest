import { Gift } from "lucide-react";

export function TopBar() {
  return (
    <div className="bg-charcoal text-cream/90 text-xs">
      <div className="mx-auto max-w-[1440px] px-4 md:px-8 h-9 flex items-center justify-between">
        <p className="flex items-center gap-1.5 truncate">
          <Gift size={13} className="text-terracotta-light shrink-0" />
          <span className="truncate">
            Free Shipping on all orders above ₹999
          </span>
        </p>
        <div className="hidden sm:flex items-center gap-1.5 text-cream/75 shrink-0">
          <a href="/track-order" className="hover:text-cream transition-colors">
            Track Order
          </a>
          <span className="text-cream/30">|</span>
          <a href="/help" className="hover:text-cream transition-colors">
            Help
          </a>
          <span className="text-cream/30">|</span>
          <a
            href="/corporate"
            className="hover:text-cream transition-colors"
          >
            Corporate Gifting
          </a>
        </div>
      </div>
    </div>
  );
}
