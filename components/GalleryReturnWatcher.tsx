"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { isGalleryReturnPending, peekGalleryReturn, clearGalleryReturn } from "../lib/gallery-scroll";
import { scrollToAnchor } from "../lib/anchor-navigation";

/**
 * Restores the gallery position for the two ways back that never run the Back
 * button: the browser Back button and the swipe-back gesture.
 *
 * Both are POP navigations. Neither sets our return flag, so before this existed
 * `ScrollReset` saw a plain route change and won, dropping the visitor at the
 * top of the page. This watches for a POP landing on the home route with a return
 * record on file and re-applies the offset after the page has been painted.
 */
export default function GalleryReturnWatcher() {
  const pathname = usePathname();

  useEffect(() => {
    // Only the home route hosts the gallery, so only it can consume a record.
    if (pathname !== "/") return;
    if (!isGalleryReturnPending()) return;

    const record = peekGalleryReturn();
    if (!record) return;

    // The gallery section owns this itself when it mounts; this watcher is the
    // fallback for a POP that restored the page from bfcache, where the section
    // never remounted and so never ran its own restore.
    if (typeof record.scrollY !== "number") return;

    let frame = 0;
    const apply = () => window.scrollTo({ top: record.scrollY as number, behavior: "instant" });

    frame = window.requestAnimationFrame(() => {
      apply();
      frame = window.requestAnimationFrame(apply);
    });
    const timers = [
      window.setTimeout(apply, 300),
      window.setTimeout(apply, 1000),
      // Only now is it safe to forget: another POP could still be in flight.
      window.setTimeout(() => clearGalleryReturn(), 1600),
    ];

    return () => {
      window.cancelAnimationFrame(frame);
      timers.forEach((timer) => window.clearTimeout(timer));
    };
  }, [pathname]);

  // bfcache restores skip React entirely, so no effect re-runs. The record has
  // to be re-applied from the event itself, and the intro must not replay.
  useEffect(() => {
    const handlePageShow = (event: PageTransitionEvent) => {
      if (!event.persisted) return;

      const record = peekGalleryReturn();
      if (!record) return;

      if (typeof record.scrollY === "number") {
        window.scrollTo({ top: record.scrollY, behavior: "instant" });
      } else {
        scrollToAnchor("gallery", { behavior: "instant" });
      }
    };

    window.addEventListener("pageshow", handlePageShow);
    return () => window.removeEventListener("pageshow", handlePageShow);
  }, []);

  return null;
}