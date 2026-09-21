import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/admin/require-admin";
import { db } from "@/lib/db";
import { paiseToRupees } from "@/lib/currency";
import { getRelatedProductOptions } from "@/lib/admin/product-service";
import { ProductForm, type ProductFormInitial } from "../../ProductForm";

function toRupees(paise: number | null): number | "" {
  return paise === null ? "" : paiseToRupees(paise);
}

export default async function AdminEditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdmin("products");
  const { id } = await params;

  const [product, relatedProductOptions] = await Promise.all([
    db.product.findUnique({ where: { id } }),
    getRelatedProductOptions(id),
  ]);
  if (!product) notFound();

  const details = product.productDetails as {
    description: string;
    materials?: string;
    dimensions?: string;
    howToUse?: string;
    care?: string;
    delivery: string;
  };

  const cs = product.customizationSchema as {
    textLines?: { label: string; required: boolean; maxLength: number; placeholder: string }[];
    fonts?: string[];
    colors?: { name: string; hex: string }[];
    variantLabel?: string | null;
    variantOptions?: string[] | null;
    specs?: { icon: string; label: string; value: string }[] | null;
    imageUpload?: { maxImages: number; required: boolean } | null;
  } | null;

  const initial: ProductFormInitial = {
    id: product.id,
    name: product.name,
    tagline: product.tagline ?? "",
    pdpType: product.pdpType,
    audience: product.audience as string[],
    category: product.category as string[],
    collectionSlug: product.collectionSlug ?? "",
    breadcrumbCategory: product.breadcrumbCategory ?? "",
    occasionTags: product.occasionTags as string[],
    recipientTags: product.recipientTags as string[],
    relatedSlugs: product.relatedSlugs as string[],
    attribute: product.attribute ?? "",
    badge: product.badge ?? "",
    basePrice: paiseToRupees(product.basePrice),
    compareAtPrice: toRupees(product.compareAtPrice),
    images: (product.images as string[]).length > 0 ? (product.images as string[]) : [""],
    stockQuantity: product.stockQuantity,
    codAvailable: product.codAvailable,
    featured: product.featured,
    corporateOnly: product.corporateOnly,
    corporateNeeds: product.corporateNeeds as string[],
    sortRank: product.sortRank ?? "",
    status: product.status,
    description: details.description,
    materials: details.materials ?? "",
    dimensions: details.dimensions ?? "",
    howToUse: details.howToUse ?? "",
    care: details.care ?? "",
    delivery: details.delivery,
    whatsInside:
      (product.whatsInside as { name: string; subtitle: string; qty: string }[] | null)?.map((i) => ({
        name: i.name,
        subtitle: i.subtitle,
        qty: i.qty,
      })) ?? [],
    personalNoteLabel: product.personalNoteLabel ?? "",
    personalNotePrice: toRupees(product.personalNotePrice),
    variants: (product.variants as { label: string; options: string[] }[] | null) ?? [],
    variantImages: (product.variantImages as Record<string, string[]> | null) ?? {},
    textLines: cs?.textLines ?? [],
    fonts: cs?.fonts ?? [],
    colors: cs?.colors ?? [],
    imageUploadEnabled: Boolean(cs?.imageUpload),
    imageUploadMax: cs?.imageUpload?.maxImages ?? 1,
    imageUploadRequired: cs?.imageUpload?.required ?? true,
    variantLabel: cs?.variantLabel ?? "",
    variantOptions: cs?.variantOptions ?? [],
    specs: cs?.specs ?? [],
  };

  return (
    <div className="max-w-[900px] mx-auto space-y-5">
      <div>
        <h1 className="font-serif text-2xl text-charcoal">Edit Product</h1>
        <p className="mt-1 text-sm text-ink-muted">{product.slug}</p>
      </div>
      <ProductForm initial={initial} relatedProductOptions={relatedProductOptions} />
    </div>
  );
}
