"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ChevronDown,
  Home,
  Info,
  ListChecks,
  Truck,
  RotateCcw,
  HelpCircle,
  Mail,
  PackageSearch,
  Briefcase,
  PanelsTopLeft,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/cn";

// Icon components can't cross the Server→Client prop boundary as raw
// values (RSC only serializes plain data), so this lookup lives here and
// the server page only ever sends the plain `slug` string.
const pageIcons: Record<string, LucideIcon> = {
  home: Home,
  about: Info,
  faqs: ListChecks,
  shipping: Truck,
  returns: RotateCcw,
  help: HelpCircle,
  contact: Mail,
  "track-order": PackageSearch,
  corporate: Briefcase,
  layout: PanelsTopLeft,
};

export type ContentSectionSummary = { key: string; title: string };
export type ContentPageGroup = {
  slug: string;
  label: string;
  sections: ContentSectionSummary[];
};

export function ContentSidebar({
  groups,
  activePage,
  activeSection,
}: {
  groups: ContentPageGroup[];
  activePage: string;
  activeSection?: string;
}) {
  const [expanded, setExpanded] = useState(activePage);

  return (
    <div className="rounded-2xl border border-charcoal/10 bg-white p-2 space-y-0.5 h-fit">
      {groups.map((group) => {
        const isOpen = expanded === group.slug;
        const isActiveGroup = group.slug === activePage;
        const Icon = pageIcons[group.slug] ?? Home;

        return (
          <div key={group.slug}>
            <button
              type="button"
              onClick={() => setExpanded((prev) => (prev === group.slug ? "" : group.slug))}
              aria-expanded={isOpen}
              className={cn(
                "flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm transition-colors",
                isActiveGroup ? "text-charcoal font-medium" : "text-charcoal-light hover:bg-cream-dark"
              )}
            >
              <Icon
                size={16}
                strokeWidth={1.75}
                className={cn("shrink-0", isActiveGroup ? "text-olive-dark" : "text-charcoal/40")}
              />
              <span className="flex-1 truncate text-left">{group.label}</span>
              <span className="text-[11px] text-ink-muted tabular-nums">{group.sections.length}</span>
              <ChevronDown
                size={14}
                className={cn(
                  "shrink-0 text-charcoal/30 transition-transform",
                  isOpen && "rotate-180"
                )}
              />
            </button>

            {isOpen && (
              <div className="ml-[1.15rem] mb-1.5 mt-0.5 space-y-0.5 border-l border-charcoal/10 pl-3">
                {group.sections.map((section) => (
                  <Link
                    key={section.key}
                    href={`/admin/content?page=${group.slug}&section=${section.key}`}
                    className={cn(
                      "block rounded-lg px-2.5 py-1.5 text-sm transition-colors",
                      group.slug === activePage && section.key === activeSection
                        ? "bg-olive text-cream"
                        : "text-charcoal-light hover:bg-cream-dark"
                    )}
                  >
                    {section.title}
                  </Link>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
