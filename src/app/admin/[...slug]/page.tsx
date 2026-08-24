import { Construction } from "lucide-react";
import { requireAdmin } from "@/lib/admin/require-admin";

function titleFromSlug(slug: string[]): string {
  return slug[slug.length - 1]
    .split("-")
    .map((w) => w[0].toUpperCase() + w.slice(1))
    .join(" ");
}

export default async function AdminComingSoonPage({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  await requireAdmin();
  const { slug } = await params;

  return (
    <div className="mx-auto max-w-lg py-20 text-center">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-cream-dark text-olive">
        <Construction size={26} strokeWidth={1.5} />
      </div>
      <h1 className="mt-5 font-serif text-2xl text-charcoal">{titleFromSlug(slug)}</h1>
      <p className="mt-2 text-sm text-ink-muted">
        This section of the admin panel isn&rsquo;t built yet — it&rsquo;s on the roadmap, not missing
        by accident.
      </p>
    </div>
  );
}
