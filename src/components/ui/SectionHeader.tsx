import Link from "next/link";
import { ArrowRight } from "lucide-react";

type SectionHeaderProps = {
  title: string;
  eyebrow?: string;
  linkLabel?: string;
  linkHref?: string;
  // Most sections switch to a grid on mobile, where the header's own
  // "view all" link would be redundant — sections that stay a horizontal
  // scroll at every breakpoint (see LovedByMany) need it visible there too.
  showLinkOnMobile?: boolean;
};

export function SectionHeader({
  title,
  eyebrow,
  linkLabel = "Explore all",
  linkHref = "#",
  showLinkOnMobile = false,
}: SectionHeaderProps) {
  return (
    <div className="flex items-end justify-between gap-4 mb-6 md:mb-8">
      <div>
        {eyebrow && (
          <p className="eyebrow text-terracotta-dark mb-2">{eyebrow}</p>
        )}
        <h2 className="font-serif text-2xl md:text-3xl text-charcoal">
          {title}
        </h2>
      </div>
      <Link
        href={linkHref}
        className={`${showLinkOnMobile ? "inline-flex" : "hidden sm:inline-flex"} shrink-0 items-center gap-1.5 text-sm font-medium text-charcoal hover:text-terracotta-dark transition-colors`}
      >
        {linkLabel}
        <ArrowRight size={15} />
      </Link>
    </div>
  );
}
