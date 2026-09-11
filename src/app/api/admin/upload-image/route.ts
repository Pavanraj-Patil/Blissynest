import { NextResponse } from "next/server";
import { v2 as cloudinary, type UploadApiResponse } from "cloudinary";
import { requireAdminApi } from "@/lib/admin/require-admin";

const MAX_BYTES = 8 * 1024 * 1024; // 8MB

// Allowlist, not a broad "image/*" prefix check — that would also accept
// image/svg+xml. SVG is XML and can embed a <script> that runs when the
// file is opened directly or embedded in certain contexts; product photos
// have no legitimate reason to be vector/scriptable files, so it's excluded
// outright rather than attempting to sanitize it.
const ALLOWED_IMAGE_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);

// Magic-byte check for the same four formats ALLOWED_IMAGE_TYPES declares —
// the one piece of upload validation that can't be spoofed by just setting
// a Content-Type header, unlike file.type above.
function hasKnownImageSignature(bytes: Buffer): boolean {
  if (bytes.length < 12) return false;
  const isJpeg = bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff;
  const isPng =
    bytes[0] === 0x89 &&
    bytes[1] === 0x50 &&
    bytes[2] === 0x4e &&
    bytes[3] === 0x47 &&
    bytes[4] === 0x0d &&
    bytes[5] === 0x0a &&
    bytes[6] === 0x1a &&
    bytes[7] === 0x0a;
  const isGif =
    bytes.subarray(0, 6).toString("ascii") === "GIF87a" ||
    bytes.subarray(0, 6).toString("ascii") === "GIF89a";
  const isWebp =
    bytes.subarray(0, 4).toString("ascii") === "RIFF" &&
    bytes.subarray(8, 12).toString("ascii") === "WEBP";
  return isJpeg || isPng || isGif || isWebp;
}

// POST /api/admin/upload-image — admin uploading a real product photo.
// Cloudinary credentials aren't set yet (see .env) until a real account is
// configured; until then this responds with a clear "not configured" error
// instead of a confusing crash, and the admin form's URL/local-path textarea
// remains a working fallback (see BACKEND_TODO.md).
export async function POST(request: Request) {
  const check = await requireAdminApi("products");
  if ("error" in check) {
    return NextResponse.json({ error: check.error }, { status: check.status });
  }

  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;
  if (!cloudName || !apiKey || !apiSecret) {
    return NextResponse.json(
      {
        error:
          "Image upload isn't configured yet — add CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET to .env, then restart the server.",
      },
      { status: 501 }
    );
  }

  const formData = await request.formData().catch(() => null);
  const file = formData?.get("file");
  if (!file || !(file instanceof File)) {
    return NextResponse.json({ error: "No file provided." }, { status: 400 });
  }
  if (!ALLOWED_IMAGE_TYPES.has(file.type)) {
    return NextResponse.json(
      { error: "Only JPEG, PNG, WebP, or GIF images are allowed." },
      { status: 400 }
    );
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: "Image must be under 8MB." }, { status: 400 });
  }

  cloudinary.config({ cloud_name: cloudName, api_key: apiKey, api_secret: apiSecret });

  const bytes = Buffer.from(await file.arrayBuffer());

  // The declared MIME type is client-supplied and spoofable — confirm the
  // file's actual bytes match a known raster-image signature before it
  // goes anywhere near Cloudinary, rather than trusting file.type alone.
  if (!hasKnownImageSignature(bytes)) {
    return NextResponse.json(
      { error: "That file doesn't look like a valid image." },
      { status: 400 }
    );
  }

  try {
    const result = await new Promise<UploadApiResponse>((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: "blissynest/products" },
        (err, res) => {
          if (err || !res) return reject(err ?? new Error("Upload failed"));
          resolve(res);
        }
      );
      stream.end(bytes);
    });

    return NextResponse.json({ url: result.secure_url });
  } catch {
    return NextResponse.json({ error: "Upload to Cloudinary failed." }, { status: 502 });
  }
}
