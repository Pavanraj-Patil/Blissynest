import type { Metadata } from "next";
import { TopBar } from "@/components/layout/TopBar";
import { Header } from "@/components/layout/Header";
import { Breadcrumb } from "@/components/shop/Breadcrumb";
import { ShopFooter } from "@/components/shop/ShopFooter";
import { CorporateHero } from "@/components/corporate/CorporateHero";
import { CorporateNeeds } from "@/components/corporate/CorporateNeeds";
import { HowItWorks } from "@/components/corporate/HowItWorks";
import { WhyChooseUs } from "@/components/corporate/WhyChooseUs";
import { CuratedCollections } from "@/components/corporate/CuratedCollections";
import { TrustedByStrip } from "@/components/corporate/TrustedByStrip";
import { CorporateFinalCta } from "@/components/corporate/CorporateFinalCta";

export const metadata: Metadata = {
  title: "Corporate Gifting | Blissynest",
  description: "Bulk and branded gifting for teams, clients, and every corporate occasion.",
};

export default function CorporatePage() {
  return (
    <>
      <TopBar />
      <Header />
      <main>
        <div className="mx-auto max-w-[1440px] px-4 md:px-8 pt-5">
          <Breadcrumb
            items={[
              { label: "Home", href: "/" },
              { label: "Corporate Gifting" },
            ]}
          />
        </div>

        <CorporateHero />
        <CorporateNeeds />
        <HowItWorks />
        <WhyChooseUs />
        <CuratedCollections />
        <TrustedByStrip />
        <CorporateFinalCta />
      </main>
      <ShopFooter />
    </>
  );
}
