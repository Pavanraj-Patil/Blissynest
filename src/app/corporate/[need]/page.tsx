import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { TopBar } from "@/components/layout/TopBar";
import { Header } from "@/components/layout/Header";
import { Breadcrumb } from "@/components/shop/Breadcrumb";
import { StandardFeatureStrip } from "@/components/shop/StandardFeatureStrip";
import { ShopFooter } from "@/components/shop/ShopFooter";
import { ProductCard } from "@/components/ui/ProductCard";
import { db } from "@/lib/db";
import { toListProduct } from "@/lib/product-adapters";
import { corporateNeeds, isCorporateNeedSlug } from "@/lib/corporate-data";

type Props = {
  params: Promise<{ need: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { need } = await params;
  if (!isCorporateNeedSlug(need)) {
    return { title: "Corporate Gifting | Blissynest" };
  }
  const meta = corporateNeeds.find((n) => n.slug === need)!;
  return {
    title: `${meta.title} | Corporate Gifting | Blissynest`,
    description: meta.subtitle,
  };
}

export default async function CorporateNeedPage({ params }: Props) {
  const { need } = await params;
  if (!isCorporateNeedSlug(need)) {
    notFound();
  }
  const meta = corporateNeeds.find((n) => n.slug === need)!;

  const rows = await db.product.findMany({
    where: { status: "PUBLISHED", corporateOnly: true, corporateNeeds: { array_contains: need } },
    orderBy: [{ sortRank: { sort: "asc", nulls: "last" } }, { createdAt: "asc" }],
  });
  const products = rows.map(toListProduct);

  return (
    <>
      <TopBar />
      <Header />
      <main>
        <div className="mx-auto max-w-[1440px] px-4 md:px-8 pt-5">
          <Breadcrumb
            items={[
              { label: "Home", href: "/" },
              { label: "Corporate Gifting", href: "/corporate" },
              { label: meta.title },
            ]}
          />
        </div>

        <div className="mx-auto max-w-[1440px] px-4 md:px-8 pt-4">
          <h1 className="font-serif text-2xl md:text-3xl text-charcoal">{meta.title}</h1>
          <p className="mt-1.5 text-sm text-ink-muted">{meta.subtitle}</p>
        </div>

        <div className="mx-auto max-w-[1440px] px-4 md:px-8 mt-6">
          <div className="flex flex-col items-center justify-between gap-4 rounded-2xl bg-olive-dark px-6 py-5 text-center sm:flex-row sm:text-left">
            <p className="text-sm text-cream/90">
              Ordering for your team or clients? Get a custom bulk quote for {meta.title.toLowerCase()}.
            </p>
            <Link
              href={`/corporate/quote?interest=${meta.slug}`}
              className="inline-flex shrink-0 items-center gap-2 rounded-full bg-cream px-6 py-3 text-xs font-semibold tracking-[0.1em] uppercase text-olive-dark transition-colors hover:bg-cream-dark"
            >
              Request a Bulk Quote
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>

        <div className="mx-auto max-w-[1440px] px-4 md:px-8 pb-16 pt-8">
          {products.length === 0 ? (
            <p className="py-16 text-center text-sm text-ink-muted">
              More {meta.title.toLowerCase()} options are on the way — reach out for a bulk
              quote and we&apos;ll help you find the right fit today.
            </p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {products.map((p, i) => (
                <ProductCard
                  key={p.id}
                  name={p.name}
                  price={p.price}
                  rating={p.rating}
                  reviews={p.reviews}
                  inStock={p.inStock}
                  image={p.image}
                  href={`/product/${p.id}`}
                  priority={i < 4}
                  badge={p.badge}
                />
              ))}
            </div>
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
