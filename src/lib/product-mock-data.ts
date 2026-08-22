import { shopProductsByAudience, type ShopProduct } from "@/lib/shop-mock-data";
import { bestsellers } from "@/lib/mock-data";

const ph = (w: number, h: number, bg: string, fg: string, text: string) =>
  `https://placehold.co/${w}x${h}/${bg}/${fg}.png?text=${encodeURIComponent(
    text
  )}&font=playfair-display`;

export type ProductDetailsAccordion = {
  description: string;
  materials?: string;
  dimensions?: string;
  howToUse?: string;
  care?: string;
  delivery: string;
};

export type ProductReview = {
  name: string;
  rating: number;
  date: string;
  comment: string;
  verified: boolean;
};

type BaseProduct = {
  slug: string;
  name: string;
  tagline?: string;
  rating: number;
  reviews: number;
  price: number;
  images: string[];
  breadcrumbCategory: string;
  benefits: { icon: string; label: string }[];
  productDetails: ProductDetailsAccordion;
  relatedSlugs?: string[];
  reviewsList?: ProductReview[];
};

export type HamperProduct = BaseProduct & {
  pdpType: "hamper";
  whatsInside: { icon: string; name: string; subtitle: string; qty: string }[];
  personalNote?: { label: string; price: number };
};

export type CustomisableProduct = BaseProduct & {
  pdpType: "customisable";
  textLines: {
    label: string;
    required: boolean;
    maxLength: number;
    placeholder: string;
  }[];
  fonts: string[];
  colors: { name: string; hex: string }[];
  variantLabel?: string;
  variantOptions?: string[];
  specs?: { icon: string; label: string; value: string }[];
};

export type StandaloneProduct = BaseProduct & {
  pdpType: "standalone";
  variants?: { label: string; options: string[] }[];
};

export type ProductDetail = HamperProduct | CustomisableProduct | StandaloneProduct;

const genericCare = [
  "Keep away from direct sunlight",
  "Store in a cool, dry place",
  "Handle with care",
];

