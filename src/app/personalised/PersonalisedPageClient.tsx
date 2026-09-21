"use client";

import { useMemo, useState } from "react";
import { Header } from "@/components/layout/Header";
import { Breadcrumb } from "@/components/shop/Breadcrumb";
import { FilterSidebar } from "@/components/shop/FilterSidebar";
import { MobileFilterDrawer } from "@/components/shop/MobileFilterDrawer";
import { ShopToolbar, type SortOption } from "@/components/shop/ShopToolbar";
import { LoadMoreButton } from "@/components/shop/LoadMoreButton";
import { ShopGiftBanner } from "@/components/shop/ShopGiftBanner";
import { StandardFeatureStrip } from "@/components/shop/StandardFeatureStrip";
import { ShopFooter } from "@/components/shop/ShopFooter";
import { ProductCard } from "@/components/ui/ProductCard";
import type { ListProduct } from "@/lib/product-adapters";

const PRICE_BOUNDS = { min: 0, max: 5000, step: 100 };
const ITEMS_PER_PAGE = 24;

export function PersonalisedPageClient({
  initialProducts,
}: {
  initialProducts: ListProduct[];
}) {
  const [priceMin, setPriceMin] = useState(PRICE_BOUNDS.min);
  const [priceMax, setPriceMax] = useState(PRICE_BOUNDS.max);
  const [selectedOccasions, setSelectedOccasions] = useState<string[]>([]);
  const [selectedRecipients, setSelectedRecipients] = useState<string[]>([]);
  const [sort, setSort] = useState<SortOption>("best-selling");
  const [view, setView] = useState<"grid" | "list">("grid");
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const personalisedProducts = initialProducts;

  const occasionCounts = useMemo(() => {
    const counts = new Map<string, number>();
    personalisedProducts.forEach((p) => {
      p.occasions.forEach((o) => counts.set(o, (counts.get(o) ?? 0) + 1));
    });
    return Array.from(counts.entries())
      .map(([label, count]) => ({ label, count }))
      .sort((a, b) => b.count - a.count);
  }, [personalisedProducts]);

  const recipientCounts = useMemo(() => {
    const counts = new Map<string, number>();
    personalisedProducts.forEach((p) => {
      p.recipients.forEach((r) => counts.set(r, (counts.get(r) ?? 0) + 1));
    });
    return Array.from(counts.entries())
      .map(([label, count]) => ({ label, count }))
      .sort((a, b) => b.count - a.count);
  }, [personalisedProducts]);

  const filteredProducts = useMemo(() => {
    return personalisedProducts.filter((p) => {
      if (p.price < priceMin) return false;
      if (priceMax < PRICE_BOUNDS.max && p.price > priceMax) return false;
      if (
        selectedOccasions.length > 0 &&
        !p.occasions.some((o) => selectedOccasions.includes(o))
      ) {
        return false;
      }
      if (
        selectedRecipients.length > 0 &&
        !p.recipients.some((r) => selectedRecipients.includes(r))
      ) {
        return false;
      }
      return true;
    });
  }, [personalisedProducts, priceMin, priceMax, selectedOccasions, selectedRecipients]);

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
    selectedOccasions.length +
    selectedRecipients.length +
    (priceMin > PRICE_BOUNDS.min || priceMax < PRICE_BOUNDS.max ? 1 : 0);

  function toggleOccasion(label: string) {
    setVisibleCount(ITEMS_PER_PAGE);
    setSelectedOccasions((prev) =>
      prev.includes(label) ? prev.filter((o) => o !== label) : [...prev, label]
    );
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
    setPriceMin(PRICE_BOUNDS.min);
    setPriceMax(PRICE_BOUNDS.max);
    setSelectedOccasions([]);
    setSelectedRecipients([]);
    setVisibleCount(ITEMS_PER_PAGE);
  }

  const sidebarProps = {
    priceBounds: PRICE_BOUNDS,
    priceMin,
    priceMax,
    onPriceChange: handlePriceChange,
    occasions: occasionCounts,
    selectedOccasions,
    onToggleOccasion: toggleOccasion,
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
          <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Personalised" }]} />
        </div>

        <div className="mx-auto max-w-[1440px] px-4 md:px-8 pt-4">
          <h1 className="font-serif text-2xl md:text-3xl text-charcoal">Personalised Gifts</h1>
        </div>

        <div className="mx-auto max-w-[1440px] px-4 md:px-8 pb-16 pt-8">
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
