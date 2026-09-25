import type { Metadata } from "next";
import { TopBar } from "@/components/layout/TopBar";
import { Header } from "@/components/layout/Header";
import { ShopFooter } from "@/components/shop/ShopFooter";
import { PageHero } from "@/components/pages/PageHero";
import { PageCta } from "@/components/pages/PageCta";
import { FaqAccordion, type FaqGroup } from "@/components/help/FaqAccordion";
import { getPageContent } from "@/lib/content-service";

export const metadata: Metadata = {
  title: "FAQs | Blissynest",
  description: "Answers to common questions about orders, shipping, returns, and personalisation.",
};

export default async function FaqsPage() {
  const content = await getPageContent("faqs");
  const hero = content.hero;
  const faqGroups = hero.groups as FaqGroup[];

  return (
    <>
      <TopBar />
      <Header />
      <main>
        <PageHero
          crumbs={[{ label: "Home", href: "/" }, { label: "FAQs" }]}
          eyebrow={hero.eyebrow as string}
          title={hero.heading as string}
          intro="The things people ask us most, answered plainly."
          image="/edit-luxury.png"
          imageAlt="A gold-wrapped gift with a pearl strand and ribbon"
        />
        <div className="mx-auto max-w-[1200px] px-4 md:px-8 py-12 md:py-16">
          <FaqAccordion groups={faqGroups} />
        </div>
        <PageCta
          title="Didn't find your answer?"
          body="Send us a note. A real person reads every message, usually within a day."
          primary={{ label: "Contact us", href: "/contact" }}
          secondary={{ label: "Track an order", href: "/track-order" }}
        />
      </main>
      <ShopFooter />
    </>
  );
}
