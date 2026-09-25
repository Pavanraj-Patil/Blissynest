"use client";

import { useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CheckCircle2 } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { ShopFooter } from "@/components/shop/ShopFooter";
import { PasswordInput } from "@/components/ui/PasswordInput";

const inputClass =
  "mt-1.5 w-full rounded-lg border border-charcoal/15 px-3.5 py-3 text-sm text-charcoal placeholder:text-ink-muted focus:outline-none focus:border-olive";

export function ResetPasswordClient() {
  const token = useSearchParams().get("token") ?? "";
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [done, setDone] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (password !== confirmPassword) {
      setError("Passwords don't match.");
      return;
    }
    setSubmitting(true);
    const res = await fetch("/api/auth/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, password, confirmPassword }),
    });
    setSubmitting(false);
    if (res.ok) {
      setDone(true);
      return;
    }
    const data = await res.json().catch(() => null);
    setError(data?.error ?? "Something went wrong. Please try again.");
  }

  return (
    <>
      <Header />
      <main className="mx-auto max-w-md px-4 py-14 md:py-20">
        <div className="rounded-3xl border border-charcoal/10 bg-white p-6 sm:p-8">
          {done ? (
            <div className="text-center">
              <CheckCircle2 size={40} className="mx-auto text-olive" strokeWidth={1.5} />
              <h1 className="mt-4 font-serif text-2xl text-charcoal">Password updated</h1>
              <p className="mt-3 text-sm text-ink-muted">You can now log in with your new password.</p>
              <Link
                href="/"
                className="mt-6 inline-block rounded-xl bg-olive px-6 py-3 text-xs font-semibold uppercase tracking-[0.1em] text-cream hover:bg-olive-dark"
              >
                Continue to the store
              </Link>
            </div>
          ) : !token ? (
            <div className="text-center">
              <h1 className="font-serif text-2xl text-charcoal">This link isn&rsquo;t valid</h1>
              <p className="mt-3 text-sm text-ink-muted">
                The reset link is missing or incomplete.{" "}
                <Link href="/forgot-password" className="font-medium text-terracotta-dark hover:underline">
                  Request a new one
                </Link>
                .
              </p>
            </div>
          ) : (
            <>
              <h1 className="font-serif text-2xl text-charcoal">Choose a new password</h1>
              <p className="mt-2 text-sm text-ink-muted">At least 8 characters, with a letter and a number.</p>
              <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                {error && (
                  <p className="text-sm text-terracotta-dark">
                    {error}{" "}
                    {/expired|already used/i.test(error) && (
                      <Link href="/forgot-password" className="font-medium underline">
                        Request a new link
                      </Link>
                    )}
                  </p>
                )}
                <label className="block">
                  <span className="text-xs font-medium text-charcoal">New password</span>
                  <PasswordInput
                    required
                    minLength={8}
                    autoComplete="new-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={inputClass}
                  />
                </label>
                <label className="block">
                  <span className="text-xs font-medium text-charcoal">Confirm new password</span>
                  <PasswordInput
                    required
                    minLength={8}
                    autoComplete="new-password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className={inputClass}
                  />
                </label>
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full rounded-xl bg-olive px-6 py-3.5 text-xs font-semibold uppercase tracking-[0.1em] text-cream transition-colors hover:bg-olive-dark disabled:opacity-60"
                >
                  {submitting ? "Saving…" : "Update password"}
                </button>
              </form>
            </>
          )}
        </div>
      </main>
      <ShopFooter />
    </>
  );
}
