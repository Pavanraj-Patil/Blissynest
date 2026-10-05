import { db } from "@/lib/db";

// Read-only, used by both the public storefront (TopBar's free-shipping
// banner) and the admin settings page — not admin-specific logic, just
// site config. src/lib/admin/settings-service.ts owns the write side.
export async function getSiteSettings() {
  const settings = await db.siteSettings.upsert({
    where: { id: "singleton" },
    update: {},
    create: { id: "singleton" },
  });
  return {
    gstRatePercent: settings.gstRatePercent,
    freeShippingThreshold: Math.round(settings.freeShippingThreshold / 100),
    standardShippingFee: Math.round(settings.standardShippingFee / 100),
    codEnabled: settings.codEnabled,
    topBarEnabled: settings.topBarEnabled,
    maintenanceMode: settings.maintenanceMode,
    maintenanceMessage: settings.maintenanceMessage ?? "",
    maintenanceReturnAt: settings.maintenanceReturnAt ? settings.maintenanceReturnAt.toISOString() : null,
  };
}

export type MaintenanceStatus = {
  maintenanceMode: boolean;
  maintenanceMessage: string;
  maintenanceReturnAt: string | null;
};

// proxy.ts calls this on every page navigation, so it deliberately skips
// getSiteSettings()'s upsert (no writes from the hot path) and keeps a
// short-lived in-memory cache instead of hitting the database on every
// single request. Safe because this app runs as one long-lived `next start`
// process (see AGENTS.md / deployment notes), not stateless serverless
// instances that wouldn't share the cache.
let cachedStatus: { value: MaintenanceStatus; at: number } | null = null;
const MAINTENANCE_CACHE_MS = 5000;

export async function getMaintenanceStatus(): Promise<MaintenanceStatus> {
  if (cachedStatus && Date.now() - cachedStatus.at < MAINTENANCE_CACHE_MS) {
    return cachedStatus.value;
  }
  const row = await db.siteSettings.findUnique({
    where: { id: "singleton" },
    select: { maintenanceMode: true, maintenanceMessage: true, maintenanceReturnAt: true },
  });
  const value: MaintenanceStatus = {
    maintenanceMode: row?.maintenanceMode ?? false,
    maintenanceMessage: row?.maintenanceMessage ?? "",
    maintenanceReturnAt: row?.maintenanceReturnAt ? row.maintenanceReturnAt.toISOString() : null,
  };
  cachedStatus = { value, at: Date.now() };
  return value;
}
