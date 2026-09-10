import { requireAdmin } from "@/lib/admin/require-admin";
import { ProductForm } from "../ProductForm";

export default async function AdminNewProductPage() {
  await requireAdmin("products");

  return (
    <div className="max-w-[900px] mx-auto space-y-5">
      <div>
        <h1 className="font-serif text-2xl text-charcoal">Add Product</h1>
        <p className="mt-1 text-sm text-ink-muted">The slug is generated automatically from the name.</p>
      </div>
      <ProductForm />
    </div>
  );
}
