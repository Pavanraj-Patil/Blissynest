import {
  Gift,
  Flower2,
  Heart,
  Crown,
  Home,
  Droplet,
  Gem,
  Plus,
  Sparkles,
  Wallet,
  Cpu,
  Users,
  Image as ImageIcon,
  PartyPopper,
  Wine,
  Palette,
  Puzzle,
  Baby,
  type LucideIcon,
} from "lucide-react";

const ph = (w: number, h: number, bg: string, fg: string, text: string) =>
  `https://placehold.co/${w}x${h}/${bg}/${fg}.png?text=${encodeURIComponent(
    text
  )}&font=playfair-display`;

export type ShopCategory = {
  slug: string;
  label: string;
};

// The global, audience-agnostic category list — still used as-is by /shop,
// /collections/[collection], /occasions/[occasion], /personalised, /search,
// and the admin Site Content "category pill images" editor. The five
// audience shop pages (/shop/[audience]) use their own per-audience lists
// instead — see `categoriesByAudience` below. Self Care, Beauty and Add-ons
// are deliberately excluded as quick-filter pills here (product owner's
// call) — their categoryIcons entries stay, since occasion pages'
// hand-curated pill lists (occasion-data.ts) still reference them directly.
export const shopCategories: ShopCategory[] = [
  { slug: "personalised", label: "Personalised" },
  { slug: "luxury-edit", label: "Luxury Edit" },
  { slug: "home-living", label: "Home & Living" },
  { slug: "jewellery", label: "Jewellery" },
  { slug: "hamper", label: "Hampers" },
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
  // Per-audience category slugs (see categoriesByAudience) — some reuse the
  // icons above where the theme matches (e.g. jewellery-accessories: Gem).
  "jewellery-accessories": Gem,
  "personalised-gifts": Heart,
  "luxury-gifts": Crown,
  "flowers-floral-gifts": Flower2,
  "home-lifestyle": Home,
  "cute-trending-gifts": Sparkles,
  "perfumes-fragrance": Droplet,
  "wallets-accessories": Wallet,
  "gadgets-tech": Cpu,
  "home-desk": Home,
  "for-mom": Heart,
  "for-dad": Heart,
  "for-both-parents": Users,
  "personalised-memories": ImageIcon,
  "anniversary-gifts": PartyPopper,
  "personalised-couple-gifts": Heart,
  "date-night": Wine,
  "couple-jewellery": Gem,
  "luxury-couple-gifts": Crown,
  "creative-diy-kits": Palette,
  "educational-interactive-toys": Puzzle,
  "personalized-cute-kids-gifts": Baby,
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

type ProductSeed = { name: string; price: number };

export type AudienceSlug =
  | "her"
  | "him"
  | "parents"
  | "couples"
  | "kids";

export const audienceSlugs: AudienceSlug[] = [
  "her",
  "him",
  "parents",
  "couples",
  "kids",
];

// Each audience's own quick-filter pills — replaces the old shared
// `shopCategories` row that every /shop/[audience] page used to show
// identically. Slugs are shared across audiences only where the full
// category name is identical (e.g. "Personalised Gifts" for Her and Him);
// the underlying product content is still authored separately per audience
// in `productSeedsByAudience` below, since `audience` is filtered
// independently of `category`. Labels are kept short (one or two words) —
// pill UI, not full category names; breadcrumbs/page titles use
// `audienceShopContent` instead, so nothing here needs the long form.
export const categoriesByAudience: Record<AudienceSlug, ShopCategory[]> = {
  her: [
    { slug: "jewellery-accessories", label: "Jewellery" },
    { slug: "personalised-gifts", label: "Personalised" },
    { slug: "luxury-gifts", label: "Luxury" },
    { slug: "flowers-floral-gifts", label: "Floral" },
    { slug: "home-lifestyle", label: "Lifestyle" },
    { slug: "cute-trending-gifts", label: "Trending" },
    { slug: "hamper", label: "Hampers" },
  ],
  him: [
    { slug: "perfumes-fragrance", label: "Perfumes" },
    { slug: "personalised-gifts", label: "Personalised" },
    { slug: "wallets-accessories", label: "Accessories" },
    { slug: "gadgets-tech", label: "Gadgets" },
    { slug: "luxury-gifts", label: "Luxury" },
    { slug: "home-desk", label: "Desk" },
    { slug: "jewellery-accessories", label: "Jewellery" },
    { slug: "hamper", label: "Hampers" },
  ],
  parents: [
    { slug: "for-mom", label: "Mom" },
    { slug: "for-dad", label: "Dad" },
    { slug: "for-both-parents", label: "Both Parents" },
    { slug: "personalised-memories", label: "Personalised" },
    { slug: "home-living", label: "Home" },
    { slug: "luxury-gifts", label: "Luxury" },
    { slug: "hamper", label: "Hampers" },
  ],
  couples: [
    { slug: "anniversary-gifts", label: "Anniversary" },
    { slug: "personalised-couple-gifts", label: "Personalised" },
    { slug: "date-night", label: "Date Night" },
    { slug: "couple-jewellery", label: "Jewellery" },
    { slug: "luxury-couple-gifts", label: "Luxury" },
    { slug: "hamper", label: "Hampers" },
  ],
  kids: [
    { slug: "creative-diy-kits", label: "DIY Kits" },
    { slug: "educational-interactive-toys", label: "Toys" },
    { slug: "personalized-cute-kids-gifts", label: "Personalized" },
    { slug: "hamper", label: "Hampers" },
  ],
};

// The "Personalised" header nav dropdown links each audience straight to
// its own personalised-ish category — every audience's list has exactly
// one (spelled "personalized" for Kids), so this finds it by label rather
// than hardcoding a parallel slug list that would silently drift out of
// sync with categoriesByAudience above.
export const personalisedCategoryByAudience: Record<AudienceSlug, string> = Object.fromEntries(
  audienceSlugs.map((slug) => {
    const match = categoriesByAudience[slug].find((c) => /personali[sz]ed/i.test(c.label));
    return [slug, (match ?? categoriesByAudience[slug][0]).slug];
  })
) as Record<AudienceSlug, string>;

// Maps a per-audience category slug onto the shared `shopCategories`
// vocabulary, wherever there's a genuine, honest fit — so those products
// stay discoverable through the general /shop, /collections/[collection],
// /occasions/[occasion], /personalised and /search pages' own quick-filter
// pills too, not just their own audience page's. Products get tagged with
// BOTH slugs (see buildProducts below), since `category` is a real array.
// Categories with no honest general-bucket fit (all of Kids, Wallets &
// Accessories, Gadgets & Tech, Perfumes & Fragrance, Date Night, For
// Mom/Dad/Both Parents, Anniversary Gifts, Cute & Trending Gifts) are
// deliberately left unmapped — they only show under "All" there, the same
// existing pattern bestsellers already uses for its own non-matching
// "bestsellers" tag. (Self Care, Beauty and Add-ons aren't valid mapping
// targets at all — see shopCategories above.)
export const generalCategoryFor: Partial<Record<string, string>> = {
  "jewellery-accessories": "jewellery",
  "personalised-gifts": "personalised",
  "luxury-gifts": "luxury-edit",
  "home-lifestyle": "home-living",
  "flowers-floral-gifts": "home-living",
  "home-desk": "home-living",
  "personalised-memories": "personalised",
  "personalised-couple-gifts": "personalised",
  "couple-jewellery": "jewellery",
  "luxury-couple-gifts": "luxury-edit",
};

const categoryBg: Record<string, [string, string]> = {
  "jewellery-accessories": ["e9dccb", "2a2621"],
  "personalised-gifts": ["d9cbb0", "2a2621"],
  "luxury-gifts": ["241f1a", "cfb587"],
  "flowers-floral-gifts": ["e6d2c2", "2a2621"],
  "home-lifestyle": ["e3d3bd", "2a2621"],
  "cute-trending-gifts": ["ecdccd", "a85830"],
  "perfumes-fragrance": ["e6d2c2", "2a2621"],
  "wallets-accessories": ["d6c7a8", "2a2621"],
  "gadgets-tech": ["241f1a", "cfb587"],
  "home-desk": ["e3d3bd", "2a2621"],
  "for-mom": ["ecdccd", "a85830"],
  "for-dad": ["e9dccb", "2a2621"],
  "for-both-parents": ["e3d3bd", "2a2621"],
  "personalised-memories": ["d9cbb0", "2a2621"],
  "home-living": ["e3d3bd", "2a2621"],
  "anniversary-gifts": ["241f1a", "cfb587"],
  "personalised-couple-gifts": ["d9cbb0", "2a2621"],
  "date-night": ["e6d2c2", "2a2621"],
  "couple-jewellery": ["e9dccb", "2a2621"],
  "luxury-couple-gifts": ["241f1a", "cfb587"],
  "creative-diy-kits": ["e6d2c2", "2a2621"],
  "educational-interactive-toys": ["e3d3bd", "2a2621"],
  "personalized-cute-kids-gifts": ["ecdccd", "a85830"],
};

const productSeedsByAudience: Record<
  AudienceSlug,
  Record<string, ProductSeed[]>
> = {
  her: {
    "jewellery-accessories": [
      { name: "Rose Gold Layered Necklace", price: 1349 },
      { name: "Pearl Drop Earrings", price: 999 },
      { name: "Birthstone Ring", price: 1599 },
      { name: "Charm Bracelet Set", price: 899 },
      { name: "Silk Hair Scarf", price: 649 },
      { name: "Designer Sunglasses Case Set", price: 799 },
      { name: "Statement Hoop Earrings", price: 799 },
      { name: "Classic Leather Handbag Charm", price: 899 },
    ],
    "personalised-gifts": [
      { name: "Personalised Name Necklace", price: 1199 },
      { name: "Custom Initial Bracelet", price: 799 },
      { name: "Personalised Journal", price: 899 },
      { name: "Engraved Jewellery Box", price: 1449 },
      { name: "Custom Photo Frame", price: 649 },
      { name: "Monogrammed Robe", price: 1899 },
      { name: "Personalised Tote Bag", price: 749 },
      { name: "Custom Name Keychain", price: 399 },
    ],
    "luxury-gifts": [
      { name: "Luxury Beauty Gift Box", price: 2499 },
      { name: "Signature Silk Scarf Set", price: 3499 },
      { name: "Premium Rose Gold Jewellery Set", price: 4599 },
      { name: "Deluxe Spa Retreat Box", price: 3299 },
      { name: "The Opulence Hamper", price: 4999 },
      { name: "Velvet Luxe Gift Trunk", price: 3799 },
      { name: "Gold Accent Vanity Set", price: 2899 },
      { name: "The Grand Celebration Hamper", price: 3999 },
    ],
    "flowers-floral-gifts": [
      { name: "Fresh Rose Bouquet", price: 899 },
      { name: "Everlasting Dried Flower Bunch", price: 799 },
      { name: "Mixed Seasonal Flower Basket", price: 1099 },
      { name: "Orchid Plant Gift Box", price: 1299 },
      { name: "Sunflower Bouquet & Vase Set", price: 999 },
      { name: "Lavender Bloom Hamper", price: 1149 },
      { name: "Pastel Tulip Bouquet", price: 949 },
      { name: "Rose & Chocolate Bouquet Box", price: 1249 },
    ],
    "home-lifestyle": [
      { name: "Scented Candle Gift Set", price: 1499 },
      { name: "Cozy Throw Blanket Set", price: 1799 },
      { name: "Ceramic Mug & Coaster Set", price: 899 },
      { name: "Botanical Vase & Bloom Set", price: 1349 },
      { name: "Aromatherapy Diffuser Kit", price: 1699 },
      { name: "Linen Cushion Cover Duo", price: 999 },
      { name: "Table Décor Gift Set", price: 1249 },
      { name: "Morning Ritual Tray Set", price: 1549 },
    ],
    "cute-trending-gifts": [
      { name: "Cloud Plush Keychain Set", price: 349 },
      { name: "Trendy Pastel Tumbler", price: 599 },
      { name: "Cute Enamel Pin Collection", price: 449 },
      { name: "Mini Polaroid Photo Album", price: 599 },
      { name: "Trending LED Desk Lamp", price: 899 },
      { name: "Cute Animal Coin Purse", price: 399 },
      { name: "Aesthetic Sticker & Washi Tape Set", price: 349 },
      { name: "Trendy Claw Clip Set", price: 299 },
    ],
  },
  him: {
    "perfumes-fragrance": [
      { name: "Signature Cologne Duo", price: 1899 },
      { name: "Woody Musk Perfume Set", price: 1499 },
      { name: "Citrus Fresh Fragrance Gift Set", price: 1299 },
      { name: "Deluxe Fragrance Discovery Box", price: 2299 },
      { name: "Classic Aftershave & Cologne Duo", price: 1699 },
      { name: "Travel Size Fragrance Set", price: 999 },
      { name: "Oud & Amber Perfume Box", price: 2499 },
      { name: "Everyday Fragrance Trio", price: 1399 },
    ],
    "personalised-gifts": [
      { name: "Personalised Leather Wallet", price: 1499 },
      { name: "Engraved Whiskey Glass Set", price: 1899 },
      { name: "Custom Initial Cufflinks", price: 1199 },
      { name: "Personalised Desk Nameplate", price: 899 },
      { name: "Monogrammed Travel Pouch", price: 999 },
      { name: "Custom Photo Wallet Card", price: 649 },
      { name: "Engraved Money Clip", price: 1099 },
      { name: "Personalised Keychain", price: 399 },
    ],
    "wallets-accessories": [
      { name: "Premium Leather Wallet", price: 1299 },
      { name: "Classic Leather Belt", price: 899 },
      { name: "Card Holder & Wallet Set", price: 999 },
      { name: "Leather Keychain & Wallet Duo", price: 1099 },
      { name: "Slim RFID Wallet", price: 849 },
      { name: "Leather Passport Cover Set", price: 1199 },
      { name: "Travel Accessory Organiser Set", price: 1349 },
      { name: "Classic Tie & Wallet Combo", price: 1499 },
    ],
    "gadgets-tech": [
      { name: "Wireless Earbuds", price: 2499 },
      { name: "Smart Fitness Band", price: 1999 },
      { name: "Portable Bluetooth Speaker", price: 1799 },
      { name: "Wireless Charging Pad Set", price: 999 },
      { name: "Multi-Port Travel Charger Kit", price: 1199 },
      { name: "Smart LED Desk Lamp", price: 1299 },
      { name: "Compact Power Bank", price: 899 },
      { name: "Bluetooth Tracker Duo", price: 749 },
    ],
    "luxury-gifts": [
      { name: "The Executive Gift Trunk", price: 4599 },
      { name: "Signature Watch Box", price: 4299 },
      { name: "Deluxe Whiskey Barware Set", price: 3599 },
      { name: "Premium Leather Travel Set", price: 3999 },
      { name: "The Gentleman's Reserve Hamper", price: 4999 },
      { name: "Luxury Grooming Vanity Kit", price: 3299 },
      { name: "Premium Cigar Accessory Set", price: 3799 },
      { name: "Gold Accent Desk Set", price: 2899 },
    ],
    "home-desk": [
      { name: "Desk Organiser Set", price: 1099 },
      { name: "Ceramic Whiskey Mug Set", price: 899 },
      { name: "Minimalist Wall Clock", price: 1449 },
      { name: "Executive Desk Accessory Set", price: 1349 },
      { name: "Wooden Pen & Card Holder Set", price: 999 },
      { name: "Morning Coffee Ritual Set", price: 1549 },
      { name: "Leather Desk Mat & Organiser", price: 1299 },
      { name: "Ambient Desk Lamp Set", price: 1199 },
    ],
    "jewellery-accessories": [
      { name: "Leather Bracelet Set", price: 799 },
      { name: "Stainless Steel Cufflinks", price: 899 },
      { name: "Minimalist Chain Bracelet", price: 999 },
      { name: "Engraved Signet Ring", price: 1349 },
      { name: "Classic Tie Clip Set", price: 649 },
      { name: "Braided Leather Bands", price: 599 },
      { name: "Silver Accent Bracelet", price: 1099 },
      { name: "Everyday Wristband Set", price: 499 },
    ],
  },
  parents: {
    "for-mom": [
      { name: "Silk Saree Gift Box", price: 2499 },
      { name: "Mom's Comfort Shawl Set", price: 1499 },
      { name: "Personalised Mom Photo Frame", price: 899 },
      { name: "Herbal Wellness Kit for Mom", price: 1299 },
      { name: "Traditional Gold-Tone Jewellery Set", price: 1799 },
      { name: "Mom's Self-Care Hamper", price: 1999 },
      { name: "Ayurvedic Skin Nourish Set", price: 1299 },
      { name: "Handwritten Letter & Keepsake Box", price: 799 },
    ],
    "for-dad": [
      { name: "Dad's Grooming Essentials Box", price: 1499 },
      { name: "Personalised Dad Photo Frame", price: 899 },
      { name: "Classic Leather Wallet for Dad", price: 1299 },
      { name: "Dad's Relaxation Recliner Kit", price: 1799 },
      { name: "Engraved Whiskey Glass Set", price: 1899 },
      { name: "Dad's Tech Accessory Kit", price: 1349 },
      { name: "Traditional Kurta Gift Set", price: 1599 },
      { name: "Handwritten Letter & Keepsake Box", price: 799 },
    ],
    "for-both-parents": [
      { name: "His & Hers Comfort Hamper", price: 2599 },
      { name: "Family Tea & Snack Trunk", price: 2299 },
      { name: "Matching Recliner Blanket Set", price: 1799 },
      { name: "Personalised Family Photo Frame", price: 899 },
      { name: "Home Comfort Gift Duo", price: 1999 },
      { name: "Wellness Retreat Box for Parents", price: 2799 },
      { name: "Traditional Home Décor Duo", price: 1499 },
      { name: "Anniversary Celebration Hamper", price: 3499 },
    ],
    "personalised-memories": [
      { name: "Engraved Memory Box", price: 1449 },
      { name: "Custom Family Tree Print", price: 999 },
      { name: "Personalised Recipe Journal", price: 749 },
      { name: "Custom Name Wind Chime", price: 799 },
      { name: "Engraved Anniversary Frame", price: 1199 },
      { name: "Personalised Keepsake Card Set", price: 599 },
      { name: "Monogrammed Shawl", price: 1699 },
      { name: "Custom Family Portrait", price: 1899 },
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
    "luxury-gifts": [
      { name: "The Golden Years Hamper", price: 3999 },
      { name: "Premium Comfort Recliner Kit", price: 4599 },
      { name: "Signature Silk Shawl Set", price: 3499 },
      { name: "Deluxe Wellness Retreat Box", price: 3799 },
      { name: "The Heritage Celebration Hamper", price: 4999 },
      { name: "Luxury Tea & Snack Trunk", price: 2899 },
      { name: "Premium Home Comfort Set", price: 3299 },
      { name: "Gold Accent Keepsake Box", price: 2599 },
    ],
  },
  couples: {
    "anniversary-gifts": [
      { name: "Personalised Anniversary Print", price: 799 },
      { name: "Anniversary Celebration Hamper", price: 3499 },
      { name: "Custom Couple Portrait", price: 1899 },
      { name: "Engraved Anniversary Frame", price: 1199 },
      { name: "Anniversary Wine & Cheese Set", price: 2299 },
      { name: "Milestone Anniversary Keepsake Box", price: 1599 },
      { name: "Anniversary Photo Album Set", price: 999 },
      { name: "Golden Anniversary Gift Trunk", price: 3999 },
    ],
    "personalised-couple-gifts": [
      { name: "Personalised Couple Name Frame", price: 1099 },
      { name: "Engraved Matching Mug Set", price: 999 },
      { name: "Custom Couple Photo Journal", price: 899 },
      { name: "Matching Initial Keychains", price: 599 },
      { name: "Personalised Love Story Book", price: 1449 },
      { name: "Engraved Wine Glass Duo", price: 1299 },
      { name: "Custom Couple Caricature Print", price: 1199 },
      { name: "Matching Embroidered Robe Set", price: 1799 },
    ],
    "date-night": [
      { name: "Wine & Cheese Date Night Box", price: 1999 },
      { name: "Movie Night Snack Hamper", price: 1299 },
      { name: "Candlelight Dinner Set", price: 1799 },
      { name: "Couple's Board Game Night Box", price: 1099 },
      { name: "Date Night Playlist & Picnic Kit", price: 1499 },
      { name: "Cocktail Making Kit for Two", price: 1699 },
      { name: "Cozy Fondue Night Set", price: 1899 },
      { name: "Stargazing Picnic Kit", price: 1399 },
    ],
    "couple-jewellery": [
      { name: "Matching Couple Bracelets", price: 999 },
      { name: "His & Hers Ring Set", price: 1599 },
      { name: "Matching Pendant Duo", price: 1199 },
      { name: "Couple's Charm Bracelet Set", price: 1099 },
      { name: "Promise Ring Duo", price: 1799 },
      { name: "Matching Anklet & Bracelet Duo", price: 899 },
      { name: "His & Hers Cufflink & Earring Set", price: 1449 },
      { name: "Everyday Matching Bands", price: 799 },
    ],
    "luxury-couple-gifts": [
      { name: "The Romantic Escape Hamper", price: 4599 },
      { name: "Premium His & Hers Trunk", price: 3999 },
      { name: "Signature Wine & Cheese Set", price: 3499 },
      { name: "Deluxe Couple's Retreat Box", price: 4299 },
      { name: "Luxury Matching Robe Set", price: 3299 },
      { name: "Premium Date Night Box", price: 3799 },
      { name: "Gold Accent Keepsake Duo", price: 2899 },
      { name: "The Anniversary Celebration Hamper", price: 4999 },
    ],
  },
  kids: {
    "creative-diy-kits": [
      { name: "Paint Your Own Pottery Kit", price: 799 },
      { name: "DIY Slime Making Kit", price: 449 },
      { name: "Kids' Craft Box Set", price: 699 },
      { name: "DIY Friendship Bracelet Kit", price: 399 },
      { name: "Build-Your-Own Birdhouse Kit", price: 649 },
      { name: "DIY Sticker & Sketch Art Set", price: 549 },
      { name: "Kids' Origami Craft Kit", price: 399 },
      { name: "DIY Terrarium Making Kit", price: 749 },
    ],
    "educational-interactive-toys": [
      { name: "STEM Building Blocks Set", price: 1299 },
      { name: "Interactive Puzzle Cube", price: 599 },
      { name: "Kids' Science Experiment Kit", price: 999 },
      { name: "Alphabet Learning Board", price: 649 },
      { name: "Coding Robot Toy for Kids", price: 1899 },
      { name: "Interactive Story Book Set", price: 799 },
      { name: "Wooden Shape Sorter Toy", price: 549 },
      { name: "Kids' World Map Puzzle", price: 699 },
    ],
    "personalized-cute-kids-gifts": [
      { name: "Personalised Kids Name Puzzle", price: 649 },
      { name: "Custom Kids Backpack", price: 999 },
      { name: "Personalised Storybook with Child's Name", price: 899 },
      { name: "Cute Plush Toy with Name Tag", price: 549 },
      { name: "Personalised Lunch Box Set", price: 799 },
      { name: "Custom Kids Water Bottle", price: 449 },
      { name: "Personalised Growth Chart", price: 699 },
      { name: "Cute Kids Pajama Set with Initials", price: 899 },
    ],
  },
};

// Exported so the admin product form can drive its Recipient Tags checkboxes
// off the same vocabulary, unioned across whichever Audiences are checked.
export const recipientsByAudience: Record<AudienceSlug, string[]> = {
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
  kids: [
    "Son",
    "Daughter",
    "Nephew",
    "Niece",
    "Godchild",
    "Grandchild",
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

  return categoriesByAudience[audience].flatMap((cat) =>
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
  kids: buildProducts("kids"),
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
  kids: {
    title: "Gifts for Kids",
    subtitle:
      "Playful, creative gifts that spark imagination and make kids smile.",
    breadcrumbLabel: "Gifts for Kids",
    recipients: recipientsByAudience.kids,
  },
};
