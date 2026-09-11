import type { useRouter } from "next/navigation";

// Shared by the shop-style listing pages' category pill rows: keeps a
// filter's value mirrored into the URL (via router.replace, so picking a
// pill doesn't spam browser history) so the current filter survives a
// refresh and a filtered link is actually shareable — without this, pill
// clicks were pure React state, invisible outside the tab that made them.
export function replaceSearchParam(
  router: ReturnType<typeof useRouter>,
  pathname: string,
  searchParams: URLSearchParams,
  key: string,
  value: string | null
) {
  const params = new URLSearchParams(searchParams.toString());
  if (value) {
    params.set(key, value);
  } else {
    params.delete(key);
  }
  const query = params.toString();
  router.replace(`${pathname}${query ? `?${query}` : ""}`, { scroll: false });
}
