"use client";

import { useMemo, useState } from "react";
import { Header } from "@/components/layout/Header";
import { Breadcrumb } from "@/components/shop/Breadcrumb";
import { ShopToolbar, type SortOption } from "@/components/shop/ShopToolbar";
import { LoadMoreButton } from "@/components/shop/LoadMoreButton";
import { ShopGiftBanner } from "@/components/shop/ShopGiftBanner";
import { StandardFeatureStrip } from "@/components/shop/StandardFeatureStrip";
import { ShopFooter } from "@/components/shop/ShopFooter";
import { ProductCard } from "@/components/ui/ProductCard";
import { CollectionFilterSidebar } from "@/components/collections/CollectionFilterSidebar";
import { CollectionMobileFilterDrawer } from "@/components/collections/CollectionMobileFilterDrawer";
import { collectionContent, type CollectionSlug } from "@/lib/collection-mock-data";
import type { ListProduct } from "@/lib/product-adapters";

const ITEMS_PER_PAGE = 24;

export function CollectionPageClient({
  collection,
  initialProducts,
}: {
  collection: CollectionSlug;
  initialProducts: ListProduct[];
}) {
  const content = useMemo(
    () => ({
      ...collectionContent[collection],
      products: initialProducts,
    }),
    [collection, initialProducts]
  );

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedAttributes, setSelectedAttributes] = useState<string[]>([]);
  const [selectedOccasions, setSelectedOccasions] = useState<string[]>([]);
  const [priceMin, setPriceMin] = useState(content.priceBounds.min);
  const [priceMax, setPriceMax] = useState(content.priceBounds.max);
  const [sort, setSort] = useState<SortOption>("best-selling");
  const [view, setView] = useState<"grid" | "list">("grid");
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Counts come from the full product set, not the filtered one, so an
  // option only disappears when nothing in this collection has it at all —
  // never because another filter happens to be narrowing the grid.
  const categoriesWithCounts = useMemo(
    () =>
      content.categories
        .map((cat) => ({
          ...cat,
          count: content.products.filter((p) => p.category.includes(cat.slug)).length,
        }))
        .filter((cat) => cat.count > 0),
    [content]
  );

  const attributeCounts = useMemo(() => {
    if (!content.attributeFilter) return [];
    return content.attributeFilter.values
      .map((value) => ({
        label: value,
        count: content.products.filter((p) => p.attribute === value).length,
      }))
      .filter((a) => a.count > 0);
  }, [content]);

  const occasionCounts = useMemo(() => {
    const counts = new Map<string, number>();
    content.products.forEach((p) => {
      p.occasions.forEach((o) => counts.set(o, (counts.get(o) ?? 0) + 1));
    });
    return Array.from(counts.entries())
      .map(([label, count]) => ({ label, count }))
      .sort((a, b) => b.count - a.count);
  }, [content]);

  const filteredProducts = useMemo(() => {
    return content.products.filter((p) => {
      if (selectedCategory && !p.category.includes(selectedCategory)) return false;
      if (
        selectedAttributes.length > 0 &&
        !(p.attribute && selectedAttributes.includes(p.attribute))
      ) {
        return false;
      }
      if (
        selectedOccasions.length > 0 &&
        !p.occasions.some((o) => selectedOccasions.includes(o))
      ) {
        return false;
      }
      if (p.price < priceMin) return false;
      if (priceMax < content.priceBounds.max && p.price > priceMax) return false;
      return true;
    });
  }, [content, selectedCategory, selectedAttributes, selectedOccasions, priceMin, priceMax]);

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
    (selectedCategory ? 1 : 0) +
    selectedAttributes.length +
    selectedOccasions.length +
    (priceMin > content.priceBounds.min || priceMax < content.priceBounds.max ? 1 : 0);

  function selectCategory(slug: string | null) {
    setVisibleCount(ITEMS_PER_PAGE);
    setSelectedCategory(slug);
  }

  function toggleAttribute(label: string) {
    setVisibleCount(ITEMS_PER_PAGE);
    setSelectedAttributes((prev) =>
      prev.includes(label) ? prev.filter((a) => a !== label) : [...prev, label]
    );
  }

  function toggleOccasion(label: string) {
    setVisibleCount(ITEMS_PER_PAGE);
    setSelectedOccasions((prev) =>
      prev.includes(label) ? prev.filter((o) => o !== label) : [...prev, label]
    );
  }

  function handlePriceChange(min: number, max: number) {
    setVisibleCount(ITEMS_PER_PAGE);
    setPriceMin(min);
    setPriceMax(max);
  }

  function clearAll() {
    setSelectedCategory(null);
    setSelectedAttributes([]);
    setSelectedOccasions([]);
    setPriceMin(content.priceBounds.min);
    setPriceMax(content.priceBounds.max);
    setVisibleCount(ITEMS_PER_PAGE);
  }

  const sidebarProps = {
    categories: categoriesWithCounts,
    selectedCategory,
    onSelectCategory: selectCategory,
    priceBounds: content.priceBounds,
    priceMin,
    priceMax,
    onPriceChange: handlePriceChange,
    attributeLabel: content.attributeFilter?.label,
    attributes: attributeCounts,
    selectedAttributes,
    onToggleAttribute: toggleAttribute,
    occasions: occasionCounts,
    selectedOccasions,
    onToggleOccasion: toggleOccasion,
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
              { label: "The Blissynest Edit", href: "/#blissynest-edit" },
              { label: content.breadcrumbLabel },
            ]}
          />
        </div>

        <div className="mx-auto max-w-[1440px] px-4 md:px-8 pt-4">
          <h1 className="font-serif text-2xl md:text-3xl text-charcoal">{content.title}</h1>
          <p className="mt-1 text-sm text-ink-muted">{content.subtitle}</p>
        </div>

        <div className="mx-auto max-w-[1440px] px-4 md:px-8 pb-16">
          <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-10">
            <aside className="hidden lg:block lg:sticky lg:top-24 xl:top-28 lg:self-start">
              <CollectionFilterSidebar {...sidebarProps} />
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
                      badge={p.badge}
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

      <CollectionMobileFilterDrawer
        open={mobileFiltersOpen}
        onClose={() => setMobileFiltersOpen(false)}
        activeFilterCount={activeFilterCount}
        {...sidebarProps}
      />
    </>
  );
}
