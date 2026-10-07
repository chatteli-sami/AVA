"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { takeInventoryScrollState, peekInventoryScrollState } from "../lib/inventory-scroll";

/**
 * Restores the inventory page scroll position and active tab for the two ways
 * back that never run our own link: the browser Back button and the
 * swipe-back gesture.
 *
 * Both are POP navigations. The page component itself resets to the top on
 * every route change, so without this the visitor would land at the top of the
 * list instead of where they left off.
 *
 * bfcache restores skip React entirely, so no effect re-runs. The pageshow
 * handler below is the only thing that can re-apply the offset in that case.
 */
export default function ScrollStateRestore() {
  const pathname = usePathname();

  useEffect(() => {
    if (pathname !== "/inventaire") return;

    const state = takeInventoryScrollState();
    if (!state) return;

    // Let the page finish mounting before restoring, otherwise the tab content
    // has not switched yet and the wrong list would be visible at the offset.
    let frame = 0;
    const apply = () => {
      window.scrollTo({ top: state.scrollY, behavior: "instant" });
      window.history.replaceState(
        { ...(window.history.state ?? {}), inventoryScroll: state.scrollY },
        "",
        `?type=${encodeURIComponent(state.type)}`,
      );
    };

    frame = window.requestAnimationFrame(() => {
      apply();
      frame = window.requestAnimationFrame(apply);
    });

    return () => window.cancelAnimationFrame(frame);
  }, [pathname]);

  useEffect(() => {
    const handlePageShow = (event: PageTransitionEvent) => {
      if (!event.persisted) return;
      if (typeof window === "undefined") return;
      if (window.location.pathname !== "/inventaire") return;

      const state = peekInventoryScrollState();
      if (!state) return;

      window.scrollTo({ top: state.scrollY, behavior: "instant" });
      window.history.replaceState(
        { ...(window.history.state ?? {}), inventoryScroll: state.scrollY },
        "",
        `?type=${encodeURIComponent(state.type)}`,
      );
    };

    window.addEventListener("pageshow", handlePageShow);
    return () => window.removeEventListener("pageshow", handlePageShow);
  }, []);

  return null;
}