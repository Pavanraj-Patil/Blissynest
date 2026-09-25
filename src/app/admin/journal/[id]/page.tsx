import Link from "next/link";
import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/admin/require-admin";
import { getPostForAdmin } from "@/lib/journal-service";
import { JournalEditor } from "../JournalEditor";

export default async function EditJournalPostPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin("content");
  const { id } = await params;
  const post = await getPostForAdmin(id);
  if (!post) notFound();

  return (
    <div className="max-w-[900px] mx-auto space-y-5">
      <div>
        <Link href="/admin/journal" className="text-xs text-ink-muted hover:text-terracotta-dark">
          Back to Journal
        </Link>
        <h1 className="mt-1 font-serif text-2xl text-charcoal">Edit article</h1>
      </div>
      <JournalEditor
        initial={{
          id: post.id,
          title: post.title,
          slug: post.slug,
          tag: post.tag,
          excerpt: post.excerpt,
          image: post.image,
          imageAlt: post.imageAlt,
          body: post.body,
          ctaTitle: post.ctaTitle,
          ctaBody: post.ctaBody,
          ctaLabel: post.ctaLabel,
          ctaHref: post.ctaHref,
          published: post.published,
          publishedAt: post.publishedAt.toISOString().slice(0, 10),
        }}
      />
    </div>
  );
}
