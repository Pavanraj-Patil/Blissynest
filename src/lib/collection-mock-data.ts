const ph = (w: number, h: number, bg: string, fg: string, text: string) =>
  `https://placehold.co/${w}x${h}/${bg}/${fg}.png?text=${encodeURIComponent(
    text
  )}&font=playfair-display`;

export type CollectionSlug = "minimalist" | "celebration" | "luxury" | "hampers";

export const collectionSlugs: CollectionSlug[] = [
  "minimalist",
  "celebration",
  "luxury",
  "hampers",
];

export function isCollectionSlug(value: string): value is CollectionSlug {
  return (collectionSlugs as string[]).includes(value);
}

export type CollectionCategory = { slug: string; label: string };

export type CollectionProduct = {
  id: string;
  name: string;
  price: number;
  rating: number;
  reviews: number;
  image: string;
  category: string;
  attribute?: string;
  occasions: string[];
  badge?: "Bestseller" | "New";
};

type Seed = {
  name: string;
  price: number;
  attribute?: string;
  badge?: "Bestseller" | "New";
};

type CollectionDefinition = {
  slug: CollectionSlug;
  title: string;
  subtitle: string;
  breadcrumbLabel: string;
  bannerImageLabel: string;
  bg: string;
  fg: string;
  dark?: boolean;
  categories: CollectionCategory[];
  attributeFilter: { label: string; values: string[] } | null;
  occasionTagsPool: string[];
  priceBounds: { min: number; max: number; step: number };
  seedsByCategory: Record<string, Seed[]>;
};

