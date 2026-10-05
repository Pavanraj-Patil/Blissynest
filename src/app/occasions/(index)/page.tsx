import type { Metadata } from "next";
import { TopBar } from "@/components/layout/TopBar";
import { Header } from "@/components/layout/Header";
import { PageHero } from "@/components/pages/PageHero";
import { ShopGiftBanner } from "@/components/shop/ShopGiftBanner";
import { StandardFeatureStrip } from "@/components/shop/StandardFeatureStrip";
import { ShopFooter } from "@/components/shop/ShopFooter";
import { OccasionCard } from "@/components/ui/OccasionCard";
import { getPageContent } from "@/lib/content-service";

type OccasionTile = { label: string; slug: string; image: string; dark: boolean };

export const metadata: Metadata = {
  title: "Occasions | Blissynest",
  description: "From birthdays to just because, find gifts curated for every moment worth celebrating.",
};

export default async function OccasionsPage() {
  // Reuses the homepage's "made-for-the-moment" tiles — same admin edit,
  // same tiles everywhere, instead of a second hardcoded copy that drifts.
  const content = await getPageContent("home");
  const tiles = content["made-for-the-moment"].tiles as OccasionTile[];
  const header = (await getPageContent("occasions")).header as { eyebrow: string; heading: string; intro: string };

  return (
    <>
      <TopBar />
      <Header />
      <main>
        <PageHero
          crumbs={[{ label: "Home", href: "/" }, { label: "Occasions" }]}
          eyebrow={header.eyebrow}
          title={header.heading}
          intro={header.intro}
        />

        <div className="mx-auto max-w-[1440px] px-4 md:px-8 py-12 md:py-16">
          <div
            style={{ "--cols": Math.min(tiles.length, 7) } as React.CSSProperties}
            className="flex sm:grid sm:grid-cols-4 lg:[grid-template-columns:repeat(var(--cols),minmax(0,200px))] gap-4 md:gap-5 overflow-x-auto scrollbar-none -mx-4 px-4 sm:mx-0 sm:px-0"
          >
            {tiles.map((occ) => (
              <OccasionCard
                key={occ.label}
                label={occ.label}
                image={occ.image}
                href={`/occasions/${occ.slug}`}
                dark={occ.dark}
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
