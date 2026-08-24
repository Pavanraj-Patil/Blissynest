"use client";

import { Suspense, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { User, CalendarHeart, Gift, LayoutGrid, List } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Breadcrumb } from "@/components/shop/Breadcrumb";
import { SelectDropdown } from "@/components/ui/SelectDropdown";
import { type SortOption, sortLabels } from "@/components/shop/ShopToolbar";
import { Pagination } from "@/components/shop/Pagination";
import { cn } from "@/lib/cn";
import { StandardFeatureStrip } from "@/components/shop/StandardFeatureStrip";
import { ShopFooter } from "@/components/shop/ShopFooter";
import { ProductCard } from "@/components/ui/ProductCard";
import type { ListProduct } from "@/lib/product-adapters";
import {
  whoOptions,
  whoToAudience,
  occasionOptions,
  budgetOptions,
  budgetToRange,
} from "@/lib/gifting-assistant-data";

const ITEMS_PER_PAGE = 12;

const fields = [
  { key: "who" as const, label: "Who are you gifting?", icon: User, options: whoOptions },
  { key: "occasion" as const, label: "What's the occasion?", icon: CalendarHeart, options: occasionOptions },
  { key: "budget" as const, label: "Your budget?", icon: Gift, options: budgetOptions },
];

function GiftingAssistantContent({ initialProducts }: { initialProducts: ListProduct[] }) {
  const searchParams = useSearchParams();

  const [who, setWho] = useState(searchParams.get("who") ?? "");
  const [occasion, setOccasion] = useState(searchParams.get("occasion") ?? "");
  const [budget, setBudget] = useState(searchParams.get("budget") ?? "");
  const [sort, setSort] = useState<SortOption>("best-selling");
  const [view, setView] = useState<"grid" | "list">("grid");
  const [currentPage, setCurrentPage] = useState(1);

  const selections: Record<string, string> = { who, occasion, budget };
  const setters: Record<string, (v: string) => void> = {
    who: setWho,
    occasion: setOccasion,
    budget: setBudget,
  };

  const filteredProducts = useMemo(() => {
    const audience = who ? whoToAudience[who] : null;
    const range = budget ? budgetToRange[budget] : null;
    return initialProducts.filter((p) => {
      if (audience && p.audience !== audience) return false;
      if (occasion && !p.occasions.includes(occasion)) return false;
      if (range && (p.price < range[0] || p.price > range[1])) return false;
      return true;
    });
  }, [who, occasion, budget, initialProducts]);

  const sortedProducts = useMemo(() => {
    const list = [...filteredProducts];
    switch (sort) {
      case "price-asc":
        return list.sort((a, b) => a.price - b.price);
      case "price-desc":
        return list.sort((a, b) => b.price - a.price);
      case "rating":
        return list.sort((a, b) => b.rating - a.rating);
      case "newest":
        return list.reverse();
      default:
        return list;
    }
  }, [filteredProducts, sort]);

  const totalPages = Math.max(1, Math.ceil(sortedProducts.length / ITEMS_PER_PAGE));
  const safePage = Math.min(currentPage, totalPages);
  const pageProducts = sortedProducts.slice(
    (safePage - 1) * ITEMS_PER_PAGE,
    safePage * ITEMS_PER_PAGE
  );

  const activeFilterCount = (who ? 1 : 0) + (occasion ? 1 : 0) + (budget ? 1 : 0);

  function clearAll() {
    setWho("");
    setOccasion("");
    setBudget("");
    setCurrentPage(1);
  }

  return (
    <>
      <Header />
      <main>
        <div className="mx-auto max-w-[1440px] px-4 md:px-8 pt-5">
          <Breadcrumb
            items={[{ label: "Home", href: "/" }, { label: "Gifting Assistant" }]}
          />
        </div>

        <div className="mx-auto max-w-[1440px] px-4 md:px-8 pt-6 text-center">
          <p className="eyebrow text-terracotta-dark mb-2">Gifting Assistant</p>
          <h1 className="font-serif text-3xl md:text-4xl text-charcoal">
            Let&rsquo;s find the perfect gift
          </h1>
          <p className="mt-3 text-sm text-ink-muted max-w-xl mx-auto">
            Tell us a little about who you&rsquo;re gifting and we&rsquo;ll narrow it down for you.
          </p>
        </div>

        <div className="mx-auto max-w-[1440px] px-4 md:px-8 pt-8 pb-4">
          <div className="mx-auto max-w-4xl rounded-3xl border border-charcoal/10 bg-white px-6 py-7 md:px-10 md:py-8">
            <div className="flex flex-col md:flex-row md:items-end gap-5 md:gap-4">
              {fields.map((field) => (
                <SelectDropdown
                  key={field.key}
                  label={field.label}
                  icon={field.icon}
                  options={field.options}
                  value={selections[field.key]}
                  onChange={(v) => {
                    setters[field.key](v);
                    setCurrentPage(1);
                  }}
                  placeholder="Any"
                />
              ))}

              {activeFilterCount > 0 && (
                <button
                  type="button"
                  onClick={clearAll}
                  className="shrink-0 text-xs font-medium text-terracotta-dark hover:text-terracotta transition-colors md:pb-3.5"
                >
                  Clear all
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="mx-auto max-w-[1440px] px-4 md:px-8 pb-16">
          <div className="flex items-center justify-between gap-4 py-4 border-b border-charcoal/10">
            <p className="text-sm text-ink-muted">{sortedProducts.length} gifts found</p>

            <div className="flex items-center gap-3">
              <SelectDropdown
                compact
                showPlaceholderOption={false}
                value={sort}
                onChange={(v) => {
                  setSort(v as SortOption);
                  setCurrentPage(1);
                }}
                options={(Object.keys(sortLabels) as SortOption[]).map((key) => ({
                  value: key,
                  label: sortLabels[key],
                }))}
                triggerClassName="max-w-[7.5rem] sm:max-w-none"
                panelClassName="right-0 left-auto"
              />

              <div className="flex items-center rounded-lg border border-charcoal/15 overflow-hidden">
                <button
                  type="button"
                  aria-label="Grid view"
                  aria-pressed={view === "grid"}
                  onClick={() => setView("grid")}
                  className={cn("p-2.5", view === "grid" ? "bg-charcoal text-cream" : "text-charcoal-light")}
                >
                  <LayoutGrid size={16} />
                </button>
                <button
                  type="button"
                  aria-label="List view"
                  aria-pressed={view === "list"}
                  onClick={() => setView("list")}
                  className={cn("p-2.5", view === "list" ? "bg-charcoal text-cream" : "text-charcoal-light")}
                >
                  <List size={16} />
                </button>
              </div>
            </div>
          </div>

          {pageProducts.length === 0 ? (
            <p className="py-16 text-center text-sm text-ink-muted">
              No gifts match those filters yet. Try widening your search above.
            </p>
          ) : (
            <div
              className={
                view === "grid"
                  ? "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 py-6"
                  : "flex flex-col gap-3 py-6"
              }
            >
              {pageProducts.map((p, i) => (
                <ProductCard
                  key={p.id}
                  name={p.name}
                  price={p.price}
                  rating={p.rating}
                  reviews={p.reviews}
                  image={p.image}
                  href={`/product/${p.id}`}
                  layout={view}
                  priority={i < 4}
                />
              ))}
            </div>
          )}

          <div className="pt-4">
            <Pagination
              currentPage={safePage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        </div>

        <div className="mx-auto max-w-[1440px] px-4 md:px-8 pb-14">
          <StandardFeatureStrip />
        </div>
      </main>
      <ShopFooter />
    </>
  );
}

export function GiftingAssistantPageClient({
  initialProducts,
}: {
  initialProducts: ListProduct[];
}) {
  return (
    <Suspense fallback={null}>
      <GiftingAssistantContent initialProducts={initialProducts} />
    </Suspense>
  );
}
