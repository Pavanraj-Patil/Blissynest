# End-to-end tests

Playwright suite covering the core shopping flows against the real dev
database — there's no mocked backend layer to swap in, so these tests read
and write real rows (guest carts/orders) the same way manual testing in this
project always has.

## Running

```bash
npx playwright install chromium   # first time only
npm run test:e2e                  # headless run
npm run test:e2e:ui               # interactive UI mode
```

The config starts `npm run dev` automatically if nothing is already
listening on port 3000 (`reuseExistingServer: true`, so it attaches to an
already-running dev server instead of starting a second one).

## Coverage

- `navigation.spec.ts` — homepage load, header/breadcrumb navigation,
  recipient category links, mobile menu open/close (click + Escape), search
  overlay open/close, an unknown product route resolving to a real 404.
- `product-browsing.spec.ts` — PDP content and quantity stepper, an audience
  page's category pill filtering, search with a valid and a nonsense term.
- `cart.spec.ts` — empty-cart state, add to cart, change quantity, remove
  item (through the confirmation dialog).
- `checkout.spec.ts` — empty-cart checkout state, required-field validation
  on the address form, and a full guest Cash-on-Delivery checkout through to
  a real order confirmation number.

## Known gaps

- Razorpay (card/UPI/net banking) isn't exercised — `RAZORPAY_KEY_ID` is
  unset in this environment, so there's no sandbox key to check out against.
  COD covers the same order-creation path end to end.
- Tests assume the seeded product `her-jewellery-accessories-1` exists
  (see `prisma/seed.ts`) and that the dev database is reachable.