const definitions: CollectionDefinition[] = [
  {
    slug: "minimalist",
    title: "The Minimalist Edit",
    subtitle: "Simple, elegant, thoughtful.",
    breadcrumbLabel: "The Minimalist Edit",
    bannerImageLabel: "Vase & Linen",
    bg: "e9e2d3",
    fg: "2a2621",
    categories: [
      { slug: "home-decor", label: "Home Decor" },
      { slug: "stationery", label: "Stationery" },
      { slug: "ceramics", label: "Ceramics" },
      { slug: "accessories", label: "Accessories" },
    ],
    attributeFilter: {
      label: "Material",
      values: ["Ceramic", "Brass", "Linen", "Wood", "Glass"],
    },
    occasionTagsPool: ["Housewarming", "Thank You", "Just Because"],
    priceBounds: { min: 0, max: 3000, step: 50 },
    seedsByCategory: {
      "home-decor": [
        { name: "Matte Ceramic Vase", price: 1099, attribute: "Ceramic", badge: "Bestseller" },
        { name: "Brass Taper Candle Holders", price: 899, attribute: "Brass" },
        { name: "Linen Table Runner", price: 799, attribute: "Linen" },
        { name: "Wooden Catch-All Tray", price: 699, attribute: "Wood" },
        { name: "Glass Bud Vase Trio", price: 999, attribute: "Glass", badge: "New" },
        { name: "Sculptural Ceramic Bowl", price: 849, attribute: "Ceramic" },
      ],
      stationery: [
        { name: "Minimal Leather Journal", price: 699 },
        { name: "Brass Desk Organiser Set", price: 1199, attribute: "Brass" },
        { name: "Linen-Bound Notebook Set", price: 599, attribute: "Linen" },
        { name: "Wooden Pen & Card Holder", price: 549, attribute: "Wood" },
        { name: "Glass Paperweight", price: 449, attribute: "Glass" },
      ],
      ceramics: [
        { name: "Stoneware Dinner Set", price: 2499, attribute: "Ceramic", badge: "Bestseller" },
        { name: "Handthrown Ceramic Mug Duo", price: 899, attribute: "Ceramic" },
        { name: "Minimal Ceramic Planter", price: 749, attribute: "Ceramic" },
        { name: "Ceramic Trinket Dish Set", price: 599, attribute: "Ceramic" },
      ],
      accessories: [
        { name: "Brass Bookmark Set", price: 399, attribute: "Brass" },
        { name: "Linen Zip Pouch", price: 499, attribute: "Linen" },
        { name: "Glass Coaster Set", price: 649, attribute: "Glass" },
        { name: "Minimal Wooden Watch Stand", price: 799, attribute: "Wood" },
        { name: "Brass Keychain Set", price: 349, attribute: "Brass" },
      ],
    },
  },
  {
    slug: "celebration",
    title: "The Celebration Edit",
    subtitle: "For moments to remember.",
    breadcrumbLabel: "The Celebration Edit",
    bannerImageLabel: "Balloons & Cake",
    bg: "ead9c9",
    fg: "a85830",
    categories: [
      { slug: "party-decor", label: "Party & Decor" },
      { slug: "hampers", label: "Hampers" },
      { slug: "cakes-treats", label: "Cakes & Treats" },
      { slug: "keepsakes", label: "Personalised Keepsakes" },
    ],
    attributeFilter: {
      label: "Theme",
      values: ["Birthday", "Anniversary", "Congratulations", "Festive"],
    },
    occasionTagsPool: ["Birthday", "Anniversary", "Festivals"],
    priceBounds: { min: 0, max: 5500, step: 100 },
    seedsByCategory: {
      "party-decor": [
        { name: "Gold Foil Balloon Bouquet", price: 799, attribute: "Birthday", badge: "Bestseller" },
        { name: "Confetti Party Kit", price: 599, attribute: "Birthday" },
        { name: "Fairy Light Photo Garland", price: 699, attribute: "Anniversary" },
        { name: "Festive Diya & Rangoli Set", price: 899, attribute: "Festive" },
        { name: "Happy Anniversary Banner Set", price: 449, attribute: "Anniversary" },
      ],
      hampers: [
        { name: "The Celebration Hamper", price: 2999, attribute: "Birthday", badge: "Bestseller" },
        { name: "Anniversary Wine & Chocolate Hamper", price: 3499, attribute: "Anniversary" },
        { name: "Congratulations Gift Hamper", price: 2199, attribute: "Congratulations" },
        { name: "Festive Dry Fruits Hamper", price: 1899, attribute: "Festive" },
        { name: "New Year Celebration Hamper", price: 2499, attribute: "Festive" },
      ],
      "cakes-treats": [
        { name: "Chocolate Truffle Celebration Cake", price: 899, attribute: "Birthday", badge: "New" },
        { name: "Red Velvet Anniversary Cake", price: 1099, attribute: "Anniversary" },
        { name: "Assorted Macaron Box", price: 749, attribute: "Congratulations" },
        { name: "Festive Mithai Box", price: 849, attribute: "Festive" },
        { name: "Congratulations Cupcake Box", price: 699, attribute: "Congratulations" },
      ],
      keepsakes: [
        { name: "Personalised Birthday Photo Frame", price: 799, attribute: "Birthday" },
        { name: "Engraved Anniversary Keepsake Box", price: 1299, attribute: "Anniversary" },
        { name: "Custom Congratulations Plaque", price: 999, attribute: "Congratulations" },
        { name: "Personalised Festive Ornament", price: 499, attribute: "Festive" },
        { name: "Custom Name Birthday Cushion", price: 899, attribute: "Birthday" },
      ],
    },
  },
  {
    slug: "luxury",
    title: "The Luxury Edit",
    subtitle: "For when only the best will do.",
    breadcrumbLabel: "The Luxury Edit",
    bannerImageLabel: "Watch & Silk",
    bg: "241f1a",
    fg: "cfb587",
    dark: true,
    categories: [
      { slug: "fine-jewellery", label: "Fine Jewellery" },
      { slug: "premium-hampers", label: "Premium Hampers" },
      { slug: "silk-accessories", label: "Silk & Accessories" },
      { slug: "watches-leather", label: "Watches & Leather" },
    ],
    attributeFilter: {
      label: "Material",
      values: ["Gold-Plated", "Silver", "Silk", "Leather"],
    },
    occasionTagsPool: ["Anniversary", "Wedding", "Just Because"],
    priceBounds: { min: 0, max: 7000, step: 100 },
    seedsByCategory: {
      "fine-jewellery": [
        { name: "18K Gold-Plated Pendant Necklace", price: 3499, attribute: "Gold-Plated", badge: "Bestseller" },
        { name: "Sterling Silver Bracelet", price: 2799, attribute: "Silver" },
        { name: "Pearl Drop Earrings", price: 2299, attribute: "Silver" },
        { name: "Gold-Plated Signet Ring", price: 1999, attribute: "Gold-Plated", badge: "New" },
        { name: "Diamond-Cut Tennis Bracelet", price: 4499, attribute: "Silver" },
      ],
      "premium-hampers": [
        { name: "The Opulence Hamper", price: 4999, attribute: "Gold-Plated", badge: "Bestseller" },
        { name: "Wine & Truffle Connoisseur Set", price: 5499, attribute: "Leather" },
        { name: "Premium Dry Fruits & Chocolate Box", price: 3299 },
        { name: "Signature Spa Luxury Set", price: 3899, attribute: "Silk" },
        { name: "Golden Hour Celebration Hamper", price: 4599, attribute: "Gold-Plated" },
      ],
      "silk-accessories": [
        { name: "Signature Silk Scarf Set", price: 3499, attribute: "Silk" },
        { name: "Pure Mulberry Silk Pillowcase", price: 2199, attribute: "Silk" },
        { name: "Silk Tie & Pocket Square Set", price: 1899, attribute: "Silk" },
        { name: "Embroidered Silk Robe", price: 4299, attribute: "Silk", badge: "New" },
        { name: "Silk Sleep Mask & Scrunchie Set", price: 1299, attribute: "Silk" },
      ],
      "watches-leather": [
        { name: "Classic Leather Strap Watch", price: 5999, attribute: "Leather", badge: "Bestseller" },
        { name: "Full-Grain Leather Wallet", price: 1799, attribute: "Leather" },
        { name: "Handcrafted Leather Journal", price: 1499, attribute: "Leather" },
        { name: "Leather Weekender Duffel", price: 6499, attribute: "Leather" },
        { name: "Leather Passport & Card Holder Set", price: 2199, attribute: "Leather" },
      ],
    },
  },
  {
    slug: "hampers",
    title: "Gift Hampers",
    subtitle: "Ready to gift, or made to feel personal.",
    breadcrumbLabel: "Gift Hampers",
    bannerImageLabel: "Ribbon & Box",
    bg: "cc8b65",
    fg: "2a2621",
    // These two slugs are the sub-filter pills shown on this collection's
    // own page (see CollectionPageClient.tsx, which filters real DB
    // products by `category.includes(cat.slug)`) — "hamper" doubles as the
    // same tag used for the Shop/audience "Hampers" pill (see
    // shopCategories/categoriesByAudience in shop-mock-data.ts), so a
    // hamper product only needs one shared tag to show up in both places.
    categories: [
      { slug: "hamper", label: "All Hampers" },
      { slug: "personalise-it", label: "Personalise It" },
    ],
    attributeFilter: null,
    occasionTagsPool: ["Birthday", "Anniversary", "Just Because", "Festivals"],
    priceBounds: { min: 0, max: 6000, step: 100 },
    // No mock seeds — this collection only ever shows real DB products at
    // runtime (see CollectionPageClient.tsx), so there's nothing for the
    // seed script to synthesize here.
    seedsByCategory: {},
  },
];

