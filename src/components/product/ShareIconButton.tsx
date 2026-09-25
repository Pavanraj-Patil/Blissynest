"use client";

import { useEffect, useRef, useState } from "react";
import { Share2, Mail, Link2 } from "lucide-react";

function WhatsAppIcon({ size = 16 }: { size?: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor">
      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.29-1.39a9.9 9.9 0 0 0 4.75 1.21h.01c5.46 0 9.9-4.45 9.9-9.91C21.96 6.45 17.5 2 12.04 2Zm0 18.06a8.2 8.2 0 0 1-4.17-1.14l-.3-.18-3.14.82.84-3.06-.19-.31a8.15 8.15 0 0 1-1.26-4.33c0-4.51 3.67-8.18 8.19-8.18 2.19 0 4.24.85 5.79 2.4a8.13 8.13 0 0 1 2.4 5.79c0 4.51-3.67 8.19-8.16 8.19Zm4.48-6.13c-.25-.12-1.45-.72-1.67-.8-.22-.08-.39-.12-.55.12-.16.25-.63.8-.78.96-.14.16-.28.18-.53.06-.25-.12-1.06-.39-2.02-1.24-.75-.67-1.25-1.49-1.4-1.74-.15-.25-.02-.38.11-.51.11-.11.25-.28.37-.42.12-.14.16-.24.25-.4.08-.16.04-.3-.02-.42-.06-.12-.55-1.32-.75-1.8-.2-.48-.4-.42-.55-.42-.14 0-.3-.02-.46-.02-.16 0-.42.06-.64.3-.22.25-.85.83-.85 2.02 0 1.19.87 2.34.99 2.5.12.16 1.71 2.61 4.14 3.66.58.25 1.03.4 1.38.51.58.18 1.11.16 1.53.1.47-.07 1.45-.59 1.65-1.16.2-.57.2-1.06.14-1.16-.06-.1-.22-.16-.47-.28Z" />
    </svg>
  );
}

function InstagramIcon({ size = 16 }: { size?: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4.2" />
      <circle cx="17.2" cy="6.8" r="0.9" fill="currentColor" stroke="none" />
    </svg>
  );
}

const shareTargets = [
  { key: "whatsapp", label: "WhatsApp", icon: WhatsAppIcon },
  { key: "instagram", label: "Instagram", icon: InstagramIcon },
  { key: "facebook", label: "Facebook", icon: Share2 },
  { key: "email", label: "Email", icon: Mail },
];

export function ShareIconButton({ productName }: { productName: string }) {
  const [open, setOpen] = useState(false);
  const [copyMessage, setCopyMessage] = useState<string | null>(null);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function getUrl() {
    return typeof window !== "undefined" ? window.location.href : "";
  }

  async function copyLinkToClipboard() {
    try {
      await navigator.clipboard.writeText(getUrl());
      return true;
    } catch {
      return false;
    }
  }

  function showCopyMessage(message: string) {
    setCopyMessage(message);
    setTimeout(() => setCopyMessage(null), 3000);
  }

  // Instagram has no public web share intent for an arbitrary link (unlike
  // wa.me/sharer.php below) — it deliberately keeps sharing in-app, so the
  // best a website can do is copy the link and hand the user off to
  // instagram.com to paste it themselves.
  async function handleInstagramShare() {
    if (await copyLinkToClipboard()) {
      showCopyMessage("Link copied. Paste it into your Story or DM");
    }
    window.open("https://www.instagram.com/", "_blank");
  }

  function handleShare(key: string) {
    if (key === "instagram") {
      handleInstagramShare();
      return; // stays open so the copy hint is visible
    }

    const url = getUrl();
    const text = `Check out ${productName} on Blissynest`;
    if (key === "whatsapp") {
      window.open(`https://wa.me/?text=${encodeURIComponent(`${text} ${url}`)}`, "_blank");
    } else if (key === "facebook") {
      window.open(
        `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
        "_blank"
      );
    } else if (key === "email") {
      window.open(
        `mailto:?subject=${encodeURIComponent(text)}&body=${encodeURIComponent(url)}`,
        "_self"
      );
    }
    setOpen(false);
  }

  async function handleCopy() {
    if (await copyLinkToClipboard()) {
      showCopyMessage("Copied!");
    }
  }

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        aria-label="Share this product"
        onClick={() => setOpen((v) => !v)}
        className="flex h-10 w-10 sm:h-8 sm:w-8 items-center justify-center rounded-full text-charcoal-light hover:text-terracotta-dark hover:bg-cream-dark transition-colors"
      >
        <Share2 size={16} />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 z-20 flex items-center gap-1.5 rounded-full border border-charcoal/10 bg-white p-1.5 shadow-lg">
          {shareTargets.map((target) => (
            <button
              key={target.key}
              type="button"
              aria-label={`Share on ${target.label}`}
              onClick={() => handleShare(target.key)}
              className="flex h-10 w-10 sm:h-8 sm:w-8 items-center justify-center rounded-full text-charcoal-light hover:text-terracotta-dark hover:bg-cream-dark transition-colors"
            >
              <target.icon size={16} />
            </button>
          ))}
          <button
            type="button"
            aria-label="Copy link"
            onClick={handleCopy}
            className="flex h-10 w-10 sm:h-8 sm:w-8 items-center justify-center rounded-full text-charcoal-light hover:text-terracotta-dark hover:bg-cream-dark transition-colors"
          >
            <Link2 size={16} />
          </button>
          {copyMessage && (
            <span className="absolute -bottom-6 right-0 w-max max-w-[13rem] text-xs text-olive font-medium text-right">
              {copyMessage}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
