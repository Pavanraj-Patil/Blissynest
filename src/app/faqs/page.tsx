import type { Metadata } from "next";
import { TopBar } from "@/components/layout/TopBar";
import { Header } from "@/components/layout/Header";
import { Breadcrumb } from "@/components/shop/Breadcrumb";
import { ShopFooter } from "@/components/shop/ShopFooter";
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
        <div className="mx-auto max-w-[1440px] px-4 md:px-8 pt-5">
          <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "FAQs" }]} />
        </div>

        <div className="mx-auto max-w-[1440px] px-4 md:px-8 pt-6 pb-10 text-center">
          <p className="eyebrow text-terracotta-dark mb-2">{hero.eyebrow as string}</p>
          <h1 className="font-serif text-3xl md:text-4xl text-charcoal">{hero.heading as string}</h1>
        </div>

        <div className="mx-auto max-w-2xl px-4 md:px-8 pb-16">
          <FaqAccordion groups={faqGroups} />
        </div>
      </main>
      <ShopFooter />
    </>
  );
}
