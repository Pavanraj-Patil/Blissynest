import { defineConfig, devices } from "@playwright/test";

// Local dev-server E2E suite — see e2e/README.md for scope and conventions.
// Reuses this project's own dev server (npm run dev) rather than a separate
// test server, since the app has no mocked backend layer to swap in: it's
// always talking to the real MySQL dev database.
export default defineConfig({
  testDir: "./e2e",
  globalSetup: "./e2e/global-setup.ts",
  fullyParallel: true,
  // The dev DB adapter caps its pool at 5 connections (src/lib/db.ts), and
  // each worker is a real browser process — kept modest so a local run
  // against the real dev server stays reliable rather than queuing behind
  // itself under system/DB-connection pressure.
  workers: 3,
  forbidOnly: !!process.env.CI,
  retries: 1,
  reporter: [["html", { open: "never" }], ["list"]],
  use: {
    baseURL: "http://localhost:3000",
    trace: "on-first-retry",
    screenshot: "only-on-failure",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "mobile-chromium",
      use: { ...devices["Pixel 7"] },
    },
  ],
  webServer: {
    command: "npm run dev",
    url: "http://localhost:3000",
    reuseExistingServer: true,
    timeout: 60_000,
  },
});
