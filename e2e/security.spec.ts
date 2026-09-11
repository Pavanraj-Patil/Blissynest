import { test, expect } from "@playwright/test";

// Regression coverage for the security-review pass: response headers
// (next.config.ts) and rate limiting (src/lib/rate-limit.ts usages). Upload
// validation (src/app/api/admin/upload-image/route.ts) isn't covered here —
// exercising it needs an authenticated admin session and configured
// Cloudinary credentials, neither of which exist in this dev environment;
// its magic-byte/allowlist logic was verified separately in isolation.

test.describe("Security headers", () => {
  test("responses carry the expected security headers", async ({ request }) => {
    const response = await request.get("/");
    const headers = response.headers();

    expect(headers["content-security-policy"]).toContain("default-src 'self'");
    expect(headers["content-security-policy"]).toContain("frame-ancestors 'none'");
    expect(headers["content-security-policy"]).toContain("object-src 'none'");
    expect(headers["x-frame-options"]).toBe("DENY");
    expect(headers["x-content-type-options"]).toBe("nosniff");
    expect(headers["referrer-policy"]).toBe("strict-origin-when-cross-origin");
    expect(headers["permissions-policy"]).toContain("camera=()");
    expect(headers["strict-transport-security"]).toContain("max-age=");
  });

  test("API routes also carry the security headers", async ({ request }) => {
    const response = await request.get("/api/search?q=gift");
    const headers = response.headers();

    expect(headers["x-frame-options"]).toBe("DENY");
    expect(headers["x-content-type-options"]).toBe("nosniff");
  });
});

test.describe("Rate limiting", () => {
  test("order tracking is rate-limited after repeated requests from the same client", async ({
    request,
  }) => {
    let sawTooManyRequests = false;

    for (let i = 0; i < 20; i++) {
      const response = await request.get(
        `/api/orders/track?orderNumber=BLS-NOPE-${i}&email=nobody@example.com`
      );
      if (response.status() === 429) {
        sawTooManyRequests = true;
        expect(response.headers()["retry-after"]).toBeTruthy();
        break;
      }
      expect(response.status()).toBe(404);
    }

    expect(sawTooManyRequests).toBe(true);
  });

  test("a rate-limited response never leaks whether the order actually exists", async ({
    request,
  }) => {
    let limited: Awaited<ReturnType<typeof request.get>> | null = null;
    for (let i = 0; i < 20; i++) {
      const response = await request.get(
        `/api/orders/track?orderNumber=BLS-NOPE2-${i}&email=nobody@example.com`
      );
      if (response.status() === 429) {
        limited = response;
        break;
      }
    }
    expect(limited).not.toBeNull();
    const body = (await limited!.json()) as { order?: unknown };
    expect(body.order).toBeUndefined();
  });
});

test.describe("Upload endpoint authorization", () => {
  test("uploading an image without an admin session is rejected", async ({ request }) => {
    const response = await request.post("/api/admin/upload-image", {
      multipart: {
        file: {
          name: "test.jpg",
          mimeType: "image/jpeg",
          buffer: Buffer.from([0xff, 0xd8, 0xff, 0xe0]),
        },
      },
    });
    expect([401, 403]).toContain(response.status());
  });
});
