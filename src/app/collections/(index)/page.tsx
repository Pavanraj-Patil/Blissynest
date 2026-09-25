import type { Metadata } from "next";
import { TopBar } from "@/components/layout/TopBar";
import { Header } from "@/components/layout/Header";
import { Breadcrumb } from "@/components/shop/Breadcrumb";
import { ShopGiftBanner } from "@/components/shop/ShopGiftBanner";
import { StandardFeatureStrip } from "@/components/shop/StandardFeatureStrip";
import { ShopFooter } from "@/components/shop/ShopFooter";
import { CollectionCard } from "@/components/ui/CollectionCard";
import { getPageContent } from "@/lib/content-service";

type CollectionTile = { title: string; subtitle: string; slug: string; image: string };

export const metadata: Metadata = {
  title: "Collections | Blissynest",
  description: "The Blissynest Edit — five curated collections for every kind of gifting moment.",
};

export default async function CollectionsPage() {
  // Reuses the homepage's "blissynest-edit" tiles — same admin edit, same
  // tiles everywhere, instead of a second hardcoded copy that drifts.
  const content = await getPageContent("home");
  const tiles = content["blissynest-edit"].tiles as CollectionTile[];

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
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-5">
            {tiles.map((c) => (
              <CollectionCard
                key={c.slug}
                title={c.title}
                subtitle={c.subtitle}
                image={c.image}
                href={`/collections/${c.slug}`}
                fullWidthOnMobile
              />
            ))}
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
    </>
  );
}
