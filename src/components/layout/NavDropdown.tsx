import Link from "next/link";
import { ChevronDown, type LucideIcon } from "lucide-react";

export type NavDropdownItem = {
  label: string;
  href: string;
  icon?: LucideIcon;
  swatch?: string;
};

type NavDropdownProps = {
  label: string;
  href: string;
  items: NavDropdownItem[];
  columns?: 1 | 2;
};

export function NavDropdown({ label, href, items, columns = 1 }: NavDropdownProps) {
  return (
    <div className="group relative">
      <Link
        href={href}
        className="flex items-center gap-1 hover:text-terracotta-dark transition-colors uppercase"
      >
        {label}
        <ChevronDown
          size={13}
          className="text-charcoal/50 transition-transform group-hover:rotate-180"
        />
      </Link>

      <div className="invisible absolute left-1/2 top-full z-50 -translate-x-1/2 pt-3 opacity-0 transition-[opacity,visibility] duration-150 group-hover:visible group-hover:opacity-100">
        <div
          className="rounded-xl border border-charcoal/10 bg-white p-2 shadow-lg normal-case"
          style={{
            width: columns === 2 ? "22rem" : "13rem",
          }}
        >
          <div className={columns === 2 ? "grid grid-cols-2 gap-0.5" : "flex flex-col gap-0.5"}>
            {items.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-[13px] font-normal tracking-normal text-charcoal-light hover:bg-cream-dark hover:text-terracotta-dark transition-colors"
              >
                {item.icon && (
                  <item.icon size={16} strokeWidth={1.5} className="shrink-0 text-terracotta" />
                )}
                {item.swatch && (
                  <span
                    className="h-3 w-3 shrink-0 rounded-full border border-charcoal/10"
                    style={{ backgroundColor: `#${item.swatch}` }}
                  />
                )}
                <span className="truncate">{item.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
