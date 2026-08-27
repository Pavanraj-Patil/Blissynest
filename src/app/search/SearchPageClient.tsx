"use client";

import { useMemo, useState } from "react";
import { SearchX, LayoutGrid, List } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Breadcrumb } from "@/components/shop/Breadcrumb";
import { SelectDropdown } from "@/components/ui/SelectDropdown";
import { type SortOption, sortLabels } from "@/components/shop/ShopToolbar";
import { Pagination } from "@/components/shop/Pagination";
import { StandardFeatureStrip } from "@/components/shop/StandardFeatureStrip";
import { ShopFooter } from "@/components/shop/ShopFooter";
import { ProductCard } from "@/components/ui/ProductCard";
import type { RelatedProduct } from "@/lib/product-adapters";
import { cn } from "@/lib/cn";

const ITEMS_PER_PAGE = 12;

export function SearchPageClient({
  query,
  initialResults,
}: {
  query: string;
  initialResults: RelatedProduct[];
}) {
  const [sort, setSort] = useState<SortOption>("best-selling");
  const [view, setView] = useState<"grid" | "list">("grid");
  const [currentPage, setCurrentPage] = useState(1);

  const results = initialResults;

  const sortedResults = useMemo(() => {
    const list = [...results];
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
  }, [results, sort]);

  const totalPages = Math.max(1, Math.ceil(sortedResults.length / ITEMS_PER_PAGE));
  const safePage = Math.min(currentPage, totalPages);
  const pageResults = sortedResults.slice(
    (safePage - 1) * ITEMS_PER_PAGE,
    safePage * ITEMS_PER_PAGE
  );

  return (
    <>
      <Header />
      <main>
        <div className="mx-auto max-w-[1440px] px-4 md:px-8 pt-5">
          <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Search" }]} />
        </div>

        <div className="mx-auto max-w-[1440px] px-4 md:px-8 pt-6 pb-4">
          <h1 className="font-serif text-2xl md:text-3xl text-charcoal">
            {query ? (
              <>
                Search results for &ldquo;{query}&rdquo;
              </>
            ) : (
              "Search"
            )}
          </h1>
        </div>

        <div className="mx-auto max-w-[1440px] px-4 md:px-8 pb-16">
          {results.length === 0 ? (
            <div className="flex flex-col items-center text-center py-20">
              <SearchX size={40} className="text-charcoal/20" strokeWidth={1.5} />
              <h2 className="mt-4 font-serif text-xl text-charcoal">
                {query ? `No results for "${query}"` : "Search for something"}
              </h2>
              <p className="mt-2 text-sm text-ink-muted max-w-xs">
                {query
                  ? "Try a different spelling or a more general term."
                  : "Use the search bar above to find gifts, occasions, and collections."}
              </p>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between gap-4 py-4 border-b border-charcoal/10">
                <p className="text-sm text-ink-muted">
                  {sortedResults.length} result{sortedResults.length === 1 ? "" : "s"}
                </p>

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

              <div
                className={
                  view === "grid"
                    ? "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 py-6"
                    : "flex flex-col gap-3 py-6"
                }
              >
                {pageResults.map((p, i) => (
                  <ProductCard
                    key={p.slug}
                    name={p.name}
                    price={p.price}
                    rating={p.rating}
                    reviews={p.reviews}
                    inStock={p.inStock}
                    image={p.image}
                    href={`/product/${p.slug}`}
                    layout={view}
                    priority={i < 4}
                  />
                ))}
              </div>

              <div className="pt-4">
                <Pagination
                  currentPage={safePage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />
              </div>
            </>
          )}
        </div>

        <div className="mx-auto max-w-[1440px] px-4 md:px-8 pb-14">
          <StandardFeatureStrip />
        </div>
      </main>
      <ShopFooter />
    </>
  );
}
