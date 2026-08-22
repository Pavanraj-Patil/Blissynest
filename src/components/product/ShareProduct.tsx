"use client";

import { useState } from "react";
import { Mail, Link2, Share2 } from "lucide-react";

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.29-1.39a9.9 9.9 0 0 0 4.75 1.21h.01c5.46 0 9.9-4.45 9.9-9.91C21.96 6.45 17.5 2 12.04 2Zm0 18.06a8.2 8.2 0 0 1-4.17-1.14l-.3-.18-3.14.82.84-3.06-.19-.31a8.15 8.15 0 0 1-1.26-4.33c0-4.51 3.67-8.18 8.19-8.18 2.19 0 4.24.85 5.79 2.4a8.13 8.13 0 0 1 2.4 5.79c0 4.51-3.67 8.19-8.16 8.19Zm4.48-6.13c-.25-.12-1.45-.72-1.67-.8-.22-.08-.39-.12-.55.12-.16.25-.63.8-.78.96-.14.16-.28.18-.53.06-.25-.12-1.06-.39-2.02-1.24-.75-.67-1.25-1.49-1.4-1.74-.15-.25-.02-.38.11-.51.11-.11.25-.28.37-.42.12-.14.16-.24.25-.4.08-.16.04-.3-.02-.42-.06-.12-.55-1.32-.75-1.8-.2-.48-.4-.42-.55-.42-.14 0-.3-.02-.46-.02-.16 0-.42.06-.64.3-.22.25-.85.83-.85 2.02 0 1.19.87 2.34.99 2.5.12.16 1.71 2.61 4.14 3.66.58.25 1.03.4 1.38.51.58.18 1.11.16 1.53.1.47-.07 1.45-.59 1.65-1.16.2-.57.2-1.06.14-1.16-.06-.1-.22-.16-.47-.28Z" />
    </svg>
  );
}

const shareTargets = [
  { key: "whatsapp", label: "WhatsApp", icon: WhatsAppIcon },
  { key: "facebook", label: "Facebook", icon: Share2 },
  { key: "email", label: "Email", icon: Mail },
];

export function ShareProduct({ productName }: { productName: string }) {
  const [copied, setCopied] = useState(false);

  function getUrl() {
    return typeof window !== "undefined" ? window.location.href : "";
  }

  function handleShare(key: string) {
    const url = getUrl();
    const text = `Check out ${productName} on Blissynest`;
    if (key === "whatsapp") {
      window.open(
        `https://wa.me/?text=${encodeURIComponent(`${text} ${url}`)}`,
        "_blank"
      );
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
  }

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(getUrl());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div className="flex items-center gap-3">
      <span className="text-sm font-medium text-charcoal">Share this product</span>
      <div className="flex items-center gap-2 ml-auto">
        {shareTargets.map((target) => (
          <button
            key={target.key}
            type="button"
            aria-label={`Share on ${target.label}`}
            onClick={() => handleShare(target.key)}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-charcoal/15 text-charcoal-light hover:text-terracotta-dark hover:border-terracotta transition-colors"
          >
            <target.icon />
          </button>
        ))}
        <button
          type="button"
          aria-label="Copy link"
          onClick={handleCopy}
          className="flex h-9 w-9 items-center justify-center rounded-full border border-charcoal/15 text-charcoal-light hover:text-terracotta-dark hover:border-terracotta transition-colors"
        >
          <Link2 size={16} />
        </button>
        {copied && <span className="text-xs text-olive font-medium">Copied!</span>}
      </div>
    </div>
  );
}
