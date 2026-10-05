"use client";

import { useState } from "react";
import Link from "next/link";
import { MailCheck } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { ShopFooter } from "@/components/shop/ShopFooter";

export function ForgotPasswordClient() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (res.ok) {
        setSent(true);
        return;
      }
      const data = await res.json().catch(() => null);
      setError(data?.error ?? "Something went wrong. Please try again.");
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <Header />
      <main className="mx-auto max-w-md px-4 py-14 md:py-20">
        <div className="rounded-3xl border border-charcoal/10 bg-white p-6 sm:p-8">
          {sent ? (
            <div className="text-center">
              <MailCheck size={40} className="mx-auto text-olive" strokeWidth={1.5} />
              <h1 className="mt-4 font-serif text-2xl text-charcoal">Check your email</h1>
              <p className="mt-3 text-sm leading-relaxed text-ink-muted">
                If there&rsquo;s a Blissynest account for <span className="text-charcoal">{email}</span>,
                we&rsquo;ve sent a link to choose a new password. It works for one hour. Can&rsquo;t see it? Check
                your spam folder.
              </p>
              <Link href="/" className="mt-6 inline-block text-sm font-medium text-terracotta-dark hover:underline">
                Back to the store
              </Link>
            </div>
          ) : (
            <>
              <h1 className="font-serif text-2xl text-charcoal">Forgot your password?</h1>
              <p className="mt-2 text-sm text-ink-muted">
                Enter the email you signed up with and we&rsquo;ll send you a link to choose a new one.
              </p>
              <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                {error && <p className="text-sm text-terracotta-dark">{error}</p>}
                <label className="block">
                  <span className="text-xs font-medium text-charcoal">Email</span>
                  <input
                    required
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="mt-1.5 w-full rounded-lg border border-charcoal/15 px-3.5 py-3 text-sm text-charcoal placeholder:text-ink-muted focus:outline-none focus:border-olive"
                  />
                </label>
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full rounded-xl bg-olive px-6 py-3.5 text-xs font-semibold uppercase tracking-[0.1em] text-cream transition-colors hover:bg-olive-dark disabled:opacity-60"
                >
                  {submitting ? "Sending…" : "Send reset link"}
                </button>
              </form>
              <p className="mt-5 text-center text-xs text-ink-muted">
                Signed up with Google? There&rsquo;s no password to reset. Just use &ldquo;Continue with Google&rdquo;.
              </p>
            </>
          )}
        </div>
      </main>
      <ShopFooter />
    </>
  );
}
