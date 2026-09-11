"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle } from "lucide-react";
import { RepeatingListField } from "@/components/admin/RepeatingListField";
import { ImageUploader } from "@/components/admin/ImageUploader";
import { CheckboxGroupField } from "@/components/admin/CheckboxGroupField";
import { shopCategories, shopOccasions, recipientsByAudience } from "@/lib/shop-mock-data";
import { collectionContent, collectionSlugs, isCollectionSlug } from "@/lib/collection-mock-data";
import { audienceEnumToSlug } from "@/lib/validations/product";

const audienceOptions = [
  { value: "HER", label: "Her" },
  { value: "HIM", label: "Him" },
  { value: "PARENTS", label: "Parents" },
  { value: "COUPLES", label: "Couples" },
  { value: "FRIENDS", label: "Friends" },
];

export type ProductFormInitial = {
  id?: string;
  name: string;
  tagline: string;
  pdpType: "HAMPER" | "STANDALONE" | "CUSTOMISABLE";
  audience: string[];
  category: string[];
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
  codAvailable: boolean;
  featured: boolean;
  sortRank: number | "";
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
  // Per-variant-option image overrides, keyed by "<label>::<option>" — see
  // prisma/schema.prisma's Product.variantImages.
  variantImages: Record<string, string[]>;
  textLines: { label: string; required: boolean; maxLength: number; placeholder: string }[];
  fonts: string[];
  colors: { name: string; hex: string }[];
  variantLabel: string;
  variantOptions: string[];
  specs: { icon: string; label: string; value: string }[];
};

const customisableFonts = ["Serif", "Script", "Modern"] as const;

// Matches src/components/product/icon-map.ts exactly — the PDP falls back
// to a generic gift icon for anything else, so keeping this list in sync
// is what makes a chosen icon actually show up as intended.
const specIconOptions = [
  "ShieldCheck",
  "Heart",
  "PackageCheck",
  "Lock",
  "Flame",
  "Coffee",
  "Flower2",
  "Droplet",
  "Mail",
  "Gift",
  "Sparkles",
  "MapPin",
  "Weight",
  "Clock",
  "Truck",
] as const;

