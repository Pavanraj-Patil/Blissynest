"use client";

import { useState } from "react";
import { User } from "lucide-react";
import { AccountAuthModal } from "./AccountAuthModal";

export function AccountMenu() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        aria-label="Account"
        onClick={() => setOpen(true)}
        className="hover:text-terracotta-dark transition-colors"
      >
        <User size={19} />
      </button>

      <AccountAuthModal open={open} onClose={() => setOpen(false)} />
    </>
  );
}
