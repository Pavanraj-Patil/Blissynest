import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/admin/require-admin";
import { createBanner } from "@/lib/banner-service";
import { bannerInputSchema } from "@/lib/validations/banner";
import { firstIssueMessage } from "@/lib/validations/format-error";

// POST /api/admin/banners — create a new homepage promo banner.
export async function POST(request: Request) {
  const check = await requireAdminApi("banners");
  if ("error" in check) {
    return NextResponse.json({ error: check.error }, { status: check.status });
  }

  const body = await request.json().catch(() => null);
  const parsed = bannerInputSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: firstIssueMessage(parsed.error) },
      { status: 400 }
    );
  }

  const banner = await createBanner(parsed.data);
  return NextResponse.json({ banner }, { status: 201 });
}
