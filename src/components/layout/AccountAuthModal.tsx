"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { signIn } from "next-auth/react";
import { ArrowLeft, X, Mail, Lock, User as UserIcon, AlertCircle } from "lucide-react";

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
      <path
        fill="#FFC107"
        d="M43.6 20.5H42V20H24v8h11.3c-1.6 4.6-6 8-11.3 8-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.1 8 3l6-6C34.5 5.1 29.5 3 24 3 12.4 3 3 12.4 3 24s9.4 21 21 21 21-9.4 21-21c0-1.4-.1-2.5-.4-3.5Z"
      />
      <path
        fill="#FF3D00"
        d="m6.3 14.7 6.6 4.8C14.6 15.9 18.9 13 24 13c3.1 0 5.8 1.1 8 3l6-6C34.5 5.1 29.5 3 24 3 16.3 3 9.7 7.3 6.3 14.7Z"
      />
      <path
        fill="#4CAF50"
        d="M24 45c5.4 0 10.3-2.1 14-5.5l-6.5-5.5C29.4 35.9 26.8 37 24 37c-5.2 0-9.6-3.4-11.2-8l-6.6 5.1C9.6 40.6 16.3 45 24 45Z"
      />
      <path
        fill="#1976D2"
        d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.1-4 5.5l6.5 5.5C40.9 36.6 45 30.9 45 24c0-1.4-.1-2.5-.4-3.5Z"
      />
    </svg>
  );
}

type Mode = "login" | "signup";

export function AccountAuthModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!open) return;
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") handleClose();
    }
    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  function resetForm() {
    setName("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setError(null);
    setSubmitting(false);
  }

  function handleClose() {
    resetForm();
    setMode("login");
    onClose();
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    const result = await signIn("password", { email, password, redirect: false });
    setSubmitting(false);
    if (result?.error) {
      setError("Incorrect email or password.");
      return;
    }
    handleClose();
    router.push("/account");
    router.refresh();
  }

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password, confirmPassword }),
    });
    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      setSubmitting(false);
      setError(data.error ?? "Something went wrong. Please try again.");
      return;
    }

    const result = await signIn("password", { email, password, redirect: false });
    setSubmitting(false);
    if (result?.error) {
      setError("Account created — please sign in.");
      setMode("login");
      return;
    }
    handleClose();
    router.push("/account");
    router.refresh();
  }

  if (!open) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 bg-white sm:bg-transparent">
      <div
        className="hidden sm:block absolute inset-0 bg-charcoal/50 backdrop-blur-sm"
        onClick={handleClose}
        aria-hidden="true"
      />

      <div className="relative h-full sm:h-auto sm:mx-auto sm:mt-16 sm:max-w-sm sm:px-4">
        <div className="flex h-full sm:h-auto flex-col overflow-hidden bg-white sm:rounded-3xl sm:shadow-2xl">
          <button
            type="button"
            onClick={handleClose}
            aria-label="Back"
            className="absolute left-3 top-3 z-10 flex h-9 w-9 sm:hidden items-center justify-center rounded-full bg-white/90 text-charcoal shrink-0"
          >
            <ArrowLeft size={20} />
          </button>
          <button
            type="button"
            onClick={handleClose}
            aria-label="Close"
            className="absolute right-3 top-3 z-10 hidden sm:flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-charcoal/60 hover:text-charcoal transition-colors shrink-0"
          >
            <X size={18} />
          </button>

          <div className="relative h-24 shrink-0 overflow-hidden bg-gradient-to-br from-olive-dark to-terracotta-dark">
            <span className="absolute -right-4 -top-6 text-[7rem] leading-none text-cream/10 select-none">
              ✦
            </span>
            <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-md">
              <Image src="/icon.png" alt="" width={40} height={40} className="h-10 w-10" />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-6 pb-8 pt-12 text-center sm:pt-11">
            <h2 className="font-serif text-xl text-charcoal">
              {mode === "login" ? "Login to Blissynest" : "Create your account"}
            </h2>
            <p className="mt-1.5 text-sm text-ink-muted">
              For a personalised experience &amp; faster checkout.
            </p>

            {error && (
              <div className="mt-5 flex items-start gap-2 rounded-xl bg-terracotta/10 px-4 py-3 text-left text-xs text-terracotta-dark">
                <AlertCircle size={15} className="shrink-0 mt-0.5" />
                <p>{error}</p>
              </div>
            )}

            <form
              onSubmit={mode === "login" ? handleLogin : handleSignup}
              className="mt-6 space-y-3 text-left"
            >
              {mode === "signup" && (
                <label className="relative block">
                  <UserIcon
                    size={16}
                    className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-charcoal/35"
                  />
                  <input
                    required
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Full name"
                    className="w-full rounded-lg border border-charcoal/15 py-3 pl-10 pr-3.5 text-sm text-charcoal placeholder:text-ink-muted focus:outline-none focus:border-olive"
                  />
                </label>
              )}

              <label className="relative block">
                <Mail
                  size={16}
                  className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-charcoal/35"
                />
                <input
                  required
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter email address"
                  className="w-full rounded-lg border border-charcoal/15 py-3 pl-10 pr-3.5 text-sm text-charcoal placeholder:text-ink-muted focus:outline-none focus:border-olive"
                />
              </label>

              <label className="relative block">
                <Lock
                  size={16}
                  className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-charcoal/35"
                />
                <input
                  required
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  minLength={mode === "signup" ? 8 : undefined}
                  className="w-full rounded-lg border border-charcoal/15 py-3 pl-10 pr-3.5 text-sm text-charcoal placeholder:text-ink-muted focus:outline-none focus:border-olive"
                />
              </label>

              {mode === "signup" && (
                <label className="relative block">
                  <Lock
                    size={16}
                    className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-charcoal/35"
                  />
                  <input
                    required
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm password"
                    className="w-full rounded-lg border border-charcoal/15 py-3 pl-10 pr-3.5 text-sm text-charcoal placeholder:text-ink-muted focus:outline-none focus:border-olive"
                  />
                </label>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="w-full rounded-xl bg-olive text-cream px-6 py-3.5 text-xs font-semibold tracking-[0.1em] uppercase hover:bg-olive-dark transition-colors disabled:opacity-60"
              >
                {submitting ? "Please wait…" : mode === "login" ? "Login" : "Sign Up"}
              </button>
            </form>

            <button
              type="button"
              onClick={() => {
                setError(null);
                setMode(mode === "login" ? "signup" : "login");
              }}
              className="mt-4 text-xs font-medium text-terracotta-dark hover:text-terracotta transition-colors"
            >
              {mode === "login"
                ? "New here? Create an account"
                : "Already have an account? Login"}
            </button>

            <div className="mt-5 flex items-center gap-3 text-xs text-ink-muted">
              <span className="h-px flex-1 bg-charcoal/10" />
              or continue with
              <span className="h-px flex-1 bg-charcoal/10" />
            </div>

            <button
              type="button"
              onClick={() => signIn("google", { callbackUrl: "/account" })}
              className="mt-4 flex w-full items-center justify-center gap-2.5 rounded-xl border border-charcoal/15 px-6 py-3 text-sm font-medium text-charcoal hover:bg-cream-dark transition-colors"
            >
              <GoogleIcon />
              Continue with Google
            </button>

            <p className="mt-6 text-[11px] text-ink-muted leading-relaxed">
              By continuing, you agree to Blissynest&rsquo;s Terms of Use
              and Privacy Policy.
            </p>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
