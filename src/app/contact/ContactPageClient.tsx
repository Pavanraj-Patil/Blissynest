"use client";

import { useState } from "react";
import { Mail, Phone, MapPin, CheckCircle2 } from "lucide-react";
import { TopBar } from "@/components/layout/TopBar";
import { Header } from "@/components/layout/Header";
import { Breadcrumb } from "@/components/shop/Breadcrumb";
import { ShopFooter } from "@/components/shop/ShopFooter";

const contactPoints = [
  { icon: Mail, label: "Email", value: "hello@blissynest.com" },
  { icon: Phone, label: "Phone", value: "1800-123-456" },
  { icon: MapPin, label: "Studio", value: "Koregaon Park, Pune, Maharashtra" },
];

export function ContactPageClient() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <>
      <TopBar />
      <Header />
      <main>
        <div className="mx-auto max-w-[1440px] px-4 md:px-8 pt-5">
          <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Contact Us" }]} />
        </div>

        <div className="mx-auto max-w-[1440px] px-4 md:px-8 pt-6 pb-10 text-center">
          <p className="eyebrow text-terracotta-dark mb-2">We&rsquo;d Love to Hear From You</p>
          <h1 className="font-serif text-3xl md:text-4xl text-charcoal">Contact Us</h1>
          <p className="mt-3 text-sm text-ink-muted max-w-xl mx-auto">
            Questions about an order, a bulk request, or just want to say hi — we read every message.
          </p>
        </div>

        <div className="mx-auto max-w-[1440px] px-4 md:px-8 pb-16">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.3fr] gap-10 max-w-4xl mx-auto">
            <div className="space-y-4">
              {contactPoints.map((c) => (
                <div
                  key={c.label}
                  className="flex items-center gap-3.5 rounded-2xl border border-charcoal/10 bg-white p-5"
                >
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-cream-dark">
                    <c.icon size={18} className="text-terracotta" strokeWidth={1.5} />
                  </div>
                  <div>
                    <p className="text-xs text-ink-muted">{c.label}</p>
                    <p className="text-sm font-medium text-charcoal">{c.value}</p>
                  </div>
                </div>
              ))}
              <p className="text-xs text-ink-muted leading-relaxed px-1">
                We usually reply within 24 hours on business days.
              </p>
            </div>

            <div className="rounded-2xl border border-charcoal/10 bg-white p-6 sm:p-8">
              {submitted ? (
                <div className="flex flex-col items-center text-center py-8">
                  <CheckCircle2 size={40} className="text-olive" strokeWidth={1.5} />
                  <h2 className="mt-4 font-serif text-xl text-charcoal">Message sent</h2>
                  <p className="mt-2 text-sm text-ink-muted max-w-xs">
                    Thanks for reaching out — we&rsquo;ll get back to you soon.
                  </p>
                </div>
              ) : (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    setSubmitted(true);
                  }}
                  className="space-y-4"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <label className="block">
                      <span className="text-xs font-medium text-charcoal">Name</span>
                      <input
                        required
                        type="text"
                        placeholder="Your name"
                        className="mt-1.5 w-full rounded-lg border border-charcoal/15 px-3.5 py-2.5 text-sm text-charcoal placeholder:text-ink-muted focus:outline-none focus:border-olive"
                      />
                    </label>
                    <label className="block">
                      <span className="text-xs font-medium text-charcoal">Email</span>
                      <input
                        required
                        type="email"
                        placeholder="you@example.com"
                        className="mt-1.5 w-full rounded-lg border border-charcoal/15 px-3.5 py-2.5 text-sm text-charcoal placeholder:text-ink-muted focus:outline-none focus:border-olive"
                      />
                    </label>
                  </div>

                  <label className="block">
                    <span className="text-xs font-medium text-charcoal">Subject</span>
                    <input
                      required
                      type="text"
                      placeholder="What's this about?"
                      className="mt-1.5 w-full rounded-lg border border-charcoal/15 px-3.5 py-2.5 text-sm text-charcoal placeholder:text-ink-muted focus:outline-none focus:border-olive"
                    />
                  </label>

                  <label className="block">
                    <span className="text-xs font-medium text-charcoal">Message</span>
                    <textarea
                      required
                      rows={5}
                      placeholder="Tell us a bit more..."
                      className="mt-1.5 w-full rounded-lg border border-charcoal/15 px-3.5 py-2.5 text-sm text-charcoal placeholder:text-ink-muted focus:outline-none focus:border-olive resize-none"
                    />
                  </label>

                  <button
                    type="submit"
                    className="w-full sm:w-auto rounded-xl bg-olive text-cream px-7 py-3.5 text-xs font-semibold tracking-[0.1em] uppercase hover:bg-olive-dark transition-colors"
                  >
                    Send Message
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </main>
      <ShopFooter />
    </>
  );
}
