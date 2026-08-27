import { Gift, Flower2, Heart, Crown, Home, Droplet, Gem, Plus, type LucideIcon } from "lucide-react";

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

export const categoryIcons: Record<string, LucideIcon> = {
  all: Gift,
  "self-care": Flower2,
  personalised: Heart,
  "luxury-edit": Crown,
  "home-living": Home,
  beauty: Droplet,
  jewellery: Gem,
  "add-ons": Plus,
};

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

export type AudienceSlug =
  | "her"
  | "him"
  | "parents"
  | "couples"
  | "friends"
  | "colleagues";

export const audienceSlugs: AudienceSlug[] = [
  "her",
  "him",
  "parents",
  "couples",
  "friends",
  "colleagues",
];

const genericAddOns: ProductSeed[] = [
  { name: "Handwritten Card", price: 99 },
  { name: "Gift Wrap Upgrade", price: 149 },
  { name: "Dried Flower Bunch", price: 199 },
  { name: "Ribbon & Bow Set", price: 79 },
  { name: "Mini Chocolate Box", price: 249 },
  { name: "Scented Sachet", price: 129 },
  { name: "Greeting Tag Set", price: 59 },
  { name: "Premium Gift Box Upgrade", price: 299 },
];

const productSeedsByAudience: Record<
  AudienceSlug,
  Record<string, ProductSeed[]>
