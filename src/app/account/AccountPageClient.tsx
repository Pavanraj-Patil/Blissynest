"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ArrowRight, Info } from "lucide-react";
import { TopBar } from "@/components/layout/TopBar";
import { Header } from "@/components/layout/Header";
import { Breadcrumb } from "@/components/shop/Breadcrumb";
import { ShopFooter } from "@/components/shop/ShopFooter";

type Tab = "sign-in" | "register";

function AccountForm() {
  const searchParams = useSearchParams();
  const initialTab: Tab = searchParams.get("tab") === "register" ? "register" : "sign-in";
  const [tab, setTab] = useState<Tab>(initialTab);

  return (
    <div className="mx-auto max-w-md">
      <div className="flex rounded-xl border border-charcoal/15 p-1">
        <button
          type="button"
          onClick={() => setTab("sign-in")}
          className={`flex-1 rounded-lg py-2.5 text-xs font-semibold tracking-[0.08em] uppercase transition-colors ${
            tab === "sign-in" ? "bg-olive text-cream" : "text-charcoal-light hover:text-charcoal"
          }`}
        >
          Sign In
        </button>
        <button
          type="button"
          onClick={() => setTab("register")}
          className={`flex-1 rounded-lg py-2.5 text-xs font-semibold tracking-[0.08em] uppercase transition-colors ${
            tab === "register" ? "bg-olive text-cream" : "text-charcoal-light hover:text-charcoal"
          }`}
        >
          Create Account
        </button>
      </div>

      <form onSubmit={(e) => e.preventDefault()} className="mt-6 space-y-4">
        {tab === "register" && (
          <label className="block">
            <span className="text-xs font-medium text-charcoal">Full Name</span>
            <input
              required
              type="text"
              placeholder="Your full name"
              className="mt-1.5 w-full rounded-lg border border-charcoal/15 px-3.5 py-2.5 text-sm text-charcoal placeholder:text-ink-muted focus:outline-none focus:border-olive"
            />
          </label>
        )}

        <label className="block">
          <span className="text-xs font-medium text-charcoal">Email</span>
          <input
            required
            type="email"
            placeholder="you@example.com"
            className="mt-1.5 w-full rounded-lg border border-charcoal/15 px-3.5 py-2.5 text-sm text-charcoal placeholder:text-ink-muted focus:outline-none focus:border-olive"
          />
        </label>

        <label className="block">
          <span className="text-xs font-medium text-charcoal">Password</span>
          <input
            required
            type="password"
            placeholder="••••••••"
            minLength={8}
            className="mt-1.5 w-full rounded-lg border border-charcoal/15 px-3.5 py-2.5 text-sm text-charcoal placeholder:text-ink-muted focus:outline-none focus:border-olive"
          />
        </label>

        <button
          type="submit"
          className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-olive text-cream px-6 py-3.5 text-xs font-semibold tracking-[0.1em] uppercase hover:bg-olive-dark transition-colors"
        >
          {tab === "sign-in" ? "Sign In" : "Create Account"}
          <ArrowRight size={14} />
        </button>
      </form>

      <div className="mt-6 flex gap-2.5 rounded-xl bg-cream-dark px-4 py-3.5 text-xs text-charcoal-light leading-relaxed">
        <Info size={15} className="text-terracotta shrink-0 mt-0.5" />
        <p>
          Accounts aren&rsquo;t live in this demo yet, so this form won&rsquo;t
          actually sign you in. Blissynest is fully guest-friendly in the
          meantime — your{" "}
          <Link href="/cart" className="text-terracotta-dark font-medium hover:underline">
            cart
          </Link>{" "}
          and{" "}
          <Link href="/wishlist" className="text-terracotta-dark font-medium hover:underline">
            wishlist
          </Link>{" "}
          already work without one.
        </p>
      </div>
    </div>
  );
}

export function AccountPageClient() {
  return (
    <>
      <TopBar />
      <Header />
      <main>
        <div className="mx-auto max-w-[1440px] px-4 md:px-8 pt-5">
          <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Account" }]} />
        </div>

        <div className="mx-auto max-w-[1440px] px-4 md:px-8 pt-6 pb-16 text-center">
          <p className="eyebrow text-terracotta-dark mb-2">Your Account</p>
          <h1 className="font-serif text-3xl md:text-4xl text-charcoal">
            Sign in or create an account
          </h1>
          <p className="mt-3 text-sm text-ink-muted max-w-xl mx-auto">
            Keep track of your orders and save your favourites for next time.
          </p>

          <div className="mt-10 text-left">
            <Suspense fallback={null}>
              <AccountForm />
            </Suspense>
          </div>
        </div>
      </main>
      <ShopFooter />
    </>
  );
}
