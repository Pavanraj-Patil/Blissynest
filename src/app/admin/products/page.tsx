import Link from "next/link";
import Image from "next/image";
import { ExternalLink, Search, PackageX, Plus } from "lucide-react";
import { requireAdmin } from "@/lib/admin/require-admin";
import { db } from "@/lib/db";
import type { Prisma } from "@/generated/prisma/client";
import { ProductRowActions } from "./ProductRowActions";

const PAGE_SIZE = 20;

const statusStyles: Record<string, string> = {
  PUBLISHED: "bg-olive/10 text-olive-dark",
  DRAFT: "bg-gold/15 text-charcoal",
  ARCHIVED: "bg-charcoal/10 text-charcoal-light",
};

export default async function AdminProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string; page?: string }>;
}) {
  await requireAdmin();
  const { q, status, page: pageParam } = await searchParams;
  const query = (q ?? "").trim();
  const page = Math.max(1, Number(pageParam) || 1);

  const where: Prisma.ProductWhereInput = {
    ...(query && { name: { contains: query } }),
    ...(status && ["PUBLISHED", "DRAFT", "ARCHIVED"].includes(status) && { status: status as never }),
  };

  const [products, total] = await Promise.all([
    db.product.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
    db.product.count({ where }),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  function pageHref(targetPage: number) {
    const params = new URLSearchParams();
    if (query) params.set("q", query);
    if (status) params.set("status", status);
    params.set("page", String(targetPage));
    return `/admin/products?${params.toString()}`;
  }

  const statusFilters = [
    { label: "All", value: "" },
    { label: "Published", value: "PUBLISHED" },
    { label: "Draft", value: "DRAFT" },
    { label: "Archived", value: "ARCHIVED" },
  ];

  return (
    <div className="max-w-[1400px] mx-auto space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl text-charcoal">Products</h1>
          <p className="mt-1 text-sm text-ink-muted">{total} product{total === 1 ? "" : "s"} in your catalogue</p>
        </div>
        <Link
          href="/admin/products/new"
          className="inline-flex items-center gap-2 rounded-xl bg-olive text-cream px-5 py-2.5 text-xs font-semibold tracking-[0.1em] uppercase hover:bg-olive-dark transition-colors shrink-0"
        >
          <Plus size={14} />
          Add Product
        </Link>
      </div>

      <div className="rounded-2xl border border-charcoal/10 bg-white p-4">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <form className="flex-1 max-w-sm">
            <label className="relative block">
              <Search size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-charcoal/35" />
              <input
                type="text"
                name="q"
                defaultValue={query}
                placeholder="Search by name…"
                className="w-full rounded-lg border border-charcoal/15 py-2 pl-9 pr-3 text-sm text-charcoal placeholder:text-ink-muted focus:outline-none focus:border-olive"
              />
              {status && <input type="hidden" name="status" value={status} />}
            </label>
          </form>

          <div className="flex items-center gap-1.5">
            {statusFilters.map((f) => (
              <Link
                key={f.value}
                href={`/admin/products${f.value ? `?status=${f.value}` : ""}${query ? `${f.value ? "&" : "?"}q=${encodeURIComponent(query)}` : ""}`}
                className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                  (status ?? "") === f.value
                    ? "bg-olive text-cream"
                    : "border border-charcoal/15 text-charcoal-light hover:bg-cream-dark"
                }`}
              >
                {f.label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-charcoal/10 bg-white overflow-hidden">
        {products.length === 0 ? (
          <div className="flex flex-col items-center py-16 text-center">
            <PackageX size={32} className="text-charcoal/20" strokeWidth={1.5} />
            <p className="mt-3 text-sm text-charcoal">No products match this search.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-ink-muted border-b border-charcoal/10 bg-cream-dark/50">
                  <th className="py-3 pl-5 pr-3 font-medium">Product</th>
                  <th className="py-3 px-3 font-medium">Category</th>
                  <th className="py-3 px-3 font-medium">Price</th>
                  <th className="py-3 px-3 font-medium">Stock</th>
                  <th className="py-3 px-3 font-medium">Status</th>
                  <th className="py-3 px-3 font-medium text-right">Rating</th>
                  <th className="py-3 pr-5 pl-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p.id} className="border-b border-charcoal/5 last:border-0 hover:bg-cream/40">
                    <td className="py-2.5 pl-5 pr-3">
                      <div className="flex items-center gap-3">
                        <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-lg bg-cream-dark">
                          <Image
                            src={(p.images as string[])[0]}
                            alt={p.name}
                            fill
                            className="object-cover"
                            sizes="44px"
                          />
                        </div>
                        <div className="min-w-0">
                          <p className="truncate max-w-[220px] font-medium text-charcoal">{p.name}</p>
                          <Link
                            href={`/product/${p.slug}`}
                            target="_blank"
                            className="flex items-center gap-1 text-[11px] text-ink-muted hover:text-terracotta-dark"
                          >
                            View on store <ExternalLink size={10} />
                          </Link>
                        </div>
                      </div>
                    </td>
                    <td className="py-2.5 px-3 text-charcoal-light">{p.category}</td>
                    <td className="py-2.5 px-3 text-charcoal">
                      ₹{Math.round(p.basePrice / 100).toLocaleString("en-IN")}
                    </td>
                    <td className="py-2.5 px-3">
                      <span className={p.stockQuantity < 10 ? "text-terracotta-dark font-medium" : "text-charcoal-light"}>
                        {p.stockQuantity}
                      </span>
                    </td>
                    <td className="py-2.5 px-3">
                      <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${statusStyles[p.status]}`}>
                        {p.status}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-right text-charcoal-light">
                      {p.rating.toFixed(1)} ({p.reviewCount})
                    </td>
                    <td className="py-2.5 pr-5 pl-3">
                      <div className="flex justify-end">
                        <ProductRowActions id={p.id} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          {Array.from({ length: totalPages }).map((_, i) => (
            <Link
              key={i}
              href={pageHref(i + 1)}
              className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-medium transition-colors ${
                page === i + 1 ? "bg-olive text-cream" : "text-charcoal-light hover:bg-cream-dark"
              }`}
            >
              {i + 1}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
