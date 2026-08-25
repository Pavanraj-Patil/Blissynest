import type { Metadata } from "next";
import { TopBar } from "@/components/layout/TopBar";
import { getPageContent } from "@/lib/content-service";
import { ContactPageClient } from "./ContactPageClient";

export const metadata: Metadata = {
  title: "Contact Us | Blissynest",
  description: "Get in touch with the Blissynest team — questions, bulk orders, or just to say hi.",
};

export default async function ContactPage() {
  const content = await getPageContent("contact");

  return (
    <>
      <TopBar />
      <ContactPageClient content={content.hero} />
    </>
  );
}
