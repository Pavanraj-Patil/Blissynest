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

export type ValidatedUpload = { bytes: Buffer; contentType: string };
export type ValidationError = { error: string; status: number };

// Shared by every "admin uploads a product photo" route regardless of which
// storage backend it ends up in (Cloudinary, R2, ...) — the file-safety
// rules don't change based on where the bytes are going.
export async function validateUploadedImage(
  request: Request
): Promise<ValidationError | ValidatedUpload> {
  const formData = await request.formData().catch(() => null);
  const file = formData?.get("file");
  if (!file || !(file instanceof File)) {
    return { error: "No file provided.", status: 400 };
  }
  if (!ALLOWED_IMAGE_TYPES.has(file.type)) {
    return { error: "Only JPEG, PNG, WebP, or GIF images are allowed.", status: 400 };
  }
  if (file.size > MAX_BYTES) {
    return { error: "Image must be under 8MB.", status: 400 };
  }

  const bytes = Buffer.from(await file.arrayBuffer());

  // The declared MIME type is client-supplied and spoofable — confirm the
  // file's actual bytes match a known raster-image signature before it goes
  // anywhere near a storage backend, rather than trusting file.type alone.
  if (!hasKnownImageSignature(bytes)) {
    return { error: "That file doesn't look like a valid image.", status: 400 };
  }

  return { bytes, contentType: file.type };
}
