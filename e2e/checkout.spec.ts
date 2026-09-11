import { test, expect } from "@playwright/test";

const KNOWN_PRODUCT_SLUG = "her-jewellery-accessories-1";

test.describe("Checkout", () => {
  test("an empty cart shows a real message instead of the checkout form", async ({ page }) => {
    await page.goto("/checkout");
    await expect(page.getByRole("heading", { name: /nothing to check out/i })).toBeVisible();
  });

  test("the address form will not save with required fields missing", async ({ page }) => {
    await page.goto(`/product/${KNOWN_PRODUCT_SLUG}`);
    await page.getByRole("button", { name: "Add to Cart" }).click();
    await page.goto("/checkout");

    await page.getByLabel(/Email \(for order updates\)/).fill("qa+playwright@example.com");
    await page.getByLabel(/Mobile Number \(for order updates\)/).fill("9876543210");

    await page.getByRole("button", { name: "Add New Address" }).click();
    // Only partially filled — City/State/Pincode left blank.
    await page.getByPlaceholder("Your full name").fill("Playwright Tester");
    await page.getByPlaceholder("House no., street, area").fill("221B Test Lane");
    const saveButton = page.getByRole("button", { name: "Save Address" });
    await saveButton.click();

    // A native-required field blocks submission — the form must still be
    // open (an address never got added to the list) rather than silently
    // accepting incomplete data.
    await expect(saveButton).toBeVisible();
    await expect(page.getByPlaceholder("Your full name")).toBeVisible();
  });

  test("guest checkout with Cash on Delivery reaches a real order confirmation", async ({ page }) => {
    await page.goto(`/product/${KNOWN_PRODUCT_SLUG}`);
    await page.getByRole("button", { name: "Add to Cart" }).click();
    await page.goto("/checkout");

    await page.getByLabel(/Email \(for order updates\)/).fill("qa+playwright@example.com");
    await page.getByLabel(/Mobile Number \(for order updates\)/).fill("9876543210");

    await page.getByRole("button", { name: "Add New Address" }).click();
    await page.getByPlaceholder("Home, Work...").fill("Home");
    await page.getByPlaceholder("Your full name").fill("Playwright Tester");
    await page.getByPlaceholder("House no., street, area").fill("221B Test Lane");
    await page.getByLabel(/^City/).fill("Mumbai");
    await page.getByLabel(/^State/).fill("Maharashtra");
    await page.getByLabel(/^Pincode/).fill("400001");
    await page.getByLabel(/^Phone/).fill("9876543210");
    await page.getByRole("button", { name: "Save Address" }).click();

    await page.getByRole("button", { name: "Continue to Payment" }).click();
    await page.getByText("Cash on Delivery", { exact: true }).click();
    await page.getByRole("button", { name: "Continue to Review" }).click();
    await page.getByRole("button", { name: "Place Order" }).click();

    await expect(page.getByRole("heading", { name: /order placed successfully/i })).toBeVisible({
      timeout: 15_000,
    });
    await expect(page.getByText(/^BLS\w+$/)).toBeVisible();
  });
});
