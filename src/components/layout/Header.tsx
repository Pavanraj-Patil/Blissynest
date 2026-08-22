import Link from "next/link";
import { Search, User, Heart, ShoppingBag, ChevronDown } from "lucide-react";
import { navLinks } from "@/lib/mock-data";

export function Header() {
  return (
    <header className="sticky top-0 z-40 bg-cream/95 backdrop-blur border-b border-charcoal/10">
      <div className="mx-auto max-w-[1440px] px-4 md:px-8 h-20 md:h-24 flex items-center justify-between gap-6">
        <Link href="/" className="shrink-0">
          <span className="block font-serif text-2xl md:text-[28px] leading-none text-charcoal">
            blissynest
          </span>
          <span className="block eyebrow text-[9px] tracking-[0.22em] text-terracotta-dark mt-1">
            Gifts that feel like home
          </span>
        </Link>

        <nav className="hidden lg:flex items-center gap-8 text-[13px] font-medium tracking-wide text-charcoal">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="flex items-center gap-1 hover:text-terracotta-dark transition-colors uppercase"
            >
              {link.label}
              <ChevronDown size={13} className="text-charcoal/50" />
            </Link>
          ))}
          <Link
            href="/corporate"
            className="flex items-center gap-1.5 hover:text-terracotta-dark transition-colors uppercase"
          >
            Corporate
            <span className="rounded-full bg-terracotta text-cream text-[9px] font-semibold px-1.5 py-0.5 tracking-normal normal-case">
              New
            </span>
          </Link>
        </nav>

        <div className="flex items-center gap-4 md:gap-5 text-charcoal shrink-0">
          <button aria-label="Search" className="hover:text-terracotta-dark transition-colors">
            <Search size={19} />
          </button>
          <button aria-label="Account" className="hidden sm:block hover:text-terracotta-dark transition-colors">
            <User size={19} />
          </button>
          <button aria-label="Wishlist" className="hidden sm:block hover:text-terracotta-dark transition-colors">
            <Heart size={19} />
          </button>
          <Link href="/cart" aria-label="Cart" className="relative hover:text-terracotta-dark transition-colors">
            <ShoppingBag size={19} />
            <span className="absolute -top-2 -right-2 flex h-4 w-4 items-center justify-center rounded-full bg-terracotta text-[9px] font-semibold text-cream">
              0
            </span>
          </Link>
        </div>
      </div>
    </header>
  );
}
