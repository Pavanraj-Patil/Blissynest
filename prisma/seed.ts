// Seeds the local dev database from the frontend's existing mock data files
// (src/lib/{shop,collection,product}-mock-data.ts, src/lib/mock-data.ts) so
// the product APIs (src/app/api/products/*) have real rows to serve while
// the catalogue is wired up. Run via `npx prisma db seed` (or automatically
// after `prisma migrate dev`) — configured in prisma.config.ts.
//
// Relative imports throughout (not the `@/*` alias) since tsx runs this
// script outside Next.js's module resolution.
import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import {
  allShopProducts,
  type ShopProductWithAudience,
} from "../src/lib/shop-mock-data";
import {
  collectionContent,
  collectionSlugs,
  type CollectionProduct,
  type CollectionSlug,
} from "../src/lib/collection-mock-data";
import { bestsellers } from "../src/lib/mock-data";
import { flagshipProducts } from "./seed-flagship-products";
import { slugify } from "../src/lib/slugify";

const adapter = new PrismaMariaDb(process.env.DATABASE_URL!);
const db = new PrismaClient({ adapter });

const genericCare = [
  "Keep away from direct sunlight",
  "Store in a cool, dry place",
  "Handle with care",
];
const genericBenefits = [
  { icon: "Gift", label: "Thoughtfully Curated" },
  { icon: "PackageCheck", label: "Premium Packaging" },
  { icon: "Truck", label: "Delivered with Care" },
  { icon: "ShieldCheck", label: "Happiness Guaranteed" },
];

const audienceSlugToEnum = {
  her: "HER",
  him: "HIM",
  parents: "PARENTS",
  couples: "COUPLES",
  friends: "FRIENDS",
  colleagues: "COLLEAGUES",
} as const;

function titleCase(slug: string): string {
  return slug
    .split("-")
    .map((w) => w[0].toUpperCase() + w.slice(1))
    .join(" ");
}

// Deterministic (not random) so re-running the seed produces the same
// numbers — same reasoning as the mock data's rating/review generation.
// No real inventory system exists yet, so this is a placeholder like those,
// just varied enough that low-stock alerts in the admin dashboard aren't
// trivially "every product" (stockQuantity previously defaulted to 0).
function stockFor(slug: string): number {
  let hash = 0;
  for (let i = 0; i < slug.length; i++) hash = (hash * 31 + slug.charCodeAt(i)) % 1000;
  return 5 + (hash % 145);
}

function fromShopProduct(p: ShopProductWithAudience) {
  return {
    slug: p.id,
    name: p.name,
    audience: audienceSlugToEnum[p.audience],
    category: p.category,
    collectionSlug: null,
    occasionTags: p.occasions,
    recipientTags: p.recipients,
    basePrice: p.price * 100,
    images: [p.image],
    breadcrumbCategory: titleCase(p.category),
    rating: p.rating,
    reviewCount: p.reviews,
    stockQuantity: stockFor(p.id),
    benefits: genericBenefits,
    productDetails: {
      description: `${p.name} — a thoughtfully chosen gift, beautifully packaged and ready to make someone's day.`,
      delivery: "Ships within 24-48 hours, delivered in gift-ready packaging across India.",
      care: genericCare.join(" · "),
    },
    featured: false,
  };
}

function fromCollectionProduct(slug: CollectionSlug, p: CollectionProduct) {
  return {
    slug: p.id,
    name: p.name,
    category: p.category,
    collectionSlug: slug,
    occasionTags: p.occasions,
    recipientTags: [],
    attribute: p.attribute ?? null,
    badge: p.badge ? (p.badge.toUpperCase() as "BESTSELLER" | "NEW") : null,
    basePrice: p.price * 100,
    images: [p.image],
    breadcrumbCategory: titleCase(p.category),
    rating: p.rating,
    reviewCount: p.reviews,
    stockQuantity: stockFor(p.id),
    benefits: genericBenefits,
    productDetails: {
      description: `${p.name} — a thoughtfully chosen gift, beautifully packaged and ready to make someone's day.`,
      delivery: "Ships within 24-48 hours, delivered in gift-ready packaging across India.",
      care: genericCare.join(" · "),
    },
    featured: false,
  };
}

