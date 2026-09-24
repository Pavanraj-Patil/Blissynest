import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { requireAdminApi } from "@/lib/admin/require-admin";
import { validateUploadedImage } from "@/lib/image-upload-validation";
import { getR2Client } from "@/lib/r2-client";

// POST /api/admin/upload-image-r2 — admin uploading a real product photo,
// stored on Cloudflare R2. Only the original is stored, and the response is
// its public URL; resizing happens later, per request, either at
// Cloudflare's edge (/cdn-cgi/image/…) or through /api/image-proxy — see
// src/lib/image-loader.ts.
//
// Until R2 credentials are configured this responds with a clear "not
// configured" error, same pattern as src/app/api/admin/upload-image/route.ts
// (Cloudinary), which stays in place as a working fallback.
export async function POST(request: Request) {
  const check = await requireAdminApi("products");
  if ("error" in check) {
    return NextResponse.json({ error: check.error }, { status: check.status });
  }

  const bucket = process.env.R2_BUCKET_NAME;
  const publicUrl = process.env.R2_PUBLIC_URL;
  const client = getR2Client();

  if (!client || !bucket || !publicUrl) {
    return NextResponse.json(
      {
        error:
          "Image upload isn't configured yet — add R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET_NAME, and R2_PUBLIC_URL to .env, then restart the server.",
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

  return NextResponse.json({ url: `${publicUrl.replace(/\/$/, "")}/${key}` });
}
