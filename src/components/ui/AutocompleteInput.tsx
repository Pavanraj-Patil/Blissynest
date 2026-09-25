"use client";

import { useEffect, useId, useMemo, useRef, useState, type InputHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

type AutocompleteInputProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "value" | "onChange" | "onSelect" | "type" | "list"
> & {
  value: string;
  onChange: (value: string) => void;
  /** Called when a suggestion is picked (not on every keystroke). */
  onSelect?: (value: string) => void;
  options: readonly string[];
  /** Characters typed before suggestions appear — 0 shows the whole list on focus. */
  minChars?: number;
  maxSuggestions?: number;
  /** Non-empty = the field is invalid with this message (blocks form submit). */
  validityMessage?: string;
};

// A text field with a suggestion dropdown, like the address fields on
// Amazon/Flipkart: type "p" and every option starting with "p" appears, type
// "pu" and it narrows to "pu…", then pick one with a tap/click or the arrow
// keys + Enter. Options that start with the typed text come first, then
// options where a later word starts with it ("gama" -> "Vasco da Gama").
// Free typing is still allowed — whether a value outside the list is accepted
// is up to the caller (see `validityMessage`).
export function AutocompleteInput({
  value,
  onChange,
  onSelect,
  options,
  minChars = 1,
  maxSuggestions = 8,
  validityMessage = "",
  className,
  onFocus,
  onBlur,
  onKeyDown,
  ...props
}: AutocompleteInputProps) {
  const listId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [open, setOpen] = useState(false);
  const [highlight, setHighlight] = useState(-1);

  const suggestions = useMemo(() => {
    const q = value.trim().toLowerCase();
    if (q.length < minChars) return [];
    if (q === "") return options.slice(0, maxSuggestions);
    const starts: string[] = [];
    const wordStarts: string[] = [];
    for (const opt of options) {
      const lower = opt.toLowerCase();
      if (lower.startsWith(q)) starts.push(opt);
      else if (lower.split(/[\s-]+/).some((w) => w.startsWith(q))) wordStarts.push(opt);
    }
    return [...starts, ...wordStarts].slice(0, maxSuggestions);
  }, [value, options, minChars, maxSuggestions]);

  // Once the typed text exactly equals the only suggestion there is nothing
  // left to pick, so don't keep the list hanging open.
  const exactOnly = suggestions.length === 1 && suggestions[0].toLowerCase() === value.trim().toLowerCase();
  const showList = open && suggestions.length > 0 && !exactOnly;

  useEffect(() => {
    inputRef.current?.setCustomValidity(validityMessage);
  }, [validityMessage, value]);

  function pick(option: string) {
    onChange(option);
    onSelect?.(option);
    setOpen(false);
    setHighlight(-1);
  }

  return (
    <div className="relative">
      <input
        {...props}
        ref={inputRef}
        value={value}
        type="text"
        role="combobox"
        aria-expanded={showList}
        aria-controls={listId}
        aria-autocomplete="list"
        aria-activedescendant={showList && highlight >= 0 ? `${listId}-${highlight}` : undefined}
        autoComplete="off"
        className={className}
        onChange={(e) => {
          onChange(e.target.value);
          setOpen(true);
          setHighlight(-1);
        }}
        onFocus={(e) => {
          setOpen(true);
          onFocus?.(e);
        }}
        onBlur={(e) => {
          setOpen(false);
          setHighlight(-1);
          onBlur?.(e);
        }}
        onKeyDown={(e) => {
          onKeyDown?.(e);
          if (e.defaultPrevented) return;
          if (e.key === "ArrowDown" && suggestions.length > 0) {
            e.preventDefault();
            setOpen(true);
            setHighlight((h) => (h + 1) % suggestions.length);
          } else if (e.key === "ArrowUp" && suggestions.length > 0) {
            e.preventDefault();
            setOpen(true);
            setHighlight((h) => (h <= 0 ? suggestions.length - 1 : h - 1));
          } else if (e.key === "Enter" && showList && highlight >= 0) {
            // Picks the highlighted suggestion instead of submitting the form.
            e.preventDefault();
            pick(suggestions[highlight]);
          } else if (e.key === "Escape" && showList) {
            e.preventDefault();
            setOpen(false);
          }
        }}
      />

      {showList && (
        <ul
          id={listId}
          role="listbox"
          className="absolute left-0 right-0 top-full z-30 mt-1 max-h-56 overflow-auto rounded-xl border border-charcoal/10 bg-white p-1 shadow-xl"
        >
          {suggestions.map((option, i) => {
            const q = value.trim();
            const matchesStart = q && option.toLowerCase().startsWith(q.toLowerCase());
            return (
              <li
                key={option}
                id={`${listId}-${i}`}
                role="option"
                aria-selected={i === highlight}
                // mousedown (not click) so the input keeps focus and the
                // list isn't closed by blur before the choice registers.
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => pick(option)}
                onMouseEnter={() => setHighlight(i)}
                className={cn(
                  "cursor-pointer rounded-lg px-3 py-2 text-sm text-charcoal",
                  i === highlight ? "bg-cream-dark" : "hover:bg-cream-dark"
                )}
              >
                {matchesStart ? (
                  <>
                    <span className="font-semibold">{option.slice(0, q.length)}</span>
                    {option.slice(q.length)}
                  </>
                ) : (
                  option
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