const flagshipProducts: ProductDetail[] = [
  {
    pdpType: "hamper",
    slug: "birthday-self-care-box",
    name: "The Birthday Self-Care Box",
    rating: 5,
    reviews: 124,
    price: 1999,
    breadcrumbCategory: "Birthday Gifts",
    images: [
      ph(700, 700, "e6d2c2", "2a2621", "Birthday Self-Care Box"),
      ph(700, 700, "e9dccb", "2a2621", "Scented Soy Candle"),
      ph(700, 700, "d9cbb0", "2a2621", "Ceramic Mug"),
      ph(700, 700, "ecdccd", "a85830", "Premium Gift Box"),
    ],
    benefits: [
      { icon: "ShieldCheck", label: "Premium Quality" },
      { icon: "Heart", label: "Curated with Love" },
      { icon: "PackageCheck", label: "Beautifully Packaged" },
      { icon: "Lock", label: "Secure Payment" },
    ],
    whatsInside: [
      {
        icon: "Flame",
        name: "Scented Soy Candle",
        subtitle: "Calm — Lavender & Vanilla",
        qty: "1x",
      },
      {
        icon: "Coffee",
        name: "Ceramic Mug",
        subtitle: "Another year of awesome",
        qty: "1x",
      },
      {
        icon: "Flower2",
        name: "Mini Dried Flower Vase",
        subtitle: "For a touch of calm decor",
        qty: "1x",
      },
      {
        icon: "Droplet",
        name: "Luxury Bath Bomb",
        subtitle: "Relax & unwind",
        qty: "1x",
      },
      {
        icon: "Mail",
        name: "Handwritten Birthday Card",
        subtitle: "Because words matter",
        qty: "1x",
      },
      {
        icon: "Gift",
        name: "Premium Gift Box",
        subtitle: "Packed with love",
        qty: "1x",
      },
    ],
    personalNote: { label: "Add a handwritten note", price: 199 },
    productDetails: {
      description:
        "A thoughtfully curated box of self-care essentials, perfect for celebrating another trip around the sun. Every item is chosen to help them slow down and feel cared for.",
      care: genericCare.concat([
        "Handle the ceramic mug with care",
        "For external use only (bath bomb)",
      ]).join(" · "),
      delivery:
        "Ships within 24-48 hours. Delivered in premium, ready-to-gift packaging across India.",
    },
    relatedSlugs: ["her-self-care-2", "her-self-care-3", "her-self-care-5", "her-self-care-6"],
    reviewsList: [
      {
        name: "Ananya K.",
        rating: 5,
        date: "2 weeks ago",
        comment:
          "Ordered this for my sister's birthday and she loved every single item. The candle smells amazing and the packaging alone made it feel so special.",
        verified: true,
      },
      {
        name: "Rohan M.",
        rating: 5,
        date: "1 month ago",
        comment:
          "Really thoughtful box — nothing felt like filler. The handwritten card was a lovely touch and it arrived exactly on time.",
        verified: true,
      },
      {
        name: "Priya S.",
        rating: 4,
        date: "1 month ago",
        comment:
          "Beautiful presentation and good quality items. Wish the bath bomb was a bit bigger, but overall a great gift box.",
        verified: true,
      },
      {
        name: "Vikram T.",
        rating: 5,
        date: "2 months ago",
        comment:
          "This is my second time ordering — consistent quality and always beautifully packed. Highly recommend for birthdays.",
        verified: false,
      },
    ],
  },
  {
    pdpType: "customisable",
    slug: "personalised-scented-candle",
    name: "Personalised Scented Candle",
    tagline: "Add your name, date or a special note to make it truly yours.",
    rating: 5,
    reviews: 98,
    price: 899,
    breadcrumbCategory: "Personalised",
    images: [
      ph(700, 700, "e6d2c2", "2a2621", "Personalised Candle"),
      ph(700, 700, "e9dccb", "2a2621", "Candle Detail"),
      ph(700, 700, "d9cbb0", "2a2621", "Candle Lit"),
      ph(700, 700, "ecdccd", "a85830", "Gift Box"),
      ph(700, 700, "d6c7a8", "2a2621", "Wrapped"),
    ],
    benefits: [
      { icon: "Flame", label: "Premium Soy Wax" },
      { icon: "Sparkles", label: "Long Lasting Fragrance" },
      { icon: "MapPin", label: "Hand Poured in India" },
      { icon: "PackageCheck", label: "Beautifully Packaged" },
    ],
    textLines: [
      { label: "Text Line 1", required: false, maxLength: 20, placeholder: "You are" },
      { label: "Text Line 2", required: true, maxLength: 20, placeholder: "my today" },
      { label: "Text Line 3", required: false, maxLength: 20, placeholder: "and all of" },
      { label: "Text Line 4", required: false, maxLength: 20, placeholder: "my tomorrows" },
    ],
    fonts: ["Serif", "Script", "Modern"],
    colors: [
      { name: "Charcoal", hex: "#2a2621" },
      { name: "Brown", hex: "#a85830" },
      { name: "Beige", hex: "#e3c8a5" },
      { name: "Pink", hex: "#e39aa0" },
      { name: "Green", hex: "#4a5738" },
    ],
    variantLabel: "Scent",
    variantOptions: ["Lavender", "Vanilla", "Sandalwood", "Jasmine", "Rose"],
    specs: [
      { icon: "Weight", label: "Net Weight", value: "200 g" },
      { icon: "Clock", label: "Burn Time", value: "40+ Hours" },
      { icon: "Droplet", label: "Wax Type", value: "100% Soy Wax" },
      { icon: "Sparkles", label: "Fragrance", value: "Premium Essential Oils" },
    ],
    productDetails: {
      description:
        "Hand poured with love using 100% soy wax and premium fragrance oils for a clean, long-lasting burn. Personalise it with a name, date, or a short message to make it truly one of a kind.",
      howToUse:
        "Trim the wick to 1/4 inch before lighting. Keep the candle on a flat surface and burn for 2-3 hours for best results.",
      care: "Keep away from drafts and direct sunlight. Store in a cool, dry place when not in use.",
      delivery:
        "Ships within 24-48 hours. Please double-check your personalisation — it will be printed exactly as entered.",
    },
    relatedSlugs: [
      "her-personalised-2",
      "her-personalised-3",
      "her-personalised-5",
      "her-personalised-7",
    ],
    reviewsList: [
      {
        name: "Sneha R.",
        rating: 5,
        date: "3 weeks ago",
        comment:
          "The personalisation came out perfectly, exactly as I typed it. Burns evenly and smells wonderful. Will be ordering more for the holidays.",
        verified: true,
      },
      {
        name: "Arjun P.",
        rating: 5,
        date: "1 month ago",
        comment:
          "Got this made for my parents' anniversary with a custom message. The font options made it feel really personal — they were touched.",
        verified: true,
      },
      {
        name: "Kavya N.",
        rating: 4,
        date: "6 weeks ago",
        comment:
          "Lovely candle and the preview tool made it easy to get the text right. Delivery took a day longer than expected but worth the wait.",
        verified: true,
      },
    ],
  },
  {
    pdpType: "standalone",
    slug: "scented-soy-candle",
    name: "Scented Soy Candle",
    tagline: "A calming candle made for slow evenings & thoughtful gifting.",
    rating: 5,
    reviews: 53,
    price: 1499,
    breadcrumbCategory: "Home & Living",
    images: [
      ph(700, 700, "e6d2c2", "2a2621", "Scented Soy Candle"),
      ph(700, 700, "e9dccb", "2a2621", "Candle Lit"),
      ph(700, 700, "d9cbb0", "2a2621", "Candle Detail"),
    ],
    benefits: [
      { icon: "Flame", label: "Hand-poured" },
      { icon: "Droplet", label: "Premium Soy Wax" },
      { icon: "Clock", label: "40+ Hour Burn" },
      { icon: "Sparkles", label: "Essential-Oil Fragrance" },
    ],
    variants: [
      { label: "Scent", options: ["Lavender", "Vanilla", "Sandalwood"] },
      { label: "Size", options: ["150g", "250g"] },
    ],
    productDetails: {
      description:
        "A calming soy candle hand-poured in small batches, made to fill a room with warmth without ever feeling heavy. Every detail — from the fragrance to the finish — is designed for slow evenings and thoughtful gifting.",
      materials: "100% natural soy wax, cotton wick, premium essential-oil fragrance.",
      dimensions: "Net weight 150g / 250g · 8cm (H) x 7cm (W) glass jar.",
      howToUse:
        "Trim the wick to 1/4 inch before each light. Burn for 2-3 hours at a time and keep away from drafts for an even melt pool.",
      care: "Keep away from direct sunlight and store in a cool, dry place.",
      delivery: "Ships within 24-48 hours, delivered in protective gift-ready packaging.",
    },
    relatedSlugs: [
      "her-home-living-1",
      "her-home-living-3",
      "her-home-living-5",
      "her-home-living-7",
    ],
    reviewsList: [
      {
        name: "Rahul D.",
        rating: 5,
        date: "2 weeks ago",
        comment:
          "Such a calming scent, not overpowering at all. Burns cleanly and the jar looks lovely on my desk even after the candle's done.",
        verified: true,
      },
      {
        name: "Ananya K.",
        rating: 4,
        date: "1 month ago",
        comment:
          "Good burn time and lovely fragrance. Gifted the smaller size to a friend and she messaged me immediately asking where it was from.",
        verified: true,
      },
      {
        name: "Priya S.",
        rating: 5,
        date: "2 months ago",
        comment:
          "Bought the lavender scent for myself — genuinely helps me unwind in the evenings. Already ordering the sandalwood one next.",
        verified: false,
      },
    ],
  },
];

