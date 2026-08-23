"use client";

import { useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import type { Address } from "@/lib/checkout-data";

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
  onSave: (values: AddressFormValues) => void;
  onCancel: () => void;
}) {
  const [values, setValues] = useState(initial);

  function set<K extends keyof AddressFormValues>(key: K, value: AddressFormValues[K]) {
    setValues((prev) => ({ ...prev, [key]: value }));
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSave(values);
      }}
      className="rounded-2xl border border-charcoal/10 bg-white p-5 sm:p-6 space-y-4"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <label className="block">
          <span className="text-xs font-medium text-charcoal">Address Label</span>
          <input
            required
            value={values.label}
            onChange={(e) => set("label", e.target.value)}
            placeholder="Home, Work..."
            className="mt-1.5 w-full rounded-lg border border-charcoal/15 px-3.5 py-2.5 text-sm text-charcoal placeholder:text-ink-muted focus:outline-none focus:border-olive"
          />
        </label>
        <label className="block">
          <span className="text-xs font-medium text-charcoal">Full Name</span>
          <input
            required
            value={values.name}
            onChange={(e) => set("name", e.target.value)}
            className="mt-1.5 w-full rounded-lg border border-charcoal/15 px-3.5 py-2.5 text-sm text-charcoal focus:outline-none focus:border-olive"
          />
        </label>
      </div>

      <label className="block">
        <span className="text-xs font-medium text-charcoal">Address Line 1</span>
        <input
          required
          value={values.line1}
          onChange={(e) => set("line1", e.target.value)}
          className="mt-1.5 w-full rounded-lg border border-charcoal/15 px-3.5 py-2.5 text-sm text-charcoal focus:outline-none focus:border-olive"
        />
      </label>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <label className="block">
          <span className="text-xs font-medium text-charcoal">City</span>
          <input
            required
            value={values.city}
            onChange={(e) => set("city", e.target.value)}
            className="mt-1.5 w-full rounded-lg border border-charcoal/15 px-3.5 py-2.5 text-sm text-charcoal focus:outline-none focus:border-olive"
          />
        </label>
        <label className="block">
          <span className="text-xs font-medium text-charcoal">State</span>
          <input
            required
            value={values.state}
            onChange={(e) => set("state", e.target.value)}
            className="mt-1.5 w-full rounded-lg border border-charcoal/15 px-3.5 py-2.5 text-sm text-charcoal focus:outline-none focus:border-olive"
          />
        </label>
        <label className="block">
          <span className="text-xs font-medium text-charcoal">Pincode</span>
          <input
            required
            maxLength={6}
            value={values.pincode}
            onChange={(e) => set("pincode", e.target.value.replace(/\D/g, ""))}
            className="mt-1.5 w-full rounded-lg border border-charcoal/15 px-3.5 py-2.5 text-sm text-charcoal focus:outline-none focus:border-olive"
          />
        </label>
      </div>

      <label className="block max-w-xs">
        <span className="text-xs font-medium text-charcoal">Phone</span>
        <input
          required
          value={values.phone}
          onChange={(e) => set("phone", e.target.value)}
          className="mt-1.5 w-full rounded-lg border border-charcoal/15 px-3.5 py-2.5 text-sm text-charcoal focus:outline-none focus:border-olive"
        />
      </label>

      <div className="flex gap-3 pt-1">
        <button
          type="submit"
          className="rounded-xl bg-olive text-cream px-6 py-3 text-xs font-semibold tracking-[0.1em] uppercase hover:bg-olive-dark transition-colors"
        >
          Save Address
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="rounded-xl border border-charcoal/20 px-6 py-3 text-xs font-semibold tracking-[0.1em] uppercase text-charcoal hover:bg-cream-dark transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

export function AddressesSection({ initial }: { initial: Address[] }) {
  const [addresses, setAddresses] = useState<Address[]>(initial);
  const [mode, setMode] = useState<"list" | "add" | "edit">("list");
  const [editingId, setEditingId] = useState<string | null>(null);

  const editingAddress = addresses.find((a) => a.id === editingId);

  function addAddress(values: AddressFormValues) {
    setAddresses((prev) => [...prev, { ...values, id: `addr-${Date.now()}` }]);
    setMode("list");
  }

  function editAddress(id: string, values: AddressFormValues) {
    setAddresses((prev) => prev.map((a) => (a.id === id ? { ...values, id } : a)));
    setMode("list");
    setEditingId(null);
  }

  function deleteAddress(id: string) {
    setAddresses((prev) => prev.filter((a) => a.id !== id));
  }

  if (mode === "add") {
    return <AddressForm initial={emptyForm} onSave={addAddress} onCancel={() => setMode("list")} />;
  }

  if (mode === "edit" && editingAddress) {
    return (
      <AddressForm
        initial={editingAddress}
        onSave={(values) => editAddress(editingAddress.id, values)}
        onCancel={() => {
          setMode("list");
          setEditingId(null);
        }}
      />
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {addresses.map((addr) => (
        <div key={addr.id} className="relative rounded-2xl border border-charcoal/10 bg-white p-4">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-charcoal">{addr.label}</span>
            {addr.id === addresses[0]?.id && (
              <span className="rounded-full bg-cream-dark px-2 py-0.5 text-[10px] font-medium text-charcoal-light">
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

          <div className="absolute right-3 top-3 flex gap-1">
            <button
              type="button"
              onClick={() => {
                setEditingId(addr.id);
                setMode("edit");
              }}
              aria-label="Edit address"
              className="flex h-8 w-8 items-center justify-center rounded-full text-charcoal-light hover:text-terracotta-dark hover:bg-cream-dark transition-colors"
            >
              <Pencil size={14} />
            </button>
            <button
              type="button"
              onClick={() => deleteAddress(addr.id)}
              aria-label="Delete address"
              className="flex h-8 w-8 items-center justify-center rounded-full text-charcoal-light hover:text-terracotta-dark hover:bg-cream-dark transition-colors"
            >
              <Trash2 size={14} />
            </button>
          </div>
        </div>
      ))}

      <button
        type="button"
        onClick={() => setMode("add")}
        className="flex flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-charcoal/20 p-4 text-charcoal-light hover:border-olive/50 hover:text-olive transition-colors min-h-[9rem]"
      >
        <Plus size={20} />
        <span className="text-sm font-medium">Add New Address</span>
      </button>
    </div>
  );
}
