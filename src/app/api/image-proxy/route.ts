import { NextResponse } from "next/server";
import { loadSourceImage, resizeImage } from "@/lib/image-resize";

// GET /api/image-proxy?url=<src>&w=<width>&q=<quality>
//
// Stands in for Next's own built-in /_next/image optimizer, which Next.js
// disables entirely once images.loader is set to "custom" (see
// next.config.ts and src/lib/image-loader.ts) — confirmed by hitting
// /_next/image directly after that config change and getting a 404. This
// route reproduces the same resize/reformat behavior for every image source
// (local /public files, placehold.co, Cloudinary, and R2 photos when
// Cloudflare's edge resizing isn't in front of the site). With that resizing
// on, R2 photos skip this route and are resized at Cloudflare instead.
//
// What it may read (local files, same-site paths, allowlisted hosts) is
// decided in src/lib/image-resize.ts, so this can't be used as an open SSRF
// proxy to arbitrary URLs.
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const src = searchParams.get("url");
  const width = Number(searchParams.get("w"));
  const quality = Number(searchParams.get("q"));

  if (!src || !Number.isFinite(width) || width <= 0) {
    return NextResponse.json({ error: "Invalid url or width." }, { status: 400 });
  }

  const source = await loadSourceImage(src, new URL(request.url).origin);
  if ("error" in source) {
    return NextResponse.json({ error: source.error }, { status: source.status });
  }

  return resizeImage(source.bytes, {
    width,
    quality: Number.isFinite(quality) ? quality : 75,
    format: "webp",
  });
}