const productMap = new Map<string, ProductDetail>(
  flagshipProducts.map((p) => [p.slug, p])
);

export function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function fallbackFromShopProduct(product: ShopProduct): StandaloneProduct {
  return {
    pdpType: "standalone",
    slug: product.id,
    name: product.name,
    tagline: "Thoughtfully chosen, beautifully packaged.",
    rating: product.rating,
    reviews: product.reviews,
    price: product.price,
    breadcrumbCategory: product.category
      .split("-")
      .map((w) => w[0].toUpperCase() + w.slice(1))
      .join(" "),
    images: [product.image],
    benefits: [
      { icon: "Gift", label: "Thoughtfully Curated" },
      { icon: "PackageCheck", label: "Premium Packaging" },
      { icon: "Truck", label: "Delivered with Care" },
      { icon: "ShieldCheck", label: "Happiness Guaranteed" },
    ],
    productDetails: {
      description: `${product.name} — a thoughtfully chosen gift, beautifully packaged and ready to make someone's day.`,
      delivery: "Ships within 24-48 hours, delivered in gift-ready packaging across India.",
      care: genericCare.join(" · "),
    },
  };
}

function fallbackFromBestseller(name: string): StandaloneProduct | null {
  const match = bestsellers.find((b) => slugify(b.name) === name);
  if (!match) return null;
  return {
    pdpType: "standalone",
    slug: slugify(match.name),
    name: match.name,
    tagline: "Thoughtfully chosen, beautifully packaged.",
    rating: match.rating,
    reviews: match.reviews,
    price: match.price,
    breadcrumbCategory: "Bestsellers",
    images: [match.image],
    benefits: [
      { icon: "Gift", label: "Thoughtfully Curated" },
      { icon: "PackageCheck", label: "Premium Packaging" },
      { icon: "Truck", label: "Delivered with Care" },
      { icon: "ShieldCheck", label: "Happiness Guaranteed" },
    ],
    productDetails: {
      description: `${match.name} — a thoughtfully chosen gift, beautifully packaged and ready to make someone's day.`,
      delivery: "Ships within 24-48 hours, delivered in gift-ready packaging across India.",
      care: genericCare.join(" · "),
    },
  };
}

