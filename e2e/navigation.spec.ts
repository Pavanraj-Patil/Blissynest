import { test, expect } from "@playwright/test";

test.describe("Navigation", () => {
  test("homepage loads successfully", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/Blissynest/);
    await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1);
    await expect(page.getByRole("heading", { name: "Who are you making smile?" })).toBeVisible();
  });

  test("logo navigates back to home from another page", async ({ page }) => {
    await page.goto("/shop");
    await page.getByRole("link", { name: "Blissynest" }).first().click();
    await expect(page).toHaveURL("/");
  });

  test("main header navigation reaches Shop", async ({ page, isMobile }) => {
    test.skip(isMobile, "the header nav is replaced by the hamburger menu below the md breakpoint");
    await page.goto("/");
    await page.getByRole("link", { name: "Shop", exact: true }).click();
    await expect(page).toHaveURL(/\/shop$/);
    await expect(page.getByRole("heading", { name: "All Gifts" })).toBeVisible();
  });

  test("recipient category navigation reaches an audience page", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("link", { name: "Gifts for Her" }).first().click();
    await expect(page).toHaveURL(/\/shop\/her/);
    await expect(page.getByRole("heading", { name: "Gifts for Her" })).toBeVisible();
  });

  test("breadcrumb navigates back up a level", async ({ page }) => {
    await page.goto("/shop/her");
    await page.getByRole("link", { name: "Shop", exact: true }).first().click();
    await expect(page).toHaveURL(/\/shop$/);
  });

  test("an unknown product route renders a not-found page instead of crashing", async ({ page }) => {
    const response = await page.goto("/product/this-slug-does-not-exist");
    expect(response?.status()).toBe(404);
    await expect(page.getByText(/page could not be found|not found/i)).toBeVisible();
  });
});

test.describe("Mobile menu", () => {
  test.use({ viewport: { width: 375, height: 812 } });

  test("opens and closes via the close button", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Open menu" }).click();
    const closeButton = page.getByRole("button", { name: "Close menu" });
    await expect(closeButton).toBeVisible();
    await closeButton.click();
    await expect(closeButton).not.toBeVisible();
  });

  test("closes on Escape", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Open menu" }).click();
    const closeButton = page.getByRole("button", { name: "Close menu" });
    await expect(closeButton).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(closeButton).not.toBeVisible();
  });
});

test.describe("Search", () => {
  test("opens, closes on Escape, and supports keyboard input", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Search" }).click();
    const input = page.getByPlaceholder("Search for gifts, occasions, collections...");
    await expect(input).toBeVisible();
    await expect(input).toBeFocused();
    await page.keyboard.press("Escape");
    await expect(input).not.toBeVisible();
  });
});
