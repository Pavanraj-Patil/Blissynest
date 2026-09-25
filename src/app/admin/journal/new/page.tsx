import Link from "next/link";
import { requireAdmin } from "@/lib/admin/require-admin";
import { JournalEditor } from "../JournalEditor";

export default async function NewJournalPostPage() {
  await requireAdmin("content");
  const today = new Date().toISOString().slice(0, 10);

  return (
    <div className="max-w-[900px] mx-auto space-y-5">
      <div>
        <Link href="/admin/journal" className="text-xs text-ink-muted hover:text-terracotta-dark">
          Back to Journal
        </Link>
        <h1 className="mt-1 font-serif text-2xl text-charcoal">New article</h1>
      </div>
      <JournalEditor
        initial={{
          title: "",
          slug: "",
          tag: "Gift Guides",
          excerpt: "",
          image: "",
          imageAlt: "",
          body: "",
          ctaTitle: "",
          ctaBody: "",
          ctaLabel: "",
          ctaHref: "",
          published: false,
          publishedAt: today,
        }}
      />
    </div>
  );
}
