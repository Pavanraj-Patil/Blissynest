import type { Metadata } from "next";
import { TopBar } from "@/components/layout/TopBar";
import { Header } from "@/components/layout/Header";
import { Breadcrumb } from "@/components/shop/Breadcrumb";
import { ShopGiftBanner } from "@/components/shop/ShopGiftBanner";
import { StandardFeatureStrip } from "@/components/shop/StandardFeatureStrip";
import { ShopFooter } from "@/components/shop/ShopFooter";
import { OccasionCard } from "@/components/ui/OccasionCard";
import { getPageContent } from "@/lib/content-service";
import { getContentIcon } from "@/lib/content-icons";

type OccasionTile = { label: string; slug: string; image: string; icon: string; dark: boolean };

export const metadata: Metadata = {
  title: "Occasions | Blissynest",
  description: "From birthdays to just because — find gifts curated for every moment worth celebrating.",
};

export default async function OccasionsPage() {
  // Reuses the homepage's "made-for-the-moment" tiles — same admin edit,
  // same tiles everywhere, instead of a second hardcoded copy that drifts.
  const content = await getPageContent("home");
  const tiles = content["made-for-the-moment"].tiles as OccasionTile[];

  return (
    <>
      <TopBar />
      <Header />
      <main>
        <div className="mx-auto max-w-[1440px] px-4 md:px-8 pt-5">
          <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Occasions" }]} />
        </div>

        <div className="mx-auto max-w-[1440px] px-4 md:px-8 pt-6 pb-10 text-center">
          <p className="eyebrow text-terracotta-dark mb-2">Made For The Moment</p>
          <h1 className="font-serif text-3xl md:text-4xl text-charcoal">
            Occasions
          </h1>
          <p className="mt-3 text-sm text-ink-muted max-w-xl mx-auto">
            From birthdays to just because — find gifts curated for every
            moment worth celebrating.
          </p>
        </div>

        <div className="mx-auto max-w-[1440px] px-4 md:px-8 pb-16">
          <div className="flex sm:grid sm:grid-cols-4 lg:grid-cols-7 gap-4 md:gap-5 overflow-x-auto scrollbar-none -mx-4 px-4 sm:mx-0 sm:px-0">
            {tiles.map((occ) => (
              <OccasionCard
                key={occ.label}
                label={occ.label}
                image={occ.image}
                icon={getContentIcon(occ.icon)}
                href={`/occasions/${occ.slug}`}
                dark={occ.dark}
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
