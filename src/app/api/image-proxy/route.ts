import { NextResponse } from "next/server";
import path from "path";
import fs from "fs/promises";
import sharp from "sharp";

// GET /api/image-proxy?url=<src>&w=<width>&q=<quality>
//
// Stands in for Next's own built-in /_next/image optimizer, which Next.js
// disables entirely once images.loader is set to "custom" (see
// next.config.ts and src/lib/cloudflare-images-loader.ts) — confirmed by
// hitting /_next/image directly after that config change and getting a
// 404. This route reproduces the same resize/reformat behavior so every
// existing image source (local /public files, placehold.co, Cloudinary)
// keeps working exactly as before; only new Cloudflare Images URLs skip
// this route entirely and go straight to imagedelivery.net.
//
// Same-origin local files only need a path-traversal guard; remote sources
// are checked against the identical host allowlist next.config.ts's
// remotePatterns already declares, so this can't be used as an open SSRF
// proxy to arbitrary URLs.
const ALLOWED_REMOTE_HOSTS = new Set(["placehold.co", "res.cloudinary.com"]);
const MAX_WIDTH = 3840;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const src = searchParams.get("url");
  const widthParam = Number(searchParams.get("w"));
  const qualityParam = Number(searchParams.get("q"));

  if (!src || !Number.isFinite(widthParam) || widthParam <= 0) {
    return NextResponse.json({ error: "Invalid url or width." }, { status: 400 });
  }
  const width = Math.min(Math.round(widthParam), MAX_WIDTH);
  const quality = Number.isFinite(qualityParam)
    ? Math.min(Math.max(Math.round(qualityParam), 1), 100)
    : 75;

  let sourceBytes: Buffer;

  if (src.startsWith("/")) {
    // Local /public asset. Resolve and confirm the result stays inside
    // public/ — decodeURIComponent first, since a raw "%2e%2e" segment
    // would otherwise sail through a pre-decode ".." check untouched.
    const publicDir = path.join(process.cwd(), "public");
    const decoded = decodeURIComponent(src);
    const resolved = path.join(publicDir, decoded);
    if (!resolved.startsWith(publicDir + path.sep) && resolved !== publicDir) {
      return NextResponse.json({ error: "Invalid path." }, { status: 400 });
    }
    try {
      sourceBytes = await fs.readFile(resolved);
    } catch {
      // Not a file in public/ — it may still be a file this app serves at
      // that path (e.g. src/app/icon.png is served at /icon.png, and Next's
      // built-in optimizer used to reach it by fetching the running site).
      // Try the same origin, but only for a plain same-site path: no
      // protocol-relative "//host", nothing that resolves off-origin, and
      // never this route or Next internals (no request loops).
      const origin = new URL(request.url).origin;
      let sameSite: URL | null = null;
      try {
        sameSite = new URL(decoded, origin);
      } catch {}
      if (
        !sameSite ||
        sameSite.origin !== origin ||
        decoded.startsWith("//") ||
        sameSite.pathname.startsWith("/api/") ||
        sameSite.pathname.startsWith("/_next/")
      ) {
        return NextResponse.json({ error: "Image not found." }, { status: 404 });
      }
      try {
        const res = await fetch(sameSite.toString());
        if (!res.ok || !(res.headers.get("content-type") ?? "").startsWith("image/")) {
          return NextResponse.json({ error: "Image not found." }, { status: 404 });
        }
        sourceBytes = Buffer.from(await res.arrayBuffer());
      } catch {
        return NextResponse.json({ error: "Image not found." }, { status: 404 });
      }
    }
  } else {
    let parsed: URL;
    try {
      parsed = new URL(src);
    } catch {
      return NextResponse.json({ error: "Invalid url." }, { status: 400 });
    }
    if (parsed.protocol !== "https:" || !ALLOWED_REMOTE_HOSTS.has(parsed.hostname)) {
      return NextResponse.json({ error: "Host not allowed." }, { status: 400 });
    }
    try {
      const res = await fetch(parsed.toString());
      if (!res.ok) throw new Error("fetch failed");
      sourceBytes = Buffer.from(await res.arrayBuffer());
    } catch {
      return NextResponse.json({ error: "Failed to fetch source image." }, { status: 502 });
    }
  }

  try {
    const resized = await sharp(sourceBytes)
      .resize({ width, withoutEnlargement: true })
      .webp({ quality })
      .toBuffer();

    return new NextResponse(resized, {
      headers: {
        "Content-Type": "image/webp",
        // Same immutable-cache intent as Next's own optimizer output —
        // the URL is a pure function of (src, width, quality), so a cached
        // response never goes stale.
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch {
    return NextResponse.json({ error: "Failed to process image." }, { status: 500 });
  }
}
