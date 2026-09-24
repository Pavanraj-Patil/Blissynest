import { NextResponse } from "next/server";
import { loadSourceImage, resizeImage, type OutputFormat } from "@/lib/image-resize";

// GET /cdn-cgi/image/<options>/<source> — a stand-in for Cloudflare's
// Image Transformations, which own this exact URL shape on a domain proxied
// through Cloudflare.
//
// On a proxied domain (the live site, or uat.blissynest.com through the
// tunnel) Cloudflare answers these requests at its edge and they never reach
// this server, so this route never runs there. It exists for when a request
// DOES reach the app directly — e.g. browsing http://localhost:3000 while the
// image loader (src/lib/image-loader.ts) is emitting /cdn-cgi/image URLs
// because CLOUDFLARE_IMAGE_TRANSFORMS is on — so one build works on both
// addresses. Only the options the loader emits are understood: width,
// quality, format.
//
// Source is an absolute URL ("https://images…/blissynest/products/x") or a
// same-site path; what it may actually read is decided in
// src/lib/image-resize.ts, the same allowlist /api/image-proxy uses.
function parseOptions(raw: string): Record<string, string> {
  const out: Record<string, string> = {};
  for (const part of raw.split(",")) {
    const eq = part.indexOf("=");
    if (eq > 0) out[part.slice(0, eq).trim()] = part.slice(eq + 1).trim();
  }
  return out;
}

// "format=auto" in Cloudflare picks by the browser's Accept header; only
// the formats this fallback can produce cheaply are considered.
function pickFormat(requested: string | undefined, accept: string): OutputFormat {
  if (requested === "png") return "png";
  if (requested === "jpeg" || requested === "jpg") return "jpeg";
  if (requested === "webp") return "webp";
  return /image\/webp|image\/avif/.test(accept) ? "webp" : "jpeg";
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ options: string; source: string[] }> }
) {
  const { options, source: segments } = await params;
  const opts = parseOptions(decodeURIComponent(options));

  const width = Number(opts.width ?? opts.w);
  if (!Number.isFinite(width) || width <= 0) {
    return NextResponse.json({ error: "A width is required." }, { status: 400 });
  }
  const quality = Number(opts.quality ?? opts.q);

  // The source's own "//" can arrive collapsed to "/" by the time it's split
  // into segments, so rebuild it rather than trusting the join.
  const joined = segments.map((s) => decodeURIComponent(s)).join("/");
  const src = /^https?:\/+/i.test(joined)
    ? joined.replace(/^(https?):\/+/i, "$1://")
    : `/${joined}`;

  const loaded = await loadSourceImage(src, new URL(request.url).origin);
  if ("error" in loaded) {
    return NextResponse.json({ error: loaded.error }, { status: loaded.status });
  }

  const response = await resizeImage(loaded.bytes, {
    width,
    quality: Number.isFinite(quality) ? quality : 80,
    format: pickFormat(opts.format, request.headers.get("accept") ?? ""),
  });
  // The chosen format depends on the request's Accept header.
  response.headers.set("Vary", "Accept");
  return response;
}
