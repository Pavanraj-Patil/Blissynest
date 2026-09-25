import { requireAdmin } from "@/lib/admin/require-admin";
import { getAllPostsForAdmin } from "@/lib/journal-service";
import { JournalList } from "./JournalList";

export default async function AdminJournalPage() {
  await requireAdmin("content");
  const posts = await getAllPostsForAdmin();

  return (
    <div className="max-w-[900px] mx-auto space-y-5">
      <div>
        <h1 className="font-serif text-2xl text-charcoal">Journal</h1>
        <p className="mt-1 text-sm text-ink-muted">
          The articles on The Bliss Journal page. Only published articles are shown to visitors,
          newest first.
        </p>
      </div>

      <JournalList
        posts={posts.map((p) => ({
          id: p.id,
          title: p.title,
          tag: p.tag,
          slug: p.slug,
          published: p.published,
          publishedAt: p.publishedAt.toISOString(),
        }))}
      />
    </div>
  );
}
