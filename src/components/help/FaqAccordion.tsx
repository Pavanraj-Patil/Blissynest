"use client";

import { useMemo, useState } from "react";
import { Plus, Search } from "lucide-react";
import { cn } from "@/lib/cn";

export type FaqItem = { question: string; answer: string };
export type FaqGroup = { category: string; items: FaqItem[] };

const slug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

// Searchable question list with a topic index alongside (on wide screens).
// Answers open in place with a smooth grid-row transition; only one is open
// at a time so the page never becomes a wall of text.
export function FaqAccordion({ groups }: { groups: FaqGroup[] }) {
  const [openKey, setOpenKey] = useState<string | null>(null);
  const [query, setQuery] = useState("");

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return groups;
    return groups
      .map((g) => ({
        ...g,
        items: g.items.filter((i) => `${i.question} ${i.answer}`.toLowerCase().includes(q)),
      }))
      .filter((g) => g.items.length > 0);
  }, [groups, query]);

  return (
    <div className="grid gap-10 lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-16">
      <aside className="lg:sticky lg:top-28 lg:self-start">
        <label className="relative block">
          <span className="sr-only">Search the FAQs</span>
          <Search size={16} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-charcoal/40" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search questions"
            className="w-full rounded-full border border-charcoal/15 bg-white py-3 pl-11 pr-4 text-sm text-charcoal placeholder:text-ink-muted focus:border-olive focus:outline-none"
          />
        </label>
        <nav aria-label="FAQ topics" className="mt-6 hidden lg:block">
          <p className="eyebrow mb-3 text-ink-muted">Topics</p>
          <ul className="space-y-2.5 border-l border-charcoal/25 pl-4">
            {groups.map((g) => (
              <li key={g.category}>
                <a href={`#${slug(g.category)}`} className="text-sm text-charcoal-light transition-colors hover:text-terracotta-dark">
                  {g.category}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      <div className="space-y-14">
        {visible.length === 0 && (
          <p className="rounded-2xl bg-cream-dark px-6 py-10 text-center text-sm text-charcoal-light">
            Nothing matches &ldquo;{query}&rdquo;. Try a different word, or write to us, we&rsquo;re happy to help.
          </p>
        )}
        {visible.map((group) => (
          <section key={group.category} id={slug(group.category)} className="scroll-mt-28">
            <h2 className="font-serif text-2xl text-charcoal md:text-3xl">{group.category}</h2>
            <ul className="mt-5 border-b border-charcoal/12">
              {group.items.map((item) => {
                const key = `${group.category}__${item.question}`;
                const isOpen = openKey === key;
                return (
                  <li key={key} className="border-t border-charcoal/12">
                    <button
                      type="button"
                      onClick={() => setOpenKey(isOpen ? null : key)}
                      aria-expanded={isOpen}
                      className="group flex w-full items-center justify-between gap-6 py-5 text-left"
                    >
                      <span
                        className={cn(
                          "text-[15px] font-medium leading-snug transition-colors md:text-base",
                          isOpen ? "text-terracotta-dark" : "text-charcoal group-hover:text-terracotta-dark"
                        )}
                      >
                        {item.question}
                      </span>
                      <span
                        className={cn(
                          "flex h-8 w-8 shrink-0 items-center justify-center rounded-full border transition-all",
                          isOpen ? "rotate-45 border-terracotta bg-terracotta text-cream" : "border-charcoal/20 text-charcoal"
                        )}
                      >
                        <Plus size={15} />
                      </span>
                    </button>
                    <div
                      className={cn(
                        "grid transition-[grid-template-rows] duration-300 ease-out",
                        isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                      )}
                    >
                      <div className="overflow-hidden">
                        <p className="max-w-2xl pb-6 pr-12 text-sm leading-[1.85] text-charcoal-light md:text-[15px]">
                          {item.answer}
                        </p>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}
