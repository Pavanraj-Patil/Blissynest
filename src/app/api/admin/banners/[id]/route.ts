import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/admin/require-admin";
import { updateBanner, setBannerActive, deleteBanner } from "@/lib/banner-service";
import { bannerInputSchema } from "@/lib/validations/banner";
import { z } from "zod";
import { firstIssueMessage } from "@/lib/validations/format-error";

const toggleSchema = z.object({ active: z.boolean() });

// PATCH /api/admin/banners/:id — full update, or just {active} to toggle.
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const check = await requireAdminApi("banners");
  if ("error" in check) {
    return NextResponse.json({ error: check.error }, { status: check.status });
  }

  const { id } = await params;
  const body = await request.json().catch(() => null);

  const toggle = toggleSchema.safeParse(body);
  if (toggle.success && Object.keys(body).length === 1) {
    await setBannerActive(id, toggle.data.active);
    return NextResponse.json({ success: true });
  }

  const parsed = bannerInputSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: firstIssueMessage(parsed.error) },
      { status: 400 }
    );
  }

  const banner = await updateBanner(id, parsed.data);
  if (!banner) {
    return NextResponse.json({ error: "Banner not found" }, { status: 404 });
  }
  return NextResponse.json({ banner });
}

// DELETE /api/admin/banners/:id
export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const check = await requireAdminApi("banners");
  if ("error" in check) {
    return NextResponse.json({ error: check.error }, { status: check.status });
  }

  const { id } = await params;
  await deleteBanner(id);
  return NextResponse.json({ success: true });
}
