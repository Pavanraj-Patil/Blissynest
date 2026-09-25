import { ArrowRight, Mail, Phone } from "lucide-react";
import { Button } from "@/components/ui/Button";
import type { LinkValue } from "@/lib/content-schema";

export function CorporateFinalCta({ content }: { content: Record<string, unknown> }) {
  const heading = content.heading as string;
  const subcopy = content.subcopy as string;
  const cta = content.cta as LinkValue;
  const email = content.email as string;
  const phone = content.phone as string;

  return (
    <section className="mx-auto max-w-[1440px] px-4 md:px-8 pb-14 md:pb-20">
      <div className="rounded-3xl bg-charcoal text-cream px-6 py-12 md:px-14 md:py-16 text-center">
        <h2 className="font-serif text-2xl md:text-3xl">
          {heading}
        </h2>
        <p className="mt-3 text-sm text-cream/70 max-w-md mx-auto">
          {subcopy}
        </p>
        <div className="mt-7 flex flex-wrap items-center justify-center gap-4">
          <Button href={cta.href} variant="primary">
            {cta.label}
            <ArrowRight size={14} />
          </Button>
        </div>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm text-cream/70">
          <a href={`mailto:${email}`} className="flex items-center gap-2 hover:text-cream transition-colors">
            <Mail size={15} />
            {email}
          </a>
          {phone && (
            <a href={`tel:${phone}`} className="flex items-center gap-2 hover:text-cream transition-colors">
              <Phone size={15} />
              {phone}
            </a>
          )}
        </div>
      </div>
    </section>
  );
}
