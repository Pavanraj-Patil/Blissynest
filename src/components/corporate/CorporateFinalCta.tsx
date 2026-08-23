import { ArrowRight, Mail, Phone } from "lucide-react";
import { Button } from "@/components/ui/Button";

export function CorporateFinalCta() {
  return (
    <section className="mx-auto max-w-[1440px] px-4 md:px-8 pb-14 md:pb-20">
      <div className="rounded-3xl bg-charcoal text-cream px-6 py-12 md:px-14 md:py-16 text-center">
        <h2 className="font-serif text-2xl md:text-3xl">
          Let&rsquo;s plan your next gifting moment.
        </h2>
        <p className="mt-3 text-sm text-cream/70 max-w-md mx-auto">
          Share your requirements and our gifting expert will get back to
          you within one business day.
        </p>
        <div className="mt-7 flex flex-wrap items-center justify-center gap-4">
          <Button href="/corporate/quote" variant="primary">
            Request a Quote
            <ArrowRight size={14} />
          </Button>
        </div>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm text-cream/70">
          <a href="mailto:corporate@blissynest.com" className="flex items-center gap-2 hover:text-cream transition-colors">
            <Mail size={15} />
            corporate@blissynest.com
          </a>
          <a href="tel:+911800123456" className="flex items-center gap-2 hover:text-cream transition-colors">
            <Phone size={15} />
            1800-123-456
          </a>
        </div>
      </div>
    </section>
  );
}
