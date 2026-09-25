import { GiftBoxLoader } from "@/components/ui/GiftBoxLoader";

// Covers the checkout while an order is being placed or a payment confirmed.
// The wait here is the one where an impatient double-tap or a closed tab can
// cost a customer real money or a lost order, so it's loud on purpose: the
// brand loader plus a clear "don't leave" message.
export function OrderProcessingOverlay() {
  return (
    <div className="fixed inset-0 z-[55] flex items-center justify-center bg-cream/90 px-6 backdrop-blur-sm">
      <GiftBoxLoader
        label="Wrapping up your order…"
        hint="Please don't close or refresh this page while we confirm it."
        size={104}
      />
    </div>
  );
}
