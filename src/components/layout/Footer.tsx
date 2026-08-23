import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { footerLinks } from "@/lib/mock-data";

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.6">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.2" cy="6.8" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
      <path d="M13.5 21v-7.5h2.5l.4-3H13.5V8.4c0-.87.24-1.46 1.49-1.46H16.5V4.35C16.22 4.31 15.27 4.23 14.16 4.23c-2.32 0-3.91 1.42-3.91 4.02V10.5H7.75v3H10.25V21h3.25Z" />
    </svg>
  );
}

function PinterestIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
      <path d="M12 2C6.48 2 2 6.48 2 12c0 4.24 2.63 7.86 6.34 9.32-.09-.79-.17-2.01.04-2.88.19-.79 1.23-5.02 1.23-5.02s-.31-.63-.31-1.55c0-1.46.85-2.55 1.9-2.55.9 0 1.33.67 1.33 1.48 0 .9-.57 2.25-.87 3.5-.25 1.05.52 1.9 1.55 1.9 1.86 0 3.29-1.96 3.29-4.79 0-2.5-1.8-4.25-4.37-4.25-2.98 0-4.73 2.23-4.73 4.54 0 .9.34 1.86.78 2.39a.31.31 0 0 1 .07.3c-.08.32-.25 1.05-.29 1.19-.05.2-.15.24-.35.14-1.3-.61-2.11-2.5-2.11-4.03 0-3.28 2.38-6.29 6.87-6.29 3.61 0 6.41 2.57 6.41 6.01 0 3.58-2.26 6.47-5.4 6.47-1.05 0-2.05-.55-2.39-1.2l-.65 2.48c-.24.9-.87 2.03-1.3 2.72.98.3 2.02.46 3.1.46 5.52 0 10-4.48 10-10S17.52 2 12 2Z" />
    </svg>
  );
}

function YoutubeIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
      <path d="M21.58 7.19a2.51 2.51 0 0 0-1.77-1.78C18.25 5 12 5 12 5s-6.25 0-7.81.41a2.51 2.51 0 0 0-1.77 1.78A26.3 26.3 0 0 0 2 12a26.3 26.3 0 0 0 .42 4.81 2.51 2.51 0 0 0 1.77 1.78C5.75 19 12 19 12 19s6.25 0 7.81-.41a2.51 2.51 0 0 0 1.77-1.78A26.3 26.3 0 0 0 22 12a26.3 26.3 0 0 0-.42-4.81ZM10 15V9l5.2 3-5.2 3Z" />
    </svg>
  );
}

const socials = [
  { icon: InstagramIcon, label: "Instagram", href: "#" },
  { icon: FacebookIcon, label: "Facebook", href: "#" },
  { icon: PinterestIcon, label: "Pinterest", href: "#" },
  { icon: YoutubeIcon, label: "YouTube", href: "#" },
];

export function Footer() {
  return (
    <footer className="bg-cream-dark border-t border-charcoal/10">
      <div className="mx-auto max-w-[1440px] px-4 md:px-8 py-12 md:py-14">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 pb-10 border-b border-charcoal/10">
          <div className="max-w-sm text-center lg:text-left mx-auto lg:mx-0">
            <h2 className="font-serif text-2xl text-charcoal">
              A little inspiration, delivered.
            </h2>
            <p className="text-sm text-ink-muted mt-2">
              Gift ideas, new launches and feel-good stories — straight to
              your inbox.
            </p>
          </div>
          <form className="flex w-full max-w-md mx-auto lg:mx-0 items-center gap-3">
            <input
              type="email"
              required
              placeholder="Enter your email"
              className="flex-1 min-w-0 rounded-full border border-charcoal/20 bg-white px-5 py-3 text-sm text-charcoal placeholder:text-ink-muted focus:outline-none focus:border-olive"
            />
            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-full bg-olive text-cream px-6 py-3 text-xs font-semibold tracking-[0.1em] uppercase hover:bg-olive-dark transition-colors shrink-0"
            >
              Subscribe
              <ArrowRight size={14} />
            </button>
          </form>
          <div className="flex flex-col items-center lg:items-end gap-2 shrink-0">
            <span className="text-xs text-ink-muted">Follow us</span>
            <div className="flex items-center gap-4 text-charcoal">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  className="hover:text-terracotta-dark transition-colors"
                >
                  <s.icon />
                </a>
              ))}
            </div>
          </div>
        </div>

        <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-charcoal-light pt-8">
          {footerLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="hover:text-terracotta-dark transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <p className="text-xs text-ink-muted text-center lg:text-left mt-6">
          © 2026 BlissyNest. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
