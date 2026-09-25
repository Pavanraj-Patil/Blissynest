import {
  Boxes,
  Palette,
  Truck,
  HeadphonesIcon,
  MessageSquare,
  PhoneCall,
  type LucideIcon,
} from "lucide-react";

const ph = (w: number, h: number, bg: string, fg: string, text: string) =>
  `https://placehold.co/${w}x${h}/${bg}/${fg}.png?text=${encodeURIComponent(
    text
  )}&font=playfair-display`;

export const corporateHeroImage = ph(900, 760, "e3d3bd", "2a2621", "Corporate Gift Box");
export const yourBrandImage = ph(700, 560, "3a4529", "cfb587", "Your Brand");

export type TrustPoint = { icon: LucideIcon; title: string; subtitle: string };

export const heroTrustPoints: TrustPoint[] = [
  { icon: Boxes, title: "Bulk Gifting", subtitle: "Made Simple" },
  { icon: Palette, title: "Customisation", subtitle: "For Your Brand" },
  { icon: Truck, title: "Pan India Delivery", subtitle: "On Time, Every Time" },
  { icon: HeadphonesIcon, title: "Dedicated Support", subtitle: "At Every Step" },
];

export type CorporateNeed = {
  slug: string;
  title: string;
  subtitle: string;
  image: string;
};

export const corporateNeeds: CorporateNeed[] = [
  {
    slug: "employee",
    title: "Employee Gifting",
    subtitle: "Celebrate your team",
    image: "/corporate-need-employee.png",
  },
  {
    slug: "client",
    title: "Client Gifting",
    subtitle: "Build lasting relationships",
    image: "/corporate-need-client.png",
  },
  {
    slug: "festive",
    title: "Festival Gifting",
    subtitle: "Celebrate togetherness",
    image: "/moment-festivals.png",
  },
  {
    slug: "milestone",
    title: "Milestone Gifting",
    subtitle: "Mark every achievement",
    image: "/corporate-need-milestone.png",
  },
  {
    slug: "welcome",
    title: "Welcome Kits",
    subtitle: "Warm welcomes matter",
    image: "/corporate-need-welcome.png",
  },
];

export const corporateNeedSlugs: string[] = corporateNeeds.map((n) => n.slug);

export function isCorporateNeedSlug(value: string): boolean {
  return corporateNeedSlugs.includes(value);
}

export type ProcessStep = {
  number: string;
  icon: LucideIcon;
  title: string;
  description: string;
};

export const processSteps: ProcessStep[] = [
  {
    number: "01",
    icon: MessageSquare,
    title: "Share Your Requirements",
    description: "Tell us your headcount, budget and occasion. It takes two minutes.",
  },
  {
    number: "02",
    icon: PhoneCall,
    title: "Consultation Call",
    description: "Our gifting expert walks you through curated options for your brand.",
  },
  {
    number: "03",
    icon: Palette,
    title: "Customise & Approve",
    description: "Pick your hamper, add your branding, and approve the final look.",
  },
  {
    number: "04",
    icon: Truck,
    title: "Pan-India Delivery",
    description: "We handle packaging and delivery, tracked every step of the way.",
  },
];

export const whyChooseUsChecklist: string[] = [
  "Premium quality, thoughtfully curated products",
  "Personalisation with your logo, message & packaging",
  "Flexible solutions for budgets of all sizes",
  "Reliable pan India & international delivery",
  "Sustainable & ethical gifting choices",
  "Dedicated account manager & end-to-end support",
];

export type Testimonial = {
  quote: string;
  name: string;
  title: string;
  company: string;
};

export const testimonials: Testimonial[] = [
  {
    quote:
      "Blissynest made our annual gifting effortless and memorable. The quality, packaging and on-time delivery were exceptional!",
    name: "Priya Mehta",
    title: "Head – People & Culture",
    company: "Verdant Systems",
  },
  {
    quote:
      "From the first call to the final delivery, everything felt effortless. Our employees still talk about the Diwali hampers.",
    name: "Arjun Nair",
    title: "VP, Human Resources",
    company: "Northbridge Analytics",
  },
  {
    quote:
      "We needed 300 branded welcome kits in under two weeks. Blissynest delivered early, and every box was exactly on-brief.",
    name: "Kavya Reddy",
    title: "Talent & Culture Lead",
    company: "Solace Interiors",
  },
  {
    quote:
      "Personalised, punctual and genuinely thoughtful — exactly what we wanted for this year's client appreciation gifts.",
    name: "Rohan Kapoor",
    title: "Client Success Director",
    company: "Fieldstone Partners",
  },
];

export type TrustedCompany = { name: string; initials: string };

export const trustedByCompanies: TrustedCompany[] = [
  { name: "Verdant Systems", initials: "VS" },
  { name: "Northbridge Analytics", initials: "NA" },
  { name: "Solace Interiors", initials: "SI" },
  { name: "Marrow & Co.", initials: "MC" },
  { name: "Fieldstone Partners", initials: "FP" },
  { name: "Everline Media", initials: "EM" },
];

export type CuratedCollection = {
  slug: string;
  title: string;
  image: string;
  isCustom?: boolean;
};

const curatedBg: [string, string][] = [
  ["e6d2c2", "2a2621"],
  ["ead9c9", "a85830"],
  ["d6c4a8", "2a2621"],
  ["e9e2d3", "2a2621"],
  ["e3d3bd", "2a2621"],
  ["ceb9a3", "2a2621"],
];

export const curatedCollections: CuratedCollection[] = [
  { slug: "welcome-kits", title: "New Employee Welcome Kits", image: ph(360, 300, ...curatedBg[0], "Welcome Kit") },
  { slug: "diwali", title: "Diwali Gifts", image: ph(360, 300, ...curatedBg[1], "Diwali Gifts") },
  { slug: "work-anniversary", title: "Work Anniversary", image: ph(360, 300, ...curatedBg[2], "Anniversary") },
  { slug: "womens-day", title: "Women's Day Gifts", image: ph(360, 300, ...curatedBg[3], "Women's Day") },
  { slug: "holiday", title: "Holiday Gifts", image: ph(360, 300, ...curatedBg[4], "Holiday Gifts") },
  { slug: "client-appreciation", title: "Client Appreciation", image: ph(360, 300, ...curatedBg[5], "Client Gifts") },
  { slug: "custom", title: "Create Your Own Hamper", image: "", isCustom: true },
];

// Which curated collections best represent each corporate-need category,
// used to tailor the downloadable catalogue to the category the visitor picked.
export const needToCollectionSlugs: Record<string, string[]> = {
  employee: ["welcome-kits", "work-anniversary"],
  client: ["client-appreciation", "holiday"],
  festive: ["diwali", "holiday"],
  milestone: ["work-anniversary", "client-appreciation"],
  welcome: ["welcome-kits"],
};
