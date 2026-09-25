"use client";

import { useState } from "react";
import Image from "next/image";
import { CheckCircle2, AlertCircle } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { PageHero } from "@/components/pages/PageHero";
import { ShopFooter } from "@/components/shop/ShopFooter";
import { getContentIcon } from "@/lib/content-icons";

type ContactPoint = { icon: string; label: string; value: string };
type ContactContent = {
  eyebrow: string;
  heading: string;
  subcopy: string;
  contactPoints: ContactPoint[];
};

type ContactPageContent = {
  hero: Record<string, unknown>;
  details: Record<string, unknown>;
  form: Record<string, unknown>;
};

export function ContactPageClient({ content }: { content: ContactPageContent }) {
  const { eyebrow, heading, subcopy, contactPoints } = content.hero as ContactContent;
  const details = content.details as { eyebrow: string; heading: string; replyNote: string };
  const form = content.form as { heading: string; subcopy: string };
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: formData.get("name"),
        email: formData.get("email"),
        subject: formData.get("subject"),
        message: formData.get("message"),
      }),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Something went wrong. Please try again.");
      setSubmitting(false);
      return;
    }

    setSubmitted(true);
  }

  const field =
    "mt-2 w-full rounded-xl border border-charcoal/12 bg-cream px-4 py-3 text-sm text-charcoal placeholder:text-ink-muted transition-colors focus:border-olive focus:bg-white focus:outline-none";

  return (
    <>
      <Header />
      <main>
        <PageHero
          crumbs={[{ label: "Home", href: "/" }, { label: "Contact Us" }]}
          eyebrow={eyebrow}
          title={heading}
          intro={subcopy}
        />

        <div className="mx-auto max-w-[1200px] px-4 md:px-8 py-12 md:py-16">
          <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr] lg:gap-8">
            {/* Form */}
            <div className="rounded-[2rem] border border-charcoal/10 bg-white p-6 shadow-[0_18px_50px_-30px_rgba(42,38,33,0.35)] sm:p-10">
              {submitted ? (
                <div className="flex flex-col items-center py-12 text-center">
                  <span className="flex h-16 w-16 items-center justify-center rounded-full bg-olive/10">
                    <CheckCircle2 size={32} className="text-olive" strokeWidth={1.5} />
                  </span>
                  <h2 className="mt-5 font-serif text-2xl text-charcoal">Message sent</h2>
                  <p className="mt-2 max-w-xs text-sm leading-relaxed text-ink-muted">
                    Thanks for reaching out. We&rsquo;ll get back to you soon.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <h2 className="font-serif text-2xl text-charcoal md:text-3xl">{form.heading}</h2>
                    <p className="mt-1.5 text-sm text-ink-muted">{form.subcopy}</p>
                  </div>

                  {error && (
                    <div className="flex items-start gap-2 rounded-xl bg-terracotta/10 px-4 py-3 text-xs text-terracotta-dark">
                      <AlertCircle size={15} className="mt-0.5 shrink-0" />
                      <p>{error}</p>
                    </div>
                  )}

                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                    <label className="block">
                      <span className="text-xs font-semibold uppercase tracking-[0.1em] text-charcoal-light">Name</span>
                      <input required name="name" type="text" placeholder="Your name" className={field} />
                    </label>
                    <label className="block">
                      <span className="text-xs font-semibold uppercase tracking-[0.1em] text-charcoal-light">Email</span>
                      <input required name="email" type="email" placeholder="you@example.com" className={field} />
                    </label>
                  </div>

                  <label className="block">
                    <span className="text-xs font-semibold uppercase tracking-[0.1em] text-charcoal-light">Subject</span>
                    <input required name="subject" type="text" placeholder="What's this about?" className={field} />
                  </label>

                  <label className="block">
                    <span className="text-xs font-semibold uppercase tracking-[0.1em] text-charcoal-light">Message</span>
                    <textarea required name="message" rows={5} placeholder="Tell us a bit more..." className={`${field} resize-none`} />
                  </label>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full rounded-full bg-olive px-8 py-3.5 text-xs font-semibold uppercase tracking-[0.1em] text-cream transition-colors hover:bg-olive-dark disabled:opacity-60 sm:w-auto"
                  >
                    {submitting ? "Sending…" : "Send Message"}
                  </button>
                </form>
              )}
            </div>

            {/* Details */}
            <aside className="relative flex flex-col overflow-hidden rounded-[2rem] bg-olive-dark p-8 text-cream sm:p-10">
              <div aria-hidden className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full border border-cream/10" />
              <div aria-hidden className="pointer-events-none absolute -bottom-24 -left-10 h-60 w-60 rounded-full border border-cream/10" />
              <p className="eyebrow relative flex items-center gap-3 text-gold-light">
                <span aria-hidden className="h-px w-8 bg-gold-light" />
                {details.eyebrow}
              </p>
              <h2 className="relative mt-4 font-serif text-2xl md:text-3xl">{details.heading}</h2>
              <ul className="relative mt-8 space-y-6">
                {contactPoints.map((c) => {
                  const Icon = getContentIcon(c.icon);
                  return (
                    <li key={c.label} className="flex items-start gap-4">
                      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-cream/25">
                        {Icon && <Icon size={18} className="text-gold-light" strokeWidth={1.5} />}
                      </span>
                      <div className="min-w-0">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-cream/60">{c.label}</p>
                        <p className="mt-1 break-words text-[15px] text-cream">{c.value}</p>
                      </div>
                    </li>
                  );
                })}
              </ul>
              <p className="relative mt-8 border-t border-cream/25 pt-5 text-sm leading-relaxed text-cream/75">
                {details.replyNote}
              </p>
              <div aria-hidden className="relative mt-8 hidden min-h-[160px] flex-1 overflow-hidden rounded-t-[999px] rounded-b-2xl lg:block">
                <Image src="/moment-thankyou.png" alt="" fill sizes="400px" className="object-cover object-bottom" />
              </div>
            </aside>
          </div>
        </div>
      </main>
      <ShopFooter />
    </>
  );
}
