import { SlowLoadNotice } from "@/components/ui/SlowLoadNotice";

// Checkout has its own slim header, so this stays deliberately plain: the
// brand loader (after a beat) on an empty page.
export default function Loading() {
  return (
    <main aria-busy="true" className="flex min-h-[60vh] items-center justify-center">
      <span className="sr-only" role="status">
        Loading checkout…
      </span>
      <SlowLoadNotice after={300} label="Getting your checkout ready…" />
    </main>
  );
}
