import type { Metadata } from "next";
import { CorporateQuotePageClient } from "./CorporateQuotePageClient";

export const metadata: Metadata = {
  title: "Get a Corporate Gifting Quote | Blissynest",
  description: "Tell us about your team or event and we'll put together a corporate gifting proposal.",
};

export default function CorporateQuotePage() {
  return <CorporateQuotePageClient />;
}