function buildProducts(def: CollectionDefinition): CollectionProduct[] {
  let idx = 0;
  return def.categories.flatMap((cat) =>
    (def.seedsByCategory[cat.slug] ?? []).map((seed, i) => {
      const localIdx = idx++;
      const rating = 4 + (localIdx % 2);
      const reviews = 20 + ((localIdx * 13) % 180);
      const occasions = [
        def.occasionTagsPool[localIdx % def.occasionTagsPool.length],
        def.occasionTagsPool[(localIdx + 1) % def.occasionTagsPool.length],
      ];
      return {
        id: `${def.slug}-${cat.slug}-${i + 1}`,
        name: seed.name,
        price: seed.price,
        rating,
        reviews,
        image: ph(320, 320, def.bg, def.fg, seed.name),
        category: cat.slug,
        attribute: seed.attribute,
        occasions,
        badge: seed.badge,
      };
    })
  );
}

export type CollectionContent = {
  slug: CollectionSlug;
  title: string;
  subtitle: string;
  breadcrumbLabel: string;
  bg: string;
  fg: string;
  dark: boolean;
  bannerImage: string;
  categories: CollectionCategory[];
  attributeFilter: { label: string; values: string[] } | null;
  occasionTagsPool: string[];
  priceBounds: { min: number; max: number; step: number };
  products: CollectionProduct[];
};

export const collectionContent: Record<CollectionSlug, CollectionContent> =
  Object.fromEntries(
    definitions.map((def) => [
      def.slug,
      {
        slug: def.slug,
        title: def.title,
        subtitle: def.subtitle,
        breadcrumbLabel: def.breadcrumbLabel,
        bg: def.bg,
        fg: def.fg,
        dark: def.dark ?? false,
        bannerImage: ph(1400, 700, def.bg, def.fg, def.bannerImageLabel),
        categories: def.categories,
        attributeFilter: def.attributeFilter,
        occasionTagsPool: def.occasionTagsPool,
        priceBounds: def.priceBounds,
        products: buildProducts(def),
      },
    ])
  ) as Record<CollectionSlug, CollectionContent>;
