"use client";

import { useMemo, useState } from "react";
import { Header } from "@/components/layout/Header";
import { Breadcrumb } from "@/components/shop/Breadcrumb";
import { CategoryPillRow } from "@/components/shop/CategoryPillRow";
import { FilterSidebar } from "@/components/shop/FilterSidebar";
import { MobileFilterDrawer } from "@/components/shop/MobileFilterDrawer";
import { ShopToolbar, type SortOption } from "@/components/shop/ShopToolbar";
import { LoadMoreButton } from "@/components/shop/LoadMoreButton";
import { ShopGiftBanner } from "@/components/shop/ShopGiftBanner";
import { StandardFeatureStrip } from "@/components/shop/StandardFeatureStrip";
import { ShopFooter } from "@/components/shop/ShopFooter";
import { ProductCard } from "@/components/ui/ProductCard";
import type { ListProduct } from "@/lib/product-adapters";
import {
  occasionContent,
  occasionPills,
  recipientPillGroups,
  getOccasionPillIcon,
  type OccasionSlug,
  type OccasionPillFilter,
} from "@/lib/occasion-data";

function pillKey(type: OccasionPillFilter["type"], value: string) {
  return `${type}:${value}`;
}

function productMatchesPill(product: ListProduct, pill: OccasionPillFilter) {
  if (pill.type === "occasion") return product.occasions.includes(pill.value);
  if (pill.type === "audience") return product.audience.includes(pill.value as ListProduct["audience"][number]);
  if (pill.type === "recipient") {
    const tags = recipientPillGroups[pill.value] ?? [];
    return product.recipients.some((r) => tags.includes(r));
  }
  return product.category.includes(pill.value);
}

const PRICE_BOUNDS = { min: 0, max: 5000, step: 100 };
const ITEMS_PER_PAGE = 24;

