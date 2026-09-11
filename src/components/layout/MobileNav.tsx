"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import Image from "next/image";
import { Menu, X, ChevronDown, User, PackageSearch } from "lucide-react";
import { cn } from "@/lib/cn";
import type { NavDropdownItem } from "./NavDropdown";
import {
  audienceSlugs,
  audienceShopContent,
  personalisedCategoryByAudience,
} from "@/lib/shop-mock-data";
import { audiencePillIcons, occasionSlugs, occasionContent } from "@/lib/occasion-data";
import { collectionSlugs, collectionContent } from "@/lib/collection-mock-data";

type MobileNavSection = {
  label: string;
  href: string;
  items?: NavDropdownItem[];
  badge?: string;
};

const shopItems: NavDropdownItem[] = audienceSlugs.map((slug) => ({
  label: audienceShopContent[slug].title,
  href: `/shop/${slug}`,
  icon: audiencePillIcons[slug],
}));

const personalisedItems: NavDropdownItem[] = audienceSlugs.map((slug) => ({
  label: audienceShopContent[slug].title,
  href: `/shop/${slug}?category=${personalisedCategoryByAudience[slug]}`,
  icon: audiencePillIcons[slug],
}));

const collectionItems: NavDropdownItem[] = collectionSlugs.map((slug) => ({
  label: collectionContent[slug].title,
  href: `/collections/${slug}`,
  swatch: collectionContent[slug].bg,
}));

const occasionItems: NavDropdownItem[] = occasionSlugs.map((slug) => ({
  label: occasionContent[slug].label,
  href: `/occasions/${slug}`,
  icon: occasionContent[slug].icon,
}));

const sections: MobileNavSection[] = [
  { label: "Shop", href: "/shop", items: shopItems },
  { label: "Collections", href: "/collections", items: collectionItems },
  { label: "Occasions", href: "/occasions", items: occasionItems },
  { label: "Personalised", href: "/personalised", items: personalisedItems },
  { label: "Corporate Gifting", href: "/corporate" },
];

export function MobileNav() {
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [open]);

  function close() {
    setOpen(false);
    setExpanded(null);
  }

  return (
    <>
      <button
        type="button"
        aria-label="Open menu"
        onClick={() => setOpen(true)}
        className="text-charcoal md:hidden"
      >
        <Menu size={22} />
      </button>

      {open &&
        createPortal(
          <div className="fixed inset-0 z-50 md:hidden">
            <div
              className="absolute inset-0 bg-charcoal/50"
              onClick={close}
              aria-hidden="true"
            />
            <div className="absolute inset-y-0 left-0 flex w-[82%] max-w-sm flex-col bg-cream shadow-2xl">
              <div className="flex h-16 shrink-0 items-center justify-between border-b border-charcoal/10 px-4">
                <Image
                  src="/blissynest-logo.png"
                  alt="Blissynest"
                  width={150}
                  height={30}
                  className="h-7 w-auto"
                />
                <button
                  type="button"
                  aria-label="Close menu"
                  onClick={close}
                  className="flex h-9 w-9 items-center justify-center rounded-full text-charcoal hover:bg-cream-dark transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="flex shrink-0 border-b border-charcoal/10">
                <Link
                  href="/account"
                  onClick={close}
                  className="flex flex-1 items-center gap-2 px-4 py-3.5 text-sm font-medium text-charcoal"
                >
                  <User size={16} className="text-terracotta" />
                  Profile
                </Link>
                <Link
                  href="/account?tab=orders"
                  onClick={close}
                  className="flex flex-1 items-center gap-2 border-l border-charcoal/10 px-4 py-3.5 text-sm font-medium text-charcoal"
                >
                  <PackageSearch size={16} className="text-terracotta" />
                  Order History
                </Link>
              </div>

              <nav className="flex-1 overflow-y-auto py-1">
                {sections.map((section) => (
                  <div key={section.label} className="border-b border-charcoal/10">
                    {section.items ? (
                      <>
                        <button
                          type="button"
                          onClick={() =>
                            setExpanded((e) => (e === section.label ? null : section.label))
                          }
                          aria-expanded={expanded === section.label}
                          className="flex w-full items-center justify-between px-4 py-3.5 text-left text-sm font-medium text-charcoal"
                        >
                          <span className="flex items-center gap-2">
                            {section.label}
                            {section.badge && (
                              <span className="rounded-full bg-terracotta text-cream text-[9px] font-semibold px-1.5 py-0.5 tracking-normal normal-case">
                                {section.badge}
                              </span>
                            )}
                          </span>
                          <ChevronDown
                            size={16}
                            className={cn(
                              "shrink-0 text-charcoal/40 transition-transform",
                              expanded === section.label && "rotate-180"
                            )}
                          />
                        </button>
                        {expanded === section.label && (
                          <div className="pb-2">
                            {section.items.map((item) => (
                              <Link
                                key={item.href}
                                href={item.href}
                                onClick={close}
                                className="flex items-center gap-2.5 py-2.5 pl-8 pr-4 text-sm text-charcoal-light hover:text-terracotta-dark transition-colors"
                              >
                                {item.icon && (
                                  <item.icon size={15} className="shrink-0 text-terracotta" />
                                )}
                                {item.label}
                              </Link>
                            ))}
                          </div>
                        )}
                      </>
                    ) : (
                      <Link
                        href={section.href}
                        onClick={close}
                        className="flex items-center gap-2 px-4 py-3.5 text-sm font-medium text-charcoal"
                      >
                        {section.label}
                        {section.badge && (
                          <span className="rounded-full bg-terracotta text-cream text-[9px] font-semibold px-1.5 py-0.5 tracking-normal normal-case">
                            {section.badge}
                          </span>
                        )}
                      </Link>
                    )}
                  </div>
                ))}
              </nav>

              <div className="shrink-0 space-y-2.5 border-t border-charcoal/10 px-4 py-4">
                <Link
                  href="/track-order"
                  onClick={close}
                  className="block text-xs text-charcoal-light hover:text-terracotta-dark transition-colors"
                >
                  Track Order
                </Link>
                <Link
                  href="/help"
                  onClick={close}
                  className="block text-xs text-charcoal-light hover:text-terracotta-dark transition-colors"
                >
                  Help
                </Link>
              </div>
            </div>
          </div>,
          document.body
        )}
    </>
  );
}
