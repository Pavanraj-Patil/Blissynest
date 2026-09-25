import type { Metadata } from "next";
import { LegalDocument, type LegalSection } from "@/components/legal/LegalDocument";
import { getBusinessDetails } from "@/lib/content-service";

export const metadata: Metadata = {
  title: "Terms & Conditions | Blissynest",
  description: "The terms that apply when you browse and buy from Blissynest.",
};

export default async function TermsPage() {
  const business = await getBusinessDetails();
  const name = business.legalName || "Blissynest";

  const sections: LegalSection[] = [
    {
      heading: "Using our store",
      blocks: [
        { type: "p", text: `By browsing or placing an order on this website you agree to these terms. The site is operated by ${name}. You must be at least 18 years old, or use the site with a parent or guardian, to place an order.` },
      ],
    },
    {
      heading: "Products and prices",
      blocks: [
        {
          type: "ul",
          items: [
            "All prices are in Indian Rupees (₹) and shown inclusive of applicable taxes unless stated otherwise.",
            "We work hard to keep descriptions, photos and prices accurate. Colours may differ slightly between screens, and handmade or personalised items can vary a little from the picture.",
            "If we spot an obvious pricing or stock error after you order, we will contact you to confirm, correct or cancel the order and refund anything you have paid.",
            "Stock is limited. An order is confirmed only when we accept it, and we may cancel an order for an item that turns out to be unavailable.",
          ],
        },
      ],
    },
    {
      heading: "Orders and payment",
      blocks: [
        {
          type: "ul",
          items: [
            "You can pay online (card, UPI, netbanking) through our payment provider, or choose Cash on Delivery where it is offered for your order.",
            "Cash on Delivery may not be available for every product or order value.",
            "Discount codes are valid only as described when issued, cannot be combined unless stated, and may be limited to first orders or a single use.",
            "We may cancel or refuse an order where we suspect fraud or misuse.",
          ],
        },
      ],
    },
    {
      heading: "Personalised products and photos",
      blocks: [
        { type: "p", text: "Personalised items are made specially for you and generally cannot be returned or exchanged, unless they arrive damaged or defective. Please check every name, message and photo carefully before you order. We produce exactly what you submit." },
        { type: "p", text: "If you upload a photo or text, you confirm you have the right to use it and that it is lawful, not offensive, and does not infringe anyone else's rights. We may decline any personalisation request we consider inappropriate and will refund you if so. You allow us to use what you upload only to make and deliver your order." },
      ],
    },
    {
      heading: "Shipping, returns and refunds",
      blocks: [
        { type: "p", text: "Delivery timelines and charges are set out on our Shipping & Delivery page, and our return and refund rules are on the Returns & Refunds page. Both form part of these terms." },
      ],
    },
    {
      heading: "Your account",
      blocks: [
        { type: "p", text: "You are responsible for keeping your login details private and for everything done through your account. Tell us straight away if you think someone else has used it." },
      ],
    },
    {
      heading: "Acceptable use",
      blocks: [
        { type: "p", text: "Please do not misuse the site: no attempts to break or overload it, scrape it, place fake orders, or use it for anything unlawful. We may suspend access where this happens." },
      ],
    },
    {
      heading: "Content and ownership",
      blocks: [
        { type: "p", text: "The Blissynest name, logo, product photography, text and design belong to us or our licensors. You may not copy or reuse them commercially without our written permission." },
      ],
    },
    {
      heading: "Reviews",
      blocks: [
        { type: "p", text: "Reviews on the site come from customers who have bought the product. We may remove reviews that are abusive, unlawful or clearly not about the product." },
      ],
    },
    {
      heading: "Our responsibility",
      blocks: [
        { type: "p", text: "We will deliver what you ordered with reasonable care and skill. To the extent the law allows, we are not liable for indirect or consequential losses, or for delays caused by events beyond our control such as courier disruption, weather or strikes. Nothing in these terms limits your rights under Indian consumer protection law." },
      ],
    },
    {
      heading: "Governing law",
      blocks: [
        { type: "p", text: "These terms are governed by the laws of India. Disputes are subject to the courts at the location of our registered office, without affecting any right you have to bring a complaint before a consumer forum." },
      ],
    },
    {
      heading: "Changes",
      blocks: [
        { type: "p", text: "We may update these terms from time to time. The date at the top shows when they last changed, and the version in force when you place an order is the one that applies to it." },
      ],
    },
  ];

  return (
    <LegalDocument
      title="Terms & Conditions"
      intro={`These terms apply when you use this website and buy from ${name}. Please read them together with our Privacy Policy.`}
      sections={sections}
      business={business}
    />
  );
}
