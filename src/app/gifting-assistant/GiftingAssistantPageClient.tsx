"use client";

import { Suspense, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { User, CalendarHeart, Gift, Tag, LayoutGrid, List } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Breadcrumb } from "@/components/shop/Breadcrumb";
import { SelectDropdown } from "@/components/ui/SelectDropdown";
import { type SortOption, sortLabels } from "@/components/shop/ShopToolbar";
import { LoadMoreButton } from "@/components/shop/LoadMoreButton";
import { cn } from "@/lib/cn";
import { StandardFeatureStrip } from "@/components/shop/StandardFeatureStrip";
import { ShopFooter } from "@/components/shop/ShopFooter";
import { ProductCard } from "@/components/ui/ProductCard";
import type { ListProduct } from "@/lib/product-adapters";
import { shopCategories } from "@/lib/shop-mock-data";
import {
  whoOptions,
  whoToAudience,
  occasionOptions,
  budgetOptions,
  budgetToRange,
} from "@/lib/gifting-assistant-data";

const ITEMS_PER_PAGE = 24;

const fields = [
  { key: "who" as const, label: "Who are you gifting?", icon: User, options: whoOptions },
  { key: "occasion" as const, label: "What's the occasion?", icon: CalendarHeart, options: occasionOptions },
  { key: "budget" as const, label: "Your budget?", icon: Gift, options: budgetOptions },
  {
    key: "category" as const,
    label: "Category",
    icon: Tag,
    options: shopCategories.map((c) => ({ value: c.slug, label: c.label })),
  },
];

function GiftingAssistantContent({ initialProducts }: { initialProducts: ListProduct[] }) {
  const searchParams = useSearchParams();

  const [who, setWho] = useState(searchParams.get("who") ?? "");
  const [occasion, setOccasion] = useState(searchParams.get("occasion") ?? "");
  const [budget, setBudget] = useState(searchParams.get("budget") ?? "");
  const [category, setCategory] = useState(searchParams.get("category") ?? "");
  const [sort, setSort] = useState<SortOption>("best-selling");
  const [view, setView] = useState<"grid" | "list">("grid");
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);

  const selections: Record<string, string> = { who, occasion, budget, category };
  const setters: Record<string, (v: string) => void> = {
    who: setWho,
    occasion: setOccasion,
    budget: setBudget,
    category: setCategory,
  };

  const filteredProducts = useMemo(() => {
    const audience = who ? whoToAudience[who] : null;
    const range = budget ? budgetToRange[budget] : null;
    return initialProducts.filter((p) => {
      if (audience && !p.audience.includes(audience)) return false;
      if (occasion && !p.occasions.includes(occasion)) return false;
      if (range && (p.price < range[0] || p.price > range[1])) return false;
      if (category && !p.category.includes(category)) return false;
      return true;
    });
  }, [who, occasion, budget, category, initialProducts]);

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

  const pageProducts = sortedProducts.slice(0, visibleCount);
  const hasMore = visibleCount < sortedProducts.length;

  const activeFilterCount =
    (who ? 1 : 0) + (occasion ? 1 : 0) + (budget ? 1 : 0) + (category ? 1 : 0);

  function clearAll() {
    setWho("");
    setOccasion("");
    setBudget("");
    setCategory("");
    setVisibleCount(ITEMS_PER_PAGE);
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
                    setVisibleCount(ITEMS_PER_PAGE);
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
                  setVisibleCount(ITEMS_PER_PAGE);
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
                  inStock={p.inStock}
                  image={p.image}
                  href={`/product/${p.id}`}
                  layout={view}
                  priority={i < 4}
                />
              ))}
            </div>
          )}

          <div className="pt-4">
            <LoadMoreButton
              onClick={() => setVisibleCount((v) => v + ITEMS_PER_PAGE)}
              hasMore={hasMore}
              shownCount={pageProducts.length}
              totalCount={sortedProducts.length}
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