function fromBestseller(b: (typeof bestsellers)[number]) {
  return {
    slug: slugify(b.name),
    name: b.name,
    category: "bestsellers",
    occasionTags: [],
    recipientTags: [],
    basePrice: b.price * 100,
    images: [b.image],
    breadcrumbCategory: "Bestsellers",
    rating: b.rating,
    reviewCount: b.reviews,
    stockQuantity: stockFor(slugify(b.name)),
    benefits: genericBenefits,
    productDetails: {
      description: `${b.name} — a thoughtfully chosen gift, beautifully packaged and ready to make someone's day.`,
      delivery: "Ships within 24-48 hours, delivered in gift-ready packaging across India.",
      care: genericCare.join(" · "),
    },
    featured: true,
  };
}

async function main() {
  const shopRows = allShopProducts.map(fromShopProduct);
  const collectionRows = collectionSlugs.flatMap((slug) =>
    collectionContent[slug].products.map((p) => fromCollectionProduct(slug, p))
  );
  const bestsellerRows = bestsellers.map(fromBestseller);

  const rows = [...shopRows, ...collectionRows, ...bestsellerRows, ...flagshipProducts];

  // Upsert by slug rather than delete-then-recreate: real Order/CartItem/
  // Wishlist rows now reference real product ids (this is a live-ish
  // database, not just mock scaffolding anymore), and deleting products
  // out from under them would violate FK constraints — or worse, cascade
  // and destroy real customer history, if a cascade were ever added. This
  // also means re-running the seed no longer clobbers stock/status edits
  // made from the admin panel to *other* fields... except it does still
  // overwrite every field below on every run. That's an accepted tradeoff
  // for now (this script is the only source of catalogue truth); revisit
  // once the admin panel is the source of truth instead.
  let count = 0;
  for (const row of rows) {
    await db.product.upsert({ where: { slug: row.slug }, create: row, update: row });
    count++;
  }
  console.log(`Upserted ${count} products.`);

  await db.siteSettings.upsert({
    where: { id: "singleton" },
    update: {},
    create: { id: "singleton" },
  });
  console.log("Ensured SiteSettings singleton row exists.");

  // Matches src/lib/checkout-data.ts's coupons array — kept in sync by hand
  // (just two rows) so the checkout page's live discount preview and the
  // server's authoritative /api/orders validation agree.
  for (const coupon of [
    { code: "WELCOME10", discountType: "PERCENT" as const, discountValue: 10, minOrderValue: 0 },
    { code: "FLAT200", discountType: "FLAT" as const, discountValue: 20000, minOrderValue: 150000 },
  ]) {
    await db.coupon.upsert({ where: { code: coupon.code }, update: coupon, create: coupon });
  }
  console.log("Ensured demo coupons exist.");

  // Only seeded when the table is empty — Banner has no natural unique key
  // to upsert against, and once an admin starts editing these via
  // /admin/banners, re-running this shouldn't silently recreate deleted
  // defaults.
  const bannerCount = await db.banner.count();
  if (bannerCount === 0) {
    await db.banner.createMany({
      data: [
        {
          title: "The Diwali Edit",
          subtitle: "Diyas, sweets, and hampers for the festival of light.",
          href: "/occasions/festivals",
          icon: "flame",
          gradient: "terracotta",
          sortOrder: 0,
        },
        {
          title: "Wedding Season Is Here",
          subtitle: "Timeless gifts for every wedding on your calendar.",
          href: "/occasions/wedding",
          icon: "gem",
          gradient: "charcoal-olive",
          sortOrder: 1,
        },
        {
          title: "Ring In the New Year",
          subtitle: "Toast to fresh beginnings with something memorable.",
          href: "/occasions/festivals",
          icon: "party-popper",
          gradient: "olive",
          sortOrder: 2,
        },
      ],
    });
    console.log("Seeded default homepage banners.");
  }
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
