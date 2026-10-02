"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { isGalleryReturnPending } from "../lib/gallery-scroll";

const useIsomorphicLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;

/**
 * Resets the scroll position on every route change, before the browser paints.
 *
 * Without this, a soft navigation keeps the previous page's offset. The new page
 * then paints at that offset (clamped to its own maximum, so the visitor briefly
 * sees the bottom of the page), and the framework's scroll-to-top only runs
 * afterwards. `html { scroll-behavior: smooth }` turns that correction into a
 * visible ~1s animation, which reads as a glitch.
 *
 * Gallery returns are skipped: the gallery restores its own offset, and doing it
 * from an effect below is what keeps that restoration authoritative.
 */
export default function ScrollReset() {
  const pathname = usePathname();
  const isFirstRender = useRef(true);

  // Take the scroll position away from the browser so it cannot restore a stale
  // offset behind our back on back/forward navigation.
  useEffect(() => {
    const previous = window.history.scrollRestoration;
    window.history.scrollRestoration = "manual";
    return () => {
      window.history.scrollRestoration = previous;
    };
  }, []);

  useIsomorphicLayoutEffect(() => {
    // A deep link or a reload still deserves a clean top, but never fight the
    // gallery's own restore on the way back from a project.
    if (isFirstRender.current && isGalleryReturnPending()) {
      isFirstRender.current = false;
      return;
    }
    isFirstRender.current = false;

    // "instant" deliberately overrides `scroll-behavior: smooth`.
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [pathname]);

  return null;
}
