import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { requireAdminApi } from "@/lib/admin/require-admin";
import { validateUploadedImage } from "@/lib/image-upload-validation";
import { getR2Client } from "@/lib/r2-client";

// POST /api/admin/upload-image-r2 — admin uploading a real product photo,
// stored on Cloudflare R2 and served/resized through Cloudflare Images.
//
// Two steps, because R2 alone only stores bytes — it does no resizing:
//   1. Upload the original to R2 (needs a *publicly reachable* bucket URL,
//      since step 2 has Cloudflare's own servers fetch it over the open
//      internet, not via the S3 credentials used to write it).
//   2. Register that public URL with Cloudflare Images, which returns an
//      image id. The base delivery URL built from that id (WITHOUT a
//      variant suffix) is what gets stored — see
//      src/lib/cloudflare-images-loader.ts for how a width/quality/format
//      get appended per-request via flexible variants.
//
// Requires a real Cloudflare account (R2 bucket + API token, Cloudflare
// Images enabled with flexible variants on) — until then this responds
// with a clear "not configured" error, same pattern as
// src/app/api/admin/upload-image/route.ts (Cloudinary), which stays in
// place as a working fallback.
export async function POST(request: Request) {
  const check = await requireAdminApi("products");
  if ("error" in check) {
    return NextResponse.json({ error: check.error }, { status: check.status });
  }

  const bucket = process.env.R2_BUCKET_NAME;
  const publicUrl = process.env.R2_PUBLIC_URL;
  const accountId = process.env.R2_ACCOUNT_ID;
  const cfAccountHash = process.env.CLOUDFLARE_IMAGES_ACCOUNT_HASH;
  const cfApiToken = process.env.CLOUDFLARE_IMAGES_API_TOKEN;
  const client = getR2Client();

  if (!client || !bucket || !publicUrl || !accountId || !cfAccountHash || !cfApiToken) {
    return NextResponse.json(
      {
        error:
          "Image upload isn't configured yet — add R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET_NAME, R2_PUBLIC_URL, CLOUDFLARE_IMAGES_ACCOUNT_HASH, and CLOUDFLARE_IMAGES_API_TOKEN to .env, then restart the server.",
      },
      { status: 501 }
    );
  }

  const validated = await validateUploadedImage(request);
  if ("error" in validated) {
    return NextResponse.json({ error: validated.error }, { status: validated.status });
  }
  const { bytes, contentType } = validated;

  const key = `blissynest/products/${randomUUID()}`;
  try {
    await client.send(
      new PutObjectCommand({ Bucket: bucket, Key: key, Body: bytes, ContentType: contentType })
    );
  } catch {
    return NextResponse.json({ error: "Upload to R2 failed." }, { status: 502 });
  }

  const sourceUrl = `${publicUrl.replace(/\/$/, "")}/${key}`;

  try {
    const form = new FormData();
    form.append("url", sourceUrl);
    const cfRes = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${accountId}/images/v1`,
      { method: "POST", headers: { Authorization: `Bearer ${cfApiToken}` }, body: form }
    );
    const cfData = await cfRes.json();
    if (!cfRes.ok || !cfData.success) {
      return NextResponse.json(
        { error: "Cloudflare Images registration failed." },
        { status: 502 }
      );
    }
    // No variant suffix here on purpose — the custom next/image loader
    // appends `/w=...,quality=...,format=auto` per request.
    const deliveryUrl = `https://imagedelivery.net/${cfAccountHash}/${cfData.result.id}`;
    return NextResponse.json({ url: deliveryUrl });
  } catch {
    return NextResponse.json({ error: "Cloudflare Images registration failed." }, { status: 502 });
  }
}
