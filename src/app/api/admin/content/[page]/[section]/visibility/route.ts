import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdminApi } from "@/lib/admin/require-admin";
import { getSectionSchema } from "@/lib/content-schema";
import { setSectionVisibility } from "@/lib/content-service";

const bodySchema = z.object({ visible: z.boolean() });

// PATCH /api/admin/content/[page]/[section]/visibility — the show/hide
// switch on a Site Content section. Separate from the section's field save
// (../route.ts) so flipping it takes effect immediately, without also
// submitting whatever half-edited copy is in the form.
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ page: string; section: string }> }
) {
  const check = await requireAdminApi("content");
  if ("error" in check) {
    return NextResponse.json({ error: check.error }, { status: check.status });
  }

  const { page, section } = await params;
  const schema = getSectionSchema(page, section);
  if (!schema) {
    return NextResponse.json({ error: "Unknown content section." }, { status: 404 });
  }
  if (!schema.hideable) {
    return NextResponse.json({ error: "This section can't be hidden." }, { status: 400 });
  }

  const parsed = bodySchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  await setSectionVisibility(page, section, parsed.data.visible);
  return NextResponse.json({ success: true, visible: parsed.data.visible });
}
