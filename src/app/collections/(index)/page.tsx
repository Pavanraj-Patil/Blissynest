import type { Metadata } from "next";
import { TopBar } from "@/components/layout/TopBar";
import { Header } from "@/components/layout/Header";
import { PageHero } from "@/components/pages/PageHero";
import { ShopGiftBanner } from "@/components/shop/ShopGiftBanner";
import { StandardFeatureStrip } from "@/components/shop/StandardFeatureStrip";
import { ShopFooter } from "@/components/shop/ShopFooter";
import { CollectionCard } from "@/components/ui/CollectionCard";
import { getPageContent } from "@/lib/content-service";

type CollectionTile = { title: string; subtitle: string; slug: string; image: string };

export const metadata: Metadata = {
  title: "Collections | Blissynest",
  description: "The Blissynest Edit: curated collections for every kind of gifting moment.",
};

export default async function CollectionsPage() {
  // Reuses the homepage's "blissynest-edit" tiles — same admin edit, same
  // tiles everywhere, instead of a second hardcoded copy that drifts.
  const content = await getPageContent("home");
  const tiles = content["blissynest-edit"].tiles as CollectionTile[];
  const header = (await getPageContent("collections")).header as { eyebrow: string; heading: string; intro: string };

  return (
    <>
      <TopBar />
      <Header />
      <main>
        <PageHero
          crumbs={[{ label: "Home", href: "/" }, { label: "The Blissynest Edit" }]}
          eyebrow={header.eyebrow}
          title={header.heading}
          intro={header.intro}
        />

        <div className="mx-auto max-w-[1440px] px-4 md:px-8 py-12 md:py-16">
          <div
            style={{ "--cols": Math.min(tiles.length, 5) } as React.CSSProperties}
            className="grid grid-cols-2 sm:grid-cols-3 lg:[grid-template-columns:repeat(var(--cols),minmax(0,1fr))] gap-4 md:gap-5"
          >
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
