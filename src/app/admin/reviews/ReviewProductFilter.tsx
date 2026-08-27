"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";

// Debounced live filter — typing narrows the review list to one product's
// name (~400ms after the user stops), preserving the status pill filter
// already in the URL. Same pattern as admin/products/ProductSearchInput.tsx.
export function ReviewProductFilter({ defaultValue }: { defaultValue: string }) {
  const [value, setValue] = useState(defaultValue);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (value === (searchParams.get("product") ?? "")) return;

    const timeout = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set("product", value);
      } else {
        params.delete("product");
      }
      router.replace(`${pathname}?${params.toString()}`);
    }, 400);

    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return (
    <label className="relative block max-w-xs">
      <Search size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-charcoal/35" />
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Filter by product name…"
        className="w-full rounded-lg border border-charcoal/15 py-2 pl-9 pr-3 text-sm text-charcoal placeholder:text-ink-muted focus:outline-none focus:border-olive"
      />
    </label>
  );
}
