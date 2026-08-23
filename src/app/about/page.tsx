import type { Metadata } from "next";
import { TopBar } from "@/components/layout/TopBar";
import { Header } from "@/components/layout/Header";
import { Breadcrumb } from "@/components/shop/Breadcrumb";
import { StandardFeatureStrip } from "@/components/shop/StandardFeatureStrip";
import { ShopFooter } from "@/components/shop/ShopFooter";

export const metadata: Metadata = {
  title: "About Us | Blissynest",
  description:
    "Blissynest is a gifting studio for the people who make life beautiful — thoughtfully curated gifts for every feeling worth celebrating.",
};

export default function AboutPage() {
  return (
    <>
      <TopBar />
      <Header />
      <main>
        <div className="mx-auto max-w-[1440px] px-4 md:px-8 pt-5">
          <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "About Us" }]} />
        </div>

        <div className="mx-auto max-w-[1440px] px-4 md:px-8 pt-6 pb-10 text-center">
          <p className="eyebrow text-terracotta-dark mb-2">Our Story</p>
          <h1 className="font-serif text-3xl md:text-4xl text-charcoal">About Blissynest</h1>
        </div>

        <div className="mx-auto max-w-2xl px-4 md:px-8 pb-14 text-center">
          <p className="text-sm md:text-base text-charcoal-light leading-relaxed">
            Blissynest started with a simple frustration: most gifting felt
            transactional — a rushed scroll, a generic hamper, a card nobody
            reads. We wanted something that felt more like the moment it was
            marking. So we built a place where every gift is chosen the way
            you&rsquo;d choose one for someone you actually love — with a
            little thought, a little care, and packaging that feels like part
            of the gift, not an afterthought.
          </p>
          <p className="mt-4 text-sm md:text-base text-charcoal-light leading-relaxed">
            Today that means a catalogue built around real moments — birthdays,
            anniversaries, festivals, thank-yous, and the days that don&rsquo;t
            need a reason at all — curated by people who still get excited
            about a well-wrapped box.
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
