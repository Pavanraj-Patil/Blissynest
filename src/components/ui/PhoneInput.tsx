"use client";

import { useEffect, useRef, type InputHTMLAttributes } from "react";
import { PHONE_ERROR, isValidIndianMobile } from "@/lib/phone";

// An Indian mobile-number field: phone keypad on mobile, browser autofill, and
// a validation message at submit time when the number isn't a valid 10-digit
// mobile. Uses the browser's own form validation (setCustomValidity), so it
// works in controlled and uncontrolled forms alike and blocks submit without
// any per-form handler code. An empty value is left to `required`.
export function PhoneInput({
  onInput,
  ...props
}: Omit<InputHTMLAttributes<HTMLInputElement>, "type">) {
  const ref = useRef<HTMLInputElement>(null);

  function check(el: HTMLInputElement) {
    const v = el.value.trim();
    el.setCustomValidity(v === "" || isValidIndianMobile(v) ? "" : PHONE_ERROR);
  }

  // Covers values set from outside (a prefilled/saved number, a form reset).
  useEffect(() => {
    if (ref.current) check(ref.current);
  }, [props.value]);

  return (
    <input
      {...props}
      ref={ref}
      type="tel"
      inputMode="tel"
      autoComplete={props.autoComplete ?? "tel"}
      maxLength={props.maxLength ?? 17}
      onInput={(e) => {
        check(e.currentTarget);
        onInput?.(e);
      }}
    />
  );
}
