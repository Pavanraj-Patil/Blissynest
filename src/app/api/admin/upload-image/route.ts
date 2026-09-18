import { NextResponse } from "next/server";
import { v2 as cloudinary, type UploadApiResponse } from "cloudinary";
import { requireAdminApi } from "@/lib/admin/require-admin";
import { validateUploadedImage } from "@/lib/image-upload-validation";

// POST /api/admin/upload-image — admin uploading a real product photo to
// Cloudinary. Kept in place (and working) as a fallback/revert path even
// after R2 + Cloudflare Images (see upload-image-r2/route.ts) became the
// active integration — switching back is just re-adding these three env
// vars and pointing the uploader components at this route again.
//
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

  const validated = await validateUploadedImage(request);
  if ("error" in validated) {
    return NextResponse.json({ error: validated.error }, { status: validated.status });
  }
  const { bytes } = validated;

  cloudinary.config({ cloud_name: cloudName, api_key: apiKey, api_secret: apiSecret });

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
