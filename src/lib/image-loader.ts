// Global custom loader for next/image (see next.config.ts's images.loader).
// Setting a custom loader replaces Next's own built-in optimizer for EVERY
// <Image> in the app, so this has to handle every source, not just new ones.
//
// Photos stored in R2 (admin product uploads): when the site is served
// through Cloudflare with Image Transformations on (CLOUDFLARE_IMAGE_TRANSFORMS
// = "true"), the browser asks Cloudflare's edge to resize them —
//   /cdn-cgi/image/width=800,quality=80,format=auto/<original R2 URL>
// — so the resize work never touches our own server, and it's free up to
// 5,000 unique transforms a month. That path only exists on a domain
// proxied by Cloudflare, so it's off by default (local dev, or a deployment
// not yet behind Cloudflare) and R2 photos take the fallback below instead.
//
// Everything else — local /public files, placehold.co, Cloudinary, and R2
// photos when transforms are off — goes through /api/image-proxy, a small
// self-hosted stand-in for Next's built-in optimizer. That built-in
// optimizer isn't an option once a custom loader is set: Next disables its
// own /_next/image route entirely (confirmed: it 404s).
//
// Both values are inlined at build time from next.config.ts's `env`.
const TRANSFORMS_ENABLED = process.env.NEXT_PUBLIC_CF_TRANSFORMS === "true";
const R2_ORIGIN = process.env.NEXT_PUBLIC_R2_ORIGIN ?? "";

type ImageLoaderProps = {
  src: string;
  width: number;
  quality?: number;
};

export default function imageLoader({ src, width, quality }: ImageLoaderProps): string {
  if (TRANSFORMS_ENABLED && R2_ORIGIN && src.startsWith(`${R2_ORIGIN}/`)) {
    return `/cdn-cgi/image/width=${width},quality=${quality ?? 80},format=auto/${src}`;
  }

  return `/api/image-proxy?url=${encodeURIComponent(src)}&w=${width}&q=${quality ?? 75}`;
}
