import type { Metadata } from "next";
import { TopBar } from "@/components/layout/TopBar";
import { Header } from "@/components/layout/Header";
import { ShopFooter } from "@/components/shop/ShopFooter";
import { PageHero } from "@/components/pages/PageHero";
import { PageCta } from "@/components/pages/PageCta";
import { PolicyRows, type PolicySection } from "@/components/pages/PolicyRows";
import { getPageContent } from "@/lib/content-service";

export const metadata: Metadata = {
  title: "Shipping & Delivery | Blissynest",
  description: "Delivery timelines, shipping charges, and coverage for Blissynest orders.",
};

export default async function ShippingPage() {
  const content = await getPageContent("shipping");
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
          intro="From our studio to their doorstep, wrapped with care and tracked all the way."
          image="/edit-hampers.png"
          imageAlt="A wicker gift hamper tied with a copper ribbon"
        />
        <PolicyRows sections={sections} />
        <PageCta
          title="Wondering where your gift is?"
          body="Pop in your order number and we'll show you exactly where it is on its way."
          primary={{ label: "Track my order", href: "/track-order" }}
          secondary={{ label: "Talk to us", href: "/contact" }}
        />
      </main>
      <ShopFooter />
    </>
  );
}
