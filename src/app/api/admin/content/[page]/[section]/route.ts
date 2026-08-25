import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/admin/require-admin";
import { getSectionSchema } from "@/lib/content-schema";
import { setContentBlock } from "@/lib/content-service";

// Runtime shape check per field's declared type — a section's schema
// (content-schema.ts) is the validation source, so there's no separate
// per-section Zod schema to keep in sync as sections get added.
function isValidForType(type: string, value: unknown): boolean {
  if (type === "TEXT" || type === "IMAGE") return typeof value === "string";
  if (type === "LINK") {
    return (
      typeof value === "object" &&
      value !== null &&
      typeof (value as Record<string, unknown>).label === "string" &&
      typeof (value as Record<string, unknown>).href === "string"
    );
  }
  if (type === "LIST") return Array.isArray(value);
  return false;
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ page: string; section: string }> }
) {
  const check = await requireAdminApi();
  if ("error" in check) {
    return NextResponse.json({ error: check.error }, { status: check.status });
  }

  const { page, section } = await params;
  const schema = getSectionSchema(page, section);
  if (!schema) {
    return NextResponse.json({ error: "Unknown content section." }, { status: 404 });
  }

  const body = await request.json().catch(() => null);
  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  for (const [key, descriptor] of Object.entries(schema.fields)) {
    if (!(key in body)) continue;
    if (!isValidForType(descriptor.type, (body as Record<string, unknown>)[key])) {
      return NextResponse.json(
        { error: `Invalid value for "${descriptor.label}".` },
        { status: 400 }
      );
    }
  }

  for (const [key, descriptor] of Object.entries(schema.fields)) {
    if (!(key in body)) continue;
    await setContentBlock(page, section, key, descriptor.type, (body as Record<string, unknown>)[key]);
  }

  return NextResponse.json({ success: true });
}
