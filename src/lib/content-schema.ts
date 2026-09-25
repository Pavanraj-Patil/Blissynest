import type { ListFieldDef } from "@/components/admin/RepeatingListField";
import {
  audienceCategories,
  occasions,
  editCollections,
  featureStrip,
  communityPhotos,
  corporateChecklist,
  footerLinks,
  heroImage,
  heroImageMobile,
} from "@/lib/mock-data";

import {
  shopCategories,
  categoriesByAudience,
  audienceSlugs,
  audienceShopContent,
} from "@/lib/shop-mock-data";
import { occasionPills } from "@/lib/occasion-data";
import { corporateNeeds } from "@/lib/corporate-data";
import { contentIconOptions } from "@/lib/content-icons";

const featureIconDefaults = ["Gift", "PackageCheck", "Wand2", "Truck"];
const corporateChecklistIconDefaults = ["Users", "Briefcase", "PartyPopper", "PackageOpen"];

// The single source of truth for every admin-editable content field on
// the homepage and static pages: what it's called in the admin UI, what
// shape it is, and — critically — its default value. Defaults come from
// today's hardcoded copy, so a page renders correctly even before an
// admin has ever saved a ContentBlock row for it (see content-service.ts
// getPageContent) — no backfill/seed script needed when a new key is
// added here.
export type ContentFieldType = "TEXT" | "IMAGE" | "IMAGE_RESPONSIVE" | "ICON" | "LINK" | "LIST" | "NESTED_LIST";

export type LinkValue = { label: string; href: string };

// Mobile falls back to desktop when unset — most banners don't need a
// separate crop, so admin isn't forced to upload two images for every one.
export type ResponsiveImageValue = { desktop: string; mobile?: string };

export type FieldDescriptor =
  | { type: "TEXT"; label: string; default: string }
  | { type: "IMAGE"; label: string; default: string }
  | { type: "IMAGE_RESPONSIVE"; label: string; default: ResponsiveImageValue }
  // A single icon picker (see contentIconOptions) outside of a LIST row —
  // "" is a deliberate "no icon" choice (see getContentIcon), not unset.
  | { type: "ICON"; label: string; default: string }
  | { type: "LINK"; label: string; default: LinkValue }
  | {
      type: "LIST";
      label: string;
      itemLabel: string;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      listFields: ListFieldDef<any>[];
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      emptyItem: any;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      default: any[];
    }
  // A list of groups, each holding its own repeating list (e.g. FAQ
  // categories, each with its own Q&A list) — the one shape RepeatingListField
  // can't render directly since its rows are flat. Purpose-built for this
  // rather than teaching RepeatingListField to nest for the one page that
  // needs it.
  | {
      type: "NESTED_LIST";
      label: string;
      groupLabel: string;
      groupNameField: string;
      itemsField: string;
      itemLabel: string;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      itemFields: ListFieldDef<any>[];
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      emptyItem: any;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      default: any[];
    };

export type SectionSchema = {
  title: string;
  // A standalone block on a page that the admin can switch off (see
  // content-service.ts getSectionVisibility). Deliberately opt-in: many
  // sections here are data rather than blocks (footer, top-bar links,
  // category photos), and a static page's only section IS the page, so a
  // hide switch there would just leave an empty page.
  hideable?: boolean;
  // Visibility when the admin has never touched the switch. Defaults to
  // shown; a section whose block isn't currently on the site can start hidden.
  defaultVisible?: boolean;
  fields: Record<string, FieldDescriptor>;
};

export type PageSchema = Record<string, SectionSchema>;

// One photo field per quick-access pill that actually appears on the site —
// the /shop row, each "Gifts for …" page's row, and the occasion pages' rows.
// Built from the same lists those pages render (shopCategories,
// categoriesByAudience, occasionPills) rather than typed out, so adding or
// renaming a pill there can't leave this editor out of date. Keys are exactly
// the slugs CategoryPillRow looks photos up by; a slug that appears on
// several pages (e.g. "personalised-gifts") is one field shared by all of them.
function buildCategoryPillFields(): Record<string, FieldDescriptor> {
  const pills = new Map<string, { label: string; where: string[] }>();
  const add = (slug: string, label: string, where: string) => {
    const existing = pills.get(slug);
    if (!existing) pills.set(slug, { label, where: [where] });
    else if (!existing.where.includes(where)) existing.where.push(where);
  };

  shopCategories.forEach((c) => add(c.slug, c.label, "Shop"));
  for (const audience of audienceSlugs) {
    const page = audienceShopContent[audience].breadcrumbLabel;
    categoriesByAudience[audience].forEach((c) => add(c.slug, c.label, page));
  }
  for (const pillList of Object.values(occasionPills)) {
    pillList.forEach((pill) => add(`${pill.type}:${pill.value}`, pill.label, "Occasion pages"));
  }

  const fields: Record<string, FieldDescriptor> = {
    all: { type: "IMAGE", label: "All (every page)", default: "" },
  };
  for (const [slug, { label, where }] of pills) {
    fields[slug] = { type: "IMAGE", label: `${label} — ${where.join(", ")}`, default: "" };
  }
  return fields;
}

