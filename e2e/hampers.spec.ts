import { test, expect } from "@playwright/test";

// Fixtures created once via a direct DB write (see project history) rather
// than through prisma/seed.ts — mirrors the same pdpType: HAMPER shape the
// admin form produces. PRE_BUILT has no customizationSchema at all;
// PERSONALISABLE has one text line + 2 fonts + 1 color, matching what was
// manually verified end-to-end (admin create/edit, cart, checkout) before
// this suite was written.
const PRE_BUILT_SLUG = "test-pre-built-hamper";
const PERSONALISABLE_SLUG = "test-personalisable-hamper";
const PERSONALISABLE_NAME = "Test Personalisable Hamper";

test.describe("Pre-built hamper PDP", () => {
  test("shows What's Inside but no personalisation UI", async ({ page }) => {
    await page.goto(`/product/${PRE_BUILT_SLUG}`);
    await expect(page.getByRole("heading", { name: /^Test Pre-Built Hamper$/ })).toBeVisible();
    await expect(page.getByText(/What.s Inside/)).toBeVisible();
    await expect(page.getByText("Personalise This Hamper")).toHaveCount(0);
    await expect(page.getByPlaceholder(/to sarah, with love/i)).toHaveCount(0);
  });

  test("adds to cart with no customization attached", async ({ page }) => {
    await page.goto(`/product/${PRE_BUILT_SLUG}`);
    await page.getByRole("button", { name: "Add to Cart" }).click();
    await page.goto("/cart");
    await expect(page.getByText("Test Pre-Built Hamper")).toBeVisible();
    // A personalised line shows its message in quotes (see the
    // personalisable-hamper cart test below) — a plain hamper line must not.
    await expect(page.locator("main")).not.toContainText("“");
  });
});

