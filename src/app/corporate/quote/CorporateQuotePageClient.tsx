"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  CheckCircle2,
  Download,
  Mail,
  Phone,
  MessageSquare,
  PhoneCall,
  Palette,
  Truck,
  AlertCircle,
} from "lucide-react";
import { Header } from "@/components/layout/Header";
import { PageHero } from "@/components/pages/PageHero";
import { ShopFooter } from "@/components/shop/ShopFooter";
import { SelectDropdown } from "@/components/ui/SelectDropdown";
import { corporateNeeds } from "@/lib/corporate-data";
import { downloadCatalogue } from "@/lib/corporate-catalogue";
import { PhoneInput } from "@/components/ui/PhoneInput";

const teamSizes = ["1–10", "11–50", "51–200", "201–500", "500+"];

const reassuranceSteps = [
  { icon: MessageSquare, text: "We review your requirements within one business day." },
  { icon: PhoneCall, text: "Our gifting expert calls you to understand the brief." },
  { icon: Palette, text: "You get a curated proposal, customised to your brand." },
  { icon: Truck, text: "We handle packaging and pan-India delivery, tracked end to end." },
];

function QuoteForm({ email, phone }: { email: string; phone: string }) {
  const searchParams = useSearchParams();
  const isConsultation = searchParams.get("intent") === "consultation";
  const interestParam = searchParams.get("interest");
  const matchedInterest = corporateNeeds.find((n) => n.slug === interestParam);

  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [downloaded, setDownloaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [teamSize, setTeamSize] = useState("");
  const [interest, setInterest] = useState(matchedInterest?.slug ?? "");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const submitter = (e.nativeEvent as SubmitEvent).submitter as HTMLButtonElement | null;
    const isDownload = submitter?.value === "download";
    const formData = new FormData(e.currentTarget);

    const res = await fetch("/api/corporate-lead", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: formData.get("name"),
        workEmail: formData.get("workEmail"),
        phone: formData.get("phone"),
        companyName: formData.get("companyName"),
        teamSize: teamSize || undefined,
        interest: interest || undefined,
        intent: isConsultation ? "CONSULTATION" : "QUOTE",
        message: formData.get("message") || undefined,
        downloadedCatalogue: isDownload,
      }),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Something went wrong. Please try again.");
      setSubmitting(false);
      return;
    }

    if (isDownload) {
      downloadCatalogue(interest);
      setDownloaded(true);
    }

    setSubmitted(true);
  }

  const pageTitle = isConsultation ? "Book a Consultation" : "Request a Quote";

  return (
    <>
      <Header />
      <main>
        <PageHero
          crumbs={[
            { label: "Home", href: "/" },
            { label: "Corporate Gifting", href: "/corporate" },
            { label: pageTitle },
          ]}
          eyebrow="Corporate Gifting"
          title={pageTitle}
          intro={
            isConsultation
              ? "Tell us a bit about your team and we'll set up a call with a gifting expert."
              : "Share your requirements and we'll put together a curated proposal for your business."
          }
          image="/corporate-need-client.png"
          imageAlt="A corporate gift set with a card and ribbon"
        />

        <div className="mx-auto max-w-[1440px] px-4 md:px-8 py-10 md:py-14">

          <div className="grid grid-cols-1 lg:grid-cols-[1.3fr_1fr] gap-10 max-w-4xl mx-auto">
            <div className="rounded-3xl border border-charcoal/10 bg-white p-6 md:p-8">
              {submitted ? (
                <div className="flex flex-col items-center text-center py-10">
                  <CheckCircle2 size={40} className="text-olive" strokeWidth={1.5} />
                  <h2 className="mt-4 font-serif text-xl text-charcoal">
                    Thank you, we&rsquo;ve got it!
                  </h2>
                  <p className="mt-2 text-sm text-ink-muted max-w-xs">
                    {downloaded
                      ? "Your catalogue download should start automatically. Our gifting expert will also reach out within one business day to discuss your requirements."
                      : "Our gifting expert will reach out within one business day to discuss your requirements."}
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  {error && (
                    <div className="flex items-start gap-2 rounded-xl bg-terracotta/10 px-4 py-3 text-xs text-terracotta-dark">
                      <AlertCircle size={15} className="shrink-0 mt-0.5" />
                      <p>{error}</p>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <label className="block">
                      <span className="text-xs font-medium text-charcoal">Full Name *</span>
                      <input
                        type="text"
                        name="name"
                        required
                        placeholder="Your full name"
                        className="mt-1.5 w-full rounded-lg border border-charcoal/15 px-3.5 py-2.5 text-sm text-charcoal placeholder:text-ink-muted focus:outline-none focus:border-olive"
                      />
                    </label>
                    <label className="block">
                      <span className="text-xs font-medium text-charcoal">Work Email *</span>
                      <input
                        type="email"
                        name="workEmail"
                        required
                        placeholder="you@company.com"
                        className="mt-1.5 w-full rounded-lg border border-charcoal/15 px-3.5 py-2.5 text-sm text-charcoal placeholder:text-ink-muted focus:outline-none focus:border-olive"
                      />
                    </label>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <label className="block">
                      <span className="text-xs font-medium text-charcoal">Phone *</span>
                      <PhoneInput
                        name="phone"
                        required
                        className="mt-1.5 w-full rounded-lg border border-charcoal/15 px-3.5 py-2.5 text-sm text-charcoal placeholder:text-ink-muted focus:outline-none focus:border-olive"
                      />
                    </label>
                    <label className="block">
                      <span className="text-xs font-medium text-charcoal">Company Name *</span>
                      <input
                        type="text"
                        name="companyName"
                        required
                        placeholder="Your company"
                        className="mt-1.5 w-full rounded-lg border border-charcoal/15 px-3.5 py-2.5 text-sm text-charcoal placeholder:text-ink-muted focus:outline-none focus:border-olive"
                      />
                    </label>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="block">
                      <span className="text-xs font-medium text-charcoal">Team Size</span>
                      <div className="mt-1.5">
                        <SelectDropdown
                          value={teamSize}
                          onChange={setTeamSize}
                          placeholder="Select team size"
                          options={teamSizes.map((size) => ({
                            value: size,
                            label: `${size} employees`,
                          }))}
                        />
                      </div>
                    </div>
                    <div className="block">
                      <span className="text-xs font-medium text-charcoal">
                        What are you looking for?
                      </span>
                      <div className="mt-1.5">
                        <SelectDropdown
                          value={interest}
                          onChange={setInterest}
                          placeholder="Select a category"
                          options={corporateNeeds.map((need) => ({
                            value: need.slug,
                            label: need.title,
                          }))}
                        />
                      </div>
                    </div>
                  </div>

                  <label className="block">
                    <span className="text-xs font-medium text-charcoal">
                      Tell us more (optional)
                    </span>
                    <textarea
                      rows={4}
                      name="message"
                      placeholder="Occasion, budget, timeline, branding needs..."
                      className="mt-1.5 w-full rounded-lg border border-charcoal/15 px-3.5 py-2.5 text-sm text-charcoal placeholder:text-ink-muted focus:outline-none focus:border-olive resize-none"
                    />
                  </label>

                  <div className="flex flex-col sm:flex-row gap-3">
                    <button
                      type="submit"
                      name="action"
                      value="submit"
                      disabled={submitting}
                      className="flex-1 inline-flex items-center justify-center rounded-xl bg-olive text-cream px-6 py-3.5 text-xs font-semibold tracking-[0.1em] uppercase hover:bg-olive-dark transition-colors disabled:opacity-60"
                    >
                      {isConsultation ? "Book Consultation" : "Submit Request"}
                    </button>
                    <button
                      type="submit"
                      name="action"
                      value="download"
                      disabled={submitting}
                      className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl border border-charcoal/20 text-charcoal px-6 py-3.5 text-xs font-semibold tracking-[0.1em] uppercase hover:bg-cream-dark transition-colors disabled:opacity-60"
                    >
                      <Download size={14} />
                      Download Catalogue
                    </button>
                  </div>
                  <p className="text-xs text-ink-muted">
                    Downloading the catalogue also submits your request above.
                  </p>
                </form>
              )}
            </div>

            <div>
              <div className="rounded-3xl bg-cream-dark p-6 md:p-7">
                <h2 className="font-serif text-lg text-charcoal">
                  What happens next
                </h2>
                <ul className="mt-5 space-y-4">
                  {reassuranceSteps.map((step, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white text-terracotta">
                        <step.icon size={15} strokeWidth={1.5} />
                      </span>
                      <p className="text-sm text-ink-muted leading-relaxed pt-1">
                        {step.text}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-6 rounded-3xl border border-charcoal/10 p-6 md:p-7">
                <h2 className="font-serif text-lg text-charcoal">
                  Prefer to reach out directly?
                </h2>
                <div className="mt-4 space-y-3">
                  <a
                    href={`mailto:${email}`}
                    className="flex items-center gap-2.5 text-sm text-ink-muted hover:text-terracotta-dark transition-colors"
                  >
                    <Mail size={16} />
                    {email}
                  </a>
                  {phone && (
                    <a
                      href={`tel:${phone.replace(/[^\d+]/g, "")}`}
                      className="flex items-center gap-2.5 text-sm text-ink-muted hover:text-terracotta-dark transition-colors"
                    >
                      <Phone size={16} />
                      {phone}
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <ShopFooter />
    </>
  );
}

export function CorporateQuotePageClient({ email, phone }: { email: string; phone: string }) {
  return (
    <Suspense fallback={null}>
      <QuoteForm email={email} phone={phone} />
    </Suspense>
  );
}
