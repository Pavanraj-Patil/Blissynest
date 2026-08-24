"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2, AlertCircle } from "lucide-react";

export type ProductFormInitial = {
  id?: string;
  name: string;
  tagline: string;
  pdpType: "HAMPER" | "STANDALONE" | "CUSTOMISABLE";
  audience: string;
  category: string;
  collectionSlug: string;
  breadcrumbCategory: string;
  occasionTags: string[];
  recipientTags: string[];
  attribute: string;
  badge: string;
  basePrice: number; // rupees
  compareAtPrice: number | "";
  images: string[];
  stockQuantity: number;
  featured: boolean;
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  description: string;
  materials: string;
  dimensions: string;
  howToUse: string;
  care: string;
  delivery: string;
  whatsInside: { name: string; subtitle: string; qty: string }[];
  personalNoteLabel: string;
  personalNotePrice: number | "";
  variants: { label: string; options: string[] }[];
};

export const emptyProductForm: ProductFormInitial = {
  name: "",
  tagline: "",
  pdpType: "STANDALONE",
  audience: "",
  category: "",
  collectionSlug: "",
  breadcrumbCategory: "",
  occasionTags: [],
  recipientTags: [],
  attribute: "",
  badge: "",
  basePrice: 0,
  compareAtPrice: "",
  images: [""],
  stockQuantity: 0,
  featured: false,
  status: "DRAFT",
  description: "",
  materials: "",
  dimensions: "",
  howToUse: "",
  care: "",
  delivery: "Ships within 24-48 hours, delivered in gift-ready packaging across India.",
  whatsInside: [],
  personalNoteLabel: "",
  personalNotePrice: "",
  variants: [],
};

const inputClass =
  "mt-1.5 w-full rounded-lg border border-charcoal/15 px-3.5 py-2.5 text-sm text-charcoal placeholder:text-ink-muted focus:outline-none focus:border-olive";
const labelClass = "text-xs font-medium text-charcoal";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-charcoal/10 bg-white p-5 space-y-4">
      <h2 className="font-serif text-lg text-charcoal">{title}</h2>
      {children}
    </div>
  );
}

