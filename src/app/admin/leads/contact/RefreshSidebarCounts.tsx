"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

// The page this renders on marks messages read as a server-side effect
// during its own render — nothing about that tells the client to drop its
// cached copy of admin/layout.tsx (where the sidebar badge counts are
// computed), so without this the badge only updates on a hard reload.
// router.refresh() re-requests the current route tree from the server,
// including ancestor layouts, matching how ReviewActions/LeadStatusSelect
// already keep their own badges live after an explicit action.
export function RefreshSidebarCounts() {
  const router = useRouter();

  useEffect(() => {
    router.refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}
