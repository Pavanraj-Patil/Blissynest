import type { Metadata } from "next";
import { ContactPageClient } from "./ContactPageClient";

export const metadata: Metadata = {
  title: "Contact Us | Blissynest",
  description: "Get in touch with the Blissynest team — questions, bulk orders, or just to say hi.",
};

export default function ContactPage() {
  return <ContactPageClient />;
}
