"use client";

import { useMemo, useState } from "react";
import { Gift, PackageCheck, Truck, ShieldCheck } from "lucide-react";
import { TopBar } from "@/components/layout/TopBar";
import { Header } from "@/components/layout/Header";
import { Breadcrumb } from "@/components/shop/Breadcrumb";
import { ShopBanner } from "@/components/shop/ShopBanner";
import { CategoryPillRow } from "@/components/shop/CategoryPillRow";
import { FilterSidebar } from "@/components/shop/FilterSidebar";
import { MobileFilterDrawer } from "@/components/shop/MobileFilterDrawer";
import { ShopToolbar, type SortOption } from "@/components/shop/ShopToolbar";
import { Pagination } from "@/components/shop/Pagination";
import { ShopGiftBanner } from "@/components/shop/ShopGiftBanner";
import { ShopFooter } from "@/components/shop/ShopFooter";
import { ProductCard } from "@/components/ui/ProductCard";
import {
  shopProducts,
  shopCategories,
  shopOccasions,
  shopRecipients,
  audienceShopContent,
} from "@/lib/shop-mock-data";

const PRICE_BOUNDS = { min: 0, max: 5000, step: 100 };
const ITEMS_PER_PAGE = 12;

const featureItems = [
  { icon: Gift, title: "Thoughtfully Curated", subtitle: "Every product earns its place." },
  { icon: PackageCheck, title: "Premium Packaging", subtitle: "Beautiful inside and out." },
  { icon: Truck, title: "Delivered with Care", subtitle: "Reliable delivery, across India." },
  { icon: ShieldCheck, title: "Happiness Guaranteed", subtitle: "We're here to make it right." },
];

export default function GiftsForHerPage() {
  const content = audienceShopContent.her;

  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [priceMin, setPriceMin] = useState(PRICE_BOUNDS.min);
  const [priceMax, setPriceMax] = useState(PRICE_BOUNDS.max);
  const [selectedOccasions, setSelectedOccasions] = useState<string[]>([]);
  const [selectedRecipients, setSelectedRecipients] = useState<string[]>([]);
  const [sort, setSort] = useState<SortOption>("best-selling");
  const [view, setView] = useState<"grid" | "list">("grid");
  const [currentPage, setCurrentPage] = useState(1);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const categoryCounts = useMemo(
    () =>
      shopCategories.map((cat) => ({
        ...cat,
        count: shopProducts.filter((p) => p.category === cat.slug).length,
      })),
    []
  );

  const occasionCounts = useMemo(
    () =>
      shopOccasions.map((label) => ({
        label,
        count: shopProducts.filter((p) => p.occasions.includes(label)).length,
      })),
    []
  );

  const recipientCounts = useMemo(
    () =>
      shopRecipients.map((label) => ({
        label,
        count: shopProducts.filter((p) => p.recipients.includes(label)).length,
      })),
    []
  );

  const filteredProducts = useMemo(() => {
    return shopProducts.filter((p) => {
      if (selectedCategories.length > 0 && !selectedCategories.includes(p.category)) {
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
  }, [selectedCategories, priceMin, priceMax, selectedOccasions, selectedRecipients]);

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
    selectedCategories.length +
    selectedOccasions.length +
    selectedRecipients.length +
    (priceMin > PRICE_BOUNDS.min || priceMax < PRICE_BOUNDS.max ? 1 : 0);

  function toggleCategory(slug: string) {
    setCurrentPage(1);
    if (slug === "__all__") {
      setSelectedCategories([]);
      return;
    }
    setSelectedCategories((prev) =>
      prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]
    );
  }

  function toggleOccasion(label: string) {
    setCurrentPage(1);
    setSelectedOccasions((prev) =>
      prev.includes(label) ? prev.filter((o) => o !== label) : [...prev, label]
    );
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
    setSelectedCategories([]);
    setPriceMin(PRICE_BOUNDS.min);
    setPriceMax(PRICE_BOUNDS.max);
    setSelectedOccasions([]);
    setSelectedRecipients([]);
    setCurrentPage(1);
  }

  const sidebarProps = {
    categories: categoryCounts,
    selectedCategories,
    onToggleCategory: toggleCategory,
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
      <TopBar />
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

        <div className="mx-auto max-w-[1440px] px-4 md:px-8 pt-5">
          <ShopBanner title={content.title} subtitle={content.subtitle} />
        </div>

        <div className="mx-auto max-w-[1440px] px-4 md:px-8 py-8">
          <CategoryPillRow
            categories={shopCategories}
            selected={selectedCategories.length === 1 ? selectedCategories[0] : null}
            onSelect={(slug) => toggleCategory(slug ?? "__all__")}
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
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10 border-t border-charcoal/10 pt-10">
            {featureItems.map((f) => (
              <div key={f.title} className="flex items-start gap-3">
                <f.icon size={24} strokeWidth={1.5} className="text-terracotta shrink-0" />
                <div>
                  <h3 className="text-sm font-semibold text-charcoal">{f.title}</h3>
                  <p className="text-xs text-ink-muted mt-1 leading-relaxed">
                    {f.subtitle}
                  </p>
                </div>
              </div>
            ))}
          </div>
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
