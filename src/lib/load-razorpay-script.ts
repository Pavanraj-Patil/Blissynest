const SCRIPT_SRC = "https://checkout.razorpay.com/v1/checkout.js";

// Loads Razorpay's real hosted Checkout.js exactly once per page — this app
// never builds its own card-number/CVV input fields (see checkout's own
// comments); the actual payment UI is always Razorpay's.
export function loadRazorpayScript(): Promise<boolean> {
  if (typeof window === "undefined") return Promise.resolve(false);
  if (window.Razorpay) return Promise.resolve(true);

  const existing = document.querySelector(`script[src="${SCRIPT_SRC}"]`);
  if (existing) {
    return new Promise((resolve) => {
      existing.addEventListener("load", () => resolve(true));
      existing.addEventListener("error", () => resolve(false));
    });
  }

  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = SCRIPT_SRC;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}
