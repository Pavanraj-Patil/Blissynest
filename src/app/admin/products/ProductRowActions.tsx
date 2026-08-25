"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Pencil, Trash2 } from "lucide-react";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";

export function ProductRowActions({ id, name }: { id: string; name: string }) {
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleDelete() {
    setDeleting(true);
    setError(null);
    const res = await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error);
      setDeleting(false);
      setConfirming(false);
      return;
    }
    router.refresh();
  }

  if (error) {
    return <p className="max-w-[16rem] text-[11px] text-terracotta-dark">{error}</p>;
  }

  return (
    <div className="flex items-center gap-1">
      <Link
        href={`/admin/products/${id}/edit`}
        aria-label="Edit product"
        className="flex h-8 w-8 items-center justify-center rounded-full text-charcoal-light hover:text-terracotta-dark hover:bg-cream-dark transition-colors"
      >
        <Pencil size={14} />
      </Link>
      <button
        type="button"
        onClick={() => setConfirming(true)}
        aria-label="Delete product"
        className="flex h-8 w-8 items-center justify-center rounded-full text-charcoal-light hover:text-terracotta-dark hover:bg-cream-dark transition-colors"
      >
        <Trash2 size={14} />
      </button>

      <ConfirmDialog
        open={confirming}
        title="Delete this product?"
        description={`"${name}" will be permanently deleted. This can't be undone — if it's referenced by any real orders, carts, or wishlists, the delete will be refused instead.`}
        submitting={deleting}
        onConfirm={handleDelete}
        onCancel={() => setConfirming(false)}
      />
    </div>
  );
}
