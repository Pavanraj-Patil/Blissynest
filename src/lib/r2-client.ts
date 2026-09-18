import { S3Client } from "@aws-sdk/client-s3";

// R2 is S3-compatible — same client, just pointed at Cloudflare's endpoint
// instead of AWS's. Returns null (rather than throwing) when credentials
// aren't configured yet, matching the same "not configured" pattern the
// Cloudinary route already uses, so callers can respond with a clear error
// instead of a crash.
export function getR2Client(): S3Client | null {
  const accountId = process.env.R2_ACCOUNT_ID;
  const accessKeyId = process.env.R2_ACCESS_KEY_ID;
  const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;
  if (!accountId || !accessKeyId || !secretAccessKey) return null;

  return new S3Client({
    region: "auto",
    endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
    credentials: { accessKeyId, secretAccessKey },
  });
}
