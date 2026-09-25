import type { Metadata } from "next";
import { TopBar } from "@/components/layout/TopBar";
import { getBusinessDetails, getPageContent } from "@/lib/content-service";
import { CorporateQuotePageClient } from "./CorporateQuotePageClient";

export const metadata: Metadata = {
  title: "Get a Corporate Gifting Quote | Blissynest",
  description: "Tell us about your team or event and we'll put together a corporate gifting proposal.",
};

export default async function CorporateQuotePage() {
  const [business, content] = await Promise.all([getBusinessDetails(), getPageContent("corporate-quote")]);
  const header = content.header as { eyebrow: string; quoteIntro: string; consultationIntro: string };
  return (
    <>
      <TopBar />
      <CorporateQuotePageClient email={business.contactEmail} phone={business.contactPhone} header={header} />
    </>
  );
}
