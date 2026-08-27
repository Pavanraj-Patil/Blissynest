import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/admin/require-admin";
import { getSectionSchema, type FieldDescriptor } from "@/lib/content-schema";
import type { ListFieldDef } from "@/components/admin/RepeatingListField";
import { setContentBlock } from "@/lib/content-service";

// Checks one row of a LIST/NESTED_LIST field against its declared
// listFields/itemFields shape — every key must be present with the right
// primitive type for its `kind`. Without this, a saved row missing a
// field (or holding the wrong type) only surfaces later as a runtime
// crash or blank render deep in whatever page component consumes it.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function isValidItem(fields: ListFieldDef<any>[], item: unknown): boolean {
  if (typeof item !== "object" || item === null) return false;
  const record = item as Record<string, unknown>;

  return fields.every((field) => {
    const value = record[field.key as string];
    if (field.kind === "checkbox") return typeof value === "boolean";
    if (field.kind === "number") return typeof value === "number" && Number.isFinite(value);
    if (field.kind === "taglist") return Array.isArray(value) && value.every((v) => typeof v === "string");
    // text / select / color all store a plain string
    return typeof value === "string";
  });
}

// Runtime shape check per field's declared type — a section's schema
// (content-schema.ts) is the validation source, so there's no separate
// per-section Zod schema to keep in sync as sections get added.
function isValidForField(descriptor: FieldDescriptor, value: unknown): boolean {
  if (descriptor.type === "TEXT" || descriptor.type === "IMAGE") return typeof value === "string";

  if (descriptor.type === "IMAGE_RESPONSIVE") {
    if (typeof value !== "object" || value === null) return false;
    const record = value as Record<string, unknown>;
    return (
      typeof record.desktop === "string" &&
      (record.mobile === undefined || typeof record.mobile === "string")
    );
  }

  if (descriptor.type === "LINK") {
    return (
      typeof value === "object" &&
      value !== null &&
      typeof (value as Record<string, unknown>).label === "string" &&
      typeof (value as Record<string, unknown>).href === "string"
    );
  }

  if (descriptor.type === "LIST") {
    return Array.isArray(value) && value.every((item) => isValidItem(descriptor.listFields, item));
  }

  if (descriptor.type === "NESTED_LIST") {
    if (!Array.isArray(value)) return false;
    return value.every((group) => {
      if (typeof group !== "object" || group === null) return false;
      const record = group as Record<string, unknown>;
      if (typeof record[descriptor.groupNameField] !== "string") return false;
      const items = record[descriptor.itemsField];
      return Array.isArray(items) && items.every((item) => isValidItem(descriptor.itemFields, item));
    });
  }

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
    if (!isValidForField(descriptor, (body as Record<string, unknown>)[key])) {
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
