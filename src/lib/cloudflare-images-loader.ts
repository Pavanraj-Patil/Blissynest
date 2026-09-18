// Global custom loader for next/image (see next.config.ts's images.loader).
// Setting a custom loader replaces Next's own built-in optimizer for EVERY
// <Image> in the app, not just new ones — so this has to keep behaving
// exactly like the built-in optimizer for every source that isn't one of
// our new Cloudflare Images URLs (existing local /public files, Cloudinary
// URLs if that path is ever reactivated, placehold.co), or every image on
// the site would break the moment this file ships, regardless of whether
// R2/Cloudflare Images credentials are even configured yet.
//
// Cloudflare Images sources: apply width/quality/format as a "flexible
// variant" segment (must be enabled once in the Cloudflare Images
// dashboard) — https://imagedelivery.net/<hash>/<id>/w=800,quality=80,format=auto
//
// Everything else: routed through /api/image-proxy, a small self-hosted
// stand-in for Next's built-in optimizer. That built-in optimizer isn't an
// option here — Next fully disables its own /_next/image route once a
// custom loader is configured (confirmed directly: it 404s), so there's no
// way to "fall through" to it. /api/image-proxy enforces the same host
// allowlist next.config.ts's remotePatterns declares.
const CLOUDFLARE_IMAGES_HOST = "imagedelivery.net";

type ImageLoaderProps = {
  src: string;
  width: number;
  quality?: number;
};

export default function cloudflareImagesLoader({ src, width, quality }: ImageLoaderProps): string {
  try {
    const url = new URL(src, "http://internal.invalid");
    if (url.hostname === CLOUDFLARE_IMAGES_HOST) {
      const q = quality ?? 80;
      return `${src}/w=${width},quality=${q},format=auto`;
    }
  } catch {
    // Unparseable as an absolute URL — treated as a local /public path,
    // which always falls through to the default branch below anyway.
  }

  const q = quality ?? 75;
  return `/api/image-proxy?url=${encodeURIComponent(src)}&w=${width}&q=${q}`;
}
