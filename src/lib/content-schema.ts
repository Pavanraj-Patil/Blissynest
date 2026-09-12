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
import { curatedCollections } from "@/lib/corporate-data";
import { collectionContent } from "@/lib/collection-mock-data";
import { contentIconOptions } from "@/lib/content-icons";

const occasionIconDefaults = ["Cake", "Heart", "Gem", "Home", "Mail", "Sparkles", "Flame"];
const featureIconDefaults = ["Gift", "PackageCheck", "Wand2", "Truck"];
const corporateChecklistIconDefaults = ["Users", "Briefcase", "PartyPopper", "PackageOpen", "CalendarDays"];

// The single source of truth for every admin-editable content field on
// the homepage and static pages: what it's called in the admin UI, what
// shape it is, and — critically — its default value. Defaults come from
// today's hardcoded copy, so a page renders correctly even before an
// admin has ever saved a ContentBlock row for it (see content-service.ts
// getPageContent) — no backfill/seed script needed when a new key is
// added here.
export type ContentFieldType = "TEXT" | "IMAGE" | "IMAGE_RESPONSIVE" | "LINK" | "LIST" | "NESTED_LIST";

export type LinkValue = { label: string; href: string };

// Mobile falls back to desktop when unset — most banners don't need a
// separate crop, so admin isn't forced to upload two images for every one.
export type ResponsiveImageValue = { desktop: string; mobile?: string };

export type FieldDescriptor =
  | { type: "TEXT"; label: string; default: string }
  | { type: "IMAGE"; label: string; default: string }
  | { type: "IMAGE_RESPONSIVE"; label: string; default: ResponsiveImageValue }
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
  fields: Record<string, FieldDescriptor>;
};

export type PageSchema = Record<string, SectionSchema>;

