const ph = (w: number, h: number, bg: string, fg: string, text: string) =>
  `https://placehold.co/${w}x${h}/${bg}/${fg}.png?text=${encodeURIComponent(
    text
  )}&font=playfair-display`;

export type ShopCategory = {
  slug: string;
  label: string;
};

export const shopCategories: ShopCategory[] = [
  { slug: "self-care", label: "Self Care" },
  { slug: "personalised", label: "Personalised" },
  { slug: "luxury-edit", label: "Luxury Edit" },
  { slug: "home-living", label: "Home & Living" },
  { slug: "beauty", label: "Beauty" },
  { slug: "jewellery", label: "Jewellery" },
  { slug: "add-ons", label: "Add-ons" },
];

export const shopOccasions = [
  "Birthday",
  "Anniversary",
  "Thank You",
  "Just Because",
  "Wedding",
  "Housewarming",
  "Festivals",
  "Congratulations",
];

export const shopRecipients = [
  "Wife",
  "Sister",
  "Friend",
  "Mother",
  "Daughter",
  "Colleague",
  "Partner",
];

const categoryBg: Record<string, [string, string]> = {
  "self-care": ["e6d2c2", "2a2621"],
  personalised: ["d9cbb0", "2a2621"],
  "luxury-edit": ["241f1a", "cfb587"],
  "home-living": ["e3d3bd", "2a2621"],
  beauty: ["ecdccd", "a85830"],
  jewellery: ["e9dccb", "2a2621"],
  "add-ons": ["d6c7a8", "2a2621"],
};

type ProductSeed = { name: string; price: number };

const productSeeds: Record<string, ProductSeed[]> = {
  "self-care": [
    { name: "The Cozy Night In Box", price: 1999 },
    { name: "Blissful Pamper Hamper", price: 2299 },
    { name: "Mini Self-Care Treat Box", price: 999 },
    { name: "The Self-Care Gift Box", price: 1899 },
    { name: "Calm Evening Ritual Set", price: 1749 },
    { name: "Spa Day At Home Kit", price: 2599 },
    { name: "Soothing Bath Ritual Box", price: 1599 },
    { name: "Unwind & Relax Hamper", price: 2099 },
  ],
  personalised: [
    { name: "Personalised Name Necklace", price: 1199 },
    { name: "Personalised Journal", price: 899 },
    { name: "Custom Initial Bracelet", price: 799 },
    { name: "Personalised Photo Frame", price: 649 },
    { name: "Engraved Jewellery Box", price: 1449 },
    { name: "Custom Name Keychain", price: 399 },
    { name: "Personalised Tote Bag", price: 749 },
    { name: "Monogrammed Robe", price: 1899 },
  ],
  "luxury-edit": [
    { name: "Luxury Beauty Gift Box", price: 2499 },
    { name: "The Grand Celebration Hamper", price: 3999 },
    { name: "Signature Silk Scarf Set", price: 3499 },
    { name: "Premium Rose Gold Jewellery Set", price: 4599 },
    { name: "Deluxe Spa Retreat Box", price: 3299 },
    { name: "The Opulence Hamper", price: 4999 },
    { name: "Velvet Luxe Gift Trunk", price: 3799 },
    { name: "Gold Accent Vanity Set", price: 2899 },
  ],
  "home-living": [
    { name: "Scented Candle Gift Set", price: 1499 },
    { name: "Cozy Throw Blanket Set", price: 1799 },
    { name: "Ceramic Mug & Coaster Set", price: 899 },
    { name: "Botanical Vase & Bloom Set", price: 1349 },
    { name: "Aromatherapy Diffuser Kit", price: 1699 },
    { name: "Linen Cushion Cover Duo", price: 999 },
    { name: "Table Décor Gift Set", price: 1249 },
    { name: "Morning Ritual Tray Set", price: 1549 },
  ],
  beauty: [
    { name: "Radiant Skin Ritual Set", price: 1899 },
    { name: "Nourishing Skincare Duo", price: 1299 },
    { name: "Everyday Glow Kit", price: 1099 },
    { name: "Botanical Face Care Set", price: 1599 },
    { name: "Hand & Foot Pamper Duo", price: 899 },
    { name: "Rose Glow Gift Set", price: 1449 },
    { name: "Silk Hair Care Bundle", price: 1699 },
    { name: "Natural Glow Trio", price: 1249 },
  ],
  jewellery: [
    { name: "Minimalist Pearl Earrings", price: 1099 },
    { name: "Layered Chain Necklace", price: 1349 },
    { name: "Rose Gold Stud Set", price: 899 },
    { name: "Charm Bracelet", price: 999 },
    { name: "Birthstone Ring", price: 1599 },
    { name: "Delicate Anklet", price: 649 },
    { name: "Statement Hoop Earrings", price: 799 },
    { name: "Classic Pendant Set", price: 1199 },
  ],
  "add-ons": [
    { name: "Handwritten Card", price: 99 },
    { name: "Gift Wrap Upgrade", price: 149 },
    { name: "Dried Flower Bunch", price: 199 },
    { name: "Ribbon & Bow Set", price: 79 },
    { name: "Mini Chocolate Box", price: 249 },
    { name: "Scented Sachet", price: 129 },
    { name: "Greeting Tag Set", price: 59 },
    { name: "Premium Gift Box Upgrade", price: 299 },
  ],
};

export type ShopProduct = {
  id: string;
  name: string;
  price: number;
  rating: number;
  reviews: number;
  image: string;
  category: string;
  occasions: string[];
  recipients: string[];
};

let globalIndex = 0;

export const shopProducts: ShopProduct[] = shopCategories.flatMap((cat) =>
  productSeeds[cat.slug].map((seed, i) => {
    const idx = globalIndex++;
    const [bg, fg] = categoryBg[cat.slug];
    const rating = 3 + (idx % 3);
    const reviews = 40 + ((idx * 17) % 200);
    const occasions = [
      shopOccasions[idx % shopOccasions.length],
      shopOccasions[(idx + 3) % shopOccasions.length],
    ];
    const recipients = [
      shopRecipients[idx % shopRecipients.length],
      shopRecipients[(idx + 2) % shopRecipients.length],
    ];
    return {
      id: `${cat.slug}-${i + 1}`,
      name: seed.name,
      price: seed.price,
      rating,
      reviews,
      image: ph(320, 320, bg, fg, seed.name),
      category: cat.slug,
      occasions,
      recipients,
    };
  })
);

export type AudienceShopContent = {
  title: string;
  subtitle: string;
  breadcrumbLabel: string;
};

export const audienceShopContent: Record<string, AudienceShopContent> = {
  her: {
    title: "Gifts for Her",
    subtitle:
      "Thoughtful gifts to celebrate the women who inspire, uplift and make every moment beautiful.",
    breadcrumbLabel: "Gifts for Her",
  },
};
