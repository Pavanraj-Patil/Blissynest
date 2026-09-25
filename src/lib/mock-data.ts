import { slugify } from "@/lib/slugify";

export type SimpleLink = {
  label: string;
  href: string;
};

const ph = (
  w: number,
  h: number,
  bg: string,
  fg: string,
  text: string
) =>
  `https://placehold.co/${w}x${h}/${bg}/${fg}.png?text=${encodeURIComponent(
    text
  )}&font=playfair-display`;

export const audienceCategories = [
  { label: "Gifts for Her", href: "/shop/her", image: "/who-her.png" },
  { label: "Gifts for Him", href: "/shop/him", image: "/who-him.png" },
  { label: "Gifts for Parents", href: "/shop/parents", image: "/who-parents.png" },
  { label: "Gifts for Couples", href: "/shop/couples", image: "/who-couples.png" },
  { label: "Gifts for Kids", href: "/shop/kids", image: "/who-kids.png" },
];

export const occasions = [
  { label: "Birthday", image: "/moment-birthday.png" },
  { label: "Anniversary", image: "/moment-anniversary.png" },
  { label: "Thank You", image: "/moment-thankyou.png" },
  { label: "Festivals", image: "/moment-festivals.png" },
].map((o) => ({ ...o, slug: slugify(o.label) }));

export const editCollections = [
  {
    slug: "minimalist",
    title: "Minimalist",
    subtitle: "Simple, elegant, thoughtful",
    image: "/edit-minimalist.png",
  },
  {
    slug: "celebration",
    title: "Celebration",
    subtitle: "For moments to remember",
    image: "/edit-celebration.png",
  },
  {
    slug: "luxury",
    title: "Luxury",
    subtitle: "For when only the best will do",
    image: "/edit-luxury.png",
  },
  {
    slug: "hampers",
    title: "Gift Hampers",
    subtitle: "Ready to gift, or made to feel personal",
    image: "/edit-hampers.png",
  },
];

export const bestsellers = [
  {
    name: "The Sunday Self-Care Box",
    price: 1899,
    rating: 4,
    reviews: 124,
    bg: "e6d2c2",
    fg: "2a2621",
  },
  {
    name: "Warm Hugs Gift Box",
    price: 1649,
    rating: 5,
    reviews: 98,
    bg: "d9cbb0",
    fg: "2a2621",
  },
  {
    name: "The Gratitude Hamper",
    price: 2299,
    rating: 4,
    reviews: 76,
    bg: "e9dccb",
    fg: "2a2621",
  },
  {
    name: "Luxury Rose Gift Box",
    price: 2899,
    rating: 4,
    reviews: 53,
    bg: "7a1f1f",
    fg: "f0e8da",
  },
  {
    name: "Calm & Cozy Hamper",
    price: 1799,
    rating: 4,
    reviews: 112,
    bg: "ecdccd",
    fg: "2a2621",
  },
].map((p) => ({ ...p, image: ph(320, 320, p.bg, p.fg, p.name) }));

export const corporateChecklist: SimpleLink[] = [
  { label: "Employee Gifting", href: "/corporate/quote?interest=employee" },
  { label: "Client Gifting", href: "/corporate/quote?interest=client" },
  { label: "Festive Gifting", href: "/corporate/quote?interest=festive" },
  { label: "Welcome Kits", href: "/corporate/quote?interest=welcome" },
];

export const featureStrip = [
  {
    title: "Thoughtfully Curated",
    subtitle: "Every product earns its place.",
  },
  {
    title: "Beautifully Packed",
    subtitle: "Because unboxing is part of the gift.",
  },
  {
    title: "Personalised",
    subtitle: "Make every gift uniquely theirs.",
  },
  {
    title: "Delivered with Care",
    subtitle: "Reliable delivery, across India.",
  },
];

export const communityPhotos = Array.from({ length: 5 }).map((_, i) =>
  ph(320, 320, ["e9dccb", "d9cbb0", "e3d3bd", "ecdccd", "d6c7a8"][i], [
    "4a5738",
    "2a2621",
    "4a5738",
    "a85830",
    "2a2621",
  ][i], "")
);

export const footerLinks: SimpleLink[] = [
  { label: "About Us", href: "/about" },
  { label: "The Bliss Journal", href: "/journal" },
  { label: "Track Order", href: "/track-order" },
  { label: "Shipping & Delivery", href: "/shipping" },
  { label: "Returns", href: "/returns" },
  { label: "FAQs", href: "/faqs" },
  { label: "Contact Us", href: "/contact" },
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms & Conditions", href: "/terms" },
];

export const heroImage = "/home-hero-desktop.png";
// Portrait crop for mobile/tablet — a wide desktop crop scaled down and
// object-fit-cropped for a phone-width viewport loses the subject; a
// separate art-directed image is the standard fix (see foxtale.in's
// hero, which does the same thing with two entirely different files).
export const heroImageMobile = "/home-hero-mobile.png";
