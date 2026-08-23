import type { Metadata } from "next";
import { TopBar } from "@/components/layout/TopBar";
import { Header } from "@/components/layout/Header";
import { Breadcrumb } from "@/components/shop/Breadcrumb";
import { ShopFooter } from "@/components/shop/ShopFooter";
import { FaqAccordion, type FaqGroup } from "@/components/help/FaqAccordion";

export const metadata: Metadata = {
  title: "FAQs | Blissynest",
  description: "Answers to common questions about orders, shipping, returns, and personalisation.",
};

const faqGroups: FaqGroup[] = [
  {
    category: "Orders & Payments",
    items: [
      {
        question: "How do I track my order?",
        answer:
          "Head to the Track Order page and enter your order number and email — you'll see the latest status right away.",
      },
      {
        question: "Can I change or cancel my order after placing it?",
        answer:
          "If your order hasn't shipped yet, contact us as soon as possible and we'll do our best to update or cancel it. Once it's dispatched, it'll need to go through the returns process instead.",
      },
      {
        question: "What payment methods do you accept?",
        answer: "Cards, UPI, net banking, and cash on delivery, all selectable at checkout.",
      },
    ],
  },
  {
    category: "Shipping",
    items: [
      {
        question: "How long does delivery take?",
        answer: "Most orders arrive within 3–5 business days. Personalised items may take 1–2 days longer to prepare.",
      },
      {
        question: "Is shipping free?",
        answer: "Yes, on all orders above ₹999. Orders below that have a flat ₹99 shipping charge.",
      },
    ],
  },
  {
    category: "Returns & Refunds",
    items: [
      {
        question: "What's your return policy?",
        answer: "Unused items in original packaging can be returned within 7 days of delivery. See the full Returns page for details.",
      },
      {
        question: "Can I return a personalised gift?",
        answer: "Personalised and made-to-order items can't be returned unless they arrive damaged or incorrect.",
      },
    ],
  },
  {
    category: "Personalisation & Gifting",
    items: [
      {
        question: "Can I add a gift note?",
        answer: "Yes — every order can include a free handwritten-style gift note, added during checkout.",
      },
      {
        question: "Can prices be hidden if I'm sending this as a gift?",
        answer: "Yes, there's a 'hide prices on packing slip' option in the gift step at checkout.",
      },
    ],
  },
];

export default function FaqsPage() {
  return (
    <>
      <TopBar />
      <Header />
      <main>
        <div className="mx-auto max-w-[1440px] px-4 md:px-8 pt-5">
          <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "FAQs" }]} />
        </div>

        <div className="mx-auto max-w-[1440px] px-4 md:px-8 pt-6 pb-10 text-center">
          <p className="eyebrow text-terracotta-dark mb-2">Good to Know</p>
          <h1 className="font-serif text-3xl md:text-4xl text-charcoal">Frequently Asked Questions</h1>
        </div>

        <div className="mx-auto max-w-2xl px-4 md:px-8 pb-16">
          <FaqAccordion groups={faqGroups} />
        </div>
      </main>
      <ShopFooter />
    </>
  );
}
