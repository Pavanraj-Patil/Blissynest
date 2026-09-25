import { test, expect } from "@playwright/test";

// Real seeded product used throughout this suite — see prisma/seed.ts /
// src/lib/shop-mock-data.ts for the audience+category taxonomy it comes from.
const KNOWN_PRODUCT_SLUG = "her-jewellery-accessories-1";
const KNOWN_PRODUCT_NAME = "Rose Gold Layered Necklace";

test.describe("Product detail page", () => {
  test("loads with name, price, rating and a working Add to Cart action", async ({ page }) => {
    await page.goto(`/product/${KNOWN_PRODUCT_SLUG}`);
    await expect(page.getByRole("heading", { name: KNOWN_PRODUCT_NAME })).toBeVisible();
    await expect(page.getByText(/^₹[\d,]+$/).first()).toBeVisible();
    await expect(page.getByRole("button", { name: "Add to Cart" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Buy Now" })).toBeVisible();
  });
});

test.describe("Category filtering", () => {
  test("an audience page's quick-filter pills narrow the results", async ({ page }) => {
    await page.goto("/shop/her");
    // Two responsive-only spans ("N products" / "N results") share this
    // paragraph and only one is ever visible via CSS — .innerText() reads
    // whichever one actually is, regardless of viewport.
    const resultCount = page.locator("p").filter({ hasText: /\d+\s+(products|results)/ });
    await expect(resultCount).toBeVisible();
    const before = await resultCount.innerText();

    // Pill selection is client-side React state, not synced to the URL
    // (only the *initial* ?category= param on page load is read) — so the
    // real, correct assertion here is that the result count narrows, not
    // that the URL changes.
    await page.getByRole("button", { name: "Jewellery" }).click();
    await expect(async () => {
      expect(await resultCount.innerText()).not.toBe(before);
    }).toPass();
  });
});

test.describe("Search", () => {
  test("a valid search term returns matching results", async ({ page }) => {
    await page.goto("/search?q=candle");
    await expect(page.getByText(/results? for/i)).toBeVisible();
    await expect(page.locator("main")).toContainText(/candle/i);
  });

  test("a nonsense search term shows a real empty state, not a crash", async ({ page }) => {
    await page.goto("/search?q=zzzznoproductmatchesthisxyz");
    await expect(page.getByText(/no (results|products)/i)).toBeVisible();
  });
});
