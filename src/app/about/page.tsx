import type { Metadata } from "next";
import { TopBar } from "@/components/layout/TopBar";
import { Header } from "@/components/layout/Header";
import { Breadcrumb } from "@/components/shop/Breadcrumb";
import { StandardFeatureStrip } from "@/components/shop/StandardFeatureStrip";
import { ShopFooter } from "@/components/shop/ShopFooter";
import { getPageContent } from "@/lib/content-service";

export const metadata: Metadata = {
  title: "About Us | Blissynest",
  description:
    "Blissynest is a gifting studio for the people who make life beautiful — thoughtfully curated gifts for every feeling worth celebrating.",
};

export default async function AboutPage() {
  const content = await getPageContent("about");
  const hero = content.hero;

  return (
    <>
      <TopBar />
      <Header />
      <main>
        <div className="mx-auto max-w-[1440px] px-4 md:px-8 pt-5">
          <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "About Us" }]} />
        </div>

        <div className="mx-auto max-w-[1440px] px-4 md:px-8 pt-6 pb-10 text-center">
          <p className="eyebrow text-terracotta-dark mb-2">{hero.eyebrow as string}</p>
          <h1 className="font-serif text-3xl md:text-4xl text-charcoal">{hero.heading as string}</h1>
        </div>

        <div className="mx-auto max-w-2xl px-4 md:px-8 pb-14 text-center">
          <p className="text-sm md:text-base text-charcoal-light leading-relaxed">
            {hero.paragraph1 as string}
          </p>
          <p className="mt-4 text-sm md:text-base text-charcoal-light leading-relaxed">
            {hero.paragraph2 as string}
          </p>
        </div>

        <div className="mx-auto max-w-[1440px] px-4 md:px-8 pb-16">
          <StandardFeatureStrip />
        </div>
      </main>
      <ShopFooter />
    </>
  );
}
