"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";

// Debounced live search — typing updates the URL's `q` param (and resets
// pagination) ~400ms after the user stops, without a full page reload.
// Still lives inside the surrounding filter `<form>`, so pressing Enter or
// clicking "Search" keeps working exactly as before (same target URL).
export function ProductSearchInput({ defaultValue }: { defaultValue: string }) {
  const [value, setValue] = useState(defaultValue);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (value === (searchParams.get("q") ?? "")) return;

    const timeout = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set("q", value);
      } else {
        params.delete("q");
      }
      params.delete("page");
      router.replace(`${pathname}?${params.toString()}`);
    }, 400);

    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return (
    <label className="relative block flex-1 max-w-sm">
      <Search size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-charcoal/35" />
      <input
        type="text"
        name="q"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Search by name…"
        className="w-full rounded-lg border border-charcoal/15 py-2 pl-9 pr-3 text-sm text-charcoal placeholder:text-ink-muted focus:outline-none focus:border-olive"
      />
    </label>
  );
}
