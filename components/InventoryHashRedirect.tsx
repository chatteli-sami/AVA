"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

/**
 * The inventory used to live at the `#inventaire` anchor on the home page. It
 * now has its own route, so any link that still points at the anchor needs to
 * redirect without a full reload.
 *
 * This component is rendered on the home page only. It runs once on mount and
 * replaces the current history entry when the visitor arrived with the old
 * hash, so the Back button still lands on the previous page rather than the
 * home page with the hash.
 */
export default function InventoryHashRedirect() {
  const router = useRouter();

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.location.hash !== "#inventaire") return;

    const current = `${window.location.pathname}${window.location.search}`;
    router.replace("/inventaire", { scroll: false });
    // Keep the referrer intact by not touching history.state.
    void current;
  }, [router]);

  return null;
}