> = {
  her: {
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
    "add-ons": genericAddOns,
  },
  him: {
    "self-care": [
      { name: "The Grooming Essentials Box", price: 1999 },
      { name: "Beard Care Ritual Kit", price: 1749 },
      { name: "Post-Shave Recovery Set", price: 1299 },
      { name: "Mini Grooming Travel Kit", price: 999 },
      { name: "The Gentleman's Spa Box", price: 2299 },
      { name: "Cologne & Care Duo", price: 1899 },
      { name: "Relax & Unwind Hamper", price: 2099 },
      { name: "Everyday Grooming Kit", price: 1599 },
    ],
    personalised: [
      { name: "Personalised Leather Wallet", price: 1499 },
      { name: "Engraved Whiskey Glass Set", price: 1899 },
      { name: "Custom Initial Cufflinks", price: 1199 },
      { name: "Personalised Keychain", price: 399 },
      { name: "Monogrammed Travel Pouch", price: 999 },
      { name: "Personalised Desk Nameplate", price: 899 },
      { name: "Custom Photo Wallet Card", price: 649 },
      { name: "Engraved Money Clip", price: 1099 },
    ],
    "luxury-edit": [
      { name: "The Executive Gift Trunk", price: 4599 },
      { name: "Premium Leather Travel Set", price: 3999 },
      { name: "Signature Watch Box", price: 4299 },
      { name: "Deluxe Whiskey Barware Set", price: 3599 },
      { name: "The Gentleman's Reserve Hamper", price: 4999 },
      { name: "Luxury Grooming Vanity Kit", price: 3299 },
      { name: "Premium Cigar Accessory Set", price: 3799 },
      { name: "Gold Accent Desk Set", price: 2899 },
    ],
    "home-living": [
      { name: "Scented Candle for Him", price: 1299 },
      { name: "Desk Organiser Set", price: 1099 },
      { name: "Ceramic Whiskey Mug Set", price: 899 },
      { name: "Minimalist Wall Clock", price: 1449 },
      { name: "Aromatherapy Diffuser Kit", price: 1699 },
      { name: "Cozy Throw & Cushion Set", price: 1799 },
      { name: "Table Décor Set", price: 1249 },
      { name: "Morning Coffee Ritual Set", price: 1549 },
    ],
    beauty: [
      { name: "Everyday Face Care Kit", price: 1099 },
      { name: "Beard Oil & Balm Duo", price: 899 },
      { name: "Charcoal Skincare Set", price: 1299 },
      { name: "Post-Workout Body Care Kit", price: 999 },
      { name: "Hydrating Face Wash Trio", price: 799 },
      { name: "Grooming Essentials Trio", price: 1199 },
      { name: "Refresh & Renew Kit", price: 1349 },
      { name: "Complete Skincare Bundle", price: 1699 },
    ],
    jewellery: [
      { name: "Leather Bracelet Set", price: 799 },
      { name: "Stainless Steel Cufflinks", price: 899 },
      { name: "Minimalist Chain Bracelet", price: 999 },
      { name: "Engraved Signet Ring", price: 1349 },
      { name: "Classic Tie Clip Set", price: 649 },
      { name: "Braided Leather Bands", price: 599 },
      { name: "Silver Accent Bracelet", price: 1099 },
      { name: "Everyday Wristband Set", price: 499 },
    ],
    "add-ons": genericAddOns,
  },
  parents: {
    "self-care": [
      { name: "The Relax & Recharge Box", price: 1899 },
      { name: "Comfort Ritual Hamper", price: 2099 },
      { name: "Mini Wellness Treat Box", price: 999 },
      { name: "The Calm Evenings Gift Box", price: 1799 },
      { name: "Soothing Ayurvedic Ritual Set", price: 2299 },
      { name: "Restful Nights Kit", price: 1649 },
      { name: "Gentle Care Spa Box", price: 2399 },
      { name: "Everyday Comfort Hamper", price: 1549 },
    ],
    personalised: [
      { name: "Personalised Family Photo Frame", price: 899 },
      { name: "Engraved Memory Box", price: 1449 },
      { name: "Custom Name Wind Chime", price: 799 },
      { name: "Personalised Recipe Journal", price: 749 },
      { name: "Engraved Anniversary Frame", price: 1199 },
      { name: "Custom Family Tree Print", price: 999 },
      { name: "Personalised Keepsake Card Set", price: 599 },
      { name: "Monogrammed Shawl", price: 1699 },
    ],
    "luxury-edit": [
      { name: "The Golden Years Hamper", price: 3999 },
      { name: "Premium Comfort Recliner Kit", price: 4599 },
      { name: "Signature Silk Shawl Set", price: 3499 },
      { name: "Deluxe Wellness Retreat Box", price: 3799 },
      { name: "The Heritage Celebration Hamper", price: 4999 },
      { name: "Luxury Tea & Snack Trunk", price: 2899 },
      { name: "Premium Home Comfort Set", price: 3299 },
      { name: "Gold Accent Keepsake Box", price: 2599 },
    ],
    "home-living": [
      { name: "Cozy Recliner Blanket Set", price: 1799 },
      { name: "Ceramic Tea & Coffee Set", price: 1349 },
      { name: "Aromatic Diffuser for Home", price: 1099 },
      { name: "Botanical Vase & Bloom Set", price: 1249 },
      { name: "Warm Evening Lamp Set", price: 1899 },
      { name: "Linen Cushion Cover Duo", price: 999 },
      { name: "Table Décor Gift Set", price: 1249 },
      { name: "Morning Ritual Tray Set", price: 1549 },
    ],
    beauty: [
      { name: "Ayurvedic Skin Nourish Set", price: 1299 },
      { name: "Gentle Hand & Foot Care Duo", price: 899 },
      { name: "Herbal Hair Oil Trio", price: 999 },
      { name: "Soothing Balm Collection", price: 799 },
      { name: "Relaxing Foot Soak Kit", price: 949 },
      { name: "Nourishing Face Care Set", price: 1199 },
      { name: "Wellness Ritual Trio", price: 1349 },
      { name: "Complete Care Bundle", price: 1599 },
    ],
    jewellery: [
      { name: "Classic Pearl Necklace", price: 1349 },
      { name: "Traditional Gold-Tone Bangles", price: 1199 },
      { name: "Elegant Prayer Bead Mala", price: 899 },
      { name: "Simple Chain Pendant", price: 999 },
      { name: "Classic Stud Earrings", price: 799 },
      { name: "Heritage Charm Bracelet", price: 1099 },
      { name: "Timeless Brooch Set", price: 899 },
      { name: "Everyday Comfort Ring", price: 749 },
    ],
    "add-ons": genericAddOns,
  },
  couples: {
    "self-care": [
      { name: "His & Hers Spa Duo Box", price: 2599 },
      { name: "Couple's Cozy Night In Box", price: 2299 },
      { name: "Together Time Self-Care Set", price: 1999 },
      { name: "Mini Duo Pamper Box", price: 1299 },
      { name: "Weekend Wind-Down Hamper", price: 2799 },
      { name: "Couple's Bath Ritual Duo", price: 1899 },
      { name: "Relax Together Gift Box", price: 2099 },
      { name: "His & Hers Comfort Kit", price: 1749 },
    ],
    personalised: [
      { name: "Personalised Couple Name Frame", price: 1099 },
      { name: "Engraved Matching Mug Set", price: 999 },
      { name: "Custom Couple Photo Journal", price: 899 },
      { name: "Personalised Anniversary Print", price: 799 },
      { name: "Matching Initial Keychains", price: 599 },
      { name: "Custom Couple Portrait", price: 1899 },
      { name: "Engraved Wine Glass Duo", price: 1299 },
      { name: "Personalised Love Story Book", price: 1449 },
    ],
    "luxury-edit": [
      { name: "The Romantic Escape Hamper", price: 4599 },
      { name: "Premium His & Hers Trunk", price: 3999 },
      { name: "Signature Wine & Cheese Set", price: 3499 },
      { name: "Deluxe Couple's Retreat Box", price: 4299 },
      { name: "The Anniversary Celebration Hamper", price: 4999 },
      { name: "Luxury Matching Robe Set", price: 3299 },
      { name: "Premium Date Night Box", price: 3799 },
      { name: "Gold Accent Keepsake Duo", price: 2899 },
    ],
    "home-living": [
      { name: "Matching Mug & Coaster Duo", price: 899 },
      { name: "Couple's Scented Candle Set", price: 1499 },
      { name: "Cozy Throw Blanket for Two", price: 1899 },
      { name: "His & Hers Bathrobe Set", price: 2199 },
      { name: "Botanical Vase Duo Set", price: 1349 },
      { name: "Date Night Table Décor Set", price: 1249 },
      { name: "Matching Cushion Cover Duo", price: 999 },
      { name: "Morning Coffee Duo Set", price: 1549 },
    ],
    beauty: [
      { name: "His & Hers Skincare Duo", price: 1599 },
      { name: "Couple's Face Mask Set", price: 899 },
      { name: "Matching Bath Bomb Duo", price: 649 },
      { name: "Shared Grooming Kit", price: 1199 },
      { name: "Romantic Bath Oil Duo", price: 999 },
      { name: "Glow Together Skincare Set", price: 1349 },
      { name: "His & Hers Fragrance Duo", price: 1899 },
      { name: "Complete Couple's Care Bundle", price: 1699 },
    ],
    jewellery: [
      { name: "Matching Couple Bracelets", price: 999 },
      { name: "His & Hers Ring Set", price: 1599 },
      { name: "Matching Pendant Duo", price: 1199 },
      { name: "Couple's Charm Bracelet Set", price: 1099 },
      { name: "Matching Anklet & Bracelet Duo", price: 899 },
      { name: "His & Hers Cufflink & Earring Set", price: 1449 },
      { name: "Promise Ring Duo", price: 1799 },
      { name: "Everyday Matching Bands", price: 799 },
    ],
    "add-ons": genericAddOns,
  },
  friends: {
    "self-care": [
      { name: "Best Friend Pamper Box", price: 1799 },
      { name: "Girls' Night In Self-Care Set", price: 1999 },
      { name: "Mini Friendship Treat Box", price: 999 },
      { name: "The Ultimate Chill Box", price: 1649 },
      { name: "Squad Spa Day Hamper", price: 2299 },
      { name: "Cozy Catch-Up Ritual Set", price: 1549 },
      { name: "Relax & Recharge Friend Box", price: 2099 },
      { name: "Everyday Self-Care Duo", price: 1349 },
    ],
    personalised: [
      { name: "Personalised Friendship Frame", price: 799 },
      { name: "Custom Best Friend Bracelet", price: 649 },
      { name: "Engraved Friendship Journal", price: 899 },
      { name: "Personalised Photo Collage", price: 749 },
      { name: "Custom Nickname Keychain", price: 399 },
      { name: "Engraved Friendship Mug", price: 599 },
      { name: "Personalised Memory Jar", price: 999 },
      { name: "Custom Squad Tote Bag", price: 749 },
    ],
    "luxury-edit": [
      { name: "The Ultimate Friendship Hamper", price: 3499 },
      { name: "Premium Girls' Night Trunk", price: 3999 },
      { name: "Signature Celebration Box", price: 3299 },
      { name: "Deluxe Squad Retreat Hamper", price: 3799 },
      { name: "The Bestie Celebration Trunk", price: 4499 },
      { name: "Luxury Spa Day Box", price: 2999 },
      { name: "Premium Party Starter Set", price: 2799 },
      { name: "Gold Accent Friendship Set", price: 2599 },
    ],
    "home-living": [
      { name: "Fun Mug & Coaster Set", price: 799 },
      { name: "Scented Candle Duo", price: 1249 },
      { name: "Cozy Hangout Blanket", price: 1699 },
      { name: "Room Décor Fairy Light Set", price: 999 },
      { name: "Botanical Desk Plant Set", price: 899 },
      { name: "Party Table Décor Set", price: 1149 },
      { name: "Movie Night Cushion Set", price: 999 },
      { name: "Snack & Sip Tray Set", price: 1349 },
    ],
    beauty: [
      { name: "Best Friend Beauty Kit", price: 1199 },
      { name: "Face Mask Party Pack", price: 799 },
      { name: "Everyday Glow Duo", price: 999 },
      { name: "Nail Care Party Set", price: 649 },
      { name: "Hair Care Sharing Set", price: 1099 },
      { name: "Fresh Face Trio", price: 949 },
      { name: "Squad Glow Kit", price: 1349 },
      { name: "Complete Beauty Bundle", price: 1599 },
    ],
    jewellery: [
      { name: "Best Friend Charm Bracelets", price: 599 },
      { name: "Matching Friendship Necklace Set", price: 799 },
      { name: "Stackable Ring Set", price: 649 },
      { name: "Beaded Bracelet Duo", price: 499 },
      { name: "Everyday Stud Earring Set", price: 699 },
      { name: "Friendship Anklet Set", price: 549 },
      { name: "Layered Chain Set", price: 899 },
      { name: "Charm Keychain & Bracelet Duo", price: 749 },
    ],
    "add-ons": genericAddOns,
  },
  colleagues: {
    "self-care": [
      { name: "Office Wellness Box", price: 1499 },
      { name: "Desk Break Self-Care Kit", price: 999 },
      { name: "Mini Relax Treat Box", price: 749 },
      { name: "The Work-Life Balance Box", price: 1799 },
      { name: "Team Appreciation Hamper", price: 2099 },
      { name: "Post-Meeting Calm Kit", price: 899 },
      { name: "Everyday Wellness Set", price: 1249 },
      { name: "Wind-Down Desk Kit", price: 1349 },
    ],
    personalised: [
      { name: "Personalised Desk Nameplate", price: 899 },
      { name: "Custom Coffee Mug", price: 599 },
      { name: "Engraved Pen Set", price: 799 },
      { name: "Personalised Notebook", price: 649 },
      { name: "Custom Laptop Sleeve", price: 999 },
      { name: "Engraved Desk Organiser", price: 1099 },
      { name: "Personalised Planner", price: 749 },
      { name: "Custom Business Card Holder", price: 849 },
    ],
    "luxury-edit": [
      { name: "The Executive Appreciation Trunk", price: 3999 },
      { name: "Premium Desk Accessory Set", price: 3499 },
      { name: "Signature Corporate Hamper", price: 3799 },
      { name: "Deluxe Office Essentials Box", price: 2999 },
      { name: "The Leadership Celebration Trunk", price: 4299 },
      { name: "Luxury Pen & Notebook Set", price: 2599 },
      { name: "Premium Coffee Ritual Set", price: 2799 },
      { name: "Gold Accent Desk Trophy Set", price: 2499 },
    ],
    "home-living": [
      { name: "Ceramic Desk Mug Set", price: 799 },
      { name: "Desk Plant & Pot Set", price: 899 },
      { name: "Aromatic Desk Diffuser", price: 1099 },
      { name: "Minimalist Desk Organiser", price: 999 },
      { name: "Coaster & Notepad Set", price: 649 },
      { name: "Office Candle Set", price: 1099 },
      { name: "Desk Décor Bundle", price: 1249 },
      { name: "Morning Coffee Desk Kit", price: 1349 },
    ],
    beauty: [
      { name: "Desk Hand Care Duo", price: 649 },
      { name: "Office Freshen-Up Kit", price: 799 },
      { name: "Everyday Glow Essentials", price: 899 },
      { name: "Travel-Size Skincare Set", price: 749 },
      { name: "Refresh & Renew Desk Kit", price: 949 },
      { name: "Hand Cream & Lip Balm Duo", price: 549 },
      { name: "Quick Care Trio", price: 699 },
      { name: "Complete Desk Wellness Bundle", price: 1199 },
    ],
    jewellery: [
      { name: "Minimalist Stud Earring Set", price: 699 },
      { name: "Classic Chain Bracelet", price: 799 },
      { name: "Simple Pendant Necklace", price: 899 },
      { name: "Everyday Ring Set", price: 649 },
      { name: "Professional Cufflink Set", price: 899 },
      { name: "Delicate Layered Necklace", price: 999 },
      { name: "Classic Tie Pin Set", price: 599 },
      { name: "Minimalist Bangle Set", price: 749 },
    ],
    "add-ons": genericAddOns,
  },
};

const recipientsByAudience: Record<AudienceSlug, string[]> = {
  her: ["Wife", "Sister", "Friend", "Mother", "Daughter", "Colleague", "Partner"],
  him: ["Husband", "Brother", "Father", "Son", "Friend", "Colleague", "Partner"],
  parents: [
    "Mother",
    "Father",
    "Grandmother",
    "Grandfather",
    "Mother-in-law",
    "Father-in-law",
  ],
  couples: [
    "Newlyweds",
    "Engaged Couple",
    "Anniversary Couple",
    "Best Friends",
    "Family",
    "Colleagues",
  ],
  friends: [
    "Best Friend",
    "Roommate",
    "Childhood Friend",
    "College Friend",
    "Neighbour",
    "Colleague",
  ],
  colleagues: [
    "Manager",
    "Teammate",
    "Mentor",
    "New Joinee",
    "Client",
    "Retiring Colleague",
  ],
};

export type ShopProduct = {
  id: string;
  name: string;
  price: number;
  rating: number;
  reviews: number;
  inStock: boolean;
  image: string;
  category: string;
  occasions: string[];
  recipients: string[];
};

function buildProducts(audience: AudienceSlug): ShopProduct[] {
  const recipients = recipientsByAudience[audience];
  const seedsByCategory = productSeedsByAudience[audience];
  let idx = 0;

  return shopCategories.flatMap((cat) =>
    (seedsByCategory[cat.slug] ?? []).map((seed, i) => {
      const localIdx = idx++;
      const [bg, fg] = categoryBg[cat.slug];
      const rating = 3 + (localIdx % 3);
      const reviews = 40 + ((localIdx * 17) % 200);
      const occasions = [
        shopOccasions[localIdx % shopOccasions.length],
        shopOccasions[(localIdx + 3) % shopOccasions.length],
      ];
      const productRecipients = [
        recipients[localIdx % recipients.length],
        recipients[(localIdx + 2) % recipients.length],
      ];
      return {
        id: `${audience}-${cat.slug}-${i + 1}`,
        name: seed.name,
        price: seed.price,
        rating,
        reviews,
        inStock: true,
        image: ph(320, 320, bg, fg, seed.name),
        category: cat.slug,
        occasions,
        recipients: productRecipients,
      };
    })
  );
}

export const shopProductsByAudience: Record<AudienceSlug, ShopProduct[]> = {
  her: buildProducts("her"),
  him: buildProducts("him"),
  parents: buildProducts("parents"),
  couples: buildProducts("couples"),
  friends: buildProducts("friends"),
  colleagues: buildProducts("colleagues"),
};

export type ShopProductWithAudience = ShopProduct & { audience: AudienceSlug };

export const allShopProducts: ShopProductWithAudience[] = audienceSlugs.flatMap(
  (audience) => shopProductsByAudience[audience].map((p) => ({ ...p, audience }))
);

export type AudienceShopContent = {
  title: string;
  subtitle: string;
  breadcrumbLabel: string;
  recipients: string[];
};

export const audienceShopContent: Record<AudienceSlug, AudienceShopContent> = {
  her: {
    title: "Gifts for Her",
    subtitle:
      "Thoughtful gifts to celebrate the women who inspire, uplift and make every moment beautiful.",
    breadcrumbLabel: "Gifts for Her",
    recipients: recipientsByAudience.her,
  },
  him: {
    title: "Gifts for Him",
    subtitle:
      "Handpicked gifts for the men who bring strength, humour, and warmth into our lives.",
    breadcrumbLabel: "Gifts for Him",
    recipients: recipientsByAudience.him,
  },
  parents: {
    title: "Gifts for Parents",
    subtitle: "Heartfelt gifts to thank the ones who gave us everything.",
    breadcrumbLabel: "Gifts for Parents",
    recipients: recipientsByAudience.parents,
  },
  couples: {
    title: "Gifts for Couples",
    subtitle:
      "Romantic gifts to celebrate love, togetherness, and every milestone shared.",
    breadcrumbLabel: "Gifts for Couples",
    recipients: recipientsByAudience.couples,
  },
  friends: {
    title: "Gifts for Friends",
    subtitle: "Fun, thoughtful gifts for the friends who feel like family.",
    breadcrumbLabel: "Gifts for Friends",
    recipients: recipientsByAudience.friends,
  },
  colleagues: {
    title: "Gifts for Colleagues",
    subtitle:
      "Professional, thoughtful gifts to appreciate the people you work with.",
    breadcrumbLabel: "Gifts for Colleagues",
    recipients: recipientsByAudience.colleagues,
  },
};
