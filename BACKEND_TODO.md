# Backend & Real-Data TODO

This project is a **frontend-only build** — no server, no database, no auth, no
real payments. Everything below either runs on mock data, lives only in
client-side component state (so it resets on refresh), or is a stub link/button
that doesn't do anything yet. This file is the single place that tracks all of
that, so when it's time to wire up a real backend we know exactly what to
touch and what each piece currently fakes.

**Update this file whenever you add a new mocked/stubbed interaction** — new
entry under the right section, one row per feature.

## How to read this

- **Mocked** — behaves like the real thing (you can interact with it, state
  updates, UI responds) but only against a static/local dataset. Nothing is
  persisted anywhere and nothing survives a page refresh.
- **Stub** — present in the UI but not wired to any logic. Links go to routes
  that don't exist yet, buttons don't do anything.

---

## Global / Layout

| Area | Current state | Needed for production |
|---|---|---|
| Search icon (header) | Stub — no search UI, no results | Real search (Algolia/Meilisearch/DB full-text) + search results page |
| Account icon (header) | Stub — no auth | Auth (sign in/up, sessions), account/orders pages |
| Wishlist icon (header) | Stub — no wishlist state | Wishlist persisted per-user (DB or localStorage at minimum) |
| Cart icon + badge (header) | Stub — badge hardcoded to `0`, no cart | Real cart: add/remove/update qty, persisted (DB for logged-in, localStorage for guest), checkout flow |
| Nav dropdowns (Shop, Collections, Occasions, Personalised) | **Functional** — each is a real hover mega-menu (`NavDropdown` in `src/components/layout/NavDropdown.tsx`, pure CSS `group-hover`, no JS state) linking to real pages: Shop/Personalised list the 6 audiences (`/shop/[audience]`, Personalised appends `?category=personalised`, which `/shop/[audience]` now reads via `useSearchParams` to preset that category filter on load), Collections lists the 5 edits (`/collections/[collection]`), Occasions lists all 7 (`/occasions/[occasion]`). `/shop`, `/collections`, `/occasions`, and `/personalised` (no sub-segment — the nav item's own top-level link target) are now all real hub pages too (see below) | None |
| Corporate nav item | **Functional** — `/corporate` and `/corporate/quote` are real pages (see the Corporate gifting pages section below) | None |
| Newsletter signup (footer) | Stub — form has no submit handler | Email capture endpoint (e.g. Mailchimp/Klaviyo API) |
| Footer links (About, Bliss Journal, Track Order, Shipping, Returns, FAQs, Contact) | Stub — `href="#"` or non-existent routes | Build out each page |
| Social icons (footer) | Stub — `href="#"` | Real social URLs |

## Homepage

| Area | Current state | Needed for production |
|---|---|---|
| Gifting Assistant (who/occasion/budget selects + "Find My Gift") | **Functional** — selects are controlled, the button navigates to `/gifting-assistant?who=&occasion=&budget=`, a real results page that filters `allShopProducts` by audience/occasion/price-range client-side (same filters editable inline there, live-updating, no separate submit step) | Real recommendation logic (rules engine, purchase-history-aware ranking, etc.) instead of a straightforward attribute match against the mock catalog |
| Category cards ("Who are you making smile?") | All six now link to real pages — `/shop/[her\|him\|parents\|couples\|friends\|colleagues]`, one dynamic route (`src/app/shop/[audience]/page.tsx`) driven by `src/lib/shop-mock-data.ts` | None — just needs a real catalog behind it (see below) |
| Occasion cards ("Made for the moment") | **Functional** — all seven link to real pages, `/occasions/[birthday\|anniversary\|wedding\|housewarming\|thank-you\|just-because\|festivals]` | None |
| Collection cards ("The Blissynest Edit") | **Functional** — all five link to real pages, `/collections/[self-care\|cozy\|minimalist\|celebration\|luxury]` | None |
| Bestseller products ("Loved by many") | Mocked — static array in `src/lib/mock-data.ts`, wishlist heart has no effect. Links now go to real (generated-fallback) product pages | Real product API/DB; working wishlist toggle |
| Corporate banner links | **Functional** — `/corporate` and `/corporate/quote` are real pages now (see below) | None |
| Section header links ("Explore all" / "See all occasions" / "View all") | **Functional** — `SectionHeader` defaults `linkHref` to `"#"` when not passed; all four homepage sections (`WhoAreYouGifting`, `MadeForTheMoment`, `BlissynestEdit`, `LovedByMany`) now pass a real one (`/shop`, `/occasions`, `/collections`, `/shop` respectively). "Loved by many"'s "View all" goes to `/shop` rather than a dedicated bestsellers page — there's no `isBestseller` flag in the mock catalog, and `/shop` already defaults to Best Selling sort | A real bestsellers page/flag once there's real sales data to back it |
| All product/placeholder images | Mocked — `placehold.co` placeholders | Real product photography |

## Gifting Assistant results page (`/gifting-assistant`)

The homepage widget's "Find My Gift" button used to do nothing, and the
hero's "Find the Perfect Gift" button linked to `/gifting-assistant`, which
didn't exist — both fixed by building the page. `src/lib/gifting-assistant-data.ts`
is the single source of truth for the who/occasion/budget option lists and
their mappings (`whoToAudience`, `budgetToRange`), shared between the
homepage widget (`GiftingAssistant.tsx`, now a controlled form that
navigates to `/gifting-assistant?who=&occasion=&budget=`) and the results
page itself, so the two can't drift out of sync.

The results page filters `allShopProducts` by audience/occasion/price-range
— **functional**, all client-side against the mock catalog, no separate
"submit" step (changing any of the three selects re-filters immediately,
same as every other filter UI on this site). Sort, grid/list toggle, and
pagination are the same mechanics as the shop pages.

## Shop / Collection pages (`/shop`, `/shop/[audience]` — her, him, parents, couples, friends, colleagues)

One dynamic route (`src/app/shop/[audience]/page.tsx`) serves all six audiences; invalid slugs 404 via `notFound()`.
`/shop` itself (`src/app/shop/page.tsx`) is a separate, near-identical page — an "All Gifts" hub over the
full combined catalog (`allShopProducts`, all 336 products) with the same category/price/occasion/recipient
filters, sort, and pagination. It was added because the PDP and audience-page breadcrumbs both link to
`/shop` and that route previously 404'd — there was no bare hub page, only `/shop/[audience]`.

| Area | Current state | Needed for production |
|---|---|---|
| Product catalog | Mocked — generated per-audience in `src/lib/shop-mock-data.ts` (56 products × 6 audiences = 336 total), deterministic (not random) so SSR/CSR match. Product copy is hand-written per audience; ratings/reviews/occasion+recipient tags are procedurally derived from a per-audience index, not real signal | Real product catalog from a DB/CMS, paginated server-side, one dataset shared across all audience pages instead of hardcoded arrays |
| Category filter (pill row + sidebar checkboxes) | **Functional** — filters the mocked dataset client-side | Same UX, but filtering should happen server-side (or via a proper client-side query layer) once the catalog is real and large |
| Price range filter | **Functional** — dual-handle slider filters the mocked dataset client-side, top value is open-ended ("5000+" = no cap) | Same, server-side once catalog is real |
| Occasion / Recipient filters | **Functional** — multi-select checkboxes filter client-side; tag options are hand-picked, not derived from real product data | Filter option lists (and their counts) should be derived from the actual catalog, not hardcoded |
| Sort (Best Selling / Price / Rating / Newest) | **Functional**, but "Best Selling" and "Newest" have no real signal to sort by (no purchase counts, no `createdAt`) — they currently just use array order / reversed array order | Real sort needs purchase-count and created-at fields on the product model |
| Result count ("N products") | Mocked — reflects the real (small) mock dataset size, not the "257" shown in the reference design | Will be accurate once catalog is real |
| Pagination | **Functional** — paginates the mocked dataset client-side (12/page) | Same UX, but should be server-side pagination once the catalog is large/real |
| Grid / List view toggle | **Functional** — pure UI state, no persistence | Optionally persist the user's preference (localStorage or account setting) |
| Wishlist heart on product cards | Stub — toggles local visual state only (via `useState` in `ProductCard`), not persisted | Real wishlist persistence |
| Product card links | **Functional** — every card now links to a real `/product/[slug]` page | None |
| Mobile filter drawer "Apply Filters (N)" | Functional as a close/confirm action (filtering is already live as you check boxes) | No change needed — this is a UI pattern choice, not a backend gap |
| Breadcrumb | Static — matches the current static route | Should reflect real category/route data once dynamic |

## Occasion pages (`/occasions`, `/occasions/[occasion]` — birthday, anniversary, wedding, housewarming, thank-you, just-because, festivals)

`/occasions` (`src/app/occasions/page.tsx`) is a static hub — the same 7
`OccasionCard`s used in the homepage's "Made for the moment" section, each
linking to its `/occasions/[occasion]` page. Added because the header nav
item and product/audience-page breadcrumbs both link to bare `/occasions`,
and that route 404'd — only the dynamic `[occasion]` route existed.

One dynamic route (`src/app/occasions/[occasion]/page.tsx`) serves all seven;
invalid slugs 404 via `notFound()`. Content (title/subtitle/breadcrumb/icon)
is hand-written per occasion in `src/lib/occasion-data.ts`.

This page reuses the **existing** shop catalog rather than a separate
generated one — every shop product already carries an `occasions: string[]`
tag (added when the audience shop pages were built), so an occasion page is
just `allShopProducts.filter(p => p.occasions.includes(occasionLabel))`
across all six audiences combined. No new product data was authored for
this feature.

The category pill row here is **curated per occasion** rather than showing
the same six audiences everywhere — some occasions genuinely aren't "for
everyone" (a Wedding page showing a "For Colleagues" pill makes no sense).
Each occasion gets its own curated pill list defined in `occasionPills` in
`src/lib/occasion-data.ts`, where every pill is typed `{type: "audience" |
"category" | "recipient", value, label}` and maps to a **real,
already-existing** product field — `product.audience`, `product.category`,
or (for Birthday's "For Kids" pill) a group of existing `product.recipients`
tags ("Son"/"Daughter", via `recipientPillGroups`) — never a fabricated
bucket with no backing data. Birthday and
Just Because stay broad (most/all audiences, since they apply across
relationships); Anniversary and Wedding drop Friends/Colleagues in favor of
couple-centric pills; Housewarming swaps entirely to category-type pills
(Home & Living, Self Care, Personalised) since that occasion is about the
space, not the relationship; Thank You and Festivals skew toward
Friends/Colleagues/Family. `CategoryPillRow` was generalized to accept an
icon per item (instead of a hardcoded category→icon map) and a composite
`"type:value"` key per pill, so it can render a mix of audience- and
category-type pills side by side. The sidebar's Recipient filter is
computed dynamically (every recipient tag that appears among that
occasion's products, with a real count) rather than a hand-picked list —
there was no per-occasion recipient list to author, so this derives it from
whatever's actually in the filtered set. No "Occasion" filter section is
shown (redundant, since the whole page is already scoped to one), matching
the same "don't duplicate the fixed dimension in the sidebar" decision made
for the audience pages' Categories section.

| Area | Current state | Needed for production |
|---|---|---|
| Product catalog | **Functional** — real filter over the existing 336-product shop catalog, not a separate mock set | Same real-catalog gap as the shop pages above |
| Per-occasion quick-filter pills | **Functional** — mixed audience/category filter, curated per occasion | Server-side once catalog is real |
| Price / Recipient filters | **Functional**, same mechanics as shop pages | Server-side once catalog is real |
| Sort / Pagination / Grid-List toggle | **Functional**, identical to shop pages | Same notes as shop pages above |
| Result count | Accurate (real count of the filtered mock catalog) | None |

## Personalised page (`/personalised`)

Same idea as `/occasions`/`/collections`/`/shop` — the nav item and the
Personalised dropdown's own top-level link both pointed at `/personalised`,
which didn't exist (only the dropdown's per-audience items, which deep-link
into `/shop/[audience]?category=personalised`, actually worked). Built as a
category-scoped hub, same pattern as the occasion pages: filters
`allShopProducts` down to `category === "personalised"` across all six
audiences (48 products), with Price/Occasion/Recipient filters (Occasion
and Recipient counts computed dynamically from that filtered set, same as
occasion pages), sort, and pagination. No Category pill row — redundant,
since the whole page is already scoped to one category.

## Collection pages (`/collections`, `/collections/[collection]` — self-care, cozy, minimalist, celebration, luxury)

`/collections` (`src/app/collections/page.tsx`) is a simple static hub — the
5 `CollectionCard`s (reused from the homepage's "Blissynest Edit" section)
in a scrollable row, each linking to its `/collections/[collection]` page.
Added because the header dropdown, product breadcrumbs, and the homepage's
own "Explore Collections" hero button all link to bare `/collections`, and
that route 404'd — only the dynamic `[collection]` route existed.

One dynamic route (`src/app/collections/[collection]/page.tsx`) serves all
five, invalid slugs 404 via `notFound()`. Unlike the shop/occasion pages,
each collection has its **own separate catalog** (`src/lib/collection-mock-data.ts`,
~20-25 hand-written products per edit across 4 themed categories each) rather
than reusing `allShopProducts` — a "Blissynest Edit" is an editorial curation,
not a filtered slice of the existing audience catalog, so it gets its own
product set and its own category taxonomy (e.g. Self-Care's Candles/Bath &
Body/Wellness/Home Fragrance vs. Luxury's Fine Jewellery/Premium Hampers/Silk
& Accessories/Watches & Leather).

Sidebar layout is deliberately different from the shop/occasion pages'
pill-row + sidebar hybrid — it matches the FNP-style collection page from the
reference screenshot instead: a single-select **Category** list inside the
sidebar (not a pill row), Price, an optional per-collection **attribute**
filter (Scent for Self-Care, Material for Cozy/Minimalist/Luxury, Theme for
Celebration — multi-select, only shown when a collection defines one), and
**Occasion** (multi-select, counts derived from the collection's own product
tags). `CollectionFilterSidebar` and `CollectionMobileFilterDrawer` are new,
dedicated components (not the shop pages' `FilterSidebar`) since the
Category-as-radio-list interaction is genuinely different from the shop
pages' Category-as-pill-row; they reuse `Section`/`CheckboxRow`/`ShowMoreList`
(now exported from `FilterSidebar.tsx`) and `PriceRangeSlider` rather than
duplicating that chrome.

`CollectionBanner` is a new component matching the reference's photo banner
(solid-color text panel + photo side-by-side on desktop, photo with a text
scrim overlay on mobile) — different from `ShopBanner`'s dashed-ticket style
used on shop/occasion pages, since the reference for this section looks
different. `CollectionTrustStrip` (Handpicked / Quality First / Sustainable /
Beautifully Packaged) is generic marketing copy shown on all five collections,
not data-driven per collection. `ProductCard` gained an optional `badge` prop
(Bestseller/New) to match the reference's product badges.

Product detail pages for collection products resolve through the same
generated-fallback path as shop products (`getProductBySlug` in
`product-mock-data.ts` now also checks the flattened collection catalog), and
"You may also like" pulls other products from the same collection + category
rather than a random cross-catalog pool.

| Area | Current state | Needed for production |
|---|---|---|
| Product catalog | Mocked — ~110 hand-written products total across 5 collections, deterministic (not random) generation for rating/reviews/occasion tags | Real curated-collection data from a CMS/DB; a real "collection" concept (product IDs curated into a named set) rather than a hardcoded per-collection array |
| Category filter (single-select sidebar list) | **Functional** — filters the mocked per-collection catalog client-side | Server-side once catalog is real |
| Price / Attribute (Scent/Material/Theme) / Occasion filters | **Functional**, same mechanics as shop pages | Server-side once catalog is real |
| Sort / Pagination / Grid-List toggle | **Functional**, identical to shop pages | Same notes as shop pages above |
| Product badges (Bestseller/New) | Mocked — hand-assigned per seed product, not derived from real sales/launch data | Real "bestseller" should come from sales data; "new" from a launch date field |
| Result count | Accurate (real count of the filtered mock catalog) | None |

## Corporate gifting pages (`/corporate`, `/corporate/quote`)

Designed after researching FNP's and IGP's live corporate-gifting pages
(stats strip, "how it works" step process, category tiles, client trust
strip, lead-capture form) plus the user-supplied reference screenshot. All
copy/content lives in `src/lib/corporate-data.ts`; each section is its own
component under `src/components/corporate/`.

`/corporate` is a marketing/lead-gen landing page, not a product listing —
there's no real corporate product catalog (a B2B bulk/branded-hamper
catalog is a different shape of data than the consumer shop catalog and
wasn't in scope here). Every card that would otherwise need its own
category page (the 7 "Gifts for every corporate need" tiles and the 6
"Curated collections for every occasion" tiles) instead deep-links to
`/corporate/quote?interest=<slug>`, which pre-selects that category in the
enquiry form's "What are you looking for?" dropdown — same pattern as the
Personalised nav dropdown's `?category=` deep-link into the shop pages.
"Book a Consultation" links to the same form with `?intent=consultation`,
which swaps the page's headline/copy/submit-button label.

The "Trusted by teams at" badges and all 4 testimonials use invented company
names, not real brands — consistent with the rest of the mock catalog, and
deliberately avoids implying a real company's endorsement. "Trusted by"
uses a colored initials badge per company (no real logo images, since none
exist) rather than plain text, closer to how FNP/IGP present client trust
strips.

"Gifts for every corporate need" (an asymmetric bento grid of colored
category tiles) and "Curated collections for every occasion" (a horizontal
scrollable carousel of image tiles with prev/next arrows) were originally
both plain uniform card grids and read as duplicated sections; they're now
deliberately different layouts/interactions so they don't repeat the same
pattern twice on one page. The testimonial is now `TestimonialCarousel.tsx`
— a small client component that auto-rotates through all 4 testimonials
every 5s (paused on hover) with clickable dot navigation, replacing the
single static quote. The standalone stats band (Happy Companies/Gifts
Delivered/etc.) was tried and then removed per feedback — not present on
the page anymore.

| Area | Current state | Needed for production |
|---|---|---|
| Hero, trust points, "Gifts for every corporate need", "How does it work?", "Why choose us" checklist, testimonials, curated collection tiles, trusted-by badges | Static content from `corporate-data.ts` | Real copy, real testimonials/client logos (with permission), real photography |
| Testimonial carousel auto-rotation | **Functional** — 5s interval, pauses on hover, dot navigation | None — purely presentational, no backend needed |
| `/corporate/quote` enquiry form (name/email/phone/company/team size/interest/message) | **Functional as UI** — client-side validation (`required` fields), `?interest=` and `?intent=` deep-links work, submit shows a real success state | Stub — submit doesn't send anywhere, just flips local component state. Needs a real endpoint (email/CRM lead capture) |
| "Download Catalogue" button on the quote form | **Genuinely functional** — a second submit button (distinguished via the `SubmitEvent.submitter`/`e.nativeEvent.submitter`) that both submits the same lead form and generates + downloads a real HTML "catalogue" file (`src/lib/corporate-catalogue.ts`), tailored to whichever category is selected in "What are you looking for?" (title/subtitle/checklist from `corporate-data.ts`, plus 1-2 matching `curatedCollections` via the `needToCollectionSlugs` map) | Real PDF generation/design, and a real per-category product catalogue instead of a generated HTML summary of existing on-page copy |
| "Know More" button (why-choose-us banner) | Links to `/corporate/quote` | Could instead go to a dedicated "About corporate gifting" page once one exists |
| Corporate footer email/phone (`corporate@blissynest.com`, `1800-123-456`) | Placeholder contact details | Real contact channels |

## Product detail pages (`/product/[slug]`)

One dynamic route (`src/app/product/[slug]/page.tsx`) renders one of three layout
templates based on `pdpType`, all defined in `src/lib/product-mock-data.ts`:

- **`HamperPDP`** — gift boxes/hampers. "What's Inside" item list, an optional
  paid add-on ("Add a handwritten note").
- **`CustomisablePDP`** — personalisable products. Text-line inputs with a
  **live preview** (font + color + text update in real time), plus a
  scent/variant selector.
- **`StandalonePDP`** — regular single products. Variant pills (scent/size).

Only **3 products have hand-written, reference-matched PDP content**:
`birthday-self-care-box` (hamper), `personalised-scented-candle`
(customisable), `scented-soy-candle` (standalone). Every other product card
in the app (all 336 shop products + ~110 collection products + the 5
homepage bestsellers) links to a
**generated fallback PDP** — `getProductBySlug()` in `product-mock-data.ts`
builds a reasonable `StandaloneProduct` on the fly from that product's
existing name/price/rating/category, with generic (not hand-tuned) copy for
the description and "why you'll love it" text.

**Layout**: on desktop, the gallery and the Add to Cart/Buy Now button both
use `position: sticky` (gallery pins to the top, the button pins to the
bottom) so they stay in view while the surrounding product info scrolls —
both release naturally once the info column's own content ends. On mobile,
a separate `MobileStickyCTA` bar pins to the bottom of the screen and is
positioned as the last element inside a wrapper that ends right before
"You may also like", so it releases there via plain CSS sticky (no JS/
IntersectionObserver needed). A compact `ShareIconButton` sits next to the
product name (desktop and mobile) and opens a small popover instead of a
full "Share this product" row.

| Area | Current state | Needed for production |
|---|---|---|
| Product content (name, price, images, description, etc.) | Mocked — 3 hand-written flagship products; everything else auto-generated with generic copy | Real product content from a CMS/DB, written per-SKU |
| Personalisation (text lines, font, color, live preview) | **Functional** client-side state, nothing is saved or sent anywhere | On "Add to Cart", the chosen personalisation needs to be captured as order line-item metadata and passed through to fulfillment |
| Variant selection (scent/size) | **Functional** UI state | Should affect price/stock/SKU once there's a real catalog with per-variant pricing and inventory |
| Quantity stepper | **Functional** UI state | Should respect real stock levels |
| Add to Cart / Buy Now | Stub — buttons render, no click handler, no cart | Real cart + checkout flow |
| Delivery pincode check | **Functional but fake** — accepts any 6-digit number and returns a deterministic date offset, not a real serviceability check | Real courier/serviceability API |
| Share (WhatsApp / Facebook / Email) | **Genuinely functional** — these open real share URLs (`wa.me`, Facebook sharer, `mailto:`) using the current page URL, no backend needed | None |
| Share → Copy Link | **Functional** — uses the real Clipboard API | None |
| "You may also like" | **Functional** — 3 flagship products have hand-picked `relatedSlugs`; everything else falls back to same-category products from the shop catalog | Real recommendation engine (co-purchase data, etc.) |
| Customer Reviews section | Mocked — 3 flagship products have hand-written review cards (`reviewsList`); every other product gets 3 deterministically-generated generic reviews (`generateGenericReviews`). No rating summary/breakdown is shown (removed per request) | Real reviews system (submission, moderation) |
| Product images | Mocked — 1-5 `placehold.co` placeholders per product depending on type | Real product photography |
