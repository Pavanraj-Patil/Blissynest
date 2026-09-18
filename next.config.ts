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

const CSP = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline' ${isProd ? "" : "'unsafe-eval' "}https://checkout.razorpay.com`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: https://placehold.co https://res.cloudinary.com https://imagedelivery.net",
  "font-src 'self' data:",
  "connect-src 'self' https://api.razorpay.com https://lumberjack.razorpay.com",
  "frame-src https://api.razorpay.com https://checkout.razorpay.com",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
].join("; ");

const nextConfig: NextConfig = {
  images: {
    // A custom loader replaces Next's built-in optimizer for every <Image>
    // in the app — see src/lib/cloudflare-images-loader.ts for why it still
    // behaves identically for every source that isn't a new Cloudflare
    // Images URL. remotePatterns below is still enforced: the loader's
    // fallback branch routes through Next's own internal /_next/image
    // route, which checks this allowlist itself.
    loader: "custom",
    loaderFile: "./src/lib/cloudflare-images-loader.ts",
    remotePatterns: [
      {
        protocol: "https",
        hostname: "placehold.co",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      {
        protocol: "https",
        hostname: "imagedelivery.net",
      },
    ],
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
            value: "max-age=63072000; includeSubDomains; preload",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
