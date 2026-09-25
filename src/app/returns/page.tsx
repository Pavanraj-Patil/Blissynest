import type { Metadata } from "next";
import { TopBar } from "@/components/layout/TopBar";
import { Header } from "@/components/layout/Header";
import { ShopFooter } from "@/components/shop/ShopFooter";
import { PageHero } from "@/components/pages/PageHero";
import { ContentCta } from "@/components/pages/ContentCta";
import { PolicyRows, type PolicySection } from "@/components/pages/PolicyRows";
import { getPageContent, getSectionVisibility } from "@/lib/content-service";

export const metadata: Metadata = {
  title: "Returns | Blissynest",
  description: "Our returns, refunds, and exchange policy for Blissynest orders.",
};

export default async function ReturnsPage() {
  const [content, show] = await Promise.all([getPageContent("returns"), getSectionVisibility("returns")]);
  const hero = content.hero;
  const sections = hero.sections as PolicySection[];

  return (
    <>
      <TopBar />
      <Header />
      <main>
        <PageHero
          crumbs={[{ label: "Home", href: "/" }, { label: "Returns & Refunds" }]}
          eyebrow={hero.eyebrow as string}
          title={hero.heading as string}
          intro={hero.intro as string}
          image="/edit-minimalist.png"
          imageAlt="A ceramic vase with dried flowers on linen"
        />
        <PolicyRows sections={sections} />
        <ContentCta content={content.cta} visible={show.cta} />
      </main>
      <ShopFooter />
    </>
  );
}
