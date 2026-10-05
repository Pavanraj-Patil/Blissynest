"use client";

import { useState } from "react";
import { Plus, Pencil, Trash2, ChevronDown, ArrowRight } from "lucide-react";
import { cn } from "@/lib/cn";
import type { Address } from "@/lib/checkout-data";
import { PhoneInput } from "@/components/ui/PhoneInput";
import { CityStateFields } from "@/components/ui/CityStateFields";

type AddressFormValues = Omit<Address, "id">;

const emptyForm: AddressFormValues = {
  label: "Home",
  name: "",
  line1: "",
  line2: "",
  city: "",
  state: "",
  pincode: "",
  phone: "",
};

function AddressForm({
  initial,
  onSave,
  onCancel,
}: {
  initial: AddressFormValues;
  onSave: (values: AddressFormValues) => Promise<{ ok: boolean; error?: string }>;
  onCancel: () => void;
}) {
  const [values, setValues] = useState(initial);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function set<K extends keyof AddressFormValues>(key: K, value: AddressFormValues[K]) {
    setValues((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    const result = await onSave(values);
    setSaving(false);
    // On success the parent switches away from this form entirely, so
    // there's nothing left here to update.
    if (!result.ok) setError(result.error ?? "Something went wrong. Please try again.");
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-2xl border border-charcoal/10 p-5 space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <label className="block">
          <span className="text-xs font-medium text-charcoal">
            Address Label <span className="text-terracotta-dark">*</span>
          </span>
          <input
            required
            value={values.label}
            onChange={(e) => set("label", e.target.value)}
            placeholder="Home, Work..."
            className="mt-1.5 w-full rounded-lg border border-charcoal/15 px-3.5 py-2.5 text-sm text-charcoal placeholder:text-ink-muted focus:outline-none focus:border-olive"
          />
        </label>
        <label className="block">
          <span className="text-xs font-medium text-charcoal">
            Full Name <span className="text-terracotta-dark">*</span>
          </span>
          <input
            required
            value={values.name}
            onChange={(e) => set("name", e.target.value)}
            placeholder="Your full name"
            className="mt-1.5 w-full rounded-lg border border-charcoal/15 px-3.5 py-2.5 text-sm text-charcoal placeholder:text-ink-muted focus:outline-none focus:border-olive"
          />
        </label>
      </div>

      <label className="block">
        <span className="text-xs font-medium text-charcoal">
          Address Line 1 <span className="text-terracotta-dark">*</span>
        </span>
        <input
          required
          value={values.line1}
          onChange={(e) => set("line1", e.target.value)}
          placeholder="House no., street, area"
          className="mt-1.5 w-full rounded-lg border border-charcoal/15 px-3.5 py-2.5 text-sm text-charcoal placeholder:text-ink-muted focus:outline-none focus:border-olive"
        />
      </label>

      <label className="block">
        <span className="text-xs font-medium text-charcoal">Address Line 2 (optional)</span>
        <input
          value={values.line2 ?? ""}
          onChange={(e) => set("line2", e.target.value)}
          placeholder="Landmark, apartment, etc."
          className="mt-1.5 w-full rounded-lg border border-charcoal/15 px-3.5 py-2.5 text-sm text-charcoal placeholder:text-ink-muted focus:outline-none focus:border-olive"
        />
      </label>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <CityStateFields
          city={values.city}
          state={values.state}
          onCityChange={(v) => set("city", v)}
          onStateChange={(v) => set("state", v)}
        />
        <label className="block">
          <span className="text-xs font-medium text-charcoal">
            Pincode <span className="text-terracotta-dark">*</span>
          </span>
          <input
            required
            maxLength={6}
            value={values.pincode}
            onChange={(e) => set("pincode", e.target.value.replace(/\D/g, ""))}
            inputMode="numeric"
            autoComplete="postal-code"
            pattern="[1-9][0-9]{5}"
            title="Enter a valid 6-digit pincode"
            className="mt-1.5 w-full rounded-lg border border-charcoal/15 px-3.5 py-2.5 text-sm text-charcoal focus:outline-none focus:border-olive"
          />
        </label>
      </div>

      <label className="block max-w-xs">
        <span className="text-xs font-medium text-charcoal">
          Phone <span className="text-terracotta-dark">*</span>
        </span>
        <PhoneInput
          required
          value={values.phone}
          onChange={(e) => set("phone", e.target.value)}
          className="mt-1.5 w-full rounded-lg border border-charcoal/15 px-3.5 py-2.5 text-sm text-charcoal placeholder:text-ink-muted focus:outline-none focus:border-olive"
        />
      </label>

      {error && <p className="text-sm text-terracotta-dark">{error}</p>}

      <div className="flex gap-3 pt-1">
        <button
          type="submit"
          disabled={saving}
          className="rounded-xl bg-olive text-cream px-6 py-3 text-xs font-semibold tracking-[0.1em] uppercase hover:bg-olive-dark transition-colors disabled:opacity-60"
        >
          {saving ? "Saving…" : "Save Address"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          disabled={saving}
          className="rounded-xl border border-charcoal/20 px-6 py-3 text-xs font-semibold tracking-[0.1em] uppercase text-charcoal hover:bg-cream-dark transition-colors disabled:opacity-60"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

type AddressStepProps = {
  addresses: Address[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  onAdd: (values: AddressFormValues) => Promise<{ ok: boolean; error?: string }>;
  onEdit: (id: string, values: AddressFormValues) => Promise<{ ok: boolean; error?: string }>;
  onDelete: (id: string) => void;
  isGift: boolean;
  onToggleGift: (v: boolean) => void;
  giftNote: string;
  onGiftNoteChange: (v: string) => void;
  hidePrices: boolean;
  onToggleHidePrices: (v: boolean) => void;
  onContinue: () => void;
  // Extra gate beyond `!!selectedId`, e.g. a guest's contact email also
  // needing to be valid before continuing. Defaults to true so every
  // existing caller keeps its current behavior unchanged.
  canContinue?: boolean;
  // Prefills a brand-new address's Phone field (e.g. a guest's own contact
  // number they already typed above) so they don't have to enter it twice —
  // still just a starting value, editable in case delivery goes to someone
  // else's number.
  defaultPhone?: string;
};

export function AddressStep({
  addresses,
  selectedId,
  onSelect,
  onAdd,
  onEdit,
  onDelete,
  isGift,
  onToggleGift,
  giftNote,
  onGiftNoteChange,
  hidePrices,
  onToggleHidePrices,
  onContinue,
  canContinue = true,
  defaultPhone,
}: AddressStepProps) {
  const [mode, setMode] = useState<"list" | "add" | "edit">("list");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [giftPanelOpen, setGiftPanelOpen] = useState(false);

  const editingAddress = addresses.find((a) => a.id === editingId);

  return (
    <div className="space-y-5">
      {mode === "list" && (
        <>
          {/* lg (not sm) — below lg, checkout's own layout has already split
              into a form column + order-summary sidebar (see
              CheckoutPageClient's md:grid-cols-[1fr_340px]), so the form
              column itself is much narrower than the full viewport in the
              768-1023 range; a viewport-relative sm: 2-up here would
              squeeze two address cards into that narrow column. */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {addresses.map((addr) => (
              <label
                key={addr.id}
                className={cn(
                  "relative flex gap-3 rounded-2xl border p-4 cursor-pointer transition-colors",
                  selectedId === addr.id
                    ? "border-olive bg-olive/5"
                    : "border-charcoal/10 hover:border-charcoal/25"
                )}
              >
                <input
                  type="radio"
                  name="address"
                  checked={selectedId === addr.id}
                  onChange={() => onSelect(addr.id)}
                  className="mt-1 h-4 w-4 accent-olive shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-charcoal">{addr.label}</span>
                    {addr.id === addresses[0].id && (
                      <span className="rounded-full bg-cream-dark px-2 py-0.5 text-[11px] font-medium text-charcoal-light">
                        Default
                      </span>
                    )}
                  </div>
                  <p className="mt-1.5 text-sm text-charcoal">{addr.name}</p>
                  <p className="text-sm text-ink-muted leading-relaxed">
                    {addr.line1}
                    {addr.line2 ? `, ${addr.line2}` : ""}, {addr.city}, {addr.state} - {addr.pincode}
                  </p>
                  <p className="text-sm text-ink-muted mt-0.5">{addr.phone}</p>
                </div>
                <div className="flex flex-col gap-1 shrink-0">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      setEditingId(addr.id);
                      setMode("edit");
                    }}
                    aria-label="Edit address"
                    className="flex h-8 w-8 items-center justify-center rounded-full text-charcoal-light hover:text-terracotta-dark hover:bg-white transition-colors"
                  >
                    <Pencil size={14} />
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      onDelete(addr.id);
                    }}
                    aria-label="Delete address"
                    className="flex h-8 w-8 items-center justify-center rounded-full text-charcoal-light hover:text-terracotta-dark hover:bg-white transition-colors"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </label>
            ))}

            <button
              type="button"
              onClick={() => setMode("add")}
              className="flex flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-charcoal/20 p-4 text-charcoal-light hover:border-olive/50 hover:text-olive transition-colors min-h-[9rem]"
            >
              <Plus size={20} />
              <span className="text-sm font-medium">Add New Address</span>
              <span className="text-xs text-ink-muted">Deliver to a different address</span>
            </button>
          </div>

          <div className="rounded-2xl border border-charcoal/10 p-4">
            <label className="flex items-center gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={isGift}
                onChange={(e) => {
                  onToggleGift(e.target.checked);
                  if (e.target.checked) setGiftPanelOpen(true);
                }}
                className="h-4 w-4 rounded border-charcoal/25 accent-olive"
              />
              <span className="text-sm font-medium text-charcoal">This order is a gift</span>
              <button
                type="button"
                onClick={() => setGiftPanelOpen((v) => !v)}
                className="ml-auto text-charcoal/40 hover:text-charcoal transition-colors"
                aria-label="Toggle gift options"
              >
                <ChevronDown
                  size={16}
                  className={cn("transition-transform", giftPanelOpen && "rotate-180")}
                />
              </button>
            </label>
            <p className="text-xs text-ink-muted mt-1 ml-6">
              Add a personalised note, and hide prices on the packing slip.
            </p>

            {giftPanelOpen && (
              <div className="mt-4 pt-4 border-t border-charcoal/10 space-y-3">
                <label className="block">
                  <span className="text-xs font-medium text-charcoal">Gift Note (optional)</span>
                  <textarea
                    rows={3}
                    value={giftNote}
                    onChange={(e) => onGiftNoteChange(e.target.value)}
                    placeholder="Write a short message for the recipient..."
                    className="mt-1.5 w-full rounded-lg border border-charcoal/15 px-3.5 py-2.5 text-sm text-charcoal placeholder:text-ink-muted focus:outline-none focus:border-olive resize-none"
                  />
                </label>
                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={hidePrices}
                    onChange={(e) => onToggleHidePrices(e.target.checked)}
                    className="h-4 w-4 rounded border-charcoal/25 accent-olive"
                  />
                  <span className="text-sm text-charcoal-light">
                    Hide prices on the packing slip
                  </span>
                </label>
              </div>
            )}
          </div>

          {/* Hidden on mobile — CheckoutMobileStickyCTA covers this role
              there (a persistent sticky bottom bar across every step) so
              the shopper never has to scroll to find it. */}
          <button
            type="button"
            onClick={onContinue}
            disabled={!selectedId || !canContinue}
            className="hidden md:inline-flex items-center gap-2 rounded-xl bg-olive text-cream px-7 py-3.5 text-xs font-semibold tracking-[0.1em] uppercase hover:bg-olive-dark transition-colors disabled:opacity-40 disabled:pointer-events-none"
          >
            Continue to Payment
            <ArrowRight size={14} />
          </button>
        </>
      )}

      {mode === "add" && (
        <AddressForm
          initial={defaultPhone ? { ...emptyForm, phone: defaultPhone } : emptyForm}
          onSave={async (values) => {
            const result = await onAdd(values);
            if (result.ok) setMode("list");
            return result;
          }}
          onCancel={() => setMode("list")}
        />
      )}

      {mode === "edit" && editingAddress && (
        <AddressForm
          initial={editingAddress}
          onSave={async (values) => {
            const result = await onEdit(editingAddress.id, values);
            if (result.ok) {
              setMode("list");
              setEditingId(null);
            }
            return result;
          }}
          onCancel={() => {
            setMode("list");
            setEditingId(null);
          }}
        />
      )}
    </div>
  );
}
