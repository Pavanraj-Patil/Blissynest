"use client";

import { useMemo, useState } from "react";
import { Header } from "@/components/layout/Header";
import { Breadcrumb } from "@/components/shop/Breadcrumb";
import { CategoryPillRow } from "@/components/shop/CategoryPillRow";
import { FilterSidebar } from "@/components/shop/FilterSidebar";
import { MobileFilterDrawer } from "@/components/shop/MobileFilterDrawer";
import { ShopToolbar, type SortOption } from "@/components/shop/ShopToolbar";
import { Pagination } from "@/components/shop/Pagination";
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
  if (pill.type === "audience") return product.audience === pill.value;
  if (pill.type === "recipient") {
    const tags = recipientPillGroups[pill.value] ?? [];
    return product.recipients.some((r) => tags.includes(r));
  }
  return product.category === pill.value;
}

const PRICE_BOUNDS = { min: 0, max: 5000, step: 100 };
const ITEMS_PER_PAGE = 12;

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
  const [currentPage, setCurrentPage] = useState(1);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const filterPills = useMemo(
    () =>
      pills.map((pill) => ({
        slug: pillKey(pill.type, pill.value),
        label: pill.label,
        icon: getOccasionPillIcon(pill),
        count: occasionProducts.filter((p) => productMatchesPill(p, pill)).length,
      })),
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

  const totalPages = Math.max(1, Math.ceil(sortedProducts.length / ITEMS_PER_PAGE));
  const safePage = Math.min(currentPage, totalPages);
  const pageProducts = sortedProducts.slice(
    (safePage - 1) * ITEMS_PER_PAGE,
    safePage * ITEMS_PER_PAGE
  );

  const activeFilterCount =
    (selectedPillKey ? 1 : 0) +
    selectedRecipients.length +
    (priceMin > PRICE_BOUNDS.min || priceMax < PRICE_BOUNDS.max ? 1 : 0);

  function togglePill(key: string | null) {
    setCurrentPage(1);
    setSelectedPillKey((prev) => (key === null || prev === key ? null : key));
  }

  function toggleRecipient(label: string) {
    setCurrentPage(1);
    setSelectedRecipients((prev) =>
      prev.includes(label) ? prev.filter((r) => r !== label) : [...prev, label]
    );
  }

  function handlePriceChange(min: number, max: number) {
    setCurrentPage(1);
    setPriceMin(min);
    setPriceMax(max);
  }

  function clearAll() {
    setSelectedPillKey(null);
    setPriceMin(PRICE_BOUNDS.min);
    setPriceMax(PRICE_BOUNDS.max);
    setSelectedRecipients([]);
    setCurrentPage(1);
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

        <div className="mx-auto max-w-[1440px] px-4 md:px-8 py-8">
          <CategoryPillRow
            categories={filterPills}
            selected={selectedPillKey}
            onSelect={togglePill}
          />
        </div>

        <div className="mx-auto max-w-[1440px] px-4 md:px-8 pb-16">
          <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-10">
            <aside className="hidden lg:block">
              <FilterSidebar {...sidebarProps} />
            </aside>

            <div>
              <ShopToolbar
                resultCount={sortedProducts.length}
                sort={sort}
                onSortChange={(s) => {
                  setSort(s);
                  setCurrentPage(1);
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
          </div>
        </div>

        <div className="mx-auto max-w-[1440px] px-4 md:px-8 pb-14">
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
