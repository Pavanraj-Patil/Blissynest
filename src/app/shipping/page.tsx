import type { Metadata } from "next";
import { Truck, Clock, MapPin, PackageCheck } from "lucide-react";
import { TopBar } from "@/components/layout/TopBar";
import { Header } from "@/components/layout/Header";
import { Breadcrumb } from "@/components/shop/Breadcrumb";
import { ShopFooter } from "@/components/shop/ShopFooter";

export const metadata: Metadata = {
  title: "Shipping & Delivery | Blissynest",
  description: "Delivery timelines, shipping charges, and coverage for Blissynest orders.",
};

const sections = [
  {
    icon: Clock,
    title: "Delivery timelines",
    body: "Most orders are dispatched within 24–48 hours and delivered within 3–5 business days, depending on your location. Personalised and hamper orders may take an extra 1–2 days to prepare with care.",
  },
  {
    icon: Truck,
    title: "Shipping charges",
    body: "Free shipping on all orders above ₹999. Orders below that ship for a flat ₹99. Charges are calculated automatically at checkout — no surprises at the end.",
  },
  {
    icon: MapPin,
    title: "Where we deliver",
    body: "We currently deliver across India, including most Tier 1 and Tier 2 cities. Enter your pincode on any product page to check serviceability before you order.",
  },
  {
    icon: PackageCheck,
    title: "Tracking your order",
    body: "Once your order ships, you'll get a tracking link by email. You can also check the status any time from the Track Order page.",
  },
];

export default function ShippingPage() {
  return (
    <>
      <TopBar />
      <Header />
      <main>
        <div className="mx-auto max-w-[1440px] px-4 md:px-8 pt-5">
          <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Shipping & Delivery" }]} />
        </div>

        <div className="mx-auto max-w-[1440px] px-4 md:px-8 pt-6 pb-10 text-center">
          <p className="eyebrow text-terracotta-dark mb-2">Good to Know</p>
          <h1 className="font-serif text-3xl md:text-4xl text-charcoal">Shipping &amp; Delivery</h1>
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
