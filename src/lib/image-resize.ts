import path from "path";
import fs from "fs/promises";
import sharp from "sharp";

// Shared by /api/image-proxy and the /cdn-cgi/image fallback route — one
// place decides what a resize request may read and how it's resized, so the
// two entry points can't drift apart on safety checks.

const ALLOWED_REMOTE_HOSTS = new Set(["placehold.co", "res.cloudinary.com"]);
export const MAX_WIDTH = 3840;

// R2 product photos are read from here whenever Cloudflare's own edge
// resizing isn't the one serving the request (local dev, or the request
// reached this server directly).
function r2Host(): string | null {
  try {
    return process.env.R2_PUBLIC_URL ? new URL(process.env.R2_PUBLIC_URL).hostname : null;
  } catch {
    return null;
  }
}

export type SourceResult = { bytes: Buffer } | { error: string; status: number };

// Reads the original image for `src`, which is either a same-site path
// ("/who-her.png") or an absolute https URL on an allowlisted host.
export async function loadSourceImage(src: string, origin: string): Promise<SourceResult> {
  if (src.startsWith("/")) {
    // Local /public asset. Resolve and confirm the result stays inside
    // public/ — decodeURIComponent first, since a raw "%2e%2e" segment
    // would otherwise sail through a pre-decode ".." check untouched.
    const publicDir = path.join(process.cwd(), "public");
    const decoded = decodeURIComponent(src);
    const resolved = path.join(publicDir, decoded);
    if (!resolved.startsWith(publicDir + path.sep) && resolved !== publicDir) {
      return { error: "Invalid path.", status: 400 };
    }
    try {
      return { bytes: await fs.readFile(resolved) };
    } catch {
      // Not a file in public/ — it may still be a file this app serves at
      // that path (e.g. src/app/icon.png is served at /icon.png, and Next's
      // built-in optimizer used to reach it by fetching the running site).
      // Try the same origin, but only for a plain same-site path: no
      // protocol-relative "//host", nothing that resolves off-origin, and
      // never the image routes or Next internals (no request loops).
      let sameSite: URL | null = null;
      try {
        sameSite = new URL(decoded, origin);
      } catch {}
      if (
        !sameSite ||
        sameSite.origin !== origin ||
        decoded.startsWith("//") ||
        sameSite.pathname.startsWith("/api/") ||
        sameSite.pathname.startsWith("/_next/") ||
        sameSite.pathname.startsWith("/cdn-cgi/")
      ) {
        return { error: "Image not found.", status: 404 };
      }
      try {
        const res = await fetch(sameSite.toString());
        if (!res.ok || !(res.headers.get("content-type") ?? "").startsWith("image/")) {
          return { error: "Image not found.", status: 404 };
        }
        return { bytes: Buffer.from(await res.arrayBuffer()) };
      } catch {
        return { error: "Image not found.", status: 404 };
      }
    }
  }

  let parsed: URL;
  try {
    parsed = new URL(src);
  } catch {
    return { error: "Invalid url.", status: 400 };
  }
  if (
    parsed.protocol !== "https:" ||
    !(ALLOWED_REMOTE_HOSTS.has(parsed.hostname) || parsed.hostname === r2Host())
  ) {
    return { error: "Host not allowed.", status: 400 };
  }
  try {
    const res = await fetch(parsed.toString());
    if (!res.ok) throw new Error("fetch failed");
    return { bytes: Buffer.from(await res.arrayBuffer()) };
  } catch {
    return { error: "Failed to fetch source image.", status: 502 };
  }
}

export type OutputFormat = "webp" | "jpeg" | "png";

// Resizes to `width` (never enlarging) and re-encodes. The URL is a pure
// function of (source, width, quality, format), so the result can be cached
// forever — same immutable-cache intent as Next's own optimizer output.
export async function resizeImage(
  bytes: Buffer,
  opts: { width: number; quality: number; format: OutputFormat }
): Promise<Response> {
  try {
    const pipeline = sharp(bytes).resize({
      width: Math.min(Math.max(Math.round(opts.width), 1), MAX_WIDTH),
      withoutEnlargement: true,
    });
    const q = Math.min(Math.max(Math.round(opts.quality), 1), 100);
    const out =
      opts.format === "jpeg"
        ? pipeline.jpeg({ quality: q })
        : opts.format === "png"
          ? pipeline.png()
          : pipeline.webp({ quality: q });
    const body = await out.toBuffer();
    return new Response(new Uint8Array(body), {
      headers: {
        "Content-Type": `image/${opts.format}`,
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch {
    return Response.json({ error: "Failed to process image." }, { status: 500 });
  }
}