export const contentSchema: Record<string, PageSchema> = {
  home: {
    hero: {
      title: "Hero",
      hideable: true,
      fields: {
        image: {
          type: "IMAGE_RESPONSIVE",
          label: "Hero Image",
          default: { desktop: heroImage, mobile: heroImageMobile },
        },
        primaryCta: {
          type: "LINK",
          label: "Primary Button",
          default: { label: "Shop All", href: "/shop" },
        },
        secondaryCta: {
          type: "LINK",
          label: "Secondary Button",
          default: { label: "Explore Collections", href: "/collections" },
        },
      },
    },
    // No editable copy — exists only so the gift-finder bar under the hero
    // gets a show/hide switch alongside the other homepage sections.
    "gifting-assistant": {
      title: "Gift Finder Bar",
      hideable: true,
      fields: {},
    },
    "who-are-you-gifting": {
      title: "Who's It For — Tiles",
      hideable: true,
      fields: {
        sectionTitle: {
          type: "TEXT",
          label: "Section Title",
          default: "Who are you making smile?",
        },
        tiles: {
          type: "LIST",
          label: "Tiles",
          itemLabel: "tile",
          listFields: [
            { key: "label", label: "Label (e.g. Gifts for Her)", kind: "text" },
            { key: "href", label: "Link (e.g. /shop/her)", kind: "text" },
            { key: "image", label: "Image URL", kind: "text" },
          ],
          emptyItem: { label: "", href: "", image: "" },
          default: audienceCategories.map((c) => ({ label: c.label, href: c.href, image: c.image })),
        },
      },
    },
    "made-for-the-moment": {
      title: "Made for the Moment — Occasions",
      hideable: true,
      fields: {
        sectionTitle: { type: "TEXT", label: "Section Title", default: "Made for the moment" },
        tiles: {
          type: "LIST",
          label: "Occasion Tiles",
          itemLabel: "occasion",
          listFields: [
            { key: "label", label: "Label", kind: "text" },
            { key: "slug", label: "Slug (e.g. birthday)", kind: "text" },
            { key: "image", label: "Image URL", kind: "text" },
            { key: "dark", label: "Dark text overlay", kind: "checkbox" },
          ],
          emptyItem: { label: "", slug: "", image: "", dark: false },
          default: occasions.map((o) => ({
            label: o.label,
            slug: o.slug,
            image: o.image,
            dark: false,
          })),
        },
      },
    },
    "blissynest-edit": {
      title: "The Blissynest Edit — Collections",
      hideable: true,
      fields: {
        sectionTitle: { type: "TEXT", label: "Section Title", default: "The Blissynest Edit" },
        eyebrow: { type: "TEXT", label: "Eyebrow", default: "Curated Collections" },
        description: {
          type: "TEXT",
          label: "Description (under the title)",
          default: "",
        },
        tiles: {
          type: "LIST",
          label: "Collection Tiles",
          itemLabel: "collection",
          listFields: [
            { key: "title", label: "Title", kind: "text" },
            { key: "subtitle", label: "Subtitle", kind: "text" },
            { key: "slug", label: "Slug (e.g. minimalist)", kind: "text" },
            { key: "image", label: "Image URL", kind: "text" },
          ],
          emptyItem: { title: "", subtitle: "", slug: "", image: "" },
          default: editCollections.map((c) => ({
            title: c.title,
            subtitle: c.subtitle,
            slug: c.slug,
            image: c.image,
          })),
        },
      },
    },
    "feature-strip": {
      title: "Trust Feature Strip",
      hideable: true,
      fields: {
        items: {
          type: "LIST",
          label: "Features",
          itemLabel: "feature",
          listFields: [
            { key: "icon", label: "Icon", kind: "select", options: contentIconOptions },
            { key: "title", label: "Title", kind: "text" },
            { key: "subtitle", label: "Subtitle", kind: "text" },
          ],
          emptyItem: { icon: contentIconOptions[0], title: "", subtitle: "" },
          default: featureStrip.map((f, i) => ({ icon: featureIconDefaults[i], title: f.title, subtitle: f.subtitle })),
        },
      },
    },
    "community-strip": {
      title: "From Our Community",
      hideable: true,
      fields: {
        sectionTitle: { type: "TEXT", label: "Section Title", default: "From our community" },
        eyebrow: { type: "TEXT", label: "Eyebrow", default: "Real moments, real smiles" },
        photos: {
          type: "LIST",
          label: "Photos",
          itemLabel: "photo",
          listFields: [{ key: "image", label: "Image URL", kind: "text" }],
          emptyItem: { image: "" },
          default: communityPhotos.map((image) => ({ image })),
        },
      },
    },
    "corporate-banner": {
      title: "Corporate Gifting Banner",
      hideable: true,
      defaultVisible: false,
      fields: {
        heading: { type: "TEXT", label: "Heading", default: "Thoughtful gifting, at scale." },
        subcopy: {
          type: "TEXT",
          label: "Subcopy",
          default: "From employee welcome kits to premium client gifts, Blissynest makes corporate gifting effortless.",
        },
        cta: {
          type: "LINK",
          label: "Primary Button",
          default: { label: "Explore Corporate Gifting", href: "/corporate" },
        },
        quoteLink: {
          type: "LINK",
          label: "Quote Link",
          default: { label: "Request a Quote", href: "/corporate/quote" },
        },
        image: {
          type: "IMAGE",
          label: "Image",
          default: "/corporate-banner-home.png",
        },
        checklist: {
          type: "LIST",
          label: "Checklist Links",
          itemLabel: "item",
          listFields: [
            { key: "icon", label: "Icon", kind: "select", options: contentIconOptions },
            { key: "label", label: "Label", kind: "text" },
            { key: "href", label: "Link", kind: "text" },
          ],
          emptyItem: { icon: contentIconOptions[0], label: "", href: "" },
          default: corporateChecklist.map((item, i) => ({
            icon: corporateChecklistIconDefaults[i],
            label: item.label,
            href: item.href,
          })),
        },
      },
    },
    "loved-by-many": {
      title: "Loved by Many — Heading",
      hideable: true,
      fields: {
        sectionTitle: { type: "TEXT", label: "Section Title", default: "Loved by many" },
        eyebrow: { type: "TEXT", label: "Eyebrow", default: "Bestsellers" },
      },
    },
  },
  about: {
    hero: {
      title: "About Page",
      fields: {
        eyebrow: { type: "TEXT", label: "Eyebrow", default: "Our Story" },
        heading: { type: "TEXT", label: "Heading", default: "About Blissynest" },
        paragraph1: {
          type: "TEXT",
          label: "Paragraph 1",
          default:
            "Blissynest started with a simple frustration: most gifting felt transactional: a rushed scroll, a generic hamper, a card nobody reads. We wanted something that felt more like the moment it was marking. So we built a place where every gift is chosen the way you'd choose one for someone you actually love, with a little thought, a little care, and packaging that feels like part of the gift, not an afterthought.",
        },
        paragraph2: {
          type: "TEXT",
          label: "Paragraph 2",
          default:
            "Today that means a catalogue built around real moments (birthdays, anniversaries, festivals, thank-yous, and the days that don't need a reason at all), curated by people who still get excited about a well-wrapped box.",
        },
      },
    },
  },
  shipping: {
    hero: {
      title: "Shipping Page",
      fields: {
        eyebrow: { type: "TEXT", label: "Eyebrow", default: "Good to Know" },
        heading: { type: "TEXT", label: "Heading", default: "Shipping & Delivery" },
        sections: {
          type: "LIST",
          label: "Policy Sections",
          itemLabel: "section",
          listFields: [
            { key: "icon", label: "Icon", kind: "select", options: contentIconOptions },
            { key: "title", label: "Title", kind: "text" },
            { key: "body", label: "Body", kind: "text" },
          ],
          emptyItem: { icon: contentIconOptions[0], title: "", body: "" },
          default: [
            { icon: "Clock", title: "Delivery timelines", body: "Most orders are dispatched within 24–48 hours and delivered within 5–7 business days, depending on your location. Personalised and hamper orders may take an extra 1–2 days to prepare with care." },
            { icon: "Truck", title: "Shipping charges", body: "Free shipping on all orders above ₹999. Orders below that ship for a flat ₹99. Charges are calculated automatically at checkout, so there are no surprises at the end." },
            { icon: "MapPin", title: "Where we deliver", body: "We currently deliver across India, including most Tier 1 and Tier 2 cities. Delivery availability and timelines are confirmed automatically once you enter your address at checkout." },
            { icon: "PackageCheck", title: "Tracking your order", body: "Once your order ships, you'll get a tracking link by email. You can also check the status any time from the Track Order page." },
          ],
        },
      },
    },
  },
  returns: {
    hero: {
      title: "Returns Page",
      fields: {
        eyebrow: { type: "TEXT", label: "Eyebrow", default: "Good to Know" },
        heading: { type: "TEXT", label: "Heading", default: "Returns & Refunds" },
        sections: {
          type: "LIST",
          label: "Policy Sections",
          itemLabel: "section",
          listFields: [
            { key: "icon", label: "Icon", kind: "select", options: contentIconOptions },
            { key: "title", label: "Title", kind: "text" },
            { key: "body", label: "Body", kind: "text" },
          ],
          emptyItem: { icon: contentIconOptions[0], title: "", body: "" },
          default: [
            { icon: "RotateCcw", title: "Return window", body: "Most items can be returned within 7 days of delivery, as long as they're unused and in their original packaging. To start a return, email us at enquiry@blissynest.com with your order number and we'll guide you through it." },
            { icon: "Ban", title: "What can't be returned", body: "Personalised items (engraved, monogrammed, or made to order), perishables like sweets and gourmet hampers, and gift cards can't be returned once made. These are called out on the product page before you order." },
            { icon: "Wallet", title: "Refunds", body: "Once a returned item reaches us and passes a quick quality check, refunds are processed to your original payment method within 5–7 business days." },
            { icon: "MessageCircle", title: "Something arrived damaged?", body: "That's on us. Reach out within 48 hours of delivery with a photo and your order number, and we'll sort a replacement or refund, no return needed." },
          ],
        },
      },
    },
  },
  help: {
    hero: {
      title: "Help Page",
      fields: {
        eyebrow: { type: "TEXT", label: "Eyebrow", default: "Help Centre" },
        heading: { type: "TEXT", label: "Heading", default: "How can we help?" },
        links: {
          type: "LIST",
          label: "Help Tiles",
          itemLabel: "tile",
          listFields: [
            { key: "icon", label: "Icon", kind: "select", options: contentIconOptions },
            { key: "title", label: "Title", kind: "text" },
            { key: "body", label: "Body", kind: "text" },
            { key: "href", label: "Link", kind: "text" },
          ],
          emptyItem: { icon: contentIconOptions[0], title: "", body: "", href: "" },
          default: [
            { icon: "PackageSearch", title: "Track an Order", body: "Check the live status of a recent order.", href: "/track-order" },
            { icon: "HelpCircle", title: "FAQs", body: "Quick answers about orders, payments, and personalisation.", href: "/faqs" },
            { icon: "Truck", title: "Shipping & Delivery", body: "Timelines, charges, and where we deliver.", href: "/shipping" },
            { icon: "RotateCcw", title: "Returns & Refunds", body: "How returns work and what's eligible.", href: "/returns" },
            { icon: "Mail", title: "Contact Us", body: "Can't find what you need? Send us a message.", href: "/contact" },
          ],
        },
      },
    },
  },
  contact: {
    hero: {
      title: "Contact Page",
      fields: {
        eyebrow: { type: "TEXT", label: "Eyebrow", default: "We'd Love to Hear From You" },
        heading: { type: "TEXT", label: "Heading", default: "Contact Us" },
        subcopy: {
          type: "TEXT",
          label: "Subcopy",
          default: "Questions about an order, a bulk request, or just want to say hi, we read every message.",
        },
        contactPoints: {
          type: "LIST",
          label: "Contact Points",
          itemLabel: "contact point",
          listFields: [
            { key: "icon", label: "Icon", kind: "select", options: contentIconOptions },
            { key: "label", label: "Label", kind: "text" },
            { key: "value", label: "Value", kind: "text" },
          ],
          emptyItem: { icon: contentIconOptions[0], label: "", value: "" },
          default: [
            { icon: "Mail", label: "Email", value: "enquiry@blissynest.com" },
            { icon: "MapPin", label: "Studio", value: "Koregaon Park, Pune, Maharashtra" },
          ],
        },
      },
    },
  },
  faqs: {
    hero: {
      title: "FAQs Page",
      fields: {
        eyebrow: { type: "TEXT", label: "Eyebrow", default: "Good to Know" },
        heading: { type: "TEXT", label: "Heading", default: "Frequently Asked Questions" },
        groups: {
          type: "NESTED_LIST",
          label: "FAQ Categories",
          groupLabel: "Add category",
          groupNameField: "category",
          itemsField: "items",
          itemLabel: "Add question",
          itemFields: [
            { key: "question", label: "Question", kind: "text" },
            { key: "answer", label: "Answer", kind: "text" },
          ],
          emptyItem: { question: "", answer: "" },
          default: [
            {
              category: "Orders & Payments",
              items: [
                { question: "How do I track my order?", answer: "Head to the Track Order page and enter your order number and email and you'll see the latest status right away." },
                { question: "Can I change or cancel my order after placing it?", answer: "If your order hasn't shipped yet, contact us as soon as possible and we'll do our best to update or cancel it. Once it's dispatched, it'll need to go through the returns process instead." },
                { question: "What payment methods do you accept?", answer: "Cards, UPI, net banking, and cash on delivery, all selectable at checkout." },
              ],
            },
            {
              category: "Shipping",
              items: [
                { question: "How long does delivery take?", answer: "Most orders arrive within 3–5 business days. Personalised items may take 1–2 days longer to prepare." },
                { question: "Is shipping free?", answer: "Yes, on all orders above ₹999. Orders below that have a flat ₹99 shipping charge." },
              ],
            },
            {
              category: "Returns & Refunds",
              items: [
                { question: "What's your return policy?", answer: "Unused items in original packaging can be returned within 7 days of delivery. See the full Returns page for details." },
                { question: "Can I return a personalised gift?", answer: "Personalised and made-to-order items can't be returned unless they arrive damaged or incorrect." },
              ],
            },
            {
              category: "Personalisation & Gifting",
              items: [
                { question: "Can I add a gift note?", answer: "Yes, every order can include a free handwritten-style gift note, added during checkout." },
                { question: "Can prices be hidden if I'm sending this as a gift?", answer: "Yes, there's a 'hide prices on packing slip' option in the gift step at checkout." },
              ],
            },
          ],
        },
      },
    },
  },
  "track-order": {
    hero: {
      title: "Track Order Page",
      fields: {
        eyebrow: { type: "TEXT", label: "Eyebrow", default: "Where's My Order?" },
        heading: { type: "TEXT", label: "Heading", default: "Track Your Order" },
        subcopy: {
          type: "TEXT",
          label: "Subcopy",
          default: "Enter your order number and email to see the latest status.",
        },
      },
    },
  },
  corporate: {
    hero: {
      title: "Corporate Hero",
      hideable: true,
      fields: {
        heading: { type: "TEXT", label: "Heading Line 1", default: "Meaningful gifts." },
        headingHighlight: { type: "TEXT", label: "Heading Line 2 (highlighted)", default: "Stronger connections." },
        subcopy: {
          type: "TEXT",
          label: "Subcopy",
          default: "Thoughtfully curated gifts for your employees, clients and partners — perfect for every milestone.",
        },
        primaryCta: { type: "LINK", label: "Primary Button", default: { label: "Request a Quote", href: "/corporate/quote" } },
        secondaryCta: {
          type: "LINK",
          label: "Secondary Button",
          default: { label: "Book a Consultation", href: "/corporate/quote?intent=consultation" },
        },
        image: { type: "IMAGE", label: "Hero Image", default: "/corporate-hero.png" },
        trustPoints: {
          type: "LIST",
          label: "Trust Points",
          itemLabel: "trust point",
          listFields: [
            { key: "icon", label: "Icon", kind: "select", options: contentIconOptions },
            { key: "title", label: "Title", kind: "text" },
            { key: "subtitle", label: "Subtitle", kind: "text" },
          ],
          emptyItem: { icon: contentIconOptions[0], title: "", subtitle: "" },
          default: [
            { icon: "PackageOpen", title: "Bulk Gifting", subtitle: "Made Simple" },
            { icon: "Wand2", title: "Customisation", subtitle: "For Your Brand" },
            { icon: "Truck", title: "Pan India Delivery", subtitle: "On Time, Every Time" },
            { icon: "HelpCircle", title: "Dedicated Support", subtitle: "At Every Step" },
          ],
        },
      },
    },
    needs: {
      title: "Corporate Needs Grid",
      hideable: true,
      fields: {
        eyebrow: { type: "TEXT", label: "Eyebrow", default: "Corporate Catalogue" },
        heading: { type: "TEXT", label: "Heading", default: "Gifts for every corporate need" },
        // Fixed-position fields (not a LIST): each card's slug and grid
        // placement are hardcoded to a specific 5-cell bento layout
        // (gridTemplateAreas in CorporateNeeds.tsx) and the slug is also
        // referenced by needToCollectionSlugs in corporate-data.ts — freely
        // adding/removing/reordering here would break both. Title, image,
        // and icon per card are editable.
        needEmployeeTitle: { type: "TEXT", label: "Employee Gifting — Title", default: "Employee Gifting" },
        needEmployeeSubtitle: { type: "TEXT", label: "Employee Gifting — Subtitle", default: "Celebrate your team" },
        needEmployeeImage: {
          type: "IMAGE",
          label: "Employee Gifting — Image",
          default: corporateNeeds.find((n) => n.slug === "employee")!.image,
        },
        needEmployeeIcon: { type: "ICON", label: "Employee Gifting — Icon", default: "Users" },
        needClientTitle: { type: "TEXT", label: "Client Gifting — Title", default: "Client Gifting" },
        needClientSubtitle: { type: "TEXT", label: "Client Gifting — Subtitle", default: "Build lasting relationships" },
        needClientImage: {
          type: "IMAGE",
          label: "Client Gifting — Image",
          default: corporateNeeds.find((n) => n.slug === "client")!.image,
        },
        needClientIcon: { type: "ICON", label: "Client Gifting — Icon", default: "HeartHandshake" },
        needFestiveTitle: { type: "TEXT", label: "Festival Gifting — Title", default: "Festival Gifting" },
        needFestiveSubtitle: { type: "TEXT", label: "Festival Gifting — Subtitle", default: "Celebrate togetherness" },
        needFestiveImage: {
          type: "IMAGE",
          label: "Festival Gifting — Image",
          default: corporateNeeds.find((n) => n.slug === "festive")!.image,
        },
        needFestiveIcon: { type: "ICON", label: "Festival Gifting — Icon", default: "Flame" },
        needMilestoneTitle: { type: "TEXT", label: "Milestone Gifting — Title", default: "Milestone Gifting" },
        needMilestoneSubtitle: { type: "TEXT", label: "Milestone Gifting — Subtitle", default: "Mark every achievement" },
        needMilestoneImage: {
          type: "IMAGE",
          label: "Milestone Gifting — Image",
          default: corporateNeeds.find((n) => n.slug === "milestone")!.image,
        },
        needMilestoneIcon: { type: "ICON", label: "Milestone Gifting — Icon", default: "Trophy" },
        needWelcomeTitle: { type: "TEXT", label: "Welcome Kits — Title", default: "Welcome Kits" },
        needWelcomeSubtitle: { type: "TEXT", label: "Welcome Kits — Subtitle", default: "Warm welcomes matter" },
        needWelcomeImage: {
          type: "IMAGE",
          label: "Welcome Kits — Image",
          default: corporateNeeds.find((n) => n.slug === "welcome")!.image,
        },
        needWelcomeIcon: { type: "ICON", label: "Welcome Kits — Icon", default: "Gift" },
      },
    },
    "how-it-works": {
      title: "How It Works — Steps",
      hideable: true,
      fields: {
        heading: { type: "TEXT", label: "Heading", default: "How does it work?" },
        subcopy: { type: "TEXT", label: "Subcopy", default: "Book your corporate gifts in 4 simple steps" },
        // Fixed-position (not a LIST): numbered 01-04 and colour-cycled by
        // index (cardBg[i] in HowItWorks.tsx has exactly 4 entries), so the
        // step count and order are structural, not freely editable.
        step1Title: { type: "TEXT", label: "Step 1 — Title", default: "Share Your Requirements" },
        step1Description: { type: "TEXT", label: "Step 1 — Description", default: "Tell us your headcount, budget and occasion — takes two minutes." },
        step2Title: { type: "TEXT", label: "Step 2 — Title", default: "Consultation Call" },
        step2Description: { type: "TEXT", label: "Step 2 — Description", default: "Our gifting expert walks you through curated options for your brand." },
        step3Title: { type: "TEXT", label: "Step 3 — Title", default: "Customise & Approve" },
        step3Description: { type: "TEXT", label: "Step 3 — Description", default: "Pick your hamper, add your branding, and approve the final look." },
        step4Title: { type: "TEXT", label: "Step 4 — Title", default: "Pan-India Delivery" },
        step4Description: { type: "TEXT", label: "Step 4 — Description", default: "We handle packaging and delivery, tracked every step of the way." },
      },
    },
    "why-choose-us": {
      title: "Why Choose Us",
      hideable: true,
      fields: {
        heading: { type: "TEXT", label: "Heading", default: "Why businesses love gifting with Blissynest" },
        checklist: {
          type: "LIST",
          label: "Checklist",
          itemLabel: "item",
          listFields: [{ key: "text", label: "Text", kind: "text" }],
          emptyItem: { text: "" },
          default: [
            { text: "Premium quality, thoughtfully curated products" },
            { text: "Personalisation with your logo, message & packaging" },
            { text: "Flexible solutions for budgets of all sizes" },
            { text: "Reliable pan India & international delivery" },
            { text: "Sustainable & ethical gifting choices" },
            { text: "Dedicated account manager & end-to-end support" },
          ],
        },
        image: { type: "IMAGE", label: "Image", default: "https://placehold.co/700x560/3a4529/cfb587.png?text=Your+Brand&font=playfair-display" },
      },
    },
    testimonials: {
      title: "Testimonials",
      hideable: true,
      fields: {
        items: {
          type: "LIST",
          label: "Testimonials",
          itemLabel: "testimonial",
          listFields: [
            { key: "quote", label: "Quote", kind: "text" },
            { key: "name", label: "Name", kind: "text" },
            { key: "title", label: "Title", kind: "text" },
            { key: "company", label: "Company", kind: "text" },
          ],
          emptyItem: { quote: "", name: "", title: "", company: "" },
          default: [
            { quote: "Blissynest made our annual gifting effortless and memorable. The quality, packaging and on-time delivery were exceptional!", name: "Priya Mehta", title: "Head – People & Culture", company: "Verdant Systems" },
            { quote: "From the first call to the final delivery, everything felt effortless. Our employees still talk about the Diwali hampers.", name: "Arjun Nair", title: "VP, Human Resources", company: "Northbridge Analytics" },
            { quote: "We needed 300 branded welcome kits in under two weeks. Blissynest delivered early, and every box was exactly on-brief.", name: "Kavya Reddy", title: "Talent & Culture Lead", company: "Solace Interiors" },
            { quote: "Personalised, punctual and genuinely thoughtful — exactly what we wanted for this year's client appreciation gifts.", name: "Rohan Kapoor", title: "Client Success Director", company: "Fieldstone Partners" },
          ],
        },
      },
    },
    "trusted-by": {
      title: "Trusted By Strip",
      hideable: true,
      fields: {
        eyebrow: { type: "TEXT", label: "Eyebrow", default: "Trusted by teams at" },
        companies: {
          type: "LIST",
          label: "Companies",
          itemLabel: "company",
          listFields: [
            { key: "name", label: "Name", kind: "text" },
            { key: "initials", label: "Initials", kind: "text" },
          ],
          emptyItem: { name: "", initials: "" },
          default: [
            { name: "Verdant Systems", initials: "VS" },
            { name: "Northbridge Analytics", initials: "NA" },
            { name: "Solace Interiors", initials: "SI" },
            { name: "Marrow & Co.", initials: "MC" },
            { name: "Fieldstone Partners", initials: "FP" },
            { name: "Everline Media", initials: "EM" },
          ],
        },
      },
    },
    "final-cta": {
      title: "Final CTA",
      hideable: true,
      fields: {
        heading: { type: "TEXT", label: "Heading", default: "Let's plan your next gifting moment." },
        subcopy: {
          type: "TEXT",
          label: "Subcopy",
          default: "Share your requirements and our gifting expert will get back to you within one business day.",
        },
        cta: { type: "LINK", label: "Button", default: { label: "Request a Quote", href: "/corporate/quote" } },
        email: { type: "TEXT", label: "Email", default: "enquiry@blissynest.com" },
        // Empty by default: only shown once a real number is entered.
        phone: { type: "TEXT", label: "Phone (leave empty to hide)", default: "" },
      },
    },
  },
  // Header/MobileNav nav labels are deliberately NOT here — Header.tsx is
  // imported directly by 14 "use client" page components (same shape as
  // the TopBar regression fixed earlier), so making it async would need
  // the same 14-file page.tsx migration all over again for a few words of
  // structural nav-category text. Not worth repeating that for this.
  legal: {
    business: {
      title: "Business & Legal Details",
      fields: {
        // Shown on the Privacy Policy and Terms pages (and in the footer's
        // legal line). Indian e-commerce rules expect the seller's name,
        // address and a grievance contact to be visible — anything left
        // blank here is simply left out of those pages, never shown empty.
        legalName: { type: "TEXT", label: "Registered business name", default: "Blissynest" },
        address: { type: "TEXT", label: "Registered address", default: "" },
        gstin: { type: "TEXT", label: "GSTIN (if registered)", default: "" },
        contactEmail: { type: "TEXT", label: "Customer support email", default: "enquiry@blissynest.com" },
        contactPhone: { type: "TEXT", label: "Customer support phone", default: "" },
        grievanceName: { type: "TEXT", label: "Grievance officer — name", default: "" },
        grievanceEmail: { type: "TEXT", label: "Grievance officer — email", default: "" },
        grievancePhone: { type: "TEXT", label: "Grievance officer — phone", default: "" },
        policiesUpdated: { type: "TEXT", label: "Policies last updated (date shown on the pages)", default: "25 September 2026" },
      },
    },
  },
  layout: {
    "shop-gift-banner": {
      title: "Shop Gift Banner",
      hideable: true,
      fields: {
        // Shared across /shop, /occasions, /occasions/[occasion],
        // /collections, and /collections/[collection] — one banner, one image.
        image: {
          type: "IMAGE_RESPONSIVE",
          label: "Banner Image",
          default: {
            desktop:
              "https://placehold.co/1200x480/e3d3bd/2a2621.png?text=Blissynest+Gift+Box&font=playfair-display",
          },
        },
      },
    },
    "category-pills": {
      title: "Category Quick-Access Photos",
      // Empty default (not a placeholder image, unlike other IMAGE fields
      // here) is deliberate: an unset photo means "show the icon instead",
      // not "show a broken/placeholder image" — see CategoryPillRow.tsx.
      fields: buildCategoryPillFields(),
    },
    topbar: {
      title: "Top Bar Links",
      fields: {
        trackOrder: { type: "LINK", label: "Track Order Link", default: { label: "Track Order", href: "/track-order" } },
        help: { type: "LINK", label: "Help Link", default: { label: "Help", href: "/help" } },
        corporateGifting: {
          type: "LINK",
          label: "Corporate Gifting Link",
          default: { label: "Corporate Gifting", href: "/corporate" },
        },
      },
    },
    footer: {
      title: "Footer",
      fields: {
        newsletterHeading: {
          type: "TEXT",
          label: "Newsletter Heading",
          default: "A little inspiration, delivered.",
        },
        newsletterSubcopy: {
          type: "TEXT",
          label: "Newsletter Subcopy",
          default: "Gift ideas, new launches and feel-good stories — straight to your inbox.",
        },
        instagramUrl: {
          type: "TEXT",
          label: "Instagram URL",
          default: "https://www.instagram.com/blissynest_bn/",
        },
        facebookUrl: { type: "TEXT", label: "Facebook URL", default: "#" },
        pinterestUrl: { type: "TEXT", label: "Pinterest URL", default: "#" },
        youtubeUrl: { type: "TEXT", label: "YouTube URL", default: "#" },
        links: {
          type: "LIST",
          label: "Footer Links",
          itemLabel: "link",
          listFields: [
            { key: "label", label: "Label", kind: "text" },
            { key: "href", label: "Link", kind: "text" },
          ],
          emptyItem: { label: "", href: "" },
          default: footerLinks,
        },
        copyright: { type: "TEXT", label: "Copyright Line", default: "© 2026 Blissynest. All rights reserved." },
      },
    },
  },
};

export function getSectionSchema(page: string, section: string): SectionSchema | undefined {
  return contentSchema[page]?.[section];
}