export const contentSchema: Record<string, PageSchema> = {
  home: {
    hero: {
      title: "Hero",
      fields: {
        image: {
          type: "IMAGE_RESPONSIVE",
          label: "Hero Image",
          default: { desktop: heroImage, mobile: heroImageMobile },
        },
        primaryCta: {
          type: "LINK",
          label: "Primary Button",
          default: { label: "Find the Perfect Gift", href: "/gifting-assistant" },
        },
        secondaryCta: {
          type: "LINK",
          label: "Secondary Button",
          default: { label: "Explore Collections", href: "/collections" },
        },
      },
    },
    "who-are-you-gifting": {
      title: "Who's It For — Tiles",
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
            { key: "icon", label: "Icon", kind: "select", options: contentIconOptions },
            { key: "dark", label: "Dark text overlay", kind: "checkbox" },
          ],
          emptyItem: { label: "", slug: "", image: "", icon: contentIconOptions[0], dark: false },
          default: occasions.map((o, i) => ({
            label: o.label,
            slug: o.slug,
            image: o.image,
            icon: occasionIconDefaults[i],
            dark: o.label === "Festivals",
          })),
        },
      },
    },
    "blissynest-edit": {
      title: "The Blissynest Edit — Collections",
      fields: {
        sectionTitle: { type: "TEXT", label: "Section Title", default: "The Blissynest Edit" },
        eyebrow: { type: "TEXT", label: "Eyebrow", default: "Curated Collections" },
        tiles: {
          type: "LIST",
          label: "Collection Tiles",
          itemLabel: "collection",
          listFields: [
            { key: "title", label: "Title", kind: "text" },
            { key: "subtitle", label: "Subtitle", kind: "text" },
            { key: "slug", label: "Slug (e.g. self-care)", kind: "text" },
            { key: "image", label: "Image URL", kind: "text" },
            { key: "dark", label: "Dark overlay", kind: "checkbox" },
          ],
          emptyItem: { title: "", subtitle: "", slug: "", image: "", dark: false },
          default: editCollections.map((c) => ({
            title: c.title,
            subtitle: c.subtitle,
            slug: c.slug,
            image: c.image,
            dark: c.title === "The Luxury Edit",
          })),
        },
      },
    },
    "feature-strip": {
      title: "Trust Feature Strip",
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
          default: "https://placehold.co/560x460/1c1712/cfb587.png?text=Corporate+Gift+Set&font=playfair-display",
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
            "Blissynest started with a simple frustration: most gifting felt transactional — a rushed scroll, a generic hamper, a card nobody reads. We wanted something that felt more like the moment it was marking. So we built a place where every gift is chosen the way you'd choose one for someone you actually love — with a little thought, a little care, and packaging that feels like part of the gift, not an afterthought.",
        },
        paragraph2: {
          type: "TEXT",
          label: "Paragraph 2",
          default:
            "Today that means a catalogue built around real moments — birthdays, anniversaries, festivals, thank-yous, and the days that don't need a reason at all — curated by people who still get excited about a well-wrapped box.",
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
            { icon: "Clock", title: "Delivery timelines", body: "Most orders are dispatched within 24–48 hours and delivered within 3–5 business days, depending on your location. Personalised and hamper orders may take an extra 1–2 days to prepare with care." },
            { icon: "Truck", title: "Shipping charges", body: "Free shipping on all orders above ₹999. Orders below that ship for a flat ₹99. Charges are calculated automatically at checkout — no surprises at the end." },
            { icon: "MapPin", title: "Where we deliver", body: "We currently deliver across India, including most Tier 1 and Tier 2 cities. Enter your pincode on any product page to check serviceability before you order." },
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
            { icon: "RotateCcw", title: "Return window", body: "Most items can be returned within 7 days of delivery, as long as they're unused and in their original packaging. Start a return from your order confirmation email or the Track Order page." },
            { icon: "Ban", title: "What can't be returned", body: "Personalised items (engraved, monogrammed, or made to order), perishables like sweets and gourmet hampers, and gift cards can't be returned once made — these are called out on the product page before you order." },
            { icon: "Wallet", title: "Refunds", body: "Once a returned item reaches us and passes a quick quality check, refunds are processed to your original payment method within 5–7 business days." },
            { icon: "MessageCircle", title: "Something arrived damaged?", body: "That's on us — reach out within 48 hours of delivery with a photo and your order number, and we'll sort a replacement or refund, no return needed." },
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
          default: "Questions about an order, a bulk request, or just want to say hi — we read every message.",
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
            { icon: "Mail", label: "Email", value: "hello@blissynest.com" },
            { icon: "Phone", label: "Phone", value: "1800-123-456" },
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
                { question: "How do I track my order?", answer: "Head to the Track Order page and enter your order number and email — you'll see the latest status right away." },
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
                { question: "Can I add a gift note?", answer: "Yes — every order can include a free handwritten-style gift note, added during checkout." },
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
        image: { type: "IMAGE", label: "Hero Image", default: "https://placehold.co/900x760/e3d3bd/2a2621.png?text=Corporate+Gift+Box&font=playfair-display" },
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
      fields: {
        eyebrow: { type: "TEXT", label: "Eyebrow", default: "Corporate Catalogue" },
        heading: { type: "TEXT", label: "Heading", default: "Gifts for every corporate need" },
        // Fixed-position text only (not a LIST): each card's icon, slug, and
        // grid placement are hardcoded to a specific 7-cell bento layout
        // (gridTemplateAreas in CorporateNeeds.tsx) and the slug is also
        // referenced by needToCollectionSlugs in corporate-data.ts — freely
        // adding/removing/reordering here would break both.
        needEmployeeTitle: { type: "TEXT", label: "Employee Gifting — Title", default: "Employee Gifting" },
        needEmployeeSubtitle: { type: "TEXT", label: "Employee Gifting — Subtitle", default: "Celebrate your team" },
        needClientTitle: { type: "TEXT", label: "Client Gifting — Title", default: "Client Gifting" },
        needClientSubtitle: { type: "TEXT", label: "Client Gifting — Subtitle", default: "Build lasting relationships" },
        needFestiveTitle: { type: "TEXT", label: "Festival Gifting — Title", default: "Festival Gifting" },
        needFestiveSubtitle: { type: "TEXT", label: "Festival Gifting — Subtitle", default: "Celebrate togetherness" },
        needMilestoneTitle: { type: "TEXT", label: "Milestone Gifting — Title", default: "Milestone Gifting" },
        needMilestoneSubtitle: { type: "TEXT", label: "Milestone Gifting — Subtitle", default: "Mark every achievement" },
        needWelcomeTitle: { type: "TEXT", label: "Welcome Kits — Title", default: "Welcome Kits" },
        needWelcomeSubtitle: { type: "TEXT", label: "Welcome Kits — Subtitle", default: "Warm welcomes matter" },
        needEventTitle: { type: "TEXT", label: "Event Gifting — Title", default: "Event Gifting" },
        needEventSubtitle: { type: "TEXT", label: "Event Gifting — Subtitle", default: "Make every event special" },
        needCustomTitle: { type: "TEXT", label: "Custom Hampers — Title", default: "Custom Hampers" },
        needCustomSubtitle: { type: "TEXT", label: "Custom Hampers — Subtitle", default: "Curated just for you" },
      },
    },
    "how-it-works": {
      title: "How It Works — Steps",
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
        cta: { type: "LINK", label: "CTA", default: { label: "Know More", href: "/corporate/quote" } },
        image: { type: "IMAGE", label: "Image", default: "https://placehold.co/700x560/3a4529/cfb587.png?text=Your+Brand&font=playfair-display" },
      },
    },
    testimonials: {
      title: "Testimonials",
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
    "curated-collections": {
      title: "Curated Collections",
      fields: {
        eyebrow: { type: "TEXT", label: "Eyebrow", default: "Ready-Made Sets" },
        heading: { type: "TEXT", label: "Heading", default: "Curated collections for every occasion" },
        // Fixed-position (not a LIST): slugs are referenced by
        // needToCollectionSlugs in corporate-data.ts for the downloadable
        // catalogue feature, and the final "Create Your Own" tile is a
        // special CTA card, not real content — neither is safe to
        // freely add/remove/reorder.
        collectionWelcomeKitsTitle: { type: "TEXT", label: "Welcome Kits — Title", default: "New Employee Welcome Kits" },
        collectionWelcomeKitsImage: {
          type: "IMAGE",
          label: "Welcome Kits — Image",
          default: curatedCollections.find((c) => c.slug === "welcome-kits")!.image,
        },
        collectionDiwaliTitle: { type: "TEXT", label: "Diwali Gifts — Title", default: "Diwali Gifts" },
        collectionDiwaliImage: {
          type: "IMAGE",
          label: "Diwali Gifts — Image",
          default: curatedCollections.find((c) => c.slug === "diwali")!.image,
        },
        collectionWorkAnniversaryTitle: { type: "TEXT", label: "Work Anniversary — Title", default: "Work Anniversary" },
        collectionWorkAnniversaryImage: {
          type: "IMAGE",
          label: "Work Anniversary — Image",
          default: curatedCollections.find((c) => c.slug === "work-anniversary")!.image,
        },
        collectionWomensDayTitle: { type: "TEXT", label: "Women's Day — Title", default: "Women's Day Gifts" },
        collectionWomensDayImage: {
          type: "IMAGE",
          label: "Women's Day — Image",
          default: curatedCollections.find((c) => c.slug === "womens-day")!.image,
        },
        collectionHolidayTitle: { type: "TEXT", label: "Holiday — Title", default: "Holiday Gifts" },
        collectionHolidayImage: {
          type: "IMAGE",
          label: "Holiday — Image",
          default: curatedCollections.find((c) => c.slug === "holiday")!.image,
        },
        collectionClientAppreciationTitle: { type: "TEXT", label: "Client Appreciation — Title", default: "Client Appreciation" },
        collectionClientAppreciationImage: {
          type: "IMAGE",
          label: "Client Appreciation — Image",
          default: curatedCollections.find((c) => c.slug === "client-appreciation")!.image,
        },
      },
    },
    "final-cta": {
      title: "Final CTA",
      fields: {
        heading: { type: "TEXT", label: "Heading", default: "Let's plan your next gifting moment." },
        subcopy: {
          type: "TEXT",
          label: "Subcopy",
          default: "Share your requirements and our gifting expert will get back to you within one business day.",
        },
        cta: { type: "LINK", label: "Button", default: { label: "Request a Quote", href: "/corporate/quote" } },
        email: { type: "TEXT", label: "Email", default: "corporate@blissynest.com" },
        phone: { type: "TEXT", label: "Phone", default: "1800-123-456" },
      },
    },
  },
  // Header/MobileNav nav labels are deliberately NOT here — Header.tsx is
  // imported directly by 14 "use client" page components (same shape as
  // the TopBar regression fixed earlier), so making it async would need
  // the same 14-file page.tsx migration all over again for a few words of
  // structural nav-category text. Not worth repeating that for this.
  layout: {
    "shop-gift-banner": {
      title: "Shop Gift Banner",
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
    "collection-banners": {
      title: "Collection Page Banners",
      fields: {
        // Fixed-position, one per collection slug — collections themselves
        // aren't a LIST an admin can add/remove (they're a hardcoded
        // catalog in collection-mock-data.ts), so neither are their banners.
        selfCareBanner: {
          type: "IMAGE",
          label: "Self-Care Edit — Banner",
          default: collectionContent["self-care"].bannerImage,
        },
        cozyBanner: {
          type: "IMAGE",
          label: "Cozy Edit — Banner",
          default: collectionContent.cozy.bannerImage,
        },
        minimalistBanner: {
          type: "IMAGE",
          label: "Minimalist Edit — Banner",
          default: collectionContent.minimalist.bannerImage,
        },
        celebrationBanner: {
          type: "IMAGE",
          label: "Celebration Edit — Banner",
          default: collectionContent.celebration.bannerImage,
        },
        luxuryBanner: {
          type: "IMAGE",
          label: "Luxury Edit — Banner",
          default: collectionContent.luxury.bannerImage,
        },
        hampersBanner: {
          type: "IMAGE",
          label: "Gift Hampers — Banner",
          default: collectionContent.hampers.bannerImage,
        },
      },
    },
    "category-pills": {
      title: "Category Quick-Access Photos",
      fields: {
        // Keyed directly by the shop category slug (see shopCategories in
        // shop-mock-data.ts) so CategoryPillRow can look a value up with no
        // translation step. Empty default (not a placeholder image, unlike
        // every other IMAGE field on this page) is deliberate: an unset
        // photo means "show the Lucide icon instead," not "show a broken/
        // placeholder image" — see CategoryPillRow.tsx.
        all: { type: "IMAGE", label: "All", default: "" },
        personalised: { type: "IMAGE", label: "Personalised", default: "" },
        "luxury-edit": { type: "IMAGE", label: "Luxury Edit", default: "" },
        "home-living": { type: "IMAGE", label: "Home & Living", default: "" },
        jewellery: { type: "IMAGE", label: "Jewellery", default: "" },
        hamper: { type: "IMAGE", label: "Hampers", default: "" },
      },
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
        instagramUrl: { type: "TEXT", label: "Instagram URL", default: "#" },
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
        copyright: { type: "TEXT", label: "Copyright Line", default: "© 2026 BlissyNest. All rights reserved." },
      },
    },
  },
};

export function getSectionSchema(page: string, section: string): SectionSchema | undefined {
  return contentSchema[page]?.[section];
}