export const emptyProductForm: ProductFormInitial = {
  name: "",
  tagline: "",
  pdpType: "STANDALONE",
  audience: [],
  category: [],
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
  codAvailable: true,
  featured: false,
  sortRank: "",
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
  variantImages: {},
  textLines: [],
  fonts: [],
  colors: [],
  variantLabel: "",
  variantOptions: [],
  specs: [],
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

  // Category's valid vocabulary depends on Collection Slug: unscoped
  // products (no collection) pick from the 7 shop categories; a product
  // placed in one of the 5 curated Edits picks from that collection's own
  // category set instead (e.g. "cozy" -> candles/bath-body/wellness/...) —
  // see collection-mock-data.ts. A stale category value from before the
  // Collection Slug changed just won't be in this list, so it silently
  // stops being checked rather than blocking the form.
  const categoryOptions = useMemo(() => {
    if (isCollectionSlug(values.collectionSlug)) {
      return collectionContent[values.collectionSlug].categories.map((c) => ({
        value: c.slug,
        label: c.label,
      }));
    }
    return shopCategories.map((c) => ({ value: c.slug, label: c.label }));
  }, [values.collectionSlug]);

  // Attribute only has a fixed vocabulary once a Collection Slug is set —
  // each collection defines its own filter facet (e.g. self-care's "Scent":
  // Lavender/Vanilla/...). With no collection, Attribute has no effect on
  // the storefront at all (see ProductForm's Attribute label), so it stays
  // free text.
  const attributeFilter = isCollectionSlug(values.collectionSlug)
    ? collectionContent[values.collectionSlug].attributeFilter
    : null;

  // Recipient Tags' options are the union of every checked Audience's own
  // recipient list (see recipientsByAudience in shop-mock-data.ts) — check
  // "Her" and "Him" both, and Wife/Sister/... and Husband/Brother/... all
  // become available to tag this product with.
  const recipientOptions = useMemo(() => {
    const slugs = values.audience.map(
      (a) => audienceEnumToSlug[a as keyof typeof audienceEnumToSlug]
    );
    const union = new Set(slugs.flatMap((slug) => recipientsByAudience[slug] ?? []));
    return Array.from(union).map((r) => ({ value: r, label: r }));
  }, [values.audience]);

  // Drop any checked Recipient Tag that no longer belongs to any checked
  // Audience — otherwise it'd keep being submitted invisibly (it wouldn't
  // render as a checkbox anymore since it's not in recipientOptions above,
  // but it would still sit in state).
  // Every "label::option" pair currently defined across all variant groups
  // — used both to render one image uploader per option and to prune stale
  // variantImages entries on submit (see handleSubmit).
  const validVariantImageKeys = useMemo(
    () =>
      new Set(
        values.variants.flatMap((v) => v.options.map((opt) => `${v.label}::${opt}`))
      ),
    [values.variants]
  );

  function setVariantImages(key: string, images: string[]) {
    setValues((prev) => ({
      ...prev,
      variantImages: { ...prev.variantImages, [key]: images },
    }));
  }

  function handleAudienceChange(next: string[]) {
    const slugs = next.map((a) => audienceEnumToSlug[a as keyof typeof audienceEnumToSlug]);
    const stillValid = new Set(slugs.flatMap((slug) => recipientsByAudience[slug] ?? []));
    setValues((prev) => ({
      ...prev,
      audience: next,
      recipientTags: prev.recipientTags.filter((r) => stillValid.has(r)),
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const payload = {
      name: values.name,
      tagline: values.tagline || undefined,
      pdpType: values.pdpType,
      audience: values.audience,
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
      codAvailable: values.codAvailable,
      featured: values.featured,
      sortRank: values.sortRank === "" ? undefined : values.sortRank,
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
      // Drop any image entry whose "label::option" no longer matches a
      // current variant option — stale leftovers from a renamed/removed
      // option, which would otherwise sit in the DB unreachable by any
      // selection.
      variantImages:
        values.pdpType === "STANDALONE"
          ? Object.fromEntries(
              Object.entries(values.variantImages).filter(
                ([key, imgs]) => validVariantImageKeys.has(key) && imgs.length > 0
              )
            )
          : undefined,
      textLines: values.pdpType === "CUSTOMISABLE" ? values.textLines : undefined,
      fonts: values.pdpType === "CUSTOMISABLE" ? values.fonts : undefined,
      colors: values.pdpType === "CUSTOMISABLE" ? values.colors : undefined,
      variantLabel: values.pdpType === "CUSTOMISABLE" ? values.variantLabel || undefined : undefined,
      variantOptions:
        values.pdpType === "CUSTOMISABLE" && values.variantOptions.length > 0
          ? values.variantOptions
          : undefined,
      specs: values.pdpType === "CUSTOMISABLE" ? values.specs : undefined,
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

        <label className="block max-w-[16rem]">
          <span className={labelClass}>Product Type</span>
          <select
            value={values.pdpType}
            disabled={isEdit}
            onChange={(e) => set("pdpType", e.target.value as ProductFormInitial["pdpType"])}
            className={`${inputClass} disabled:opacity-60 disabled:cursor-not-allowed`}
          >
            <option value="STANDALONE">Standalone</option>
            <option value="HAMPER">Hamper</option>
            <option value="CUSTOMISABLE">Customisable</option>
          </select>
          {isEdit && (
            <span className="mt-1 block text-[11px] text-ink-muted">
              Locked after creation.
            </span>
          )}
        </label>

        <div>
          <span className={labelClass}>
            Audience (optional — leave unchecked to show only under Shop → All)
          </span>
          <div className="mt-1.5">
            <CheckboxGroupField
              value={values.audience}
              onChange={handleAudienceChange}
              options={audienceOptions}
            />
          </div>
        </div>

        <div>
          <span className={labelClass}>Category</span>
          <div className="mt-1.5">
            <CheckboxGroupField
              value={values.category}
              onChange={(next) => set("category", next)}
              options={categoryOptions}
            />
          </div>
          <span className="mt-1.5 block text-[11px] text-ink-muted">
            {values.collectionSlug
              ? "Showing this collection's own categories."
              : "Showing shop categories. Set a Collection Slug below to pick from that collection's categories instead."}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <label className="block">
            <span className={labelClass}>Collection Slug (optional)</span>
            <select
              value={values.collectionSlug}
              onChange={(e) => set("collectionSlug", e.target.value)}
              className={inputClass}
            >
              <option value="">None</option>
              {collectionSlugs.map((slug) => (
                <option key={slug} value={slug}>
                  {collectionContent[slug].title}
                </option>
              ))}
            </select>
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

        <div>
          <span className={labelClass}>Occasion Tags</span>
          <div className="mt-1.5">
            <CheckboxGroupField
              value={values.occasionTags}
              onChange={(next) => set("occasionTags", next)}
              options={shopOccasions.map((o) => ({ value: o, label: o }))}
            />
          </div>
        </div>

        <div>
          <span className={labelClass}>Recipient Tags</span>
          <div className="mt-1.5">
            <CheckboxGroupField
              value={values.recipientTags}
              onChange={(next) => set("recipientTags", next)}
              options={recipientOptions}
              emptyHint="Check an Audience above to see relevant recipient tags."
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <label className="block">
            <span className={labelClass}>
              Attribute (optional, collection filter facet)
              {attributeFilter && <span className="text-ink-muted"> — {attributeFilter.label}</span>}
            </span>
            {attributeFilter ? (
              <select
                value={values.attribute}
                onChange={(e) => set("attribute", e.target.value)}
                className={inputClass}
              >
                <option value="">None</option>
                {attributeFilter.values.map((v) => (
                  <option key={v} value={v}>
                    {v}
                  </option>
                ))}
                {/* A value saved under a previous Collection Slug won't be in
                    this list — keep it selectable rather than silently
                    dropping it, matching Category's same fallback below. */}
                {values.attribute && !attributeFilter.values.includes(values.attribute) && (
                  <option value={values.attribute}>{values.attribute} (not in this collection)</option>
                )}
              </select>
            ) : (
              <input
                value={values.attribute}
                onChange={(e) => set("attribute", e.target.value)}
                placeholder="Lavender"
                className={inputClass}
              />
            )}
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

        <label className="block max-w-[14rem]">
          <span className={labelClass}>Sort Priority (optional)</span>
          <input
            type="number"
            value={values.sortRank}
            onChange={(e) => set("sortRank", e.target.value === "" ? "" : Number(e.target.value))}
            placeholder="Leave blank for normal order"
            className={inputClass}
          />
          <span className="mt-1 block text-xs text-ink-muted">
            Lower numbers show first on shop/audience listings. Leave blank for no manual pin.
          </span>
        </label>

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

        <label className="flex items-center gap-2.5 cursor-pointer">
          <input
            type="checkbox"
            checked={values.codAvailable}
            onChange={(e) => set("codAvailable", e.target.checked)}
            className="h-4 w-4 rounded border-charcoal/25 accent-olive"
          />
          <span className="text-sm text-charcoal">
            Allow Cash on Delivery
            <span className="block text-xs text-ink-muted">
              Uncheck to exclude this product from COD even while it&rsquo;s enabled store-wide.
            </span>
          </span>
        </label>
      </Section>

      <Section title="Images">
        <div>
          <span className={labelClass}>Product images (first is the thumbnail)</span>
          <div className="mt-1.5">
            <ImageUploader
              images={values.images.map((i) => i.trim()).filter(Boolean)}
              onChange={(imgs) => set("images", imgs)}
            />
          </div>
        </div>

        <label className="block">
          <span className={labelClass}>Or paste image URLs / local paths, one per line</span>
          <textarea
            required
            rows={3}
            value={values.images.join("\n")}
            onChange={(e) => set("images", e.target.value.split("\n"))}
            placeholder="https://... or /products/candle.jpg"
            className={`${inputClass} resize-none`}
          />
          <span className="mt-1 block text-[11px] text-ink-muted">
            Uploads above go to Cloudinary once it&rsquo;s configured (see .env) — until then, a
            local path under /public (e.g. /products/candle.jpg) works fine for testing.
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
          <RepeatingListField
            value={values.whatsInside}
            onChange={(next) => set("whatsInside", next)}
            fields={[
              { key: "name", label: "Item name", kind: "text" },
              { key: "subtitle", label: "Subtitle", kind: "text" },
              { key: "qty", label: "1x", kind: "text" },
            ]}
            emptyItem={{ name: "", subtitle: "", qty: "1x" }}
            addLabel="Add item"
          />

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
          <RepeatingListField
            value={values.variants}
            onChange={(next) => set("variants", next)}
            fields={[
              { key: "label", label: "Scent", kind: "text" },
              { key: "options", label: "Lavender, Vanilla, Sandalwood", kind: "taglist" },
            ]}
            emptyItem={{ label: "", options: [] }}
            addLabel="Add variant"
          />

          {values.variants.some((v) => v.label && v.options.length > 0) && (
            <div className="space-y-4 border-t border-charcoal/10 pt-4">
              <div>
                <span className={labelClass}>Variant Images (optional)</span>
                <p className="mt-1 text-[11px] text-ink-muted">
                  Give an option its own photos and the gallery swaps to them when a
                  shopper picks it — e.g. upload black-product photos under
                  &ldquo;Color: Black&rdquo;. Leave an option blank to keep showing
                  the main product images above for it.
                </p>
              </div>
              {values.variants
                .filter((v) => v.label && v.options.length > 0)
                .map((v) =>
                  v.options.map((opt) => {
                    const key = `${v.label}::${opt}`;
                    return (
                      <div key={key}>
                        <span className={labelClass}>
                          {v.label}: {opt}
                        </span>
                        <div className="mt-1.5">
                          <ImageUploader
                            images={values.variantImages[key] ?? []}
                            onChange={(imgs) => setVariantImages(key, imgs)}
                          />
                        </div>
                      </div>
                    );
                  })
                )}
            </div>
          )}
        </Section>
      )}

      {values.pdpType === "CUSTOMISABLE" && (
        <Section title="Personalisation (Customisable)">
          <div>
            <span className={labelClass}>Text Lines</span>
            <div className="mt-2">
              <RepeatingListField
                value={values.textLines}
                onChange={(next) => set("textLines", next)}
                fields={[
                  { key: "label", label: "Label (e.g. Name)", kind: "text" },
                  { key: "placeholder", label: "Placeholder text", kind: "text" },
                  { key: "maxLength", label: "Max chars", kind: "number", min: 1 },
                  { key: "required", label: "Required", kind: "checkbox" },
                ]}
                emptyItem={{ label: "", required: false, maxLength: 30, placeholder: "" }}
                addLabel="Add text line"
              />
            </div>
          </div>

          <div>
            <span className={labelClass}>Font Styles</span>
            <p className="mt-1 text-[11px] text-ink-muted">
              Only these three are supported by the PDP&rsquo;s preview.
            </p>
            <div className="mt-2 flex gap-4">
              {customisableFonts.map((f) => (
                <label key={f} className="flex items-center gap-1.5 text-sm text-charcoal cursor-pointer">
                  <input
                    type="checkbox"
                    checked={values.fonts.includes(f)}
                    onChange={(e) =>
                      set(
                        "fonts",
                        e.target.checked ? [...values.fonts, f] : values.fonts.filter((x) => x !== f)
                      )
                    }
                    className="h-4 w-4 rounded border-charcoal/25 accent-olive"
                  />
                  {f}
                </label>
              ))}
            </div>
          </div>

          <div>
            <span className={labelClass}>Colors</span>
            <div className="mt-2">
              <RepeatingListField
                value={values.colors}
                onChange={(next) => set("colors", next)}
                fields={[
                  { key: "hex", label: "Color", kind: "color" },
                  { key: "name", label: "Color name (e.g. Charcoal)", kind: "text" },
                ]}
                emptyItem={{ name: "", hex: "#2a2621" }}
                addLabel="Add color"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <label className="block">
              <span className={labelClass}>Variant Label (optional, e.g. Size)</span>
              <input
                value={values.variantLabel}
                onChange={(e) => set("variantLabel", e.target.value)}
                className={inputClass}
              />
            </label>
            <label className="block">
              <span className={labelClass}>Variant Options (comma-separated)</span>
              <input
                value={values.variantOptions.join(", ")}
                onChange={(e) =>
                  set("variantOptions", e.target.value.split(",").map((s) => s.trim()).filter(Boolean))
                }
                placeholder="Small, Medium, Large"
                className={inputClass}
              />
            </label>
          </div>

          <div>
            <span className={labelClass}>Specs (optional)</span>
            <div className="mt-2">
              <RepeatingListField
                value={values.specs}
                onChange={(next) => set("specs", next)}
                fields={[
                  { key: "icon", label: "Icon", kind: "select", options: specIconOptions },
                  { key: "label", label: "Label (e.g. Material)", kind: "text" },
                  { key: "value", label: "Value (e.g. Solid Oak)", kind: "text" },
                ]}
                emptyItem={{ icon: "Gift", label: "", value: "" }}
                addLabel="Add spec"
              />
            </div>
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
