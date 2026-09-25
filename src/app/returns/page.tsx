import type { Metadata } from "next";
import { TopBar } from "@/components/layout/TopBar";
import { Header } from "@/components/layout/Header";
import { ShopFooter } from "@/components/shop/ShopFooter";
import { PageHero } from "@/components/pages/PageHero";
import { PageCta } from "@/components/pages/PageCta";
import { PolicyRows, type PolicySection } from "@/components/pages/PolicyRows";
import { getPageContent } from "@/lib/content-service";

export const metadata: Metadata = {
  title: "Returns | Blissynest",
  description: "Our returns, refunds, and exchange policy for Blissynest orders.",
};

export default async function ReturnsPage() {
  const content = await getPageContent("returns");
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
          intro="If a gift isn't quite right, we'll make it right. Here's how that works, in plain words."
          image="/edit-minimalist.png"
          imageAlt="A ceramic vase with dried flowers on linen"
        />
        <PolicyRows sections={sections} />
        <PageCta
          title="Need to start a return?"
          body="Write to us with your order number and we'll guide you through it, step by step."
          primary={{ label: "Contact us", href: "/contact" }}
          secondary={{ label: "Read the FAQs", href: "/faqs" }}
        />
      </main>
      <ShopFooter />
    </>
  );
}
