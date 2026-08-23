/**
 * A tiny external store backed by localStorage, for use with React's
 * useSyncExternalStore. Avoids the classic "setState inside an effect just
 * to load persisted state" pattern — useSyncExternalStore already handles
 * the server/client snapshot split safely (server & first client render
 * both use getServerSnapshot, so there's no hydration mismatch).
 */
export function createLocalStore<T>(key: string, fallback: T) {
  let state: T = fallback;
  let initialized = false;
  const listeners = new Set<() => void>();

  function ensureInitialized() {
    if (initialized || typeof window === "undefined") return;
    initialized = true;
    try {
      const raw = localStorage.getItem(key);
      if (raw) state = JSON.parse(raw) as T;
    } catch {
      // ignore corrupted storage
    }
  }

  function getSnapshot(): T {
    ensureInitialized();
    return state;
  }

  function getServerSnapshot(): T {
    return fallback;
  }

  function subscribe(listener: () => void) {
    listeners.add(listener);
    return () => listeners.delete(listener);
  }

  function setState(next: T) {
    ensureInitialized();
    state = next;
    try {
      localStorage.setItem(key, JSON.stringify(state));
    } catch {
      // ignore quota / serialization errors
    }
    listeners.forEach((listener) => listener());
  }

  return { getSnapshot, getServerSnapshot, subscribe, setState };
}
