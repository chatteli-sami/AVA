"use client";

import { useEffect, useState } from "react";

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

/**
 * Tracks `prefers-reduced-motion` and stays subscribed to changes.
 *
 * framer-motion's own `useReducedMotion` captures its value once at first render,
 * which resolves to `false` when the component is server-rendered, so every
 * reduced-motion branch downstream would silently animate anyway.
 */
export function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const query = window.matchMedia(REDUCED_MOTION_QUERY);
    const sync = () => setReduced(query.matches);

    sync();
    query.addEventListener("change", sync);
    return () => query.removeEventListener("change", sync);
  }, []);

  return reduced;
}