export function ProductForm({ initial }: { initial?: ProductFormInitial }) {
  const router = useRouter();
  const isEdit = Boolean(initial?.id);
  const [values, setValues] = useState<ProductFormInitial>(initial ?? emptyProductForm);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function set<K extends keyof ProductFormInitial>(key: K, value: ProductFormInitial[K]) {
    setValues((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const payload = {
      name: values.name,
      tagline: values.tagline || undefined,
      pdpType: values.pdpType === "CUSTOMISABLE" ? "STANDALONE" : values.pdpType,
      audience: values.audience || undefined,
      category: values.category,
      collectionSlug: values.collectionSlug || undefined,
      breadcrumbCategory: values.breadcrumbCategory || undefined,
      occasionTags: values.occasionTags,
      recipientTags: values.recipientTags,
      attribute: values.attribute || undefined,
      badge: values.badge || undefined,
      basePrice: values.basePrice,
      compareAtPrice: values.compareAtPrice === "" ? undefined : values.compareAtPrice,
      images: values.images.map((i) => i.trim()).filter(Boolean),
      stockQuantity: values.stockQuantity,
      featured: values.featured,
      status: values.status,
      description: values.description,
      materials: values.materials || undefined,
      dimensions: values.dimensions || undefined,
      howToUse: values.howToUse || undefined,
      care: values.care || undefined,
      delivery: values.delivery,
      whatsInside: values.pdpType === "HAMPER" ? values.whatsInside : undefined,
      personalNoteLabel: values.pdpType === "HAMPER" ? values.personalNoteLabel || undefined : undefined,
      personalNotePrice:
        values.pdpType === "HAMPER" && values.personalNotePrice !== ""
          ? values.personalNotePrice
          : undefined,
      variants: values.pdpType === "STANDALONE" ? values.variants : undefined,
    };

    const res = await fetch(isEdit ? `/api/admin/products/${initial!.id}` : "/api/admin/products", {
      method: isEdit ? "PATCH" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json();

    if (!res.ok) {
      setError(data.error ?? "Something went wrong saving this product.");
      setSubmitting(false);
      return;
    }

    router.push("/admin/products");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <div className="flex items-start gap-2 rounded-xl bg-terracotta/10 px-4 py-3 text-sm text-terracotta-dark">
          <AlertCircle size={16} className="shrink-0 mt-0.5" />
          <p>{error}</p>
        </div>
      )}

      <Section title="Basic Info">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <label className="block">
            <span className={labelClass}>Name</span>
            <input
              required
              value={values.name}
              onChange={(e) => set("name", e.target.value)}
              placeholder="Scented Soy Candle"
              className={inputClass}
            />
          </label>
          <label className="block">
            <span className={labelClass}>Tagline (optional)</span>
            <input
              value={values.tagline}
              onChange={(e) => set("tagline", e.target.value)}
              className={inputClass}
            />
          </label>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <label className="block">
            <span className={labelClass}>Product Type</span>
            <select
              value={values.pdpType}
              disabled={isEdit}
              onChange={(e) => set("pdpType", e.target.value as ProductFormInitial["pdpType"])}
              className={`${inputClass} disabled:opacity-60 disabled:cursor-not-allowed`}
            >
              <option value="STANDALONE">Standalone</option>
              <option value="HAMPER">Hamper</option>
              {values.pdpType === "CUSTOMISABLE" && <option value="CUSTOMISABLE">Customisable</option>}
            </select>
            {isEdit && (
              <span className="mt-1 block text-[11px] text-ink-muted">
                Locked after creation.
              </span>
            )}
            {values.pdpType === "CUSTOMISABLE" && (
              <span className="mt-1 block text-[11px] text-ink-muted">
                Personalisation fields (text lines, fonts, colors) aren&rsquo;t editable here yet —
                only the fields below.
              </span>
            )}
          </label>
          <label className="block">
            <span className={labelClass}>Audience (optional)</span>
            <select
              value={values.audience}
              onChange={(e) => set("audience", e.target.value)}
              className={inputClass}
            >
              <option value="">None</option>
              <option value="HER">Her</option>
              <option value="HIM">Him</option>
              <option value="PARENTS">Parents</option>
              <option value="COUPLES">Couples</option>
              <option value="FRIENDS">Friends</option>
              <option value="COLLEAGUES">Colleagues</option>
            </select>
          </label>
          <label className="block">
            <span className={labelClass}>Category</span>
            <input
              required
              value={values.category}
              onChange={(e) => set("category", e.target.value)}
              placeholder="home-living"
              className={inputClass}
            />
          </label>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <label className="block">
            <span className={labelClass}>Collection Slug (optional)</span>
            <input
              value={values.collectionSlug}
              onChange={(e) => set("collectionSlug", e.target.value)}
              placeholder="self-care"
              className={inputClass}
            />
          </label>
          <label className="block">
            <span className={labelClass}>Breadcrumb Category (optional)</span>
            <input
              value={values.breadcrumbCategory}
              onChange={(e) => set("breadcrumbCategory", e.target.value)}
              placeholder="Home & Living"
              className={inputClass}
            />
          </label>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <label className="block">
            <span className={labelClass}>Occasion Tags (comma-separated)</span>
            <input
              value={values.occasionTags.join(", ")}
              onChange={(e) => set("occasionTags", e.target.value.split(",").map((s) => s.trim()).filter(Boolean))}
              placeholder="Birthday, Anniversary"
              className={inputClass}
            />
          </label>
          <label className="block">
            <span className={labelClass}>Recipient Tags (comma-separated)</span>
            <input
              value={values.recipientTags.join(", ")}
              onChange={(e) => set("recipientTags", e.target.value.split(",").map((s) => s.trim()).filter(Boolean))}
              placeholder="Wife, Sister"
              className={inputClass}
            />
          </label>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <label className="block">
            <span className={labelClass}>Attribute (optional, collection filter facet)</span>
            <input
              value={values.attribute}
              onChange={(e) => set("attribute", e.target.value)}
              placeholder="Lavender"
              className={inputClass}
            />
          </label>
          <label className="block">
            <span className={labelClass}>Badge (optional)</span>
            <select value={values.badge} onChange={(e) => set("badge", e.target.value)} className={inputClass}>
              <option value="">None</option>
              <option value="BESTSELLER">Bestseller</option>
              <option value="NEW">New</option>
            </select>
          </label>
        </div>
      </Section>

      <Section title="Pricing & Stock">
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <label className="block">
            <span className={labelClass}>Price (₹)</span>
            <input
              required
              type="number"
              min={0}
              value={values.basePrice}
              onChange={(e) => set("basePrice", Number(e.target.value))}
              className={inputClass}
            />
          </label>
          <label className="block">
            <span className={labelClass}>Compare-at Price (₹, optional)</span>
            <input
              type="number"
              min={0}
              value={values.compareAtPrice}
              onChange={(e) => set("compareAtPrice", e.target.value === "" ? "" : Number(e.target.value))}
              className={inputClass}
            />
          </label>
          <label className="block">
            <span className={labelClass}>Stock Quantity</span>
            <input
              required
              type="number"
              min={0}
              value={values.stockQuantity}
              onChange={(e) => set("stockQuantity", Number(e.target.value))}
              className={inputClass}
            />
          </label>
          <label className="block">
            <span className={labelClass}>Status</span>
            <select value={values.status} onChange={(e) => set("status", e.target.value as ProductFormInitial["status"])} className={inputClass}>
              <option value="DRAFT">Draft</option>
              <option value="PUBLISHED">Published</option>
              <option value="ARCHIVED">Archived</option>
            </select>
          </label>
        </div>

        <label className="flex items-center gap-2.5 cursor-pointer">
          <input
            type="checkbox"
            checked={values.featured}
            onChange={(e) => set("featured", e.target.checked)}
            className="h-4 w-4 rounded border-charcoal/25 accent-olive"
          />
          <span className="text-sm text-charcoal">
            Featured (shows in the homepage &ldquo;Loved by many&rdquo; carousel)
          </span>
        </label>
      </Section>

      <Section title="Images">
        <label className="block">
          <span className={labelClass}>Image URLs, one per line (first is the thumbnail)</span>
          <textarea
            required
            rows={3}
            value={values.images.join("\n")}
            onChange={(e) => set("images", e.target.value.split("\n"))}
            placeholder="https://..."
            className={`${inputClass} resize-none`}
          />
          <span className="mt-1 block text-[11px] text-ink-muted">
            No image upload is wired up yet (no Cloudinary account configured) — paste real image
            URLs here.
          </span>
        </label>
      </Section>

      <Section title="Description">
        <label className="block">
          <span className={labelClass}>Description</span>
          <textarea
            required
            rows={3}
            value={values.description}
            onChange={(e) => set("description", e.target.value)}
            className={`${inputClass} resize-none`}
          />
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <label className="block">
            <span className={labelClass}>Materials (optional)</span>
            <input value={values.materials} onChange={(e) => set("materials", e.target.value)} className={inputClass} />
          </label>
          <label className="block">
            <span className={labelClass}>Dimensions (optional)</span>
            <input value={values.dimensions} onChange={(e) => set("dimensions", e.target.value)} className={inputClass} />
          </label>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <label className="block">
            <span className={labelClass}>How to Use (optional)</span>
            <input value={values.howToUse} onChange={(e) => set("howToUse", e.target.value)} className={inputClass} />
          </label>
          <label className="block">
            <span className={labelClass}>Care Instructions (optional)</span>
            <input value={values.care} onChange={(e) => set("care", e.target.value)} className={inputClass} />
          </label>
        </div>
        <label className="block">
          <span className={labelClass}>Delivery Copy</span>
          <input required value={values.delivery} onChange={(e) => set("delivery", e.target.value)} className={inputClass} />
        </label>
      </Section>

      {values.pdpType === "HAMPER" && (
        <Section title="What's Inside (Hamper)">
          <div className="space-y-3">
            {values.whatsInside.map((item, i) => (
              <div key={i} className="grid grid-cols-1 sm:grid-cols-[1fr_1fr_5rem_auto] gap-2 items-start">
                <input
                  placeholder="Item name"
                  value={item.name}
                  onChange={(e) =>
                    set(
                      "whatsInside",
                      values.whatsInside.map((it, idx) => (idx === i ? { ...it, name: e.target.value } : it))
                    )
                  }
                  className={inputClass}
                />
                <input
                  placeholder="Subtitle"
                  value={item.subtitle}
                  onChange={(e) =>
                    set(
                      "whatsInside",
                      values.whatsInside.map((it, idx) => (idx === i ? { ...it, subtitle: e.target.value } : it))
                    )
                  }
                  className={inputClass}
                />
                <input
                  placeholder="1x"
                  value={item.qty}
                  onChange={(e) =>
                    set(
                      "whatsInside",
                      values.whatsInside.map((it, idx) => (idx === i ? { ...it, qty: e.target.value } : it))
                    )
                  }
                  className={inputClass}
                />
                <button
                  type="button"
                  onClick={() => set("whatsInside", values.whatsInside.filter((_, idx) => idx !== i))}
                  className="mt-1.5 flex h-9 w-9 items-center justify-center rounded-lg text-charcoal-light hover:bg-cream-dark"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => set("whatsInside", [...values.whatsInside, { name: "", subtitle: "", qty: "1x" }])}
              className="flex items-center gap-1.5 text-xs font-medium text-terracotta-dark hover:text-terracotta"
            >
              <Plus size={13} /> Add item
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <label className="block">
              <span className={labelClass}>Personal Note Label (optional)</span>
              <input
                value={values.personalNoteLabel}
                onChange={(e) => set("personalNoteLabel", e.target.value)}
                placeholder="Add a handwritten note"
                className={inputClass}
              />
            </label>
            <label className="block">
              <span className={labelClass}>Personal Note Price (₹, optional)</span>
              <input
                type="number"
                min={0}
                value={values.personalNotePrice}
                onChange={(e) => set("personalNotePrice", e.target.value === "" ? "" : Number(e.target.value))}
                className={inputClass}
              />
            </label>
          </div>
        </Section>
      )}

      {values.pdpType === "STANDALONE" && (
        <Section title="Variants (optional)">
          <div className="space-y-3">
            {values.variants.map((v, i) => (
              <div key={i} className="grid grid-cols-1 sm:grid-cols-[1fr_2fr_auto] gap-2 items-start">
                <input
                  placeholder="Scent"
                  value={v.label}
                  onChange={(e) =>
                    set("variants", values.variants.map((vv, idx) => (idx === i ? { ...vv, label: e.target.value } : vv)))
                  }
                  className={inputClass}
                />
                <input
                  placeholder="Lavender, Vanilla, Sandalwood"
                  value={v.options.join(", ")}
                  onChange={(e) =>
                    set(
                      "variants",
                      values.variants.map((vv, idx) =>
                        idx === i ? { ...vv, options: e.target.value.split(",").map((s) => s.trim()).filter(Boolean) } : vv
                      )
                    )
                  }
                  className={inputClass}
                />
                <button
                  type="button"
                  onClick={() => set("variants", values.variants.filter((_, idx) => idx !== i))}
                  className="mt-1.5 flex h-9 w-9 items-center justify-center rounded-lg text-charcoal-light hover:bg-cream-dark"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => set("variants", [...values.variants, { label: "", options: [] }])}
              className="flex items-center gap-1.5 text-xs font-medium text-terracotta-dark hover:text-terracotta"
            >
              <Plus size={13} /> Add variant
            </button>
          </div>
        </Section>
      )}

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={submitting}
          className="rounded-xl bg-olive text-cream px-7 py-3 text-xs font-semibold tracking-[0.1em] uppercase hover:bg-olive-dark transition-colors disabled:opacity-60"
        >
          {submitting ? "Saving…" : isEdit ? "Save Changes" : "Create Product"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin/products")}
          className="rounded-xl border border-charcoal/20 px-7 py-3 text-xs font-semibold tracking-[0.1em] uppercase text-charcoal hover:bg-cream-dark transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
