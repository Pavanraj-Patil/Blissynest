import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/admin/require-admin";
import { updateSiteSettings } from "@/lib/admin/settings-service";
import { siteSettingsSchema } from "@/lib/validations/admin-settings";

export async function PATCH(request: Request) {
  const check = await requireAdminApi();
  if ("error" in check) {
    return NextResponse.json({ error: check.error }, { status: check.status });
  }

  const body = await request.json().catch(() => null);
  const parsed = siteSettingsSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid request" },
      { status: 400 }
    );
  }

  await updateSiteSettings(parsed.data);
  return NextResponse.json({ success: true });
}
