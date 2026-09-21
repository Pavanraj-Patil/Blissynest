import { cache } from "react";
import { db } from "@/lib/db";
import { contentSchema, type ContentFieldType } from "@/lib/content-schema";
import type { Prisma } from "@/generated/prisma/client";

// Wrapped in React's cache() so the ~10 homepage components that each
// need this page's content only trigger one query per request instead
// of one each.
export const getContentBlocks = cache(async (page: string) => {
  const rows = await db.contentBlock.findMany({ where: { page } });
  const map = new Map<string, unknown>();
  for (const row of rows) map.set(`${row.section}.${row.key}`, row.value);
  return map;
});

// Returns { [section]: { [key]: value } } for every field declared in
// content-schema.ts for this page, DB rows overriding the registry's
// defaults. A component can never receive undefined for a declared key,
// including right after a migration when no rows exist yet.
export async function getPageContent(page: string): Promise<Record<string, Record<string, unknown>>> {
  const blocks = await getContentBlocks(page);
  const pageSchema = contentSchema[page] ?? {};

  const result: Record<string, Record<string, unknown>> = {};
  for (const [section, sectionSchema] of Object.entries(pageSchema)) {
    result[section] = {};
    for (const [key, descriptor] of Object.entries(sectionSchema.fields)) {
      const dbValue = blocks.get(`${section}.${key}`);
      result[section][key] = dbValue !== undefined ? dbValue : descriptor.default;
    }
  }
  return result;
}

// Stored as an ordinary ContentBlock row under a reserved key, so it needs no
// table of its own. It isn't in content-schema's field lists, which means
// getPageContent never returns it and admins can't collide with it.
const VISIBILITY_KEY = "__visible";

// Whether each section of a page should render. Only sections marked
// `hideable` in the schema can ever be hidden; everything else is always
// true. A hideable section the admin has never toggled falls back to its
// schema default (shown, unless it declares defaultVisible: false).
export async function getSectionVisibility(page: string): Promise<Record<string, boolean>> {
  const blocks = await getContentBlocks(page);
  const result: Record<string, boolean> = {};
  for (const [section, sectionSchema] of Object.entries(contentSchema[page] ?? {})) {
    if (!sectionSchema.hideable) {
      result[section] = true;
      continue;
    }
    const stored = blocks.get(`${section}.${VISIBILITY_KEY}`);
    result[section] = typeof stored === "boolean" ? stored : (sectionSchema.defaultVisible ?? true);
  }
  return result;
}

export async function setSectionVisibility(page: string, section: string, visible: boolean): Promise<void> {
  await setContentBlock(page, section, VISIBILITY_KEY, "BOOLEAN", visible);
}

export async function setContentBlock(
  page: string,
  section: string,
  key: string,
  type: ContentFieldType | "BOOLEAN",
  value: unknown
): Promise<void> {
  await db.contentBlock.upsert({
    where: { page_section_key: { page, section, key } },
    update: { type, value: value as Prisma.InputJsonValue },
    create: { page, section, key, type, value: value as Prisma.InputJsonValue },
  });
}
