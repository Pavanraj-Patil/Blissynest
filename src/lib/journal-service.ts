import { db } from "@/lib/db";
import type { JournalPost as JournalRow } from "@/generated/prisma/client";
import { blocksToMarkup, parseMarkup } from "@/lib/journal-markup";
import { starterPosts, type JournalBlock, type JournalPost } from "@/lib/journal-posts";

function toPost(row: JournalRow): JournalPost {
  return {
    slug: row.slug,
    tag: row.tag,
    title: row.title,
    excerpt: row.excerpt,
    image: row.image,
    imageAlt: row.imageAlt,
    published: row.publishedAt.toISOString(),
    body: parseMarkup(row.body),
    cta: { title: row.ctaTitle, body: row.ctaBody, label: row.ctaLabel, href: row.ctaHref },
  };
}

// What the public site shows: published articles, newest first. Until the
// first article has been created in the admin, the starter set is shown so a
// fresh site is never an empty page.
export async function getPublishedPosts(): Promise<JournalPost[]> {
  const total = await db.journalPost.count();
  if (total === 0) return starterPosts;
  const rows = await db.journalPost.findMany({
    where: { published: true },
    orderBy: { publishedAt: "desc" },
  });
  return rows.map(toPost);
}

export async function getPublishedPost(slug: string): Promise<JournalPost | null> {
  const total = await db.journalPost.count();
  if (total === 0) return starterPosts.find((p) => p.slug === slug) ?? null;
  const row = await db.journalPost.findFirst({ where: { slug, published: true } });
  return row ? toPost(row) : null;
}

export type JournalAdminInput = {
  slug: string;
  title: string;
  tag: string;
  excerpt: string;
  image: string;
  imageAlt: string;
  body: string;
  ctaTitle: string;
  ctaBody: string;
  ctaLabel: string;
  ctaHref: string;
  published: boolean;
  publishedAt: Date;
};

export async function getAllPostsForAdmin(): Promise<JournalRow[]> {
  return db.journalPost.findMany({ orderBy: { publishedAt: "desc" } });
}

export async function getPostForAdmin(id: string): Promise<JournalRow | null> {
  return db.journalPost.findUnique({ where: { id } });
}

export async function createPost(input: JournalAdminInput): Promise<JournalRow> {
  return db.journalPost.create({ data: input });
}

export async function updatePost(id: string, input: JournalAdminInput): Promise<JournalRow | null> {
  const result = await db.journalPost.updateMany({ where: { id }, data: input });
  if (result.count === 0) return null;
  return db.journalPost.findUnique({ where: { id } });
}

export async function deletePost(id: string): Promise<void> {
  await db.journalPost.deleteMany({ where: { id } });
}

// One click in the admin: copy the starter articles into the database (as
// published), so they can be edited or removed like any other. Only runs
// when the table is empty, so it can never duplicate or overwrite anything.
export async function importStarterPosts(): Promise<number> {
  const existing = await db.journalPost.count();
  if (existing > 0) return 0;
  // Stagger the dates a day apart so the order on the page is stable. Set at
  // midday UTC so the calendar date reads the same in every time zone.
  const now = new Date();
  const base = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 12);
  await db.journalPost.createMany({
    data: starterPosts.map((p, i) => ({
      slug: p.slug,
      title: p.title,
      tag: p.tag,
      excerpt: p.excerpt,
      image: p.image,
      imageAlt: p.imageAlt,
      body: blocksToMarkup(p.body as JournalBlock[]),
      ctaTitle: p.cta.title,
      ctaBody: p.cta.body,
      ctaLabel: p.cta.label,
      ctaHref: p.cta.href,
      published: true,
      publishedAt: new Date(base - i * 24 * 60 * 60 * 1000),
    })),
  });
  return starterPosts.length;
}
