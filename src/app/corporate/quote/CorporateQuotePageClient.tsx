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
} from "lucide-react";
import { TopBar } from "@/components/layout/TopBar";
import { Header } from "@/components/layout/Header";
import { Breadcrumb } from "@/components/shop/Breadcrumb";
import { ShopFooter } from "@/components/shop/ShopFooter";
import { SelectDropdown } from "@/components/ui/SelectDropdown";
import { corporateNeeds } from "@/lib/corporate-data";
import { downloadCatalogue } from "@/lib/corporate-catalogue";

const teamSizes = ["1–10", "11–50", "51–200", "201–500", "500+"];

const reassuranceSteps = [
  { icon: MessageSquare, text: "We review your requirements within one business day." },
  { icon: PhoneCall, text: "Our gifting expert calls you to understand the brief." },
  { icon: Palette, text: "You get a curated proposal, customised to your brand." },
  { icon: Truck, text: "We handle packaging and pan-India delivery, tracked end to end." },
];

function QuoteForm() {
  const searchParams = useSearchParams();
  const isConsultation = searchParams.get("intent") === "consultation";
  const interestParam = searchParams.get("interest");
  const matchedInterest = corporateNeeds.find((n) => n.slug === interestParam);

  const [submitted, setSubmitted] = useState(false);
  const [downloaded, setDownloaded] = useState(false);
  const [teamSize, setTeamSize] = useState("");
  const [interest, setInterest] = useState(matchedInterest?.slug ?? "");

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const submitter = (e.nativeEvent as SubmitEvent).submitter as HTMLButtonElement | null;
    if (submitter?.value === "download") {
      downloadCatalogue(interest);
      setDownloaded(true);
    }

    setSubmitted(true);
  }

  const pageTitle = isConsultation ? "Book a Consultation" : "Request a Quote";

  return (
    <>
      <TopBar />
      <Header />
      <main>
        <div className="mx-auto max-w-[1440px] px-4 md:px-8 pt-5">
          <Breadcrumb
            items={[
              { label: "Home", href: "/" },
              { label: "Corporate Gifting", href: "/corporate" },
              { label: pageTitle },
            ]}
          />
        </div>

        <div className="mx-auto max-w-[1440px] px-4 md:px-8 py-8 md:py-12">
          <div className="text-center max-w-xl mx-auto mb-10">
            <h1 className="font-serif text-3xl md:text-4xl text-charcoal">
              {pageTitle}
            </h1>
            <p className="mt-3 text-sm text-ink-muted leading-relaxed">
              {isConsultation
                ? "Tell us a bit about your team and we'll set up a call with a gifting expert."
                : "Share your requirements and we'll put together a curated proposal for your business."}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[1.3fr_1fr] gap-10 max-w-4xl mx-auto">
            <div className="rounded-3xl border border-charcoal/10 bg-white p-6 md:p-8">
              {submitted ? (
                <div className="flex flex-col items-center text-center py-10">
                  <CheckCircle2 size={40} className="text-olive" strokeWidth={1.5} />
                  <h2 className="mt-4 font-serif text-xl text-charcoal">
                    Thank you — we&rsquo;ve got it!
                  </h2>
                  <p className="mt-2 text-sm text-ink-muted max-w-xs">
                    {downloaded
                      ? "Your catalogue download should start automatically. Our gifting expert will also reach out within one business day to discuss your requirements."
                      : "Our gifting expert will reach out within one business day to discuss your requirements."}
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <label className="block">
                      <span className="text-xs font-medium text-charcoal">Full Name *</span>
                      <input
                        type="text"
                        required
                        placeholder="Your full name"
                        className="mt-1.5 w-full rounded-lg border border-charcoal/15 px-3.5 py-2.5 text-sm text-charcoal placeholder:text-ink-muted focus:outline-none focus:border-olive"
                      />
                    </label>
                    <label className="block">
                      <span className="text-xs font-medium text-charcoal">Work Email *</span>
                      <input
                        type="email"
                        required
                        placeholder="you@company.com"
                        className="mt-1.5 w-full rounded-lg border border-charcoal/15 px-3.5 py-2.5 text-sm text-charcoal placeholder:text-ink-muted focus:outline-none focus:border-olive"
                      />
                    </label>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <label className="block">
                      <span className="text-xs font-medium text-charcoal">Phone *</span>
                      <input
                        type="tel"
                        required
                        placeholder="Your phone number"
                        className="mt-1.5 w-full rounded-lg border border-charcoal/15 px-3.5 py-2.5 text-sm text-charcoal placeholder:text-ink-muted focus:outline-none focus:border-olive"
                      />
                    </label>
                    <label className="block">
                      <span className="text-xs font-medium text-charcoal">Company Name *</span>
                      <input
                        type="text"
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
                      placeholder="Occasion, budget, timeline, branding needs..."
                      className="mt-1.5 w-full rounded-lg border border-charcoal/15 px-3.5 py-2.5 text-sm text-charcoal placeholder:text-ink-muted focus:outline-none focus:border-olive resize-none"
                    />
                  </label>

                  <div className="flex flex-col sm:flex-row gap-3">
                    <button
                      type="submit"
                      name="action"
                      value="submit"
                      className="flex-1 inline-flex items-center justify-center rounded-xl bg-olive text-cream px-6 py-3.5 text-xs font-semibold tracking-[0.1em] uppercase hover:bg-olive-dark transition-colors"
                    >
                      {isConsultation ? "Book Consultation" : "Submit Request"}
                    </button>
                    <button
                      type="submit"
                      name="action"
                      value="download"
                      className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl border border-charcoal/20 text-charcoal px-6 py-3.5 text-xs font-semibold tracking-[0.1em] uppercase hover:bg-cream-dark transition-colors"
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
                    href="mailto:corporate@blissynest.com"
                    className="flex items-center gap-2.5 text-sm text-ink-muted hover:text-terracotta-dark transition-colors"
                  >
                    <Mail size={16} />
                    corporate@blissynest.com
                  </a>
                  <a
                    href="tel:+911800123456"
                    className="flex items-center gap-2.5 text-sm text-ink-muted hover:text-terracotta-dark transition-colors"
                  >
                    <Phone size={16} />
                    1800-123-456
                  </a>
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

export function CorporateQuotePageClient() {
  return (
    <Suspense fallback={null}>
      <QuoteForm />
    </Suspense>
  );
}
