import type { NextConfig } from "next";

// Next.js's App Router hydration bootstrap relies on inline <script> tags,
// so 'unsafe-inline' stays in script-src until those scripts move to a
// per-request nonce (would need middleware.ts, which this app doesn't have
// yet — see AGENTS.md). Every other directive here is a real restriction:
// frame-ancestors blocks clickjacking, object-src/base-uri block the two
// classic injection pivots, and connect/frame-src are scoped to exactly
// the one third-party origin (Razorpay's checkout) this app talks to.
// React's dev-mode overlay uses eval() to rebuild component stack traces
// across bundle boundaries — harmless locally, but React itself guarantees
// it "will never use eval() in production mode", so unsafe-eval is scoped
// to dev only rather than weakening the production policy for a dev-only need.
const isProd = process.env.NODE_ENV === "production";

// Shopper-uploaded photos (see /api/upload-customer-image) are shown as plain
// <img>s straight from the R2 bucket's public URL, so that origin has to be
// allowed by img-src. Read from env because the bucket URL is per-deployment.
const r2ImgOrigin = (() => {
  try {
    return process.env.R2_PUBLIC_URL ? ` ${new URL(process.env.R2_PUBLIC_URL).origin}` : "";
  } catch {
    return "";
  }
})();

const CSP = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline' ${isProd ? "" : "'unsafe-eval' "}https://checkout.razorpay.com`,
  "style-src 'self' 'unsafe-inline'",
  `img-src 'self' data: https://placehold.co https://res.cloudinary.com${r2ImgOrigin}`,
  "font-src 'self' data:",
  "connect-src 'self' https://api.razorpay.com https://lumberjack.razorpay.com",
  "frame-src https://api.razorpay.com https://checkout.razorpay.com",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
].join("; ");

const nextConfig: NextConfig = {
  // uat.blissynest.com is a Cloudflare tunnel to a laptop running `next dev`.
  // In dev, Next blocks its hot-reload connection (/_next/hmr) from any host
  // it isn't told about, and a page that can't complete it never hydrates —
  // it renders, but no button or menu responds. Development only: ignored by
  // `next build`/`next start`.
  allowedDevOrigins: ["uat.blissynest.com"],
  // Read by src/lib/image-loader.ts in the browser. Public by nature: the R2
  // origin is the bucket's public URL, and the flag is just on/off.
  env: {
    NEXT_PUBLIC_R2_ORIGIN: r2ImgOrigin.trim(),
    NEXT_PUBLIC_CF_TRANSFORMS: process.env.CLOUDFLARE_IMAGE_TRANSFORMS ?? "",
  },
  images: {
    // A custom loader replaces Next's built-in optimizer for every <Image>
    // in the app — see src/lib/image-loader.ts. (remotePatterns below only
    // applies to Next's own optimizer, which a custom loader disables;
    // /api/image-proxy keeps its own host allowlist.)
    loader: "custom",
    loaderFile: "./src/lib/image-loader.ts",
    // Widths <Image> may ask for. Next's defaults list 16 sizes (up to 3840px),
    // so a single photo could be requested — and resized — at a dozen different
    // widths, each one a separate cold cache entry and, on Cloudflare's free
    // plan, a separate "unique transformation". A short list means far more
    // requests hit an already-made copy, and phones/desktops share them.
    deviceSizes: [640, 828, 1080, 1440, 1920],
    imageSizes: [64, 128, 256, 384],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "placehold.co",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
  },
  async redirects() {
    // Browsers and crawlers ask for /favicon.ico by habit; the real icon is a PNG.
    return [{ source: "/favicon.ico", destination: "/favicon.png", permanent: false }];
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "Content-Security-Policy", value: CSP },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
          },
          {
            key: "Strict-Transport-Security",
            // No "preload": that submits the whole domain (every subdomain)
            // to browsers' built-in HTTPS-only list, which is very hard to
            // undo if any subdomain ever needs plain HTTP.
            value: "max-age=31536000; includeSubDomains",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
