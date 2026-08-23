import type { Metadata } from "next";
import { TopBar } from "@/components/layout/TopBar";
import { Header } from "@/components/layout/Header";
import { Breadcrumb } from "@/components/shop/Breadcrumb";
import { ShopGiftBanner } from "@/components/shop/ShopGiftBanner";
import { StandardFeatureStrip } from "@/components/shop/StandardFeatureStrip";
import { ShopFooter } from "@/components/shop/ShopFooter";
import { CollectionCard } from "@/components/ui/CollectionCard";
import { editCollections } from "@/lib/mock-data";

export const metadata: Metadata = {
  title: "Collections | Blissynest",
  description: "The Blissynest Edit — five curated collections for every kind of gifting moment.",
};

export default function CollectionsPage() {
  return (
    <>
      <TopBar />
      <Header />
      <main>
        <div className="mx-auto max-w-[1440px] px-4 md:px-8 pt-5">
          <Breadcrumb
            items={[{ label: "Home", href: "/" }, { label: "The Blissynest Edit" }]}
          />
        </div>

        <div className="mx-auto max-w-[1440px] px-4 md:px-8 pt-6 pb-10 text-center">
          <p className="eyebrow text-terracotta-dark mb-2">Curated Collections</p>
          <h1 className="font-serif text-3xl md:text-4xl text-charcoal">
            The Blissynest Edit
          </h1>
          <p className="mt-3 text-sm text-ink-muted max-w-xl mx-auto">
            Five edits, each with its own story — pick the one that matches
            the moment.
          </p>
        </div>

        <div className="mx-auto max-w-[1440px] px-4 md:px-8 pb-16">
          <div className="flex sm:grid sm:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-5 overflow-x-auto scrollbar-none -mx-4 px-4 sm:mx-0 sm:px-0">
            {editCollections.map((c) => (
              <CollectionCard
                key={c.slug}
                title={c.title}
                subtitle={c.subtitle}
                image={c.image}
                href={`/collections/${c.slug}`}
                dark={c.title === "The Luxury Edit"}
              />
            ))}
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
    </>
  );
}
