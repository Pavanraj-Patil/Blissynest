import { test, expect } from "@playwright/test";

const KNOWN_PRODUCT_SLUG = "her-jewellery-accessories-1";
const KNOWN_PRODUCT_NAME = "Rose Gold Layered Necklace";

test.describe("Cart", () => {
  test("empty cart shows a real empty state, not a blank page", async ({ page }) => {
    await page.goto("/cart");
    await expect(page.getByRole("heading", { name: /cart is waiting to be filled/i })).toBeVisible();
    await expect(page.getByRole("link", { name: "Continue Shopping" })).toBeVisible();
  });

  test("adding a product from its PDP makes it appear in the cart", async ({ page }) => {
    await page.goto(`/product/${KNOWN_PRODUCT_SLUG}`);
    await page.getByRole("button", { name: "Add to Cart" }).click();
    await expect(page.getByText("Added to your cart")).toBeVisible();

    await page.goto("/cart");
    await expect(page.getByRole("heading", { name: "My Cart" })).toBeVisible();
    await expect(page.getByText(KNOWN_PRODUCT_NAME)).toBeVisible();
    await expect(page.getByText("1 item in your cart")).toBeVisible();
  });

  test("quantity can be changed and the line total updates", async ({ page }) => {
    await page.goto(`/product/${KNOWN_PRODUCT_SLUG}`);
    await page.getByRole("button", { name: "Add to Cart" }).click();
    await page.goto("/cart");

    // "N item(s) in your cart" counts distinct lines, not total units, so
    // it correctly stays at 1 here — assert on the line total instead.
    const lineTotal = page.getByText(/^₹[\d,]+$/).last();
    const before = await lineTotal.textContent();
    await page.getByRole("button", { name: "Increase quantity" }).click();
    await expect(async () => {
      expect(await lineTotal.textContent()).not.toBe(before);
    }).toPass();
  });

  test("a product can be removed from the cart", async ({ page }) => {
    await page.goto(`/product/${KNOWN_PRODUCT_SLUG}`);
    await page.getByRole("button", { name: "Add to Cart" }).click();
    await page.goto("/cart");

    await page.getByRole("button", { name: "Remove item" }).click();
    await expect(page.getByRole("alertdialog", { name: KNOWN_PRODUCT_NAME })).toBeVisible();
    await page.getByRole("button", { name: "Remove from Cart" }).click();

    await expect(page.getByRole("heading", { name: /cart is waiting to be filled/i })).toBeVisible();
  });
});