const allShopProducts: ShopProduct[] = Object.values(shopProductsByAudience).flat();

export function getProductBySlug(slug: string): ProductDetail | null {
  const flagship = productMap.get(slug);
  if (flagship) return flagship;

  const shopProduct = allShopProducts.find((p) => p.id === slug);
  if (shopProduct) return fallbackFromShopProduct(shopProduct);

  const bestseller = fallbackFromBestseller(slug);
  if (bestseller) return bestseller;

  return null;
}

export function getRelatedProducts(
  product: ProductDetail,
  count = 4
): { slug: string; name: string; price: number; rating: number; reviews: number; image: string }[] {
  if (product.relatedSlugs && product.relatedSlugs.length > 0) {
    return product.relatedSlugs
      .map((slug) => getProductBySlug(slug))
      .filter((p): p is ProductDetail => p !== null)
      .map((p) => ({
        slug: p.slug,
        name: p.name,
        price: p.price,
        rating: p.rating,
        reviews: p.reviews,
        image: p.images[0],
      }));
  }

  const categorySlug = allShopProducts.find((p) => p.id === product.slug)?.category;
  const pool = categorySlug
    ? allShopProducts.filter((p) => p.category === categorySlug && p.id !== product.slug)
    : allShopProducts.filter((p) => p.name !== product.name);

  return pool.slice(0, count).map((p) => ({
    slug: p.id,
    name: p.name,
    price: p.price,
    rating: p.rating,
    reviews: p.reviews,
    image: p.image,
  }));
}

const genericReviewerNames = [
  "Priya S.",
  "Rohan M.",
  "Ananya K.",
  "Vikram T.",
  "Sneha R.",
  "Arjun P.",
  "Kavya N.",
  "Rahul D.",
];

const genericReviewComments = [
  "Beautifully packaged and arrived right on time. Exactly what I was hoping for.",
  "Great quality for the price — the recipient was really happy with it.",
  "Simple, thoughtful and beautifully presented. Would order again.",
  "Loved the packaging and the little details. Made gifting so easy.",
  "Exactly as pictured. Delivery was quick and the presentation was lovely.",
  "A lovely, considered gift — didn't feel generic at all.",
];

const genericReviewDates = [
  "1 week ago",
  "2 weeks ago",
  "3 weeks ago",
  "1 month ago",
  "6 weeks ago",
  "2 months ago",
];

function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash * 31 + str.charCodeAt(i)) % 1000;
  }
  return hash;
}

function generateGenericReviews(product: ProductDetail): ProductReview[] {
  const seed = hashString(product.slug);
  return Array.from({ length: 3 }).map((_, i) => {
    const idx = seed + i;
    return {
      name: genericReviewerNames[idx % genericReviewerNames.length],
      rating: Math.max(3, product.rating - (i === 2 ? 1 : 0)),
      date: genericReviewDates[idx % genericReviewDates.length],
      comment: genericReviewComments[idx % genericReviewComments.length],
      verified: i !== 2,
    };
  });
}

export function getProductReviews(product: ProductDetail): ProductReview[] {
  return product.reviewsList ?? generateGenericReviews(product);
}

const ratingBreakdowns: Record<number, number[]> = {
  5: [78, 15, 5, 1, 1],
  4: [45, 35, 12, 5, 3],
  3: [20, 30, 30, 12, 8],
};

export function getRatingBreakdown(rating: number): { stars: number; pct: number }[] {
  const rounded = Math.min(5, Math.max(3, Math.round(rating)));
  const pcts = ratingBreakdowns[rounded] ?? ratingBreakdowns[4];
  return [5, 4, 3, 2, 1].map((stars, i) => ({ stars, pct: pcts[i] }));
}
