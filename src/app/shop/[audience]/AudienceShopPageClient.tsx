"use client";

import { useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
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
import {
  categoriesByAudience,
  shopOccasions,
  audienceShopContent,
  type AudienceSlug,
} from "@/lib/shop-mock-data";
import { budgetToRange } from "@/lib/gifting-assistant-data";
import { replaceSearchParam } from "@/lib/url-params";
import type { ListProduct } from "@/lib/product-adapters";

const PRICE_BOUNDS = { min: 0, max: 5000, step: 100 };
const ITEMS_PER_PAGE = 24;

export function AudienceShopPageClient({
  audience,
  initialProducts,
}: {
  audience: AudienceSlug;
  initialProducts: ListProduct[];
}) {
  const content = audienceShopContent[audience];
  const shopProducts = initialProducts;
  const categories = categoriesByAudience[audience];

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get("category");
  const validCategoryParam =
    categoryParam && categories.some((c) => c.slug === categoryParam)
      ? categoryParam
      : null;

  const occasionParam = searchParams.get("occasion");
  const validOccasionParam =
    occasionParam && shopOccasions.includes(occasionParam) ? occasionParam : null;

  const budgetParam = searchParams.get("budget");
  const budgetRangeParam = budgetParam ? budgetToRange[budgetParam] : null;

  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    validCategoryParam ? [validCategoryParam] : []
  );
  const [priceMin, setPriceMin] = useState(budgetRangeParam ? budgetRangeParam[0] : PRICE_BOUNDS.min);
  const [priceMax, setPriceMax] = useState(
    budgetRangeParam ? Math.min(budgetRangeParam[1], PRICE_BOUNDS.max) : PRICE_BOUNDS.max
  );
  const [selectedOccasions, setSelectedOccasions] = useState<string[]>(
    validOccasionParam ? [validOccasionParam] : []
  );
  const [selectedRecipients, setSelectedRecipients] = useState<string[]>([]);
  const [sort, setSort] = useState<SortOption>("best-selling");
  const [view, setView] = useState<"grid" | "list">("grid");
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Quick-access pills only make sense for categories that actually have
  // something in stock — an empty pill just leads to a "no products match"
  // grid with no way to tell that in advance.
  const visibleCategories = useMemo(
    () => categories.filter((c) => shopProducts.some((p) => p.category.includes(c.slug))),
    [categories, shopProducts]
  );

  const occasionCounts = useMemo(() => {
    const counts = new Map<string, number>();
    shopProducts.forEach((p) => {
      p.occasions.forEach((o) => counts.set(o, (counts.get(o) ?? 0) + 1));
    });
    return Array.from(counts.entries())
      .map(([label, count]) => ({ label, count }))
      .sort((a, b) => b.count - a.count);
  }, [shopProducts]);

  const recipientCounts = useMemo(
    () =>
      content.recipients.map((label) => ({
        label,
        count: shopProducts.filter((p) => p.recipients.includes(label)).length,
      })),
    [shopProducts, content.recipients]
  );

  const filteredProducts = useMemo(() => {
    return shopProducts.filter((p) => {
      if (selectedCategories.length > 0 && !p.category.some((c) => selectedCategories.includes(c))) {
        return false;
      }
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
  }, [shopProducts, selectedCategories, priceMin, priceMax, selectedOccasions, selectedRecipients]);

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

  // Category is chosen via the always-visible pill row, not the Filters
  // drawer/sidebar (no Category section lives there) — counting it here
  // would show a "1" on the Filter button for something that drawer can't
  // display or let you clear.
  const activeFilterCount =
    selectedOccasions.length +
    selectedRecipients.length +
    (priceMin > PRICE_BOUNDS.min || priceMax < PRICE_BOUNDS.max ? 1 : 0);

  function toggleCategory(slug: string) {
    setVisibleCount(ITEMS_PER_PAGE);
    // CategoryPillRow is a single-select control (one active pill at a
    // time) — replace the selection rather than toggling it into a list,
    // so picking a new category doesn't leave a previous one silently
    // still selected. Clicking the already-active pill again clears it.
    const next =
      slug === "__all__" || (selectedCategories.length === 1 && selectedCategories[0] === slug)
        ? []
        : [slug];
    setSelectedCategories(next);
    replaceSearchParam(router, pathname, searchParams, "category", next[0] ?? null);
  }

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
    setSelectedCategories([]);
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
          <Breadcrumb
            items={[
              { label: "Home", href: "/" },
              { label: "Shop", href: "/shop" },
              { label: content.breadcrumbLabel },
            ]}
          />
        </div>

        <div className="mx-auto max-w-[1440px] px-4 md:px-8 pt-4">
          <h1 className="font-serif text-2xl md:text-3xl text-charcoal">{content.breadcrumbLabel}</h1>
        </div>

        <div className="mx-auto max-w-[1440px] px-4 md:px-8 py-8">
          <CategoryPillRow
            categories={visibleCategories}
            selected={selectedCategories.length === 1 ? selectedCategories[0] : null}
            onSelect={(slug) => toggleCategory(slug ?? "__all__")}
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