export function OccasionPageClient({
  occasion,
  initialProducts,
}: {
  occasion: OccasionSlug;
  initialProducts: ListProduct[];
}) {
  const content = occasionContent[occasion];
  const occasionProducts = initialProducts;

  const pills = occasionPills[occasion];

  const [selectedPillKey, setSelectedPillKey] = useState<string | null>(null);
  const [priceMin, setPriceMin] = useState(PRICE_BOUNDS.min);
  const [priceMax, setPriceMax] = useState(PRICE_BOUNDS.max);
  const [selectedRecipients, setSelectedRecipients] = useState<string[]>([]);
  const [sort, setSort] = useState<SortOption>("best-selling");
  const [view, setView] = useState<"grid" | "list">("grid");
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Quick-access pills only make sense for filters that actually match
  // something in stock — an empty pill just leads to a "no products match"
  // grid with no way to tell that in advance.
  const filterPills = useMemo(
    () =>
      pills
        .map((pill) => ({
          slug: pillKey(pill.type, pill.value),
          label: pill.label,
          icon: getOccasionPillIcon(pill),
          count: occasionProducts.filter((p) => productMatchesPill(p, pill)).length,
        }))
        .filter((pill) => pill.count > 0),
    [pills, occasionProducts]
  );

  const recipientCounts = useMemo(() => {
    const counts = new Map<string, number>();
    occasionProducts.forEach((p) => {
      p.recipients.forEach((r) => counts.set(r, (counts.get(r) ?? 0) + 1));
    });
    return Array.from(counts.entries())
      .map(([label, count]) => ({ label, count }))
      .sort((a, b) => b.count - a.count);
  }, [occasionProducts]);

  const selectedPill = pills.find(
    (pill) => pillKey(pill.type, pill.value) === selectedPillKey
  );

  const filteredProducts = useMemo(() => {
    return occasionProducts.filter((p) => {
      if (selectedPill && !productMatchesPill(p, selectedPill)) {
        return false;
      }
      if (p.price < priceMin) return false;
      if (priceMax < PRICE_BOUNDS.max && p.price > priceMax) return false;
      if (
        selectedRecipients.length > 0 &&
        !p.recipients.some((r) => selectedRecipients.includes(r))
      ) {
        return false;
      }
      return true;
    });
  }, [occasionProducts, selectedPill, priceMin, priceMax, selectedRecipients]);

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
    (selectedPillKey ? 1 : 0) +
    selectedRecipients.length +
    (priceMin > PRICE_BOUNDS.min || priceMax < PRICE_BOUNDS.max ? 1 : 0);

  function togglePill(key: string | null) {
    setVisibleCount(ITEMS_PER_PAGE);
    setSelectedPillKey((prev) => (key === null || prev === key ? null : key));
  }

  function toggleRecipient(label: string) {
    setVisibleCount(ITEMS_PER_PAGE);
    setSelectedRecipients((prev) =>
      prev.includes(label) ? prev.filter((r) => r !== label) : [...prev, label]
    );
  }

  function handlePriceChange(min: number, max: number) {
    setVisibleCount(ITEMS_PER_PAGE);
    setPriceMin(min);
    setPriceMax(max);
  }

  function clearAll() {
    setSelectedPillKey(null);
    setPriceMin(PRICE_BOUNDS.min);
    setPriceMax(PRICE_BOUNDS.max);
    setSelectedRecipients([]);
    setVisibleCount(ITEMS_PER_PAGE);
  }

  const sidebarProps = {
    priceBounds: PRICE_BOUNDS,
    priceMin,
    priceMax,
    onPriceChange: handlePriceChange,
    recipients: recipientCounts,
    selectedRecipients,
    onToggleRecipient: toggleRecipient,
    onClearAll: clearAll,
  };

  return (
    <>
      <Header />
      <main>
        <div className="mx-auto max-w-[1440px] px-4 md:px-8 pt-5">
          <Breadcrumb
            items={[
              { label: "Home", href: "/" },
              { label: "Shop", href: "/shop" },
              { label: content.breadcrumbLabel },
            ]}
          />
        </div>

        <div className="mx-auto max-w-[1440px] px-4 md:px-8 pt-4">
          <h1 className="font-serif text-2xl md:text-3xl text-charcoal">{content.title}</h1>
        </div>

        <div className="mx-auto max-w-[1440px] px-4 md:px-8 py-8">
          <CategoryPillRow
            categories={filterPills}
            selected={selectedPillKey}
            onSelect={togglePill}
          />
        </div>

        <div className="mx-auto max-w-[1440px] px-4 md:px-8 pb-16">
          <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-10">
            <aside className="hidden lg:block lg:sticky lg:top-24 xl:top-28 lg:self-start">
              <FilterSidebar {...sidebarProps} />
            </aside>

            <div>
              <ShopToolbar
                resultCount={sortedProducts.length}
                sort={sort}
                onSortChange={(s) => {
                  setSort(s);
                  setVisibleCount(ITEMS_PER_PAGE);
                }}
                view={view}
                onViewChange={setView}
                onOpenFilters={() => setMobileFiltersOpen(true)}
                activeFilterCount={activeFilterCount}
              />

              {pageProducts.length === 0 ? (
                <p className="py-16 text-center text-sm text-ink-muted">
                  No products match your filters. Try clearing a few and
                  searching again.
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
          </div>
        </div>

        <div className="mx-auto max-w-[1440px] px-4 md:px-8 pb-14 empty:hidden">
          <ShopGiftBanner />
        </div>

        <div className="mx-auto max-w-[1440px] px-4 md:px-8 pb-14">
          <StandardFeatureStrip />
        </div>
      </main>
      <ShopFooter />

      <MobileFilterDrawer
        open={mobileFiltersOpen}
        onClose={() => setMobileFiltersOpen(false)}
        activeFilterCount={activeFilterCount}
        {...sidebarProps}
      />
    </>
  );
}
