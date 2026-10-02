"use client";

import { useEffect, useRef, useState } from "react";

export interface UseRevealOnScrollOptions {
  /** Fraction of the element that must be visible before it reveals. */
  threshold?: number;
}

/**
 * Starts hidden and flips to revealed the first time the element enters the
 * viewport, then stops observing.
 *
 * Deliberately separate from `useInViewReveal`, which starts *visible* so that
 * server-rendered content stays readable without JavaScript. The gallery wants
 * the opposite: cards are hidden until they scroll in.
 */
export function useRevealOnScroll<T extends HTMLElement = HTMLElement>(
  options: UseRevealOnScrollOptions = {},
) {
  const { threshold = 0.2 } = options;
  const ref = useRef<T | null>(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const target = ref.current;
    if (!target) return undefined;

    // Without IntersectionObserver, show the content rather than hide it.
    if (typeof IntersectionObserver === "undefined") {
      const frame = window.requestAnimationFrame(() => setRevealed(true));
      return () => window.cancelAnimationFrame(frame);
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting && entry.intersectionRatio >= threshold)) {
          setRevealed(true);
          observer.disconnect();
        }
      },
      { threshold: [0, threshold] },
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, [threshold]);

  return { ref, revealed };
}