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
| Nav links (Shop, Collections, Occasions, Personalised, Corporate) | Stub — most target routes don't exist yet | Build out each landing page |
| Newsletter signup (footer) | Stub — form has no submit handler | Email capture endpoint (e.g. Mailchimp/Klaviyo API) |
| Footer links (About, Bliss Journal, Track Order, Shipping, Returns, FAQs, Contact) | Stub — `href="#"` or non-existent routes | Build out each page |
| Social icons (footer) | Stub — `href="#"` | Real social URLs |

## Homepage

| Area | Current state | Needed for production |
|---|---|---|
| Gifting Assistant (who/occasion/budget selects + "Find My Gift") | Stub — selects have static option lists, button does nothing | Recommendation logic (rules engine or real query) that returns a filtered product set; button should navigate to a results page with those filters applied |
| Category cards ("Who are you making smile?") | All six now link to real pages — `/shop/[her\|him\|parents\|couples\|friends\|colleagues]`, one dynamic route (`src/app/shop/[audience]/page.tsx`) driven by `src/lib/shop-mock-data.ts` | None — just needs a real catalog behind it (see below) |
| Occasion cards ("Made for the moment") | Stub — `href="#"`, no occasion landing pages | Build occasion landing/filter pages |
| Collection cards ("The Blissynest Edit") | Stub — `href="#"`, no collection pages | Build curated collection pages |
| Bestseller products ("Loved by many") | Mocked — static array in `src/lib/mock-data.ts`, wishlist heart has no effect, links go nowhere | Real product API/DB; product detail pages; working wishlist toggle |
| Corporate banner links | Stub — `/corporate`, `/corporate/quote` don't exist | Build corporate gifting page + quote request form/flow |
| All product/placeholder images | Mocked — `placehold.co` placeholders | Real product photography |

## Shop / Collection pages (`/shop/[audience]` — her, him, parents, couples, friends, colleagues)

One dynamic route (`src/app/shop/[audience]/page.tsx`) serves all six audiences; invalid slugs 404 via `notFound()`.

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
| Wishlist heart on product cards | Stub — toggles local visual state only (if implemented that way), not persisted | Real wishlist persistence |
| Product card links | Stub — no product detail page exists yet | Build product detail page (`/product/[slug]`) |
| Mobile filter drawer "Apply Filters (N)" | Functional as a close/confirm action (filtering is already live as you check boxes) | No change needed — this is a UI pattern choice, not a backend gap |
| Breadcrumb | Static — matches the current static route | Should reflect real category/route data once dynamic |
