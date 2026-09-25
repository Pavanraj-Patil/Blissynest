import type { Metadata } from "next";
import { TopBar } from "@/components/layout/TopBar";
import { Header } from "@/components/layout/Header";
import { ShopFooter } from "@/components/shop/ShopFooter";
import { PageHero } from "@/components/pages/PageHero";
import { ContentCta } from "@/components/pages/ContentCta";
import { PolicyRows, type PolicySection } from "@/components/pages/PolicyRows";
import { getPageContent, getSectionVisibility } from "@/lib/content-service";

export const metadata: Metadata = {
  title: "Shipping & Delivery | Blissynest",
  description: "Delivery timelines, shipping charges, and coverage for Blissynest orders.",
};

export default async function ShippingPage() {
  const [content, show] = await Promise.all([getPageContent("shipping"), getSectionVisibility("shipping")]);
  const hero = content.hero;
  const sections = hero.sections as PolicySection[];

  return (
    <>
      <TopBar />
      <Header />
      <main>
        <PageHero
          crumbs={[{ label: "Home", href: "/" }, { label: "Shipping & Delivery" }]}
          eyebrow={hero.eyebrow as string}
          title={hero.heading as string}
          intro={hero.intro as string}
          image="/edit-hampers.png"
          imageAlt="A wicker gift hamper tied with a copper ribbon"
        />
        <PolicyRows sections={sections} />
        <ContentCta content={content.cta} visible={show.cta} />
      </main>
      <ShopFooter />
    </>
  );
}
