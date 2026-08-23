import type { Metadata } from "next";
import { RotateCcw, Ban, Wallet, MessageCircle } from "lucide-react";
import { TopBar } from "@/components/layout/TopBar";
import { Header } from "@/components/layout/Header";
import { Breadcrumb } from "@/components/shop/Breadcrumb";
import { ShopFooter } from "@/components/shop/ShopFooter";

export const metadata: Metadata = {
  title: "Returns | Blissynest",
  description: "Our returns, refunds, and exchange policy for Blissynest orders.",
};

const sections = [
  {
    icon: RotateCcw,
    title: "Return window",
    body: "Most items can be returned within 7 days of delivery, as long as they're unused and in their original packaging. Start a return from your order confirmation email or the Track Order page.",
  },
  {
    icon: Ban,
    title: "What can't be returned",
    body: "Personalised items (engraved, monogrammed, or made to order), perishables like sweets and gourmet hampers, and gift cards can't be returned once made — these are called out on the product page before you order.",
  },
  {
    icon: Wallet,
    title: "Refunds",
    body: "Once a returned item reaches us and passes a quick quality check, refunds are processed to your original payment method within 5–7 business days.",
  },
  {
    icon: MessageCircle,
    title: "Something arrived damaged?",
    body: "That's on us — reach out within 48 hours of delivery with a photo and your order number, and we'll sort a replacement or refund, no return needed.",
  },
];

export default function ReturnsPage() {
  return (
    <>
      <TopBar />
      <Header />
      <main>
        <div className="mx-auto max-w-[1440px] px-4 md:px-8 pt-5">
          <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Returns" }]} />
        </div>

        <div className="mx-auto max-w-[1440px] px-4 md:px-8 pt-6 pb-10 text-center">
          <p className="eyebrow text-terracotta-dark mb-2">Good to Know</p>
          <h1 className="font-serif text-3xl md:text-4xl text-charcoal">Returns &amp; Refunds</h1>
        </div>

        <div className="mx-auto max-w-3xl px-4 md:px-8 pb-16">
          <div className="space-y-5">
            {sections.map((s) => (
              <div
                key={s.title}
                className="flex gap-4 rounded-2xl border border-charcoal/10 bg-white p-5 sm:p-6"
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-cream-dark">
                  <s.icon size={20} className="text-terracotta" strokeWidth={1.5} />
                </div>
                <div>
                  <h2 className="font-serif text-lg text-charcoal">{s.title}</h2>
                  <p className="mt-1.5 text-sm text-ink-muted leading-relaxed">{s.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
      <ShopFooter />
    </>
  );
}
