import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { validateUploadedImage } from "@/lib/image-upload-validation";
import { getR2Client } from "@/lib/r2-client";
import { checkRateLimit, getClientIp, tooManyRequestsResponse } from "@/lib/rate-limit";
import { CUSTOMER_UPLOAD_KEY_PREFIX, customerUploadUrl } from "@/lib/customer-uploads";

// POST /api/upload-customer-image — a shopper attaching their own photo to a
// customisable product. Open to guests (guest checkout exists), so unlike
// the admin upload routes there's no session gate; the protection is the
// same file validation (type allowlist, magic bytes, 8MB cap) plus a
// per-IP rate limit, and the files land under their own key prefix so they
// never mix with catalogue images. The original is stored as-is — these are
// print/production source files for the seller, not storefront images, so
// there's no Cloudflare Images registration or resizing here.
export async function POST(request: Request) {
  const limit = checkRateLimit(`customer-upload:${getClientIp(request)}`, 20, 10 * 60 * 1000);
  if (!limit.allowed) return tooManyRequestsResponse(limit.retryAfterSeconds!);

  const bucket = process.env.R2_BUCKET_NAME;
  const client = getR2Client();
  if (!client || !bucket || !process.env.R2_PUBLIC_URL) {
    return NextResponse.json(
      { error: "Photo upload isn't available right now. Please try again later." },
      { status: 501 }
    );
  }

  const validated = await validateUploadedImage(request);
  if ("error" in validated) {
    return NextResponse.json({ error: validated.error }, { status: validated.status });
  }

  const key = `${CUSTOMER_UPLOAD_KEY_PREFIX}${randomUUID()}`;
  try {
    await client.send(
      new PutObjectCommand({
        Bucket: bucket,
        Key: key,
        Body: validated.bytes,
        ContentType: validated.contentType,
      })
    );
  } catch {
    return NextResponse.json({ error: "Upload failed. Please try again." }, { status: 502 });
  }

  return NextResponse.json({ url: customerUploadUrl(key) });
}
