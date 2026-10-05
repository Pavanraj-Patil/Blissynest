"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { SingleImageUploader } from "@/components/admin/SingleImageUploader";
import { parseMarkup } from "@/lib/journal-markup";

export type EditorPost = {
  id?: string;
  title: string;
  slug: string;
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
  publishedAt: string; // yyyy-mm-dd
};

const input =
  "mt-1 w-full rounded-lg border border-charcoal/15 px-3 py-2 text-sm text-charcoal placeholder:text-ink-muted focus:outline-none focus:border-olive";
const label = "block text-xs font-medium text-charcoal";
const tagSuggestions = ["Gift Guides", "Occasions", "How To", "Behind the Scenes"];

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 100);
}

export function JournalEditor({ initial }: { initial: EditorPost }) {
  const router = useRouter();
  const [post, setPost] = useState<EditorPost>(initial);
  // Until the web address is edited by hand, it follows the title.
  const [slugTouched, setSlugTouched] = useState(Boolean(initial.id));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const blocks = useMemo(() => parseMarkup(post.body), [post.body]);

  function set<K extends keyof EditorPost>(key: K, value: EditorPost[K]) {
    setSaved(false);
    setPost((p) => ({ ...p, [key]: value }));
  }

  async function save(publishedOverride?: boolean) {
    setSaving(true);
    setError(null);
    setSaved(false);
    const payload = {
      ...post,
      published: publishedOverride ?? post.published,
      publishedAt: post.publishedAt,
    };
    try {
      const res = await fetch(post.id ? `/api/admin/journal/${post.id}` : "/api/admin/journal", {
        method: post.id ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error ?? "Could not save the article.");
        return;
      }
      if (!post.id) {
        router.replace(`/admin/journal/${data.post.id}`);
        return;
      }
      setPost((p) => ({ ...p, published: payload.published }));
      setSaved(true);
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-5">
      <div className="grid gap-5 rounded-2xl border border-charcoal/10 bg-white p-5 sm:p-6">
        <label className={label}>
          Title
          <input
            className={input}
            value={post.title}
            onChange={(e) => {
              set("title", e.target.value);
              if (!slugTouched) setPost((p) => ({ ...p, title: e.target.value, slug: slugify(e.target.value) }));
            }}
            placeholder="A title people will want to click"
          />
        </label>

        <label className={label}>
          Web address
          <div className="mt-1 flex items-center rounded-lg border border-charcoal/15 focus-within:border-olive">
            <span className="pl-3 text-sm text-ink-muted">/journal/</span>
            <input
              className="w-full rounded-lg px-1 py-2 text-sm text-charcoal focus:outline-none"
              value={post.slug}
              onChange={(e) => {
                setSlugTouched(true);
                set("slug", slugify(e.target.value));
              }}
            />
          </div>
          <span className="mt-1 block text-[11px] font-normal text-ink-muted">
            Changing this after publishing breaks any links already shared.
          </span>
        </label>

        <div className="grid gap-5 sm:grid-cols-2">
          <label className={label}>
            Tag
            <input className={input} list="journal-tags" value={post.tag} onChange={(e) => set("tag", e.target.value)} />
            <datalist id="journal-tags">
              {tagSuggestions.map((t) => (
                <option key={t} value={t} />
              ))}
            </datalist>
          </label>
          <label className={label}>
            Date shown
            <input
              type="date"
              className={input}
              value={post.publishedAt}
              onChange={(e) => set("publishedAt", e.target.value)}
            />
          </label>
        </div>

        <label className={label}>
          Short summary (shown on the card)
          <textarea
            className={`${input} resize-none`}
            rows={2}
            maxLength={400}
            value={post.excerpt}
            onChange={(e) => set("excerpt", e.target.value)}
          />
        </label>

        <div className="grid gap-5 sm:grid-cols-[auto_1fr]">
          <SingleImageUploader label="Photo" value={post.image} onChange={(url) => set("image", url)} />
          <label className={label}>
            Photo description (for screen readers)
            <input className={input} value={post.imageAlt} onChange={(e) => set("imageAlt", e.target.value)} />
          </label>
        </div>
      </div>

      <div className="rounded-2xl border border-charcoal/10 bg-white p-5 sm:p-6">
        <div className="flex items-center justify-between gap-3">
          <span className={label}>Article text</span>
          <button
            type="button"
            onClick={() => setShowPreview((v) => !v)}
            className="text-xs font-medium text-terracotta-dark hover:text-terracotta"
          >
            {showPreview ? "Hide preview" : "Show preview"}
          </button>
        </div>
        <textarea
          className={`${input} font-mono text-[13px] leading-relaxed`}
          rows={22}
          value={post.body}
          onChange={(e) => set("body", e.target.value)}
        />
        <div className="mt-2 rounded-lg bg-cream-dark px-3 py-2.5 text-[11px] leading-relaxed text-charcoal-light">
          <p className="font-semibold text-charcoal">How to format</p>
          <p>Leave a blank line between paragraphs. Start a line with <code>## </code> for a heading, <code>- </code> for a bullet, <code>1. </code> for a numbered step, or <code>&gt; </code> for a highlighted quote.</p>
        </div>

        {showPreview && (
          <div className="mt-4 space-y-4 rounded-lg border border-charcoal/10 p-4 text-sm leading-relaxed text-charcoal-light">
            {blocks.map((b, i) => {
              if (b.type === "h2") return <h3 key={i} className="pt-2 font-serif text-xl text-charcoal">{b.text}</h3>;
              if (b.type === "quote") return <p key={i} className="border-y border-charcoal/15 py-3 text-center font-serif text-lg italic text-olive-dark">{b.text}</p>;
              if (b.type === "ul") return <ul key={i} className="list-disc space-y-1 pl-5">{b.items.map((t) => <li key={t}>{t}</li>)}</ul>;
              if (b.type === "ol") return <ol key={i} className="list-decimal space-y-1 pl-5">{b.items.map((t) => <li key={t}>{t}</li>)}</ol>;
              return <p key={i}>{b.text}</p>;
            })}
          </div>
        )}
      </div>

      <div className="grid gap-5 rounded-2xl border border-charcoal/10 bg-white p-5 sm:p-6">
        <div>
          <p className={label}>Closing banner (optional)</p>
          <p className="mt-0.5 text-[11px] text-ink-muted">A call to action shown after the article. Leave the title empty to hide it.</p>
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          <label className={label}>
            Title
            <input className={input} value={post.ctaTitle} onChange={(e) => set("ctaTitle", e.target.value)} />
          </label>
          <label className={label}>
            Text
            <input className={input} value={post.ctaBody} onChange={(e) => set("ctaBody", e.target.value)} />
          </label>
          <label className={label}>
            Button label
            <input className={input} value={post.ctaLabel} onChange={(e) => set("ctaLabel", e.target.value)} />
          </label>
          <label className={label}>
            Button link
            <input className={input} value={post.ctaHref} onChange={(e) => set("ctaHref", e.target.value)} placeholder="/shop" />
          </label>
        </div>
      </div>

      {error && <p className="rounded-lg bg-terracotta/10 px-3 py-2 text-xs text-terracotta-dark">{error}</p>}
      {saved && <p className="rounded-lg bg-olive/10 px-3 py-2 text-xs text-olive-dark">Saved.</p>}

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={() => save(true)}
          disabled={saving}
          className="rounded-lg bg-olive px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.08em] text-cream hover:bg-olive-dark transition-colors disabled:opacity-60"
        >
          {saving ? "Saving…" : post.published ? "Save changes" : "Publish"}
        </button>
        <button
          type="button"
          onClick={() => save(false)}
          disabled={saving}
          className="rounded-lg border border-charcoal/20 px-5 py-2.5 text-xs font-semibold text-charcoal hover:bg-cream-dark transition-colors disabled:opacity-60"
        >
          {post.published ? "Unpublish (save as draft)" : "Save as draft"}
        </button>
        <span className="text-xs text-ink-muted">Status: {post.published ? "Published" : "Draft"}</span>
      </div>
    </div>
  );
}
