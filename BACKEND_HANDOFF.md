# Blissynest — Backend Handoff Document

**Status: historical.** Written when this project was still frontend-only,
before the real backend (Prisma/MySQL, NextAuth, Razorpay, etc. — see
[SETUP_AND_DEPLOYMENT.md](./SETUP_AND_DEPLOYMENT.md) for the current
architecture) existed. Keep this file: several live code comments still
cite its section numbers (e.g. "see Section 9", "Section 30") as the
rationale for a decision, even though the backend described here has since
been built. Treat it as the original spec/design-rationale record, not as
a description of the site's current state.

**Purpose:** This document is a complete technical handoff of the existing Blissynest frontend, written for whoever (developer or AI) builds the backend next. It was produced by inspecting the actual codebase file by file — not by guessing. Anywhere the frontend doesn't answer a question, that is called out explicitly in Section 32 rather than silently assumed.

---

## 1. PROJECT OVERVIEW

**What Blissynest is:** A premium/boutique online gifting store (India-focused, pricing in ₹) — think a smaller, more editorial competitor to FNP/IGP. The brand voice is "Gifts that feel like home."

**What it sells:** Curated gift products across several organizing schemes rather than one flat catalogue:
- Audience-based shop ("Gifts for Her/Him/Parents/Couples/Friends/Colleagues")
- Curated editorial collections ("The Blissynest Edit": Self-Care, Cozy, Minimalist, Celebration, Luxury)
- Occasion pages (Birthday, Anniversary, Wedding, Housewarming, Thank You, Just Because, Festivals)
- Personalised/customisable products (engraved, named, monogrammed items)
- Gift hampers/boxes (multi-item bundles)
- Corporate/bulk gifting (a lead-generation flow, not a self-serve catalogue)

**Target user experience:** Browse-and-discover more than search-and-buy — the homepage leans on a "Gifting Assistant" quiz, occasion/audience browsing, and a rotating seasonal spotlight, rather than a pure search bar. The catalogue is deliberately organized around *who you're buying for* and *why*, not just product taxonomy.

**Overall e-commerce flow (as built):** Browse (shop/collection/occasion/search) → Product Detail Page → Add to Cart / Buy Now → Cart → Checkout (Address → Payment → Review) → Order Confirmation. Wishlist and an account dashboard exist alongside this as secondary flows.

**Major features currently represented in the frontend:**
- Full product browsing with filters, sort, pagination across 4 different catalogue "shapes" (shop-by-audience, collections, occasions, personalised, search, gifting-assistant results)
- 3 distinct PDP (product detail page) layouts: hamper, customisable, standalone
- Cart and Wishlist (real client-side state, persisted to `localStorage`)
- A 3-step checkout (Address → Payment → Review) ending in a mock order confirmation
- A "Gifting Assistant" quiz (who/occasion/budget → filtered results)
- Corporate gifting marketing pages + a lead-capture quote form + a generated downloadable HTML "catalogue"
- A sign-up/login modal (email + "Continue with Google" — **UI only, no real auth**)
- A "My Account" dashboard (Profile/Orders/Addresses/Wishlist/Settings tabs — **all seeded with mock/demo data**, not a real signed-in session)
- Search (client-side substring match over a static index)
- 8 static content/utility pages (About, Journal, Shipping, Returns, FAQs, Contact, Help, Track Order)

**Frontend technology/framework:**
- **Next.js 16.3.2**, App Router, mixed Server/Client Components
- **React 19.2.8** / **React DOM 19.2.8**
- **TypeScript 5** (strict — see `tsconfig.json` conventions used throughout)
- **Tailwind CSS v4** (`@tailwindcss/postcss`, `@theme inline` token system in `src/app/globals.css` — no `tailwind.config.js`, tokens are CSS custom properties)
- **Turbopack** (Next 16 default dev/build)

**Important libraries/dependencies** (from `package.json`):
| Package | Version | Used for |
|---|---|---|
| `next` | 16.3.2 | Framework |
| `react` / `react-dom` | 19.2.8 | UI |
| `lucide-react` | ^1.33.0 | All icons site-wide |
| `clsx` | ^2.1.1 | Conditional className composition (via `src/lib/cn.ts`) |
| `tailwind-merge` | ^3.6.0 | Merging Tailwind classes safely (also via `cn.ts`) |
| `tailwindcss` | ^4 | Styling |
| `eslint` / `eslint-config-next` | ^9 / 16.3.2 | Linting |
| `typescript` | ^5 | Types |

**No other dependencies exist.** Notably absent: no ORM, no auth library, no HTTP client library (no `axios`/`swr`/`react-query`), no form library, no state management library beyond React Context, no testing framework, no CMS SDK, no payment SDK, no analytics SDK.

**Project structure:**
```
src/
  app/                        Next.js App Router — one folder per route
    <route>/page.tsx           Route entry (Server Component; owns metadata)
    <route>/<Name>Client.tsx    The actual UI (Client Component), when the page needs client hooks
    layout.tsx                 Root layout — fonts, global providers, metadata default
    globals.css                Tailwind v4 theme tokens (colors, fonts)
    icon.png / apple-icon.png  Favicon (Next.js file-based icon convention)
  components/
    layout/                    Header, TopBar, Footer, MobileNav, SearchOverlay, AccountAuthModal, etc.
    home/                      Homepage-only sections (Hero, GiftingAssistant, SeasonalBanner, etc.)
    shop/                      Shared shop/catalogue chrome (FilterSidebar, ShopToolbar, Pagination, etc.)
    product/                   PDP building blocks (3 PDP types + shared pieces)
    checkout/                  Checkout step components
    collections/               Collection-page-specific chrome (different sidebar pattern than shop)
    corporate/                 Corporate marketing page sections
    account/                   My Account dashboard tab sections
    help/                      FAQ accordion
    ui/                        Generic reusable UI (ProductCard, cards, buttons, dropdowns)
    providers/                 AppProviders (wraps Cart + Wishlist context)
  lib/                         All data + business logic lives here (see Section 25)
public/                        Static assets — logo, favicon source, default Next.js SVGs
```

**Routing pattern used throughout:** every route that needs client-side interactivity (`useState`, `useSearchParams`, etc.) is split into a thin server `page.tsx` (which only exports `metadata`/`generateMetadata` and renders the client component) plus a sibling `*Client.tsx` that holds the actual logic and JSX. This split exists **specifically so each page could have its own `<title>`/meta description** — Client Components cannot export `metadata` in Next.js. Any backend work that touches these pages should preserve this split rather than collapsing it back into one file.

---

## 2. COMPLETE ROUTE / PAGE INVENTORY

Verified against the actual `src/app` file tree. There is no `not-found.tsx`, `error.tsx`, or `loading.tsx` anywhere in the project — invalid dynamic-route params fall through to Next's default (unstyled) 404, and there is no custom error boundary or loading skeleton at any route.

| Route | Page name | Purpose | How user reaches it | Key components | Data source | Mock/static? | Backend eventually required |
|---|---|---|---|---|---|---|---|
| `/` | Homepage | Brand landing, discovery entry points | Direct/logo | `Hero`, `GiftingAssistant`, `SeasonalBanner`, `WhoAreYouGifting`, `MadeForTheMoment`, `BlissynestEdit`, `LovedByMany`, `CorporateBanner`, `FeatureStrip`, `CommunityStrip` | `mock-data.ts`, `seasonal-banner-data.ts` | Static | Bestsellers/featured content should come from a real "featured" flag or curation table |
| `/shop` | All Gifts (hub) | Full combined catalogue, all audiences | Header nav, footer, breadcrumbs | `CategoryPillRow`, `FilterSidebar`, `ShopToolbar`, `ProductCard`, `Pagination` | `allShopProducts` (`shop-mock-data.ts`) | Mock (336 products) | Product search/list API with filter/sort/paginate params |
| `/shop/[audience]` | Gifts for Her/Him/Parents/Couples/Friends/Colleagues | Catalogue scoped to one audience | Header nav dropdown, homepage category cards, `?category=personalised` deep-link from Personalised nav | Same as `/shop` | `shopProductsByAudience[audience]` | Mock (56 products × 6 audiences) | Same, filtered by `audience` |
| `/collections` | Collections (hub) | Lists the 5 curated Edits | Header nav, homepage "Explore Collections" | `CollectionCard` | `editCollections` (`mock-data.ts`) | Static | None (just needs real collection data behind it) |
| `/collections/[collection]` | The Self-Care / Cozy / Minimalist / Celebration / Luxury Edit | One curated collection's own catalogue | Header nav, `/collections` hub | `CollectionBanner`, `CollectionFilterSidebar`, `ProductCard` (with `badge`) | `collectionContent[slug].products` | Mock (~20-25 products per edit, own catalogue — **not** filtered from `allShopProducts`) | Collection entity + product-to-collection join |
| `/occasions` | Occasions (hub) | Lists the 7 occasions | Header nav, homepage "Made for the moment" | `OccasionCard` | `occasions` (`mock-data.ts`) | Static | None |
| `/occasions/[occasion]` | Birthday/Anniversary/Wedding/Housewarming/Thank You/Just Because/Festival Gifts | Catalogue filtered to one occasion, with occasion-specific quick-filter pills | Header nav, homepage occasion cards, `SeasonalBanner` | `CategoryPillRow` (occasion-specific pills), `FilterSidebar` | `allShopProducts.filter(p => p.occasions.includes(label))` | Mock (reuses shop catalogue, not separate) | Occasion entity + product-to-occasion tagging |
| `/personalised` | Personalised Gifts | Catalogue scoped to `category === "personalised"` across all audiences | Header nav | `FilterSidebar`, `ProductCard` | `allShopProducts.filter(category === "personalised")` | Mock (48 products) | Same filter, server-side |
| `/product/[slug]` | Product Detail Page | Single product, one of 3 PDP layouts | Any `ProductCard`/search-result click | `HamperPDP` \| `CustomisablePDP` \| `StandalonePDP` (via `ProductPageShell`) | `getProductBySlug()` (`product-mock-data.ts`) | Mock — only 3 products are hand-authored; every other product renders via a generated fallback (see Section 25) | Product detail API by slug/id |
| `/search` | Search results | Full search-results page | Header search icon → "View all results", or Enter in search | `SearchOverlay`-fed, then own toolbar/grid | `searchProducts()` (`search-data.ts`) | Mock (client-side substring match over ~450-item static index) | Real search backend once catalogue is real/large |
| `/gifting-assistant` | Gifting Assistant | Quiz results — who/occasion/budget filtered products | Homepage "Find the Perfect Gift" button, homepage widget "Find My Gift" | `SelectDropdown` ×3, `ProductCard` grid | `allShopProducts` filtered by `whoToAudience`/`budgetToRange` maps | Mock | Real recommendation logic eventually; currently a straightforward attribute match |
| `/cart` | My Cart | View/edit cart before checkout | Header cart icon, "Add to Cart"/"Buy Now" on any PDP | `QuantityStepper` | `useCart()` (`cart-context.tsx`) → `localStorage` | **Functional**, not mock — real client state | Server-side cart per user/session |
| `/checkout` | Checkout | Address → Payment → Review → Place Order | Cart "Proceed to Checkout" | `CheckoutStepper`, `AddressStep`, `OrderSummarySidebar`, `OrderConfirmation` | `checkout-data.ts` (seed address, payment methods, coupons) | **Functional UI**, mock backend (no real payment, no real order persistence) | Real order creation, payment gateway, address persistence |
| `/wishlist` | My Wishlist | View saved items | Header heart icon, PDP heart, `ProductCard` heart | `WishlistCard` | `useWishlist()` (`wishlist-context.tsx`) → `localStorage` | **Functional**, not mock | Server-side wishlist per user |
| `/account` | My Account | Sign-in-modal-adjacent dashboard: Profile/Orders/Addresses/Wishlist/Settings tabs | Header account icon → modal → "Sign In"/"Register" link, or mobile menu "Profile"/"Order History" | `ProfileSection`, `OrdersSection`, `AddressesSection`, `WishlistSection`, `SettingsSection` | `account-data.ts` (hardcoded demo user "Meera Kapoor" + 4 mock orders + 2 mock addresses); Wishlist tab alone reads real `useWishlist()` | **Mock** (except the Wishlist tab) — this page renders as if a user is always logged in as the same demo person; there is no real session gate | Full auth + per-user profile/orders/addresses persistence |
| `/corporate` | Corporate Gifting | B2B marketing/lead-gen landing page | Header nav, TopBar link | `CorporateHero`, `CorporateNeeds`, `HowItWorks`, `WhyChooseUs`, `CuratedCollections`, `TrustedByStrip`, `CorporateFinalCta` | `corporate-data.ts` | Static marketing content | None — it's a landing page, not a catalogue |
| `/corporate/quote` | Request a Quote / Book a Consultation | Lead-capture form | `/corporate` CTAs (`?interest=<slug>`, `?intent=consultation`) | Form + `SelectDropdown` | `corporate-data.ts` (`corporateNeeds` for the dropdown) | **Functional as UI**, stub submit | Lead-capture endpoint (email/CRM) |
| `/about` | About Us | Brand story | Footer link | `StandardFeatureStrip` | Static copy | Static | None |
| `/journal` | The Bliss Journal | Blog/article teasers | Footer link | Static cards (deliberately **not clickable** — no article detail route exists) | Static copy | Static | Real CMS-backed blog |
| `/shipping` | Shipping & Delivery | Policy content | Footer link | — | Static copy | Static | None |
| `/returns` | Returns & Refunds | Policy content | Footer link | — | Static copy | Static | None |
| `/faqs` | FAQs | Accordion Q&A | Footer link, `/help` | `FaqAccordion` | Static copy | Static | None |
| `/contact` | Contact Us | Contact form + info | Footer link, `/help` | Form (Name/Email/Subject/Message) | Static contact info | **Functional as UI**, stub submit | Email/CRM endpoint |
| `/help` | Help Centre | Links to the 5 support pages above | TopBar link, mobile menu | — | Static | Static | None |
| `/track-order` | Track Your Order | Order-number + email lookup with a mock status timeline | TopBar link, `/help`, mobile menu | — | Deterministic hash of the order number → one of 4 statuses | **Functional but mocked** | Real order-lookup API |

**Routes that do NOT exist** (flagged because the task brief assumed some of these): there is **no dedicated login page**, **no OTP/mobile-number login flow**, and **no separate Google-OAuth-callback route**. All "auth" UI lives in one modal (`AccountAuthModal.tsx`) triggered from the header account icon — see Section 13.

---

## 3. NAVIGATION & USER FLOWS

Flows actually wired up in the code (verified via `onClick`/`router.push`/`<Link href>` — not inferred):

**Primary shopping flow:**
```
Homepage
 → Shop / Shop-by-audience / Occasion / Collection / Search / Gifting Assistant
 → Product Detail Page
 → Add to Cart (stays on PDP, shows "Added" confirmation) OR Buy Now (adds + navigates to /cart)
 → Cart ("Proceed to Checkout")
 → Checkout: Address → Payment → Review
 → Place Order → Order Confirmation (mock order number, cart is cleared)
```

**The Blissynest Edit (collections) flow:**
```
Homepage "The Blissynest Edit" section OR Header "Collections" dropdown
 → /collections (hub) OR directly to /collections/[slug]
 → Product Detail Page
 → (same cart/checkout flow as above)
```

**Personalised flow:**
```
Header "Personalised" dropdown (per-audience deep link, ?category=personalised)
 → /personalised OR /shop/[audience]?category=personalised
 → Product Detail Page (only reaches the CustomisablePDP layout if that specific product's pdpType is "customisable" — most personalised-category products actually render as generated StandalonePDP fallbacks; see Section 25)
 → Customisation (text lines, font, color, variant — on the PDP itself, no separate step)
 → Add to Cart / Buy Now
 → Cart → Checkout
```
**Important:** there is no dedicated "customisation" page/step — personalisation happens inline on the PDP before Add to Cart, and (see Section 6) the chosen customisation is **not** currently passed into the cart item at all.

**Gift Finder (called "Gifting Assistant" in this codebase) flow:**
```
Homepage widget or Hero "Find the Perfect Gift" button
 → Who? / Occasion? / Budget? (3 dropdowns, all optional)
 → /gifting-assistant?who=&occasion=&budget= (results filter live, no separate "submit" step)
 → Product Detail Page
 → Cart
```

**Sign-in flow (there is no OTP or mobile-number flow — see Section 13):**
```
Header account icon (desktop) / mobile menu "Profile"
 → AccountAuthModal opens (modal on desktop, full-screen takeover on mobile)
 → Enter email + "Continue" OR "Continue with Google"
 → Neither actually authenticates — an inline message says so, with a "Continue as Guest" button that just closes the modal
```
There is a separate, still-non-functional email/password form at `/account` (reached via the modal's "Sign In"/"Register" links) — same honesty pattern, no real submission.

**Corporate flow:**
```
Homepage "Corporate Gifting" banner OR Header "Corporate" nav item
 → /corporate
 → "Get a Quote" / "Book a Consultation" / any need-tile / any curated-collection tile
 → /corporate/quote (pre-filled `?interest=` or `?intent=consultation`)
 → Fill form → Submit Request (stub) OR Download Catalogue (generates + downloads a real client-side HTML file, then also submits)
 → Success state shown inline (no navigation)
```

**Account dashboard flow:**
```
AccountAuthModal "Sign In" link, or mobile menu "Profile"/"Order History"
 → /account (defaults to Profile tab; ?tab=orders deep-links to Orders)
 → Switch tabs client-side (Profile / Orders / Addresses / Wishlist / Settings) — no navigation, just local state
```

---

## 4. PRODUCT SYSTEM

There is **no single unified "Product" type** in this codebase — three different shapes exist depending on which catalogue a product came from, plus a fourth "detail" shape used only on the PDP. This is the single most important structural fact for backend schema design (see Section 22).

### 4a. `ShopProduct` (`src/lib/shop-mock-data.ts`) — the shop-by-audience catalogue
```ts
type ShopProduct = {
  id: string;              // e.g. "her-self-care-1" — audience-category-index, NOT a stable product ID independent of position
  name: string;
  price: number;
  rating: number;          // 1-5, currently a formula (3 + index % 3), not real
  reviews: number;          // currently a formula (40 + index*17 % 200), not real
  image: string;            // placehold.co generated URL
  category: string;         // one of shopCategories slugs
  occasions: string[];      // 2 labels, formula-assigned from shopOccasions
  recipients: string[];     // 2 labels, formula-assigned from that audience's recipient list
};
// ShopProductWithAudience adds: audience: AudienceSlug
```

### 4b. `CollectionProduct` (`src/lib/collection-mock-data.ts`) — the 5 curated Edits
```ts
type CollectionProduct = {
  id: string;               // e.g. "self-care-candles-1"
  name: string;
  price: number;
  rating: number;
  reviews: number;
  image: string;
  category: string;         // per-collection category (e.g. "candles", "bath-body")
  attribute?: string;       // e.g. Scent/Material/Theme value — collection-specific, optional
  occasions: string[];
  badge?: "Bestseller" | "New";   // shown on ProductCard; hand-assigned per seed, not derived from data
};
```

### 4c. `ProductDetail` (`src/lib/product-mock-data.ts`) — the PDP-only shape
```ts
type BaseProduct = {
  slug: string;
  name: string;
  tagline?: string;
  rating: number;
  reviews: number;
  price: number;
  images: string[];                       // array — PDP has a real gallery, other shapes have 1 image
  breadcrumbCategory: string;
  benefits: { icon: string; label: string }[];   // icon = a string key looked up via getIcon() (src/components/product/icon-map.ts)
  productDetails: {
    description: string;
    materials?: string;
    dimensions?: string;
    howToUse?: string;
    care?: string;
    delivery: string;
  };
  relatedSlugs?: string[];                 // hand-picked "you may also like"; falls back to same-category if absent
  reviewsList?: ProductReview[];           // hand-written reviews; generated generic ones used if absent
};
// + one of:
type HamperProduct = BaseProduct & { pdpType: "hamper"; whatsInside: {...}[]; personalNote?: {label,price} };
type CustomisableProduct = BaseProduct & { pdpType: "customisable"; textLines: {...}[]; fonts: string[]; colors: {name,hex}[]; variantLabel?: string; variantOptions?: string[]; specs?: {...}[] };
type StandaloneProduct = BaseProduct & { pdpType: "standalone"; variants?: { label: string; options: string[] }[] };
```
`ProductReview`: `{ name, rating, date, comment, verified }`.

### 4d. Bestseller (`src/lib/mock-data.ts`) — homepage-only
```ts
{ name, price, rating, reviews, bg, fg, image }
```
**No stored `slug` or `id` field** — a bestseller's PDP slug is computed on the fly via `slugify(name)` wherever it's linked (see Section 32 for why this is risky).

### Fields NOT currently present anywhere (do not assume these exist)
`compareAtPrice`, `stock`/inventory count, `sku`, `weight`, `brand`, `tags` (as a generic freeform array — closest equivalent is `occasions`/`recipients`/`category`), `bestseller` (as a boolean flag on a product — bestseller status is just "is in the hardcoded `bestsellers` array"), `new` (as a boolean flag — the closest is `badge: "New"` on `CollectionProduct` only), `createdAt`/`publishedAt` (Sort → "Newest" currently just reverses the array).

### Recommended additional backend fields (clearly necessary, not present)
`id` (stable UUID, independent of name/position), `slug` (stable, stored — not derived from name at read time), `stock`/`inventoryCount`, `sku`, `compareAtPrice` (for a real "on sale" treatment — currently no sale-price UI exists at all), `isBestseller` (boolean, computed from real sales data), `isNew` (boolean, computed from a real launch date), `weight`/`dimensions` (already free-text in `productDetails`, would need structuring for shipping calculations), `taxRate`/`hsn` (India GST), `status` (draft/published/archived, for an admin panel).

---

## 5. PRODUCT TYPES

The frontend has exactly **3 PDP layout types**, discriminated by `pdpType`, plus two things that are *not* real product types (corporate, and the "flat" shop/collection card shapes described in Section 4a/4b, which never render their own dedicated PDP layout — they always fall through to `StandalonePDP` via a generated fallback).

### 1. Hamper / gift box (`pdpType: "hamper"`, `HamperPDP.tsx`)
- **Differs by:** shows a "What's Inside" itemized list (`whatsInside: {icon, name, subtitle, qty}[]`) instead of variant pickers.
- **Required data:** `whatsInside` array; everything else from `BaseProduct`.
- **Variants:** none.
- **Customisation:** exactly one optional add-on — `personalNote?: {label, price}` (a checkbox, "Add a handwritten note", adds its price to unit price).
- **Pricing:** `unitPrice = product.price + (addNote ? personalNote.price : 0)`; `total = unitPrice * quantity`. This add-on price math happens **entirely client-side** and is not validated anywhere server-side (there is no server).
- **Inventory implications:** none modeled — hampers are multi-item bundles but there's no concept of "what if one component is out of stock."
- **Cart requirement:** the cart item's `price` is already the *effective* unit price (base + note if selected) — the note selection itself is **not** stored in the cart item, only baked into the number.
- **Checkout requirement:** none beyond standard.
- **PDP requirement:** `WhatsInsideList` component, `personalNote` checkbox.

### 2. Customisable / personalised (`pdpType: "customisable"`, `CustomisablePDP.tsx`)
- **Differs by:** the entire personalisation UI — see Section 6 for full detail.
- **Required data:** `textLines`, `fonts`, `colors`; `variantLabel`/`variantOptions`/`specs` optional.
- **Variants:** at most one variant dimension (e.g. "Scent"), via `variantLabel`/`variantOptions` — simpler than `StandaloneProduct`'s multi-dimension `variants[]`.
- **Customisation:** up to 4 free-text lines (each with its own `required`/`maxLength`/`placeholder`), a font choice (from a small fixed list, e.g. `["Serif","Script","Modern"]`), a text color choice (from a small fixed hex palette), live-updating preview panel.
- **Pricing:** flat `product.price` — customisation does **not** change price in this codebase (no "engraving costs extra" logic exists anywhere).
- **Inventory implications:** none modeled.
- **Cart requirement (critical gap):** `handleAddToCart()` in `CustomisablePDP.tsx` adds `{slug, name, price, image}` to the cart — **the typed text, chosen font, chosen color, and chosen variant are read into local component state but never passed into `addItem()`**. Reopening the cart or checkout shows zero indication of what was personalised. This must be fixed as part of backend work — the cart schema needs a customisation field, and the add-to-cart call needs to include it.
- **Checkout requirement:** currently none beyond standard, but once customisation is captured it needs to reach the order (see Section 12).
- **PDP requirement:** text inputs with live char-count, font-style buttons, color swatches, preview panel (`fontClassMap` maps font name → Tailwind class; preview literally re-renders the typed text in the chosen font/color).

### 3. Standalone / regular product (`pdpType: "standalone"`, `StandalonePDP.tsx`)
- **Differs by:** the simplest layout — optional multi-dimension variant pills (e.g. Scent AND Size), no personalisation UI, no "what's inside" list.
- **Required data:** just `BaseProduct` fields; `variants` optional.
- **Variants:** `variants?: {label, options[]}[]` — can have more than one dimension (unlike the customisable type's single `variantLabel`). Selecting a variant is pure UI state (`selectedVariants: Record<string,string>`) — **does not affect price or the cart item** (no per-variant pricing/SKU exists).
- **Customisation:** none.
- **Pricing:** flat `product.price`.
- **Inventory implications:** none modeled.
- **Cart requirement:** `{slug, name, price, image}` — same as above, but here that's actually complete since there's no customisation to lose; the **selected variant is still lost**, same underlying gap as #2 above, just lower-stakes (a scent choice, not a personalised name).
- **Checkout requirement:** none beyond standard.
- **PDP requirement:** `VariantPills` per dimension.

### 4. Corporate gifting — NOT a product type
There is no corporate product catalogue, no corporate SKUs, no corporate pricing tier. `/corporate` is pure marketing content (`corporate-data.ts`: `corporateNeeds`, `curatedCollections` — the latter has `title`/`image`/`slug` only, **no price, no product data**) that funnels into a lead-capture form at `/corporate/quote`. If a real corporate catalogue is wanted later, it does not exist in the frontend today and would need to be designed from scratch.

**Every product card everywhere in the app also uses `getProductBySlug()`'s fallback system** (Section 25) when there's no hand-authored PDP entry — meaning in practice, of the ~450 products in the whole site, only 3 render as their "real" `pdpType`; the other ~447 all render as a generated `StandalonePDP`, regardless of which catalogue they came from.

---

## 6. CUSTOMISATION SYSTEM

Everything below applies only to `CustomisablePDP` (`pdpType: "customisable"`) — currently only 1 hand-authored product uses it (`personalised-scented-candle`), though the *category* "Personalised" spans 48 shop products (most of which render as generated `StandalonePDP`s with no actual customisation UI — see Section 32, this is a real content gap, not a backend gap).

**Fields, as they exist on `CustomisableProduct`:**
| Field | Type | Notes |
|---|---|---|
| `textLines` | `{label, required, maxLength, placeholder}[]` | Up to 4 lines in the one example product. Each independently required/optional with its own character cap. |
| `fonts` | `string[]` | e.g. `["Serif", "Script", "Modern"]` — a fixed small list, mapped to a Tailwind class via a hardcoded `fontClassMap` in the component (not data-driven). |
| `colors` | `{name, hex}[]` | Fixed palette, e.g. 5 named hex colors. |
| `variantLabel` / `variantOptions` | `string` / `string[]` | Optional single variant dimension (e.g. "Scent": Lavender/Vanilla/...). |
| `specs` | `{icon, label, value}[]` | Optional display-only spec sheet (Net Weight, Burn Time, etc.) — not user-editable. |

**No image/photo upload exists anywhere in the customisation UI** — despite "Images/photos" being asked about in the task brief, there is no file input, no photo-upload personalisation option anywhere in this codebase. Do not build backend support for this without an explicit product decision — it's not implied by anything currently on screen.

**Preview functionality:** live, client-side only — the typed text re-renders instantly inside a styled `<p>` using the chosen font class and inline `color` style. There is no server round-trip, no image generation, no "proof" artifact saved anywhere.

**Required vs optional:** per-line, via `textLines[i].required`. The Add to Cart button is **not currently disabled** even if a required line is empty — there is no client-side validation blocking submission on missing required text. This is a real gap (see Section 32 and Section 30).

**What needs to be stored in the backend when a personalised product is added to cart** (this is prescriptive — none of this is captured today, per the gap noted in Section 5):
```
CartItem
  productId / slug
  quantity
  unitPrice (server-computed, never trust the client's price)
  personalisation: {
    textLines: string[]           // matched positionally to product.textLines
    font: string
    colorHex: string
    variant?: string              // if variantOptions present
  } | null
```
This composite (`Product + Variant + Customisation + Cart quantity = CartItem`) is exactly the shape the task brief anticipated — it just doesn't exist in the frontend today and needs to be added as part of backend work (touching `CustomisablePDP.tsx`'s `handleAddToCart`/`handleBuyNow` and the `CartItem` type in `cart-context.tsx`).

**Frontend assumptions that need backend validation:**
- Character limits (`maxLength`) are enforced only by the `<input maxLength>` HTML attribute — trivially bypassable via direct API calls once a backend exists.
- Required-field enforcement doesn't exist client-side either (see above) — the backend must be the source of truth for "was this actually filled in."
- Font/color "options" are just a hardcoded array on the product record — a backend admin panel would need to let these be edited per-product, not hardcoded per-component (`fontClassMap`) as they are now.

---

## 7. COLLECTION SYSTEM

Three genuinely separate relationships exist, and they do **not** share a data model — this is a real architectural fact, not a simplification:

| Concept | Route | Data source | Relationship to products |
|---|---|---|---|
| **Shop** (by audience) | `/shop`, `/shop/[audience]` | `shop-mock-data.ts` | Each `ShopProduct` belongs to exactly one `audience` (her/him/parents/couples/friends/colleagues) and one `category` (self-care/personalised/luxury-edit/home-living/beauty/jewellery/add-ons — see `shopCategories`). This is the "main" catalogue, 336 products. |
| **The Blissynest Edit** (collections) | `/collections`, `/collections/[collection]` | `collection-mock-data.ts` | 5 named collections (self-care, cozy, minimalist, celebration, luxury), each with its **own separate product list** and its **own category taxonomy** (e.g. Self-Care's categories are candles/bath-body/wellness/home-fragrance — nothing to do with the shop's `shopCategories`). ~110 products total, **not** a subset of the shop catalogue — genuinely different products/IDs. |
| **Occasions** | `/occasions`, `/occasions/[occasion]` | `occasion-data.ts` + reuses `allShopProducts` | Occasion pages do **not** have their own product list — they filter the *shop* catalogue by `product.occasions.includes(label)`. No separate occasion catalogue exists. |
| **Personalised** | `/personalised` | Reuses `allShopProducts` | Same pattern — filters shop catalogue by `category === "personalised"`. Not a separate catalogue. |
| **Recipients** | (a filter dimension, not a route) | `recipientsByAudience` in `shop-mock-data.ts` | Each audience has its own recipient list (e.g. "her" → Wife/Sister/Friend/Mother/Daughter/Colleague/Partner). Products carry 2 recipient tags each. Used only as a sidebar filter, never a standalone page. |

**Confirmed exact collection slugs (do not assume others exist):** `self-care`, `cozy`, `minimalist`, `celebration`, `luxury` — titled "The Self-Care Edit" / "The Cozy Edit" / "The Minimalist Edit" / "The Celebration Edit" / "The Luxury Edit". There is no "Home Edit" in this codebase (the brief's example list included one — it does not exist here).

**Recommended backend relationship:** `products` should probably be one real table (unifying the currently-split shop/collection product shapes), with:
- `product.audience_id` (nullable — collection products have no audience)
- `product.category_id` (categories are namespaced per catalogue today — either keep that namespacing or normalize to one category tree)
- `product_collections` (many-to-many join, since a collection is an editorial curation, not a filter)
- `product_occasions` (many-to-many join — a product can and does carry multiple occasion tags today)
- `product_recipients` (many-to-many join)

---

## 8. OCCASION SYSTEM

**Confirmed exact 7 occasions** (`occasionSlugs` in `occasion-data.ts` — do not assume others):
`birthday`, `anniversary`, `wedding`, `housewarming`, `thank-you`, `just-because`, `festivals`.

Each has `{label, title, subtitle, breadcrumbLabel, icon}` — all static copy, hand-written, no per-occasion imagery beyond the shared Lucide icon.

**How occasion filtering currently works:**
1. Occasion page loads all shop products where `product.occasions.includes(occasionContent[slug].label)` (a plain string match against the 2-label `occasions` array every `ShopProduct` carries).
2. On top of that base set, each occasion shows its own **curated quick-filter pill row** — not the same 6 audiences everywhere. This is deliberate editorial curation, defined in `occasionPills` (`occasion-data.ts`):
   - Birthday & Just Because: broad, most/all audiences (+ Birthday adds a "For Kids" pill, a `recipient`-type filter matching products tagged "Son"/"Daughter")
   - Anniversary & Wedding: couple-centric, Friends/Colleagues dropped
   - Housewarming: swaps to *category*-type pills (Home & Living, Self Care, Personalised) instead of audience pills, since housewarming is about the space, not the relationship
   - Thank You & Festivals: skew toward Friends/Colleagues/Family
   
   Every pill is typed `{type: "audience"|"category"|"recipient", value, label}` and maps to a real existing product field — there are no fabricated buckets with fake counts.
3. Below the pills, a Price filter and a dynamically-computed Recipient filter (every recipient tag that actually appears among that occasion's filtered products, with a real count) — there is deliberately no "Occasion" filter shown on an occasion page (redundant, the whole page is already scoped to one).

**Recommended backend behavior:** occasion filtering should become `WHERE occasion_id = ? ` via the `product_occasions` join table proposed in Section 7, with the same curated-pill-per-occasion concept re-implemented as either a config table (`occasion_pills: occasion_id, pill_type, pill_value, pill_label, sort_order`) or kept as application-layer config if occasions rarely change.

---

## 9. SHOP / FILTERING / SEARCH

**All filtering, sorting, and pagination happens entirely client-side today** — every "catalogue" page (`/shop`, `/shop/[audience]`, `/occasions/[occasion]`, `/collections/[collection]`, `/personalised`, `/gifting-assistant`, `/search`) loads its *entire* relevant product array into memory (imported directly from the `lib/*.ts` files, which are bundled into the page) and does `.filter()`/`.sort()`/`.slice()` in a `useMemo`. There is no API call, no loading state, no pagination request — the "12 items per page" (`ITEMS_PER_PAGE = 12`, consistent across every catalogue page) is just an array slice.

**Category filter** — pill row (`CategoryPillRow`) on shop/occasion pages; single-select radio-style list in the sidebar on collection pages (`CollectionFilterSidebar` — deliberately different interaction pattern, matching a specific reference design). Toggling resets to page 1.

**Price filter** — `PriceRangeSlider`, a dual-handle range slider. Bounds are hardcoded per page type: shop/occasion/personalised use a fixed `{min:0, max:5000, step:100}`; each collection defines its own `priceBounds` (varies, e.g. Luxury goes up to ₹7000). The top value is "open-ended" (no upper cap applied when at max).

**Occasion filter** — multi-select checkboxes, shown on shop pages (not shown on occasion pages, since redundant — see Section 8) and collection pages (own `occasionTagsPool` per collection). Not shown on `/personalised`.

**Recipient filter** — multi-select checkboxes, shown everywhere except collection pages. Counts are computed dynamically from whatever's in the currently-relevant product set (not hand-picked).

**Collection filter** — not a cross-cutting filter anywhere; you're either on a collection page or you're not.

**Personalisation filter** — not a standalone filter; `/personalised` *is* the filter (a whole page scoped to `category === "personalised"`). The shop pages' Category pill row includes "Personalised" as one of 7 categories.

**Attribute filter** (collections only) — each collection optionally defines one (`attributeFilter: {label, values}` — e.g. Self-Care's is "Scent", Luxury's is "Material"). Multi-select. Not present on shop/occasion pages at all — this dimension is collection-specific.

**Sorting** — `SortOption`: `"best-selling" | "price-asc" | "price-desc" | "rating" | "newest"` (labels in `sortLabels`, `ShopToolbar.tsx`). **"Best Selling" is a no-op** (returns the array in its original/default order — there is no real sales-count signal anywhere in the data). **"Newest" just calls `.reverse()`** on the current array — there is no `createdAt` field anywhere.

**Search** — see Section 25 for the index construction; matching is `name.toLowerCase().includes(query.toLowerCase())`, no fuzzy matching, no ranking beyond source order (bestsellers first, then collections, then shop).

**Pagination** — numbered pages via `Pagination.tsx` (not "load more" — there is no infinite-scroll or "load more" button anywhere in this codebase). Page count = `Math.ceil(filteredLength / 12)`.

**Product counts** — always the real count of the filtered/mocked dataset (e.g. "84 results" on `/shop/her`), never a fabricated bigger number.

**What should move server-side once the backend exists:** everything in this section. All filtering/sorting/pagination should become query parameters against a real product-list endpoint (`GET /products?audience=&category=&occasion=&recipient=&priceMin=&priceMax=&sort=&page=`) rather than shipping the entire catalogue to the client, which won't scale past the current mock-data sizes anyway.

---

## 10. CART SYSTEM

**Implementation:** `src/lib/cart-context.tsx`, a React Context + `useSyncExternalStore` reading/writing `localStorage` key `"blissynest-cart"`, via a small generic helper `src/lib/local-store.ts` (`createLocalStore<T>`). Wrapped around the whole app in `src/components/providers/AppProviders.tsx` (mounted in `layout.tsx`).

**Why `useSyncExternalStore` specifically (documented in the code):** avoids the classic "setState inside a `useEffect` just to load persisted state" pattern, which trips React's `react-hooks/set-state-in-effect` lint rule and risks a hydration mismatch. Server render and the very first client render both use `getServerSnapshot()` (always `[]`), so there's never a server/client mismatch; only after hydration does it switch to the real `localStorage` value.

**Cart item structure (exact type, `CartItem`):**
```ts
{ slug: string; name: string; price: number; image: string; quantity: number }
```
That's it — **no variant, no customisation, no per-line total, no addedAt timestamp.** (See Sections 5 & 6 for why this is a real gap for the customisable/variant product types.)

**Quantity:** `updateQuantity(slug, quantity)` — setting to `0` or below **removes the line entirely** (not clamped to 1). `addItem` on an already-present slug increments quantity rather than duplicating the line.

**Product variants / customisation data:** not present in the cart item at all (gap, see Section 6).

**Price calculation:** `subtotal = sum(price * quantity)`, computed fresh from cart state on every render — not stored. The cart's own price field is **exactly what was passed to `addItem()` at the time of adding** (see PDP components, Section 5) — nothing re-validates it against the live product price later. If a product's price changed after being added to cart, the cart would silently keep showing the old price.

**Discounts:** none at the cart level. Free-shipping messaging (`₹999` threshold) appears on the cart page as an informational banner but there is **no coupon input on the cart page** — coupons only exist at checkout (`OrderSummarySidebar`).

**Remove item:** `removeItem(slug)`.

**Update quantity:** `updateQuantity(slug, quantity)`, via `QuantityStepper` (shared component, also used on hamper/PDP quantity pickers).

**Wishlist interaction:** the Wishlist page's own "Add to Cart" button on each card calls `addItem(item)` directly (default quantity 1) — Cart and Wishlist are independent stores, adding to cart does not remove from wishlist and vice versa.

**Persistence:** `localStorage`, key `"blissynest-cart"`. Survives reloads; does **not** sync across browser tabs in real time beyond the store's own subscriber mechanism (which only fires on same-tab `setState` calls, not the native `storage` event from other tabs).

**Guest cart vs logged-in cart:** there is no distinction — there is no real login, so *every* cart is currently a "guest" cart by definition. `localStorage` is per-browser, not per-account.

**What the backend cart should eventually support:**
- Server-persisted cart per authenticated user (and a guest-cart-to-user-cart merge flow on login, since `localStorage` guest carts will keep existing as a fallback)
- Line items carrying variant + customisation data (see Section 6's proposed shape)
- Server-computed, server-trusted pricing (recompute from the live product price at every read, never trust a client-cached price)
- Stock/availability checks on add-to-cart and at checkout (nothing today prevents adding an "out of stock" item — there is no stock concept at all currently)

---

## 11. CHECKOUT SYSTEM

**Implementation:** `src/app/checkout/CheckoutPageClient.tsx` (orchestrator) + `src/components/checkout/*` + `src/lib/checkout-data.ts`. A 3-step accordion (`CheckoutStepper.tsx` visually shows 4 labeled steps — Address/Payment/Review/Complete — but "Complete" is really just the confirmation screen, not an interactive step).

**Address:**
- `AddressStep.tsx` — list of saved addresses (radio-select), "Add New Address" (dashed card), per-address Edit/Delete (delete has **no confirmation dialog** — clicking the trash icon deletes immediately).
- Seeded with exactly **one** address (`seedAddresses` in `checkout-data.ts`: "Meera Kapoor", Pune) on every checkout session — addresses are **local component state only, not persisted to `localStorage`** (a deliberate choice, documented in code comments, distinct from cart/wishlist).
- Deleting the last remaining address is allowed; "Continue to Payment" is simply disabled (`!selectedId`) until a new one is added.
- Gift toggle lives in this same step: "This order is a gift" checkbox reveals a gift-note textarea (free text, no length limit enforced) + a "Hide prices on packing slip" checkbox.

**Saved addresses:** see above — exist only within the current checkout session, reset on page refresh. There is no "my addresses" management outside checkout **except** the My Account dashboard's own separate, also-local, Addresses tab (Section 14) — the two are not the same data and do not sync with each other.

**Delivery address:** same as "Address" above — no separate delivery-vs-billing distinction exists anywhere.

**Gift order option / gift message:** see Address step above. Gift note and "hide prices" are captured in component state and displayed back in the Review step, but nothing currently sends them anywhere beyond that in-session state.

**Coupon:** `OrderSummarySidebar.tsx` — a text input + Apply button. Exactly 2 hardcoded valid codes (`coupons` in `checkout-data.ts`): `WELCOME10` (10% off, no minimum) and `FLAT200` (₹200 off, requires subtotal ≥ ₹1,500). `calculateDiscount()` is the single source of truth for the math. Invalid code or unmet minimum shows an inline error, no retry limit.

**Shipping:** flat `STANDARD_SHIPPING_FEE = 99` unless `subtotal >= FREE_SHIPPING_THRESHOLD (999)`, in which case shipping is `0`. No per-address/pincode shipping calculation exists.

**Taxes:** **no tax/GST line item exists anywhere in checkout.** Product prices are labeled "Inclusive of all taxes" on the PDP but no tax breakdown is ever shown or computed.

**Discounts:** see Coupon above — the only discount mechanism.

**Payment:** `paymentMethods` in `checkout-data.ts` — Card / UPI / Net Banking / COD, each `{key, label, description, icon}`. **This is a method *selector* only** — there are deliberately no card-number/CVV/expiry input fields anywhere in this codebase, with an explicit on-page disclaimer: *"This is a demo store — no payment details are collected. Selecting a method just saves your preference for the order."* This is a hard architectural line drawn during the build, not a scope shortcut — do not add fake payment-collection fields when building the real integration; wire the real gateway's hosted checkout/redirect flow instead of building custom card fields.

**Order review:** `Review Your Order` step shows 3-4 distinct bordered cards (Delivery Address, Payment Method, Gift Note if applicable, Items list with live cart data) each with a "Change" link jumping back to the relevant step, plus the "Place Order" button.

**Order confirmation:** `OrderConfirmation.tsx` — shown by swapping the whole page (not a route change) once `handlePlaceOrder()` runs. Shows: `generateOrderNumber()` output (format `BLS` + last 6 digits of `Date.now()` + 4 random digits — **not a real sequential/DB-backed order number**), the real order total, the real address summary string, and `estimatedDelivery()` (today + 5 days, computed client-side). Calls `clearCart()` immediately. **Nothing is persisted anywhere** — refreshing the confirmation page loses it entirely (the empty-cart check would then show the "nothing to check out yet" state instead).

### FRONTEND RESPONSIBILITY vs BACKEND RESPONSIBILITY

| Concern | Frontend (as built) | Backend (required) |
|---|---|---|
| Address CRUD | Local state only, resets on refresh | Persist per user, real validation (pincode serviceability etc.) |
| Coupon validation | 2 hardcoded codes, client-side check | Real promotions engine, usage limits, expiry, stacking rules |
| Shipping fee | Hardcoded flat/free threshold | Real shipping-rate calculation (carrier API or rules engine) |
| Tax | Not computed at all | GST calculation (this is a real, currently-total gap) |
| Payment | Method *selection* only, no charge | Real gateway integration (Razorpay/Stripe/etc.), webhook-based status |
| Order number | Client-generated, non-unique guarantee | Server-generated, guaranteed-unique, sequential or UUID |
| Order persistence | None — cleared from memory on confirmation | Real `orders` table, survives refresh, queryable later |
| Price/total calculation | Client-computed from client-held cart prices | Must be recomputed and trusted server-side only |

---

## 12. ORDER SYSTEM

No `Order` type or persistence exists in the codebase at all today — this section is **entirely a proposed design**, derived from what the checkout UI collects and displays (Section 11), not from any existing backend code.

```
Order
  id (PK)
  orderNumber (unique, human-readable — e.g. keep the "BLS" prefix convention)
  userId (FK → Users, nullable if guest checkout is supported)
  status: "placed" | "confirmed" | "shipped" | "delivered" | "cancelled"   // OrdersSection's mock data uses "Delivered"|"Shipped"|"Processing" — reconcile naming
  paymentStatus: "pending" | "paid" | "failed" | "refunded"
  fulfillmentStatus: "unfulfilled" | "packed" | "shipped" | "delivered"
  subtotal, discountAmount, shippingFee, taxAmount, total   // all server-computed at order time, snapshotted (never recompute from live product prices after the fact)
  addressId (FK → Addresses) or a denormalized address snapshot (recommended — so a later address edit doesn't rewrite history)
  isGift: boolean
  giftNote: string | null
  hidePricesOnPackingSlip: boolean
  couponCode: string | null
  paymentMethod: string
  createdAt, updatedAt

OrderItem
  id (PK)
  orderId (FK)
  productId, productSlug, productName, productImage   // snapshot the name/image too — don't rely on a live join for historical accuracy
  unitPrice (snapshotted at order time)
  quantity
  personalisation: jsonb | null   // see Section 6's proposed shape
  variant: jsonb | null

Customer (or reuse Users — see Section 14)
Address — as in Section 11, but should support "saved for reuse" vs "one-off for this order"
Payment — gateway transaction id, amount, status, method, raw gateway response (for reconciliation)
Coupon — as in Section 20
```
**Relationships:** `Order 1—N OrderItem`, `Order N—1 User` (nullable for guest checkout, if that's a product decision — nothing in the frontend currently prevents checkout without being "logged in," since there's no real login gate at all), `Order 1—1 Payment`, `Order N—1 Address` (or embedded snapshot).

---

## 13. AUTHENTICATION

**What the frontend actually has:** exactly one entry point, `AccountAuthModal.tsx`, opened from the header's account icon (`AccountMenu.tsx`) or the mobile drawer's "Profile" link. It offers:
1. An **email** text input + "Continue" button (`type="email"`, HTML-validated only)
2. A **"Continue with Google"** button (real Google "G" logomark SVG, but the click handler does not initiate any OAuth flow — it just flips to the same "not available" message as the email path)

**What does NOT exist in the frontend** (do not build backend support assuming otherwise — this contradicts a common assumption, so it's called out explicitly): there is **no mobile-number input anywhere**, **no OTP entry UI**, **no OTP resend/countdown UI**. If mobile+OTP login is a product requirement, it needs to be designed and built into the frontend first (or built backend-only with the frontend updated to call it) — it is not represented today.

There is also a second, separate, still-non-functional form at `/account` (`AccountPageClient.tsx` → tab-switching Sign In / Create Account, reached via the modal's "Sign In"/"Register" links, or `?tab=register` query param) with Name/Email/Password fields — same "not wired up" honesty pattern, no submission logic.

**Required backend authentication flow (proposed, not implemented anywhere today):**
- **User creation:** on first successful auth (email+password, email+magic-link/OTP, or Google), create a `users` row.
- **Existing user login:** standard credential or OAuth check.
- **OTP generation/verification/expiry/rate-limiting:** only relevant if OTP is chosen as the auth method — nothing in the frontend currently implies OTP vs. magic-link vs. password, so this is an open decision (see Section 32).
- **Session/token handling:** JWT or session-cookie — not decided by the frontend (no auth library is even installed yet, per Section 1).
- **Google OAuth:** the frontend has the *button*, not the flow — needs a real OAuth client ID/secret and callback route (none exists today, e.g. no `/api/auth/*` or similar).
- **Logout:** the account dashboard's "Sign Out" button currently just does `router.push("/")` — there is no session to actually clear.
- **Account persistence:** entirely absent — the `/account` dashboard shows the *same* hardcoded demo user (`accountUser` in `account-data.ts`) regardless of anything the visitor does.

**Do not implement any of this yet** per the task brief — this section documents what's required, not a build order (see Section 33 for sequencing).

---

## 14. USER ACCOUNT

The `/account` dashboard (`AccountPageClient.tsx` + `src/components/account/*`) is fully built as a UI, tabbed, seeded entirely from `src/lib/account-data.ts`'s hardcoded `accountUser`:
```ts
{ name: "Meera Kapoor", email: "meera.kapoor@gmail.com", phone: "+91 98765 43210", memberSince: "March 2024" }
```

**What the frontend expects from an authenticated user** (i.e., what the dashboard's tabs assume exist):
| Tab | Data shown | Editable? | Persisted? |
|---|---|---|---|
| Profile | Name, Email, Phone | Yes (form) | No — local `useState`, resets on refresh, shows a "Saved" confirmation that doesn't actually save anything |
| Orders | 4 hardcoded `AccountOrder` records (order number, date, status, items with real product images from `bestsellers`, total) | No | N/A — static array |
| Addresses | 2 hardcoded addresses (reuses `checkout-data.ts`'s `Address` type + `seedAddresses`, plus one added "Work" address) | Yes — full add/edit/delete via a local copy of the checkout `AddressForm` pattern | No — local `useState`, resets on refresh |
| Wishlist | **Real** wishlist data via `useWishlist()` | N/A (managed from product cards elsewhere) | **Yes** — genuinely reads the same `localStorage`-backed store as `/wishlist` |
| Settings | Password change fields (no real validation/submission), 3 notification toggles (Order updates/Promotions/Recommendations — client state only) | Yes (locally) | No |

**Only the Wishlist tab is "real"** in the sense of reflecting genuine cross-page state — everything else on this dashboard is illustrative/demo data, not tied to any actual signed-in session (because no real session exists — see Section 13).

**Fields the backend will need for a real account system** (derived from what's displayed): `name`, `email`, `phone`, `createdAt`/`memberSince`, a real `orders` relationship (Section 12), a real `addresses` relationship (currently duplicated in concept between checkout and account — should become one shared `addresses` table per user), `wishlist` (already has a real frontend shape to match — see Section 15), and `notificationPreferences` (currently 3 fixed booleans: order updates, promotions, recommendations).

---

## 15. WISHLIST

**Implementation:** `src/lib/wishlist-context.tsx`, same `useSyncExternalStore` + `localStorage` pattern as cart (key `"blissynest-wishlist"`).

**Item shape (`WishlistItem`):** `{ slug, name, price, image, rating, reviews }` — notably **includes `rating`/`reviews` snapshotted at add-time**, unlike the cart item, so a wishlist card can render stars without a fresh product lookup.

**Add to wishlist:** `toggleItem(item)` — the heart icon on `ProductCard`, `PdpWishlistButton` (PDP), and the wishlist page itself all call the same toggle; if already present it removes, otherwise adds. There is no separate "add" vs "toggle" API — it's always toggle-based, sourced from `isWishlisted(slug)`.

**Remove from wishlist:** `removeItem(slug)` (used by the dedicated X button on the `/wishlist` page's cards) — functionally identical to calling `toggleItem` on a present item, just skips the "is it present" check.

**Logged-out behaviour:** this is the *only* behaviour that exists — there is no logged-in-vs-guest distinction anywhere (same caveat as Cart, Section 10).

**Logged-in behaviour:** N/A today — see above.

**Persistence:** `localStorage`, survives reload, per-browser only.

**Relationship with products:** referenced purely by `slug` — if a product's slug ever changed (a real risk for bestsellers, per Section 32) a saved wishlist entry would become orphaned from the live product but would still render fine using its own snapshotted `name`/`price`/`image`/`rating`/`reviews` (it just wouldn't link anywhere real — `/product/[stale-slug]` would 404 via `getProductBySlug()` returning `null` → `notFound()`).

**Backend requirement:** a `wishlist_items` table (`userId`, `productId`, `addedAt`), server-persisted, with the same merge-on-login consideration as the cart (Section 10).

---

## 16. GIFT FINDER

Called **"Gifting Assistant"** in this codebase (routes/components/data files all use this name — there is no page or component literally named "Gift Finder"). Two entry points render the *same* underlying logic:
1. **Homepage widget** (`GiftingAssistant.tsx`) — 3 dropdowns + "Find My Gift" button, `router.push`es to `/gifting-assistant?who=&occasion=&budget=`.
2. **The results page itself** (`/gifting-assistant`) — the same 3 dropdowns shown inline at the top, editable in place (no separate "submit" — changing a dropdown re-filters immediately, same UX as every other filter on the site).

**Questions/options** (`src/lib/gifting-assistant-data.ts`):
```ts
whoOptions = ["Her", "Him", "Parents", "Couple", "Friend", "Colleague"]
whoToAudience: Her→her, Him→him, Parents→parents, Couple→couples, Friend→friends, Colleague→colleagues
occasionOptions = ["Birthday", "Anniversary", "Wedding", "Housewarming", "Thank You"]   // note: 5 options — "Just Because" and "Festivals" are NOT included here even though they exist as full occasion pages
budgetOptions = ["Under ₹1,000", "₹1,000–2,000", "₹2,000–5,000", "₹5,000+"]
budgetToRange: maps each budget string to a [min,max] tuple (last one is [5000, Infinity])
```
All 3 fields are optional — any combination (including none selected) is valid and just shows the full/partially-filtered catalogue.

**Recipient / preferences:** not asked — "Who" here means relationship-to-you (maps straight to `audience`), not a separate recipient-persona question (recipient is a different, unrelated filter dimension elsewhere in the app — see Section 9).

**Recommendation logic currently represented:** a **straight attribute match**, nothing more:
```ts
allShopProducts.filter(p =>
  (!audience || p.audience === audience) &&
  (!occasion || p.occasions.includes(occasion)) &&
  (!range || (p.price >= range[0] && p.price <= range[1]))
)
```
No scoring, no ranking beyond whatever `sort` is separately selected (defaults to "Best Selling", which — per Section 9 — is a no-op).

**Result page:** identical toolbar/grid/pagination pattern as every other catalogue page (`ProductCard` grid, `Pagination`, grid/list toggle, sort dropdown).

**Proposed backend recommendation logic (once real data exists):** start with the same filter as a baseline (it's a reasonable MVP), then layer in real signal as it becomes available — purchase history for repeat visitors, co-purchase/collaborative-filtering data, or a simple weighted score (recency + rating + real bestseller flag) instead of "Best Selling" being a no-op.

---

## 17. CORPORATE GIFTING

**Page:** `/corporate` (marketing) → `/corporate/quote` (lead form). No corporate product catalogue exists (Section 5).

**Form fields, exactly as present in `CorporateQuotePageClient.tsx`** (do not assume more than this list):
| Field | Required? | Type |
|---|---|---|
| Full Name | Yes | text |
| Work Email | Yes | email |
| Phone | Yes | tel |
| Company Name | Yes | text |
| Team Size | No | select — `["1–10","11–50","51–200","201–500","500+"]` |
| What are you looking for? | No | select — populated from `corporateNeeds` slugs (employee/client/festive/milestone/welcome/event/custom), pre-filled from `?interest=` query param if present |
| Tell us more (message) | No | textarea, no length limit |

**Not present:** number-of-gifts, delivery-requirements field, customisation-requirements field, budget field (team size is the closest proxy) — do not invent these on the backend without a product decision.

**Two submit buttons, same form:** "Submit Request" and "Download Catalogue" (distinguished via `SubmitEvent.submitter` in the `onSubmit` handler) — both mark the lead as submitted client-side; the second additionally triggers `downloadCatalogue()` (`corporate-catalogue.ts`), which **generates and downloads a real client-side HTML file** (no server involved) tailored to whichever "looking for" category is selected, pulling boilerplate content from `whyChooseUsChecklist` and `needToCollectionSlugs`-matched `curatedCollections`.

**`?intent=consultation`** (from the corporate page's "Book a Consultation" CTA) swaps the page headline/copy/submit-button label only — same form fields, same non-functional submit.

**What should be stored / what endpoint is required:** a `corporate_leads` table (all fields above + `intent: "quote"|"consultation"` + `interestSlug` + `submittedAt`), and a real endpoint (`POST /corporate/leads`) that at minimum emails/CRM-notifies the sales team — this is explicitly called out in the codebase's own `BACKEND_TODO.md` as needing "Real endpoint (email/CRM lead capture)."

---

## 18. REVIEWS & RATINGS

**What exists:** display-only. Every product shows `rating` (1-5) and `reviews` (count) as a number, and the PDP additionally shows a `ReviewsSection` with individual review cards (`{name, rating, date, comment, verified}`).

**Where the data comes from:**
- **3 flagship products** (`birthday-self-care-box`, `personalised-scented-candle`, `scented-soy-candle`) have **hand-written** `reviewsList` arrays (3-4 reviews each, real prose, believable names/dates/verified-flags).
- **Every other product** gets exactly **3 deterministically-generated generic reviews** via `generateGenericReviews()` in `product-mock-data.ts` — a seeded hash of the product's slug picks names/comments/dates from small fixed pools (`genericReviewerNames`, `genericReviewComments`, `genericReviewDates`), so the same product always shows the same fake reviews (not random on every load), but they are still fabricated placeholder content, not real customer data.
- The `rating`/`reviews` **count** numbers themselves (shown everywhere, not just the detail page) are also formula-derived, not real (Section 4).

**What does NOT exist:** **no review submission form anywhere in the codebase.** There is no "Write a Review" button, no star-rating input, no photo-upload-with-review, no moderation queue UI, no "was this helpful" voting. A shopper can only *read* the pre-seeded reviews, never submit their own.

**"Verified purchase" flag:** present as a boolean (`verified: true/false`) on each review and rendered as a small badge, but it is **hand-set/formula-set mock data** — there is no real order-linkage proving anyone verified actually purchased anything.

**Backend implementation needed (entirely new — nothing to migrate):**
- `reviews` table (`productId`, `userId` nullable-if-guest, `rating`, `comment`, `createdAt`, `verifiedPurchase` — computed for real from `OrderItem` history, not a manual flag)
- A real review-submission UI (does not exist in the frontend today — would need to be designed and built, not just wired up)
- Moderation (approve/reject/flag) — needed for an admin panel (Section 29), no equivalent exists today at all
- `product.rating`/`product.reviewCount` should become computed aggregates (`AVG(rating)`, `COUNT(*)`) over real reviews, replacing the formula-generated numbers

---

## 19. INVENTORY

**There is no inventory/stock concept anywhere in this codebase.** No product ever shows "in stock"/"out of stock"/"only 2 left," no `stock` field exists on any product type (Section 4), the Add to Cart button is never disabled for availability reasons, and the cart never checks quantity against any ceiling other than `QuantityStepper`'s hardcoded `max` prop (e.g. `max={20}` on the cart page, an arbitrary UI limit, not a real stock number).

**Backend inventory functionality required (100% new, nothing to adapt from the frontend):**
- `stock` / `stockQuantity` per product (and per-variant, once variants have their own SKUs — currently variants are purely cosmetic selections with no SKU identity at all, Section 5)
- Out-of-stock state: needs a real UI treatment designed (disabled Add to Cart, "Out of Stock" badge on `ProductCard`, PDP messaging) — none of this exists to reference
- Low-stock messaging ("Only 3 left") — same, would be new UI
- Reserved stock (items in someone's cart temporarily holding stock) — a product decision that doesn't exist yet; today carts don't touch stock at all
- Cart-vs-actual-inventory reconciliation at checkout (re-validate stock before allowing "Place Order") — currently `handlePlaceOrder()` has zero validation beyond "is an address selected"
- Order-time deduction — needs to happen atomically with order creation once a real backend exists

---

## 20. PRICING / DISCOUNTS / COUPONS

**Product price:** every product type has a single flat `price: number` field (₹, integer, no decimals used anywhere in mock data). No currency field exists — ₹/`en-IN` locale formatting (`toLocaleString("en-IN")`) is hardcoded throughout, not configurable.

**Sale price / compare-at price:** **does not exist.** No product anywhere shows a struck-through original price — there is no "was ₹X, now ₹Y" UI pattern in this codebase at all.

**Coupon:** exactly 2 hardcoded codes (Section 11) — `WELCOME10` (10% off, no minimum) and `FLAT200` (₹200 off, ₹1,500 minimum). Case-insensitive matching (`code.toUpperCase()`). No usage limits, no per-user restriction, no expiry date, no stacking rules (only one coupon can be applied at a time — applying a second replaces the first via `setAppliedCoupon`).

**Discount:** synonymous with "coupon" here — there is no other discount mechanism (no automatic volume discounts, no first-order discount beyond the `WELCOME10` code itself, no loyalty-points redemption).

**Free shipping:** threshold `₹999`, hardcoded in **two separate places** (`FREE_SHIPPING_THRESHOLD` in `checkout-data.ts`, and a locally-redeclared `const FREE_SHIPPING_THRESHOLD = 999` inside `CartPageClient.tsx` — these are not imported from one shared source, a real duplication worth fixing when this becomes backend-driven).

**Taxes:** **not computed or displayed anywhere** (Section 11) — a genuine total gap, not a hidden/rolled-in calculation.

**Minimum order value:** the only place this concept appears is the `FLAT200` coupon's own ₹1,500 minimum — there is no site-wide minimum-order-value gate.

**Corporate pricing:** does not exist — no corporate product catalogue means no corporate pricing tier either (Section 17).

**Pricing logic currently hardcoded in the frontend (flag all of these for backend migration):**
- Free shipping threshold (₹999, duplicated in 2 files)
- Standard shipping fee (₹99 flat)
- The 2 coupon codes and their math
- Hamper personalisation add-on price (₹199, on the one hamper product that has one)
- All base product prices (in the mock data files themselves)

---

## 21. SHIPPING

**Delivery address:** collected at checkout (Section 11) — full Indian address shape (`label, name, line1, line2?, city, state, pincode, phone`), no country field (India-only is assumed throughout, not configurable).

**Pincode:** collected twice, independently, for two different purposes that are **not connected to each other**:
1. `DeliveryCheck.tsx` (on every PDP) — a standalone "check delivery date" widget, just a pincode input, validates it's exactly 6 digits, then fabricates an estimate: `3 + (lastDigit % 3)` days out. Completely disconnected from checkout/cart/address.
2. The checkout address form's `pincode` field — used only as address data, never itself used to compute a delivery estimate at checkout (the checkout flow doesn't show a delivery estimate on the address step at all — only the *order confirmation* screen shows one, and that one uses a flat "+5 days from today," unrelated to the address's actual pincode).

**Delivery estimate:** two different fake formulas exist (see above) that never agree with each other and are never validated against real courier data. `/track-order`'s mock tracking uses yet a **third** formula (`+2 days from today`, shown only if the tracked order isn't yet at the final status).

**Shipping fee:** flat ₹99, or free above ₹999 (Section 20) — not pincode-dependent, not weight-dependent.

**Free shipping threshold:** ₹999 (Section 20).

**Delivery status:** only exists on `/track-order` as a mock 4-step timeline (Order Placed → Packed → Shipped → Delivered), deterministically derived from a hash of the order number typed in — not connected to any real order.

**India-specific requirements:** state/city/pincode fields assume India; no international address support exists (no country selector, no international pincode/postal-code format handling).

**What should eventually be handled by backend APIs:**
- A single, real pincode-serviceability check (replacing the 2-3 disconnected fake versions above) — likely a courier-partner API (Delhivery/Shiprocket/etc. are common for Indian e-commerce)
- Real shipping-fee calculation (by weight/distance/carrier, if that's a business requirement — nothing in the frontend implies more than a flat fee today, so a flat fee may genuinely be an acceptable v1)
- Real order tracking (replacing `/track-order`'s hash-based mock) — presumably a webhook or polling integration with whichever courier is used

---

## 22. DATABASE DESIGN RECOMMENDATION

Normalized schema derived from everything documented above. Types are illustrative (Postgres-flavored); adjust to your actual DB choice.

**Users**
| Field | Type | Notes |
|---|---|---|
| id | uuid, PK | |
| name | text | |
| email | text, unique | |
| phone | text, nullable | |
| passwordHash | text, nullable | null if OAuth-only |
| googleId | text, nullable, unique | |
| createdAt | timestamptz | drives "Member since" |
| updatedAt | timestamptz | |

**Products**
| Field | Type | Notes |
|---|---|---|
| id | uuid, PK | |
| slug | text, unique, indexed | stable — never derived from name at read time (fixes the bestseller-slug risk, Section 32) |
| name | text | |
| tagline | text, nullable | |
| description | text | |
| price | integer | ₹, no decimals, matching existing convention |
| compareAtPrice | integer, nullable | new field, not in frontend today |
| pdpType | enum("hamper","customisable","standalone") | |
| breadcrumbCategory | text | |
| audienceId | FK → Audiences, nullable | null for collection-only products |
| categoryId | FK → Categories | |
| rating | numeric, computed | aggregate from Reviews once real |
| reviewCount | integer, computed | |
| stock | integer | new field |
| isBestseller | boolean | new, real-data-derived |
| isNew | boolean | new, derived from `createdAt` |
| status | enum("draft","published","archived") | for admin panel |
| createdAt / updatedAt | timestamptz | |

**ProductImages** (`productId FK, url, sortOrder`) — replaces the current `images: string[]` array field.

**ProductVariants** (`id, productId FK, label, options: jsonb, sku, priceDelta, stock`) — normalizes both the customisable type's single `variantLabel/variantOptions` and the standalone type's multi-dimension `variants[]` into one shape.

**PersonalisationOptions** (`id, productId FK, lineLabel, required, maxLength, placeholder, sortOrder`) + **PersonalisationFonts**/**PersonalisationColors** (or a simpler `jsonb` config column if these truly never need per-product admin editing beyond the current fixed lists).

**Categories** (`id, slug, label, catalogueScope` — since categories are currently namespaced differently per shop vs. each collection; decide whether to normalize or keep scoped).

**Collections** (`id, slug, title, subtitle, bg/fg or a real banner image, dark: boolean`).

**ProductCollections** (`productId FK, collectionId FK`) — many-to-many.

**Occasions** (`id, slug, label, title, subtitle, icon`).

**ProductOccasions** (`productId FK, occasionId FK`) — many-to-many.

**Audiences** (`id, slug, label`) — her/him/parents/couples/friends/colleagues.

**Recipients** (`id, audienceId FK, label`) — per-audience recipient tags.

**ProductRecipients** (`productId FK, recipientId FK`) — many-to-many.

**Cart** (`id, userId FK nullable, sessionId text nullable` — supports guest carts) / **CartItems** (`id, cartId FK, productId FK, variantId FK nullable, quantity, personalisation: jsonb nullable, addedAt`).

**Addresses** (`id, userId FK, label, name, line1, line2, city, state, pincode, phone, isDefault: boolean`).

**Orders** / **OrderItems** — as designed in Section 12.

**Payments** (`id, orderId FK, gateway, gatewayTransactionId, amount, status, rawResponse: jsonb, createdAt`).

**Coupons** (`id, code unique, type enum("percent","flat"), value, minOrderValue nullable, usageLimit nullable, perUserLimit nullable, expiresAt nullable, active: boolean`).

**Wishlist** (`id, userId FK`) / **WishlistItems** (`wishlistId FK, productId FK, addedAt`).

**Reviews** (`id, productId FK, userId FK nullable, rating, comment, verifiedPurchase: boolean computed, status enum("pending","approved","rejected"), createdAt`).

**CorporateLeads** (`id, name, email, phone, companyName, teamSize nullable, interestSlug nullable, intent enum("quote","consultation"), message nullable, downloadedCatalogue: boolean, submittedAt`).

**GiftingAssistantOptions** — likely just application config (who/occasion/budget option lists + their mapping to audience/price-range), not necessarily a DB table unless it needs admin editing.

**Suggested indexes:** `products.slug` (unique), `products(audienceId, categoryId)`, `product_occasions(productId, occasionId)` composite, `orders.userId`, `orders.orderNumber` (unique), `cart_items(cartId)`, `wishlist_items(wishlistId, productId)` unique composite, `coupons.code` (unique).

---

## 23. API SPECIFICATION

Proposed, adapted to what the frontend actually needs — not a generic template.

### AUTH
| Method | Route | Purpose | Auth? |
|---|---|---|---|
| POST | `/api/auth/email` | Start email sign-in (magic link or password — decision needed, Section 32) | No |
| POST | `/api/auth/google` | Google OAuth callback/exchange | No |
| POST | `/api/auth/logout` | Clear session | Yes |
| GET | `/api/auth/me` | Current session's user (drives `/account`'s real data once auth exists) | Yes |

### PRODUCTS
| Method | Route | Purpose |
|---|---|---|
| GET | `/api/products` | List/filter/sort/paginate — query params: `audience, category, occasion, recipient, collection, priceMin, priceMax, sort, page, pageSize` |
| GET | `/api/products/:slug` | Full PDP detail (all `ProductDetail` fields) |
| GET | `/api/products/:slug/related` | "You may also like" |
| GET | `/api/collections/:slug` | Collection detail + its products + its filter config (categories/attribute/occasions) |
| GET | `/api/occasions/:slug` | Occasion detail + filtered products + curated pill config |
| GET | `/api/search?q=` | Search results (replaces client-side substring scan) |

### CART
| Method | Route | Purpose | Auth? |
|---|---|---|---|
| GET | `/api/cart` | Current cart (session- or user-scoped) | Optional |
| POST | `/api/cart/items` | Add item — body: `{productId, variantId?, quantity, personalisation?}` | Optional |
| PATCH | `/api/cart/items/:id` | Update quantity | Optional |
| DELETE | `/api/cart/items/:id` | Remove item | Optional |

### WISHLIST
| Method | Route | Purpose | Auth? |
|---|---|---|---|
| GET | `/api/wishlist` | Current user's wishlist | Yes |
| POST | `/api/wishlist/items` | Add — `{productId}` | Yes |
| DELETE | `/api/wishlist/items/:productId` | Remove | Yes |

### CHECKOUT / ORDERS
| Method | Route | Purpose | Auth? |
|---|---|---|---|
| GET | `/api/addresses` | User's saved addresses | Yes |
| POST | `/api/addresses` | Add address | Yes |
| PATCH | `/api/addresses/:id` | Edit | Yes |
| DELETE | `/api/addresses/:id` | Delete | Yes |
| POST | `/api/coupons/validate` | `{code, subtotal}` → discount amount or error | Optional |
| POST | `/api/orders` | Place order — server recomputes total, never trusts client price | Optional (guest checkout decision) |
| GET | `/api/orders` | Current user's order history (drives Account "Orders" tab) | Yes |
| GET | `/api/orders/:id` | Single order detail | Yes, own-orders-only |
| GET | `/api/orders/track?orderNumber=&email=` | Public order tracking (replaces `/track-order`'s mock) | No |

### CORPORATE
| Method | Route | Purpose |
|---|---|---|
| POST | `/api/corporate/leads` | Submit quote/consultation request |

### REVIEWS (net-new, no frontend to reference)
| Method | Route | Purpose | Auth? |
|---|---|---|---|
| GET | `/api/products/:slug/reviews` | List reviews | No |
| POST | `/api/products/:slug/reviews` | Submit a review | Yes |

For every endpoint above: standard REST conventions — 200/201 success, 400 validation errors with field-level messages, 401 unauthenticated, 403 forbidden (e.g. accessing another user's order), 404 not found, 409 for conflicts (e.g. coupon already used). Request/response bodies should mirror the TypeScript shapes already documented in Sections 4, 6, 10, 11, 12, 15, 17.

---

## 24. FRONTEND → BACKEND DATA CONTRACT

| Frontend component | API required | Request | Backend logic | Response | Frontend state update |
|---|---|---|---|---|---|
| `AudienceShopPageClient` / `ShopPageClient` / etc. | `GET /api/products` | Query params (Section 9) | Filter/sort/paginate real catalogue | `{items: ShopProduct[], total, page, pageSize}` | Replace `sortedProducts`/`pageProducts` `useMemo` derivations with fetched data |
| `ProductPageClient` → `Hamper/Customisable/StandalonePDP` | `GET /api/products/:slug` | slug from route params | Fetch full `ProductDetail` shape | Full product + reviews + related | Replace `getProductBySlug()` local lookup |
| `CustomisablePDP.handleAddToCart` | `POST /api/cart/items` | `{productId, quantity, personalisation: {textLines, font, colorHex, variant}}` | Validate required fields server-side, compute price | Updated cart | Replace local `addItem()` call, keep the same "Added ✓" UX |
| `CartPageClient` | `GET /api/cart`, `PATCH/DELETE /api/cart/items/:id` | — | Return live-priced cart | Cart with current server-truth prices | Replace `useCart()` localStorage read |
| `AddressStep` (checkout) | `GET/POST/PATCH/DELETE /api/addresses` | Address fields (Section 11) | Persist per user | Address list | Replace local `useState` seeded from `seedAddresses` |
| `OrderSummarySidebar.handleApplyCoupon` | `POST /api/coupons/validate` | `{code, subtotal}` | Real validation (expiry/usage/minimum) | `{discount}` or `{error}` | Replace `calculateDiscount()` local call |
| `CheckoutPageClient.handlePlaceOrder` | `POST /api/orders` | Address id, payment method, coupon code, cart snapshot | Recompute total server-side, create Order+OrderItems, clear server cart | `{orderNumber, total, estimatedDelivery}` | Replace `generateOrderNumber()`/local total with server response |
| `AccountPageClient` → `OrdersSection` | `GET /api/orders` | — | Real user's order history | `AccountOrder[]`-shaped list | Replace hardcoded `accountOrders` |
| `AccountPageClient` → `AddressesSection` | Same as checkout's address endpoints | — | Shared table, not duplicated | — | Replace local `useState` seeded from `accountAddresses` |
| `AccountPageClient` → `ProfileSection` | `PATCH /api/auth/me` | `{name, email, phone}` | Update user row | Updated user | Replace local `useState`, make "Saved" real |
| `WishlistPageClient` / `ProductCard` heart / `PdpWishlistButton` | `GET/POST/DELETE /api/wishlist(/items)` | `{productId}` | Persist per user | Updated wishlist | Replace `useWishlist()` localStorage read |
| `TrackOrderClient` | `GET /api/orders/track` | `{orderNumber, email}` | Real lookup, not a hash | Real status timeline | Replace `hashString()`-derived mock |
| `CorporateQuotePageClient` | `POST /api/corporate/leads` | All form fields (Section 17) | Store + notify sales | `{success}` | Replace stub `setSubmitted(true)` |
| `ContactPageClient` | `POST /api/contact` (not listed above — trivial, add if needed) | Name/Email/Subject/Message | Email/CRM | `{success}` | Replace stub `setSubmitted(true)` |
| `ReviewsSection` (once a submit form is built) | `GET/POST /api/products/:slug/reviews` | `{rating, comment}` | Store, moderate | Review list | Net-new UI + state, doesn't exist yet |

---

## 25. CURRENT MOCK DATA

Every hardcoded/static data source in the codebase, verified by inspection:

| File | Contains | Used by | Should be replaced by | API to eventually provide it |
|---|---|---|---|---|
| `src/lib/shop-mock-data.ts` | `shopCategories`, `shopOccasions`, `audienceSlugs`, `productSeedsByAudience` (the actual 336 products, procedurally generated per audience×category), `recipientsByAudience`, `shopProductsByAudience`, `allShopProducts`, `audienceShopContent` | `/shop`, `/shop/[audience]`, `/personalised`, `/occasions/[occasion]`, `/gifting-assistant`, `/search`, `Header` nav dropdowns, `MobileNav` | `products` table + `Audiences`/`Categories`/`Recipients` | `GET /api/products` |
| `src/lib/collection-mock-data.ts` | `collectionSlugs`, per-collection `definitions` (5 Edits × their own categories/attribute filter/products, ~110 products) | `/collections`, `/collections/[collection]` | `products` + `Collections` + `ProductCollections` | `GET /api/collections/:slug` |
| `src/lib/occasion-data.ts` | `occasionSlugs`, `occasionContent`, `occasionPills` (curated per-occasion quick filters), `recipientPillGroups`, `audiencePillIcons` | `/occasions`, `/occasions/[occasion]`, `Header`/`MobileNav` | `Occasions` + `ProductOccasions` (pills likely stay app-config) | `GET /api/occasions/:slug` |
| `src/lib/product-mock-data.ts` | `flagshipProducts` (the 3 hand-authored full PDP records), `getProductBySlug()`'s **fallback generators** (`fallbackFromShopProduct`/`fallbackFromCollectionProduct`/`fallbackFromBestseller` — synthesize a plausible `StandaloneProduct` for any of the other ~447 products), `getRelatedProducts()`, `generateGenericReviews()` | `/product/[slug]` | `products` + `ProductImages` + real per-product copy (not generated fallback text) | `GET /api/products/:slug` |
| `src/lib/mock-data.ts` | `audienceCategories` (homepage cards), `occasions` (homepage cards — separate from `occasion-data.ts`'s richer version, just label/bg/fg/image/slug), `editCollections` (homepage cards), `bestsellers` (5 hardcoded "Loved by many" products — **no stable id/slug**, see Section 32), `corporateChecklist`, `featureStrip`, `communityPhotos`, `footerLinks`, `heroImage` | Homepage sections, `Footer`/`ShopFooter` | Mostly becomes "featured content" curation (a `Featured`/`Homepage` config) rather than raw product data | Homepage content endpoint, or app-level config |
| `src/lib/corporate-data.ts` | `heroTrustPoints`, `corporateNeeds`, `processSteps`, `whyChooseUsChecklist`, `testimonials`, `trustedByCompanies` (invented company names, explicitly not real endorsements), `curatedCollections`, `needToCollectionSlugs` | `/corporate`, `/corporate/quote` | Marketing content — likely stays as CMS-editable content, not core e-commerce data | CMS or app config |
| `src/lib/corporate-catalogue.ts` | Client-side HTML-catalogue generator (`generateCatalogueHtml`, `downloadCatalogue`) | `/corporate/quote`'s "Download Catalogue" button | A real per-category PDF/catalogue asset | Static asset or generated-on-demand endpoint |
| `src/lib/gifting-assistant-data.ts` | `whoOptions`/`whoToAudience`, `occasionOptions`, `budgetOptions`/`budgetToRange` | `/gifting-assistant`, homepage widget | App config (small, unlikely to need a DB table) | — |
| `src/lib/search-data.ts` | `searchIndex` (deduped ~450-item array built at module load from shop+collection+bestseller sources), `searchProducts()` | `SearchOverlay`, `/search` | Real search backend | `GET /api/search` |
| `src/lib/checkout-data.ts` | `seedAddresses` (1 address), `paymentMethods` (4 methods), `coupons` (2 codes), `calculateDiscount()`, `generateOrderNumber()`, shipping constants | `/checkout` | `Addresses`, `Coupons` tables; payment methods likely stay app config (gateway-provided) | Section 23's checkout/order endpoints |
| `src/lib/seasonal-banner-data.ts` | `seasonalSlides` (3 hand-curated homepage promo slides) | Homepage `SeasonalBanner` | An admin-editable campaign-schedule concept (start/end dates, auto-expiring) — currently hand-edited in code with no CMS at all | Homepage content endpoint |
| `src/lib/account-data.ts` | `accountUser` (1 hardcoded demo user), `accountOrders` (4 hardcoded orders), `accountAddresses` (2 hardcoded addresses) | `/account` dashboard | Real per-user `Orders`/`Addresses`/`Users` data | `/api/auth/me`, `/api/orders`, `/api/addresses` |

**The `ph()` placeholder-image pattern:** repeated (not shared) across `mock-data.ts`, `shop-mock-data.ts`, `collection-mock-data.ts`, `product-mock-data.ts`, `corporate-data.ts` — each file has its own near-identical `ph(w,h,bg,fg,text)` function generating a `placehold.co` URL. **Every single product image in the entire site is a generated placeholder** — there is zero real product photography anywhere. `next.config.ts` has `images.remotePatterns` allowlisting `placehold.co` specifically for this reason.

---

## 26. ENVIRONMENT VARIABLES

**Currently existing:** **none.** There is no `.env`, `.env.local`, or `.env.example` file anywhere in the repository, and no `process.env.*` reference in application code except one dev-time invariant check in `occasion-data.ts` (`if (process.env.NODE_ENV !== "production")` — a build-time sanity assertion, not a config value).

**Backend variables that will eventually be required** (names only — no actual secrets exist to expose, since nothing is configured yet):
```
DATABASE_URL
NEXTAUTH_SECRET (or equivalent, depending on auth library choice — see Section 32)
GOOGLE_CLIENT_ID
GOOGLE_CLIENT_SECRET
OTP_PROVIDER_API_KEY               (only if OTP is the chosen auth method — see Section 32, undecided)
RAZORPAY_KEY_ID / RAZORPAY_KEY_SECRET   (or whichever gateway is chosen — see Section 27)
IMAGE_STORAGE_* (e.g. CLOUDINARY_URL, or S3/R2 credentials — see Section 27)
EMAIL_PROVIDER_API_KEY             (transactional email — order confirmations, corporate lead notifications, contact form)
SMS_PROVIDER_API_KEY               (only if OTP-via-SMS is chosen)
NEXT_PUBLIC_SITE_URL                (for absolute URLs in emails, share links, etc. — share buttons currently use `window.location` client-side, no env var needed today but will be for server-rendered emails)
```

---

## 27. THIRD-PARTY SERVICES

**Existing integrations:** effectively none. The only "external" URLs referenced anywhere are:
- `placehold.co` — placeholder image generation (Section 25/26), allowlisted in `next.config.ts`
- Google Fonts (`Playfair Display`, `Work Sans`) — loaded via `next/font/google` in `layout.tsx`, a build-time/self-hosted font optimization, not a runtime third-party call
- `wa.me`/Facebook sharer/`mailto:` — the PDP's `ShareIconButton` opens real share URLs and uses the real Clipboard API for "Copy Link" — this is genuinely functional and needs no backend

**Recommended backend integrations (net-new, per prior sections):**
| Purpose | Where it's needed | Notes |
|---|---|---|
| Authentication | Section 13 | Auth.js/NextAuth v5 (JWT), or a managed provider — see Section 32, this is an open decision |
| OTP | Section 13 | Only if OTP is chosen as the login method — undecided |
| Payments | Section 11 | Razorpay is the natural default for an India-priced ₹ site |
| Email | Contact form, corporate leads, order confirmations, newsletter | Transactional email provider (e.g. Resend/SendGrid/SES) |
| SMS | Only if OTP-via-SMS | — |
| Image storage | Real product photography, once it exists | Cloudinary (does resizing/CDN) or S3/R2 + `next/image` |
| Shipping | Section 21 | A courier-aggregator API (Delhivery/Shiprocket, etc.) for real serviceability/tracking |
| Analytics | Not present at all today | Any standard web analytics — no tracking pixel/script exists in the codebase currently |

---

## 28. SECURITY REQUIREMENTS

None of this is implemented today (there is no backend) — this is a requirements list for whoever builds it, grounded in what the frontend currently trusts blindly:

- **Authentication:** real session/token verification on every authenticated endpoint (Section 23) — nothing today gates `/account`'s data by identity at all.
- **Authorization:** users must only be able to read/modify their own orders/addresses/wishlist (`GET /api/orders/:id` etc. must check ownership, not just "is authenticated").
- **OTP protection:** if OTP is chosen — expiry (e.g. 5-10 min), single-use, rate-limited generation/verification attempts, no OTP ever returned in an API response body (only sent via the real channel).
- **Rate limiting:** especially on auth endpoints, coupon-validation (Section 30), and the corporate/contact form submits (currently trivially spammable client-side stubs with no server to rate-limit them yet).
- **Input validation:** server-side re-validation of everything the frontend only checks client-side today — text-line `maxLength`/`required` on personalisation (Section 6), email/phone format, pincode format, coupon code format.
- **Payment security:** never handle raw card data (the frontend's own explicit design principle, Section 11) — use the gateway's hosted/redirect flow; verify payment status via webhook, not a client-reported "success."
- **Coupon abuse prevention:** per-user usage limits, expiry enforcement — none of the current 2 hardcoded codes have any limit today.
- **Inventory protection:** re-check stock at order-placement time, not just at add-to-cart time (classic race condition between two users buying the last unit).
- **Admin authorization:** a distinct, more privileged role — no admin concept exists in the frontend at all today (Section 29).
- **Personalisation input sanitization:** free-text customisation lines (Section 6) are printed "exactly as entered" per the product copy itself — must be sanitized against injection if ever rendered as HTML/used in generated files (e.g. if a personalised-order packing slip is ever auto-generated server-side).
- **File upload security:** N/A today — no upload UI exists anywhere (Section 6's note on no photo-upload personalisation) — becomes relevant only if that feature is added later, or for an admin product-image-upload flow (Section 29).
- **CORS:** standard same-origin API design; only relevant if the API is ever split onto a different domain from the frontend.
- **Secrets management:** none exist to manage today (Section 26) — standard `.env` + secret-manager discipline once they do.

---

## 29. ADMIN PANEL REQUIREMENTS

**No admin UI exists anywhere in this codebase today.** Everything below is derived purely from what the *storefront* frontend implies an admin would need to manage — there is nothing to adapt, only to design fresh.

- **Products:** CRUD across all 3 `pdpType`s, including images (multi-image gallery), variants, personalisation config (text lines/fonts/colors), benefits list, "what's inside" list (hampers), spec sheet (customisable), related-products picker, stock, price/compareAtPrice, status (draft/published).
- **Categories:** manage the shop's 7 categories and each collection's own independent category set (Section 7 — these are not unified today, an admin panel needs to decide whether to unify them).
- **Collections:** manage the 5 Edits (or add more) — title/subtitle/banner/categories/attribute-filter config/which products belong.
- **Occasions:** manage the 7 occasions, and per-occasion curated pill config (Section 8) — this is genuinely editorial curation today, would need a real UI to edit without redeploying code.
- **Inventory:** stock levels per product/variant, low-stock alerts.
- **Orders:** view/search all orders, update status (Section 12's status enums), issue refunds, view payment/fulfillment status.
- **Customers:** view user accounts, their order history, basic support actions (not present in frontend at all — net new).
- **Coupons:** create/edit the currently-hardcoded coupon concept (Section 20) — code, type, value, minimum, usage limits, expiry.
- **Reviews:** moderation queue (approve/reject) — net new, since no submission flow exists yet either (Section 18).
- **Corporate enquiries:** view submitted leads (Section 17), mark as contacted/converted.
- **Gift Finder configuration:** edit the who/occasion/budget option lists and their mappings (Section 16) without redeploying.
- **Personalisation options:** edit per-product text-line configs, font/color lists (currently hardcoded per-component, Section 6) — an admin panel needs these to be data-driven, not code.
- **Homepage/seasonal content:** the `SeasonalBanner` slides (Section 25) are explicitly hand-edited in code today ("no CMS behind this") — a real admin panel would want to make this editable, likely with the start/end-date scheduling noted in `BACKEND_TODO.md`.

---

## 30. BUSINESS RULES

Rules the backend must enforce, regardless of what the frontend currently does or doesn't check:

- **Prices must never be trusted from the frontend.** The cart/checkout UI today sends whatever price it locally cached at add-to-cart time (Section 10) — the backend must always recompute from the live product record.
- **Product availability must be validated server-side** before both add-to-cart and order placement — today nothing checks this at all (Section 19).
- **Coupon validity must be checked server-side** — code existence, expiry, minimum order value, usage limits — the frontend's 2-hardcoded-codes check (Section 20) is illustrative only, not a security boundary.
- **Personalisation limits must be validated server-side** — required fields and character limits are only HTML-attribute-enforced today (Section 6), trivially bypassable.
- **Order totals must be calculated server-side**, including tax (which doesn't exist client-side at all today, Section 20) — never accept a client-submitted total.
- **Inventory must be checked and decremented atomically** before order confirmation (Section 19/28) — a real gap today, since there's no inventory concept whatsoever.
- **Users cannot access another user's orders/addresses/wishlist** — ownership checks on every authenticated read/write (Section 28).
- **OTPs must expire and be single-use**, if OTP is the chosen auth method (undecided, Section 32).
- **Order numbers must be guaranteed-unique**, generated server-side — the current `generateOrderNumber()` (timestamp + 4 random digits, Section 11) has no uniqueness guarantee and must not be reused as-is for a real system without at least a DB-level unique constraint and collision retry.
- **Guest checkout policy must be decided** (Section 32) — nothing today prevents checkout without "being logged in," since there is no real login gate at all; this needs to be an explicit product decision, not an accident of the mock's absence of auth.
- **Personalisation text must be sanitized** before being used anywhere beyond direct display (Section 28) — the product copy's own promise ("printed exactly as entered") means this text may end up in generated fulfillment documents eventually.

---

## 31. FRONTEND GAPS / BACKEND DEPENDENCIES

States and behaviors the frontend does not currently handle, which will become necessary once a real backend exists. **Per the task brief, none of these have been implemented — this is a list for future work, not a description of anything already built.**

- **Loading states:** no page anywhere shows a loading skeleton/spinner — every catalogue page currently renders synchronously from an in-memory array. Once data comes from a real async API, every one of the catalogue pages (`/shop*`, `/occasions/[occasion]`, `/collections/[collection]`, `/personalised`, `/gifting-assistant`, `/search`, `/product/[slug]`) will need a loading state designed.
- **Error states:** no page handles a failed data fetch (there's nothing to fail today). Needs designing for every API-backed page above, plus form submissions (checkout, corporate quote, contact, auth).
- **Empty states:** these mostly *do* exist already and are well-built — cart (`EmptyCart`), wishlist (`EmptyWishlist`), search ("No results for..."), catalogue filters ("No products match your filters"), account orders (`OrdersSection`'s empty branch), account wishlist tab. These patterns should be reused/extended for new empty states (e.g. "no orders yet" on a real, freshly-registered account — the mock always shows 4 orders, so this exact empty state hasn't actually been exercised against real conditions).
- **Authentication states:** nothing distinguishes a logged-in vs logged-out visitor anywhere in the UI today (Section 13/14) — every page renders as if no one is ever logged in, except `/account`, which renders as if the *same* one demo person always is. Real auth will need: logged-out nav treatment, a proper redirect-to-login-then-back flow for protected pages (none exists), and session-expiry handling.
- **Out-of-stock states:** don't exist at all (Section 19) — need full design (PDP, `ProductCard`, cart-line, checkout re-validation messaging).
- **Payment failure states:** don't exist — there's no real payment attempt to fail today (Section 11). The confirmation screen currently only has a "success" path.
- **Order failure states:** same — `handlePlaceOrder()` has no failure branch at all today.
- **API failure handling generally:** no `try/catch` pattern exists anywhere in the app for a network call, because there are currently no network calls to the app's own backend at all (the only real network calls are the client-side share URLs and Clipboard API, Section 27).
- **Stale cart-price handling:** if a product's price changes after being added to cart (Section 10), nothing today detects or messages this — worth deciding whether checkout should re-validate and surface a "price changed" notice.
- **Session/cart merge on login:** guest `localStorage` cart/wishlist vs. a newly-authenticated user's server-side cart/wishlist — no merge logic exists (there's no login to merge on today).

---

## 32. ASSUMPTIONS & OPEN QUESTIONS

Every decision below **cannot** be determined from the existing code and must be made explicitly before backend implementation — none of it has been silently assumed in this document.

| # | What's unknown | Why it matters | Recommended default | Decision needed from |
|---|---|---|---|---|
| 1 | **Auth method: password, magic-link, or OTP?** The frontend's `AccountAuthModal` only has an email field + Google — no OTP or password field exists on the primary path at all. The task brief assumed an OTP flow exists; it does not. | Determines the entire auth backend shape, SMS/email provider choice, and whether a phone-number field needs to be *added* to the frontend first. | Given the existing UI is email-first, a **magic-link (passwordless email)** flow is the closest match to what's already built and requires the least new frontend work. OTP would require adding a phone-number input and OTP-entry screen that don't exist today. | Product owner |
| 2 | **Guest checkout: allowed or not?** Nothing in the frontend gates checkout behind login — you can complete the entire cart→checkout→confirmation flow today without ever opening the auth modal. | Determines whether `Order.userId` is required or nullable, and whether login is ever forced before "Place Order." | Allow guest checkout (matches current frontend behavior exactly), with an optional "create an account" prompt post-purchase. | Product owner |
| 3 | **Should personalisation actually affect price?** Nothing in the current pricing logic changes price based on typed text/font/color (only the one hamper add-on note does, flatly). | Determines whether `PersonalisationOptions` needs a `priceDelta` field. | No price change for text/font/color; keep add-on-style pricing (like the existing hamper note) for anything that should cost extra. | Product owner |
| 4 | **Bestseller product identity is unstable.** `bestsellers` (`mock-data.ts`) has no stored `id`/`slug` — it's computed via `slugify(name)` at link-time everywhere it's referenced (search index, PDP fallback, wishlist links). Renaming a bestseller product would silently break every existing link/wishlist-entry/cart-entry referencing it. | A real backend must give every product a stable, immutable identifier independent of its display name before this becomes a live data-integrity bug. | Assign real UUIDs as part of the products-table migration; never derive product identity from name again. | Backend implementer (no product decision needed, just don't repeat the pattern) |
| 5 | **Which products get real customisation?** Only 1 product (`personalised-scented-candle`) has a real `pdpType: "customisable"` PDP; the other 47 products tagged `category: "personalised"` render as generated `StandalonePDP`s with **no customisation UI at all**, despite being marketed as "Personalised." | This is a real content/product gap, not just a backend one — customers browsing `/personalised` mostly can't actually personalise what they're looking at today. | Flag for content/product team, not purely backend — likely needs real PDP authoring for the other 47, or a decision to make `CustomisablePDP` the default layout whenever `category === "personalised"`. | Product/content owner |
| 6 | **What does "Best Selling" sort mean once real data exists?** Currently a no-op (Section 9) — there's no purchase-count field anywhere. | Determines whether `Orders`/`OrderItems` need a materialized "times purchased" aggregate, and how often it refreshes. | Compute from real `OrderItem` counts, refreshed periodically (not necessarily real-time). | Backend implementer, informed by whatever's cheapest to maintain |
| 7 | **Tax (GST) handling is completely unaddressed** in the entire frontend (Section 20) despite "Inclusive of all taxes" copy appearing on every PDP. | A real Indian e-commerce checkout legally needs correct GST computation/display. | Needs real tax logic (HSN-code-based GST rates) designed from scratch — nothing in the frontend to reference or preserve. | Product owner / finance, likely with legal input |
| 8 | **Should the two currently-separate "Address" concepts (checkout's session-only addresses vs. the Account dashboard's separately-mocked addresses) become one shared table?** They use the same `Address` type today but are two independent, non-syncing pieces of local state in the frontend. | Determines whether `/checkout` and `/account`'s Addresses tab should read/write the same backend resource (almost certainly yes) or intentionally stay separate. | Unify into one `Addresses` table per user, referenced from both surfaces. | Backend implementer (low-risk default, but confirm with product) |
| 9 | **Payment gateway choice.** Nothing in the frontend implies a specific gateway — it's method-agnostic by design (Card/UPI/NetBanking/COD are just labeled options, Section 11). | Determines SDK, webhook shape, and settlement/refund flow. | Razorpay (common default for India-priced ₹ sites), per earlier conversation with the user about this project. | Product owner |
| 10 | **Is a corporate product catalogue actually wanted**, or does corporate gifting stay purely lead-gen forever (as it is today)? | Determines whether Section 5's "no corporate product type" stays permanently true or needs building. | Keep as lead-gen only unless a specific business need for self-serve bulk ordering emerges. | Product owner |
| 11 | **Review submission: star-only, or with photo upload?** No submission UI exists at all today to infer from (Section 18). | Determines schema (`Reviews.imageUrls`?) and whether Section 28's file-upload security section applies immediately or can be deferred. | Start star + text only (matches the display-only pattern already in place); add photo upload later if wanted. | Product owner |
| 12 | **Multi-currency / international shipping** — is this ever needed, or is India-only (₹, Indian addresses) a permanent constraint? | Affects `Address`, `Order.total`, and shipping-integration scope significantly. | Assume India-only for v1 (matches 100% of current frontend assumptions — no currency selector, no country field exists anywhere). | Product owner |

---

## 33. BACKEND IMPLEMENTATION ROADMAP

Sequenced by dependency, informed by everything above (auth gates most other real-user-data features; products must exist before cart/wishlist/orders can reference them meaningfully).

**Phase 1 — Database & core schema**
Set up Postgres + ORM (Prisma, per prior conversation with the user about matching their other project's stack). Implement `Users`, `Products` (+ Images/Variants/PersonalisationOptions), `Categories`, `Collections`, `Occasions`, `Audiences`, `Recipients` and their join tables (Section 22). Migrate the existing mock data into real rows as seed data — this is a mechanical but important step since the mock data files already have realistic shape/volume to seed from.

**Phase 2 — Authentication**
Resolve Open Question #1 (auth method), then implement sign-up/login, session handling, Google OAuth (the frontend already has the button). Wire `AccountAuthModal` and `/account`'s sign-in form to real endpoints, replacing the "not available in this demo" messaging.

**Phase 3 — Product APIs**
`GET /api/products` (with full filter/sort/paginate), `GET /api/products/:slug`, `GET /api/collections/:slug`, `GET /api/occasions/:slug`. Migrate every catalogue page (Section 2's full list) off its direct `lib/*.ts` import onto these endpoints, preserving the exact filter/sort/pagination UX already built (Section 9).

**Phase 4 — Cart**
Server-persisted cart, resolving Section 6's personalisation-data gap and Section 5's lost-variant gap as part of this work (touch `CartItem` type + every PDP's `handleAddToCart`/`handleBuyNow`). Guest-cart-to-user-cart merge on login.

**Phase 5 — Checkout: Addresses & Coupons**
Real `Addresses` CRUD (shared between checkout and Account per Open Question #8), real `Coupons` validation endpoint.

**Phase 6 — Payments**
Integrate chosen gateway (Open Question #9). Never build custom card-detail fields (Section 11's explicit design principle) — use the gateway's hosted/redirect flow.

**Phase 7 — Orders**
`POST /api/orders` with real server-side total/tax computation (resolving Open Question #7), inventory deduction (Phase 8 dependency — sequence these together if inventory is in scope for v1), order-number uniqueness guarantee, order confirmation email. `GET /api/orders` + `GET /api/orders/:id` for the Account dashboard and a real `/track-order`.

**Phase 8 — Inventory**
Stock tracking, out-of-stock UI (net-new, Section 19/31), checkout-time re-validation.

**Phase 9 — Wishlist**
Server-persisted, same merge-on-login pattern as cart. Lowest-risk phase — the frontend's `useWishlist()` shape is already clean and small.

**Phase 10 — Personalisation & Reviews**
Data-driven personalisation config (replacing the hardcoded `fontClassMap`/color lists, Section 6), and the entirely-net-new review-submission flow (Section 18) — both require some frontend work, not just backend.

**Phase 11 — Gifting Assistant & Search**
Move the currently-fine client-side logic (Sections 9/16) to real endpoints once catalogue size justifies it — lower urgency than the above, since the current client-side approach genuinely works fine at today's mock-data scale.

**Phase 12 — Corporate & Contact leads**
Simple `POST` endpoints + email/CRM notification — low complexity, can be done any time after Phase 1, doesn't block on auth.

**Phase 13 — Admin panel**
Everything in Section 29, once the underlying data model (Phases 1-10) exists to manage. Realistically the last major piece, since it's a consumer of every other phase's schema.

---

## 34. FINAL BACKEND HANDOFF SUMMARY

**Current frontend status:** Feature-complete as a *frontend-only* e-commerce experience — every page listed in Section 2 renders, every interaction (filtering, cart, wishlist, checkout steps, forms) works as real client-side UI. Nothing is connected to a server; all "backend" behavior today is either `localStorage`, in-memory React state, or hardcoded mock data. `tsc`/`eslint` are clean across the whole codebase as of this audit.

**Backend components required:** full auth (Section 13), a real product data layer replacing 5 separate mock-data files (Section 25), server-persisted cart/wishlist (Sections 10/15), a real checkout/order/payment pipeline (Sections 11/12), inventory (Section 19 — currently 100% absent), reviews with a submission flow (Section 18 — currently display-only), corporate/contact lead capture (Section 17), and an admin panel (Section 29 — currently 100% absent).

**Database entities required:** Users, Products (+Images/Variants/PersonalisationOptions), Categories, Collections, Occasions, Audiences, Recipients (+ their join tables), Cart/CartItems, Addresses, Orders/OrderItems, Payments, Coupons, Wishlist/WishlistItems, Reviews, CorporateLeads — full field-level detail in Section 22.

**API groups required:** Auth, Products/Collections/Occasions/Search, Cart, Wishlist, Addresses/Coupons/Orders, Corporate leads, Reviews — full endpoint list in Section 23.

**Third-party integrations required:** an auth provider/library (decision pending, Open Question #1), a payment gateway (Razorpay recommended, Open Question #9), transactional email, and eventually image storage/CDN once real product photography exists (currently 100% `placehold.co` placeholders, Section 25/27). No third-party integration exists today except passive share-link URLs.

**Critical business rules:** never trust client-submitted prices/totals; validate stock, coupons, and personalisation server-side; enforce order/address/wishlist ownership; guarantee unique order numbers; decide and enforce a guest-checkout policy (full list, Section 30).

**Known unknowns (do not silently decide these — see Section 32 in full):** auth method (OTP doesn't exist in the frontend despite being commonly assumed), guest-checkout policy, whether personalisation should affect price, the real scope of "Personalised" products (only 1 of 48 has real customisation UI today), tax/GST handling (entirely unaddressed), and payment gateway choice.

**Recommended implementation order:** Database & schema → Auth → Product APIs → Cart → Addresses/Coupons → Payments → Orders → Inventory → Wishlist → Personalisation/Reviews → Gifting Assistant/Search → Corporate/Contact → Admin panel. Full rationale in Section 33.

---

## Files inspected for this document

**`src/app/` (routes):** `layout.tsx`, `page.tsx`, `about/page.tsx`, `journal/page.tsx`, `shipping/page.tsx`, `returns/page.tsx`, `faqs/page.tsx`, `contact/page.tsx` + `ContactPageClient.tsx`, `track-order/page.tsx` + `TrackOrderClient.tsx`, `help/page.tsx`, `product/[slug]/page.tsx` + `ProductPageClient.tsx`, `shop/page.tsx` + `ShopPageClient.tsx`, `shop/[audience]/page.tsx` + `AudienceShopPageClient.tsx`, `occasions/page.tsx`, `occasions/[occasion]/page.tsx` + `OccasionPageClient.tsx`, `collections/page.tsx`, `collections/[collection]/page.tsx` + `CollectionPageClient.tsx`, `search/page.tsx` + `SearchPageClient.tsx`, `personalised/page.tsx` + `PersonalisedPageClient.tsx`, `checkout/page.tsx` + `CheckoutPageClient.tsx`, `cart/page.tsx` + `CartPageClient.tsx`, `wishlist/page.tsx` + `WishlistPageClient.tsx`, `corporate/page.tsx`, `corporate/quote/page.tsx` + `CorporateQuotePageClient.tsx`, `gifting-assistant/page.tsx` + `GiftingAssistantPageClient.tsx`, `account/page.tsx` + `AccountPageClient.tsx`.

**`src/lib/` (all files):** `cn.ts`, `slugify.ts`, `shop-mock-data.ts`, `occasion-data.ts`, `product-mock-data.ts`, `collection-mock-data.ts`, `mock-data.ts`, `corporate-data.ts`, `corporate-catalogue.ts`, `gifting-assistant-data.ts`, `search-data.ts`, `local-store.ts`, `checkout-data.ts`, `seasonal-banner-data.ts`, `account-data.ts`, `cart-context.tsx`, `wishlist-context.tsx`.

**`src/components/` (representative sample covering every distinct pattern in the app):** `layout/Header.tsx`, `HeaderActions.tsx`, `TopBar.tsx`, `Footer.tsx`, `MobileNav.tsx`, `AccountMenu.tsx`, `AccountAuthModal.tsx`, `NavDropdown.tsx`, `SearchOverlay.tsx`; `home/GiftingAssistant.tsx`; `product/HamperPDP.tsx`, `CustomisablePDP.tsx`, `StandalonePDP.tsx`, `ProductPageShell.tsx`, `DeliveryCheck.tsx`, `ReviewsSection.tsx`, `MobileStickyCTA.tsx`, `PdpWishlistButton.tsx`; `checkout/AddressStep.tsx` (from earlier in this build session), `OrderSummarySidebar.tsx`, `OrderConfirmation.tsx`; `shop/FilterSidebar.tsx`, `Breadcrumb.tsx`, `ShopFooter.tsx` (from earlier in this build session); `ui/ProductCard.tsx`; `providers/AppProviders.tsx`; `account/ProfileSection.tsx`, `OrdersSection.tsx`, `AddressesSection.tsx`, `WishlistSection.tsx`, `SettingsSection.tsx`.

**Config:** `package.json`, `next.config.ts`, `src/app/globals.css`, `public/` directory listing.

**Not individually re-read for this pass but already fully known from having built them earlier in this same project (their data/behavior is fully captured above via the files that consume them):** the smaller presentational components (`Breadcrumb`, `RatingStars`, `QuantityStepper`, `Accordion`, `WhatsInsideList`, `VariantPills`, `ProductGallery`, `ShareIconButton`, `RelatedProducts`, `CategoryPillRow`, `ShopToolbar`, `Pagination`, `PriceRangeSlider`, `MobileFilterDrawer`, `CollectionFilterSidebar`, `CollectionBanner`, `CollectionTrustStrip`, `SelectDropdown`, homepage sections `Hero`/`WhoAreYouGifting`/`MadeForTheMoment`/`BlissynestEdit`/`LovedByMany`/`CorporateBanner`/`FeatureStrip`/`CommunityStrip`, corporate marketing sections `CorporateHero`/`CorporateNeeds`/`HowItWorks`/`WhyChooseUs`/`CuratedCollections`/`TrustedByStrip`/`TestimonialCarousel`/`CorporateFinalCta`). None of these affect data model or API design beyond what's already documented from their parent pages and the `lib/*.ts` data files that feed them.

**No files were modified.** This document is new; nothing in the existing application was changed.

**`BACKEND_HANDOFF.md` was created successfully** at the repository root (`D:\Blissynest\BACKEND_HANDOFF.md`).
