import { TopBar } from "@/components/layout/TopBar";
import { Header } from "@/components/layout/Header";
import { Skeleton, ProductGridSkeleton } from "@/components/ui/Skeleton";
import { SlowLoadNotice } from "@/components/ui/SlowLoadNotice";

// Placeholder screens shown by the loading.tsx files while a page is being
// prepared on the server. Each keeps the real header in place and sketches the
// page's shape in soft cream blocks, so the layout doesn't jump when the real
// content arrives. If it takes unusually long, the gift-box notice appears.

function Frame({ children }: { children: React.ReactNode }) {
  return (
    <>
      <TopBar />
      <Header />
      <main aria-busy="true">
        <span className="sr-only" role="status">
          Loading…
        </span>
        {children}
        <SlowLoadNotice after={6000} label="Still loading…" hint="This is taking longer than usual. Check your connection." retry />
      </main>
    </>
  );
}

const shell = "mx-auto max-w-[1440px] px-4 md:px-8";

// Home and any page without a more specific skeleton.
export function GenericPageSkeleton() {
  return (
    <>
      <TopBar />
      <Header />
      <main aria-busy="true">
        <span className="sr-only" role="status">
          Loading…
        </span>
        <Skeleton className="h-[52vh] max-h-[520px] min-h-[280px] w-full rounded-none" />
        <div className={`${shell} pt-8`}>
          <Skeleton className="h-7 w-56" />
          <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="aspect-[4/5] rounded-2xl" />
            ))}
          </div>
        </div>
        {/* The slower-than-usual moment gets the brand loader, after a beat. */}
        <SlowLoadNotice after={600} />
      </main>
    </>
  );
}

// Shop, audience, collection, occasion, personalised and search pages.
export function ListingPageSkeleton() {
  return (
    <Frame>
      <div className={`${shell} pt-5`}>
        <Skeleton className="h-4 w-44" />
        <Skeleton className="mt-5 h-8 w-64" />
        <div className="mt-5 flex gap-3 overflow-hidden">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-14 w-14 shrink-0 rounded-full" />
          ))}
        </div>
        <div className="mt-6 flex items-center justify-between border-b border-charcoal/10 pb-4">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-9 w-36 rounded-lg" />
        </div>
        <ProductGridSkeleton count={8} />
      </div>
    </Frame>
  );
}

export function ProductPageSkeleton() {
  return (
    <Frame>
      <div className={`${shell} pt-5`}>
        <Skeleton className="h-4 w-52" />
        <div className="mt-6 grid gap-8 md:grid-cols-2">
          <Skeleton className="aspect-square w-full rounded-2xl" />
          <div>
            <Skeleton className="h-8 w-4/5" />
            <Skeleton className="mt-3 h-4 w-40" />
            <Skeleton className="mt-6 h-8 w-32" />
            <Skeleton className="mt-8 h-12 w-full rounded-full" />
            <Skeleton className="mt-3 h-12 w-full rounded-full" />
            <Skeleton className="mt-8 h-4 w-full" />
            <Skeleton className="mt-2 h-4 w-11/12" />
            <Skeleton className="mt-2 h-4 w-3/4" />
          </div>
        </div>
      </div>
    </Frame>
  );
}

export function CartPageSkeleton() {
  return (
    <Frame>
      <div className={`${shell} pt-5`}>
        <Skeleton className="h-8 w-40" />
        <div className="mt-6 grid gap-6 lg:grid-cols-[1.6fr_1fr]">
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex gap-4 rounded-2xl border border-charcoal/10 bg-white p-4">
                <Skeleton className="h-20 w-20 shrink-0 rounded-xl" />
                <div className="flex-1">
                  <Skeleton className="h-4 w-3/5" />
                  <Skeleton className="mt-3 h-4 w-24" />
                  <Skeleton className="mt-3 h-8 w-28 rounded-full" />
                </div>
              </div>
            ))}
          </div>
          <div className="rounded-2xl border border-charcoal/10 bg-white p-6">
            <Skeleton className="h-5 w-36" />
            <Skeleton className="mt-5 h-4 w-full" />
            <Skeleton className="mt-3 h-4 w-full" />
            <Skeleton className="mt-5 h-6 w-full" />
            <Skeleton className="mt-6 h-12 w-full rounded-xl" />
          </div>
        </div>
      </div>
    </Frame>
  );
}

// Admin pages keep the admin shell (sidebar/topbar) — only the content area loads.
export function AdminPageSkeleton() {
  return (
    <div aria-busy="true" className="mx-auto max-w-[1100px] space-y-5">
      <span className="sr-only" role="status">
        Loading…
      </span>
      <Skeleton className="h-8 w-48" />
      <Skeleton className="h-4 w-72" />
      <div className="rounded-2xl border border-charcoal/10 bg-white p-4">
        {Array.from({ length: 7 }).map((_, i) => (
          <Skeleton key={i} className="mb-3 h-9 w-full last:mb-0" />
        ))}
      </div>
    </div>
  );
}
