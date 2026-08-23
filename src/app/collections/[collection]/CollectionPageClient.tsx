"use client";

import { use, useMemo, useState } from "react";
import { notFound } from "next/navigation";
import { TopBar } from "@/components/layout/TopBar";
import { Header } from "@/components/layout/Header";
import { Breadcrumb } from "@/components/shop/Breadcrumb";
import { ShopToolbar, type SortOption } from "@/components/shop/ShopToolbar";
import { Pagination } from "@/components/shop/Pagination";
import { ShopGiftBanner } from "@/components/shop/ShopGiftBanner";
import { StandardFeatureStrip } from "@/components/shop/StandardFeatureStrip";
import { ShopFooter } from "@/components/shop/ShopFooter";
import { ProductCard } from "@/components/ui/ProductCard";
import { CollectionBanner } from "@/components/collections/CollectionBanner";
import { CollectionTrustStrip } from "@/components/collections/CollectionTrustStrip";
import { CollectionFilterSidebar } from "@/components/collections/CollectionFilterSidebar";
import { CollectionMobileFilterDrawer } from "@/components/collections/CollectionMobileFilterDrawer";
import {
  collectionContent,
  isCollectionSlug,
  type CollectionProduct,
} from "@/lib/collection-mock-data";

const ITEMS_PER_PAGE = 12;

export function CollectionPageClient({
  params,
}: {
  params: Promise<{ collection: string }>;
}) {
  const { collection: collectionParam } = use(params);

  if (!isCollectionSlug(collectionParam)) {
    notFound();
  }
  const collection = collectionParam;
  const content = collectionContent[collection];

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedAttributes, setSelectedAttributes] = useState<string[]>([]);
  const [selectedOccasions, setSelectedOccasions] = useState<string[]>([]);
  const [priceMin, setPriceMin] = useState(content.priceBounds.min);
  const [priceMax, setPriceMax] = useState(content.priceBounds.max);
  const [sort, setSort] = useState<SortOption>("best-selling");
  const [view, setView] = useState<"grid" | "list">("grid");
  const [currentPage, setCurrentPage] = useState(1);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const categoriesWithCounts = useMemo(
    () =>
      content.categories.map((cat) => ({
        ...cat,
        count: content.products.filter((p) => p.category === cat.slug).length,
      })),
    [content]
  );

  const attributeCounts = useMemo(() => {
    if (!content.attributeFilter) return [];
    return content.attributeFilter.values.map((value) => ({
      label: value,
      count: content.products.filter((p) => p.attribute === value).length,
    }));
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
    return content.products.filter((p: CollectionProduct) => {
      if (selectedCategory && p.category !== selectedCategory) return false;
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

  const totalPages = Math.max(1, Math.ceil(sortedProducts.length / ITEMS_PER_PAGE));
  const safePage = Math.min(currentPage, totalPages);
  const pageProducts = sortedProducts.slice(
    (safePage - 1) * ITEMS_PER_PAGE,
    safePage * ITEMS_PER_PAGE
  );

  const activeFilterCount =
    (selectedCategory ? 1 : 0) +
    selectedAttributes.length +
    selectedOccasions.length +
    (priceMin > content.priceBounds.min || priceMax < content.priceBounds.max ? 1 : 0);

  function selectCategory(slug: string | null) {
    setCurrentPage(1);
    setSelectedCategory(slug);
  }

  function toggleAttribute(label: string) {
    setCurrentPage(1);
    setSelectedAttributes((prev) =>
      prev.includes(label) ? prev.filter((a) => a !== label) : [...prev, label]
    );
  }

  function toggleOccasion(label: string) {
    setCurrentPage(1);
    setSelectedOccasions((prev) =>
      prev.includes(label) ? prev.filter((o) => o !== label) : [...prev, label]
    );
  }

  function handlePriceChange(min: number, max: number) {
    setCurrentPage(1);
    setPriceMin(min);
    setPriceMax(max);
  }

  function clearAll() {
    setSelectedCategory(null);
    setSelectedAttributes([]);
    setSelectedOccasions([]);
    setPriceMin(content.priceBounds.min);
    setPriceMax(content.priceBounds.max);
    setCurrentPage(1);
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
      <TopBar />
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

        <div className="mx-auto max-w-[1440px] px-4 md:px-8 pt-5">
          <CollectionBanner
            title={content.title}
            subtitle={content.subtitle}
            image={content.bannerImage}
            bg={content.bg}
            dark={content.dark}
          />
        </div>

        <div className="mx-auto max-w-[1440px] px-4 md:px-8 py-8">
          <CollectionTrustStrip />
        </div>

        <div className="mx-auto max-w-[1440px] px-4 md:px-8 pb-16">
          <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-10">
            <aside className="hidden lg:block">
              <CollectionFilterSidebar {...sidebarProps} />
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
                      badge={p.badge}
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

      <CollectionMobileFilterDrawer
        open={mobileFiltersOpen}
        onClose={() => setMobileFiltersOpen(false)}
        activeFilterCount={activeFilterCount}
        {...sidebarProps}
      />
    </>
  );
}
