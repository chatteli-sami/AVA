"use client";

import { useEffect } from "react";
import { getCoverTransition, reportHeroRect } from "../../lib/cover-transition";

interface HeroRectReporterProps {
  slug: string;
  target: HTMLElement | null;
}

/**
 * Publishes where the project hero actually landed so the overlay can settle
 * onto it.
 *
 * The report is repeated for a short window because the hero can mount a frame
 * or two before the store is ready to accept it, and because fonts and the
 * responsive grid can still be settling when the page first appears. The store
 * ignores reports that arrive at the wrong time, so extra calls are harmless.
 */
export default function HeroRectReporter({ slug, target }: HeroRectReporterProps) {
  useEffect(() => {
    if (!target) return undefined;

    let frame = 0;
    let attempts = 0;

    const measure = () => {
      const rect = target.getBoundingClientRect();
      if (rect.width > 1 && rect.height > 1) {
        reportHeroRect(slug, { top: rect.top, left: rect.left, width: rect.width, height: rect.height });
      }
    };

    const tick = () => {
      measure();
      attempts += 1;
      if (attempts < 12) frame = window.requestAnimationFrame(tick);
    };
    frame = window.requestAnimationFrame(tick);

    const timers = [window.setTimeout(measure, 200), window.setTimeout(measure, 600), window.setTimeout(measure, 1200)];
    const onResize = () => {
      if (getCoverTransition().phase !== "idle") measure();
    };
    window.addEventListener("resize", onResize);

    return () => {
      window.cancelAnimationFrame(frame);
      timers.forEach((timer) => window.clearTimeout(timer));
      window.removeEventListener("resize", onResize);
    };
  }, [slug, target]);

  return null;
}