test.describe("Personalisable hamper PDP", () => {
  test("renders text input, font choices and color swatches", async ({ page }) => {
    await page.goto(`/product/${PERSONALISABLE_SLUG}`);
    await expect(page.getByRole("heading", { name: PERSONALISABLE_NAME })).toBeVisible();
    await expect(page.getByText("Personalise This Hamper")).toBeVisible();
    await expect(page.getByPlaceholder(/to sarah, with love/i)).toBeVisible();
    await expect(page.getByRole("button", { name: "Serif" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Script" })).toBeVisible();
  });

  test("the message field respects its configured character limit", async ({ page }) => {
    await page.goto(`/product/${PERSONALISABLE_SLUG}`);
    const input = page.getByPlaceholder(/to sarah, with love/i);
    // Configured maxLength is 30 — the native input attribute should stop
    // the browser from accepting more, regardless of what's typed.
    await input.fill("x".repeat(60));
    await expect(input).toHaveValue("x".repeat(30));
  });

  test("carries the typed message and chosen font into the cart", async ({ page }) => {
    await page.goto(`/product/${PERSONALISABLE_SLUG}`);
    await page.getByPlaceholder(/to sarah, with love/i).fill("Congrats on the new home!");
    await page.getByRole("button", { name: "Script" }).click();
    await page.getByRole("button", { name: "Add to Cart" }).click();

    await page.goto("/cart");
    await expect(page.getByText("Congrats on the new home!")).toBeVisible();
    await expect(page.getByText("Script", { exact: true })).toBeVisible();
  });

  test("a script-tag-shaped message is stored as inert text, not executed", async ({ page }) => {
    let dialogFired = false;
    page.on("dialog", (dialog) => {
      dialogFired = true;
      void dialog.dismiss();
    });

    await page.goto(`/product/${PERSONALISABLE_SLUG}`);
    const payload = '<img src=x onerror=alert(1)>';
    await page.getByPlaceholder(/to sarah, with love/i).fill(payload);
    await page.getByRole("button", { name: "Add to Cart" }).click();
    await page.goto("/cart");

    // React renders text content escaped — the payload shows up as visible
    // literal text on the page, and never as a live <img> element that
    // could fire onerror.
    await expect(page.locator("main")).toContainText(payload);
    expect(dialogFired).toBe(false);
  });

  test("guest checkout with a personalised hamper reaches a real order confirmation", async ({
    page,
  }) => {
    await page.goto(`/product/${PERSONALISABLE_SLUG}`);
    await page.getByPlaceholder(/to sarah, with love/i).fill("Happy Anniversary!");
    await page.getByRole("button", { name: "Add to Cart" }).click();
    await page.goto("/checkout");

    await page.getByLabel(/Email \(for order updates\)/).fill("qa+hamper@example.com");
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
  });
});

test.describe("Hamper discovery", () => {
  test("the Hamper pill appears and filters on the main Shop page", async ({ page }) => {
    await page.goto("/shop");
    await expect(page.getByRole("button", { name: "Hampers" })).toBeVisible();
    await page.getByRole("button", { name: "Hampers" }).click();
    await expect(page).toHaveURL(/category=hamper/);
    await expect(page.getByText("Test Pre-Built Hamper")).toBeVisible();
    await expect(page.getByText(PERSONALISABLE_NAME)).toBeVisible();
  });

  test("the Hamper pill appears on an audience page and is distinct from Luxury", async ({
    page,
  }) => {
    await page.goto("/shop/her");
    await expect(page.getByRole("button", { name: "Hampers" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Luxury" })).toBeVisible();
  });

  test("the Gift Hampers collection page loads with both fixture products", async ({ page }) => {
    await page.goto("/collections/hampers");
    await expect(page.getByRole("heading", { name: "Gift Hampers", exact: true }).first()).toBeVisible();
    await expect(page.getByText("Test Pre-Built Hamper")).toBeVisible();
    await expect(page.getByText(PERSONALISABLE_NAME)).toBeVisible();
  });
});

test.describe("Security: server-side bounds on personalisation input", () => {
  test("an oversized text line is rejected at order creation, not just the PDP", async ({
    request,
  }) => {
    // Bypasses the PDP entirely — the native maxLength=30 attribute is a
    // client-side convenience only. The real boundary is the shared Zod
    // schema (textLines: max 200 chars) enforced in createOrderSchema, and
    // it must hold even for a hamper whose own configured maxLength is 30.
    const response = await request.post("/api/orders", {
      data: {
        shippingAddress: {
          label: "Home",
          name: "Security Tester",
          line1: "221B Test Lane",
          city: "Mumbai",
          state: "Maharashtra",
          pincode: "400001",
          phone: "9876543210",
        },
        paymentMethod: "cod",
        guestEmail: "qa+security@example.com",
        guestPhone: "9876543210",
        guestItems: [
          {
            slug: PERSONALISABLE_SLUG,
            quantity: 1,
            customization: { textLines: ["x".repeat(250)], font: "Serif" },
          },
        ],
      },
    });
    expect(response.status()).toBe(400);
  });

  test("a personalised order's price matches the product's own basePrice, not client input", async ({
    request,
  }) => {
    // Confirms price is derived server-side from the product's own
    // basePrice (₹3,499 for this fixture — see the fixture-creation script
    // in project history), never influenced by client-supplied
    // personalisation content. A single call — see the note above this
    // describe block about staying under the guest-checkout rate limit.
    const response = await request.post("/api/orders", {
      data: {
        shippingAddress: {
          label: "Home",
          name: "Security Tester",
          line1: "221B Test Lane",
          city: "Mumbai",
          state: "Maharashtra",
          pincode: "400001",
          phone: "9876543210",
        },
        paymentMethod: "cod",
        guestEmail: "qa+pricing@example.com",
        guestPhone: "9876543210",
        guestItems: [
          {
            slug: PERSONALISABLE_SLUG,
            quantity: 1,
            customization: { textLines: ["an elaborate, premium-sounding message"], font: "Script" },
          },
        ],
      },
    });

    expect(response.status()).toBe(201);
    const body = await response.json();
    expect(body.total).toBe(3499);
  });

  test("creating a hamper product without an admin session is rejected", async ({ request }) => {
    const response = await request.post("/api/admin/products", {
      data: {
        name: "Malicious Hamper",
        pdpType: "HAMPER",
        audience: [],
        category: ["hamper"],
        basePrice: 1,
        images: ["https://placehold.co/100x100"],
        stockQuantity: 1,
        status: "PUBLISHED",
        description: "x",
        delivery: "x",
        whatsInside: [{ name: "x", subtitle: "x", qty: "1x" }],
        textLines: [{ label: "Name", required: false, maxLength: 30, placeholder: "" }],
      },
    });
    expect([401, 403]).toContain(response.status());
  });
});
