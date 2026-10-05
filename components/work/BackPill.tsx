"use client";

import { useRouter } from "next/navigation";
import { useCallback } from "react";
import { isCoverTransitionBusy, returnCover } from "../../lib/cover-transition";
import { usePrefersReducedMotion } from "../../hooks/usePrefersReducedMotion";
import { requestGalleryReturn, peekGalleryReturn } from "../../lib/gallery-scroll";
import styles from "../../styles/work.module.css";

interface BackPillProps {
  label?: string;
  slug: string;
  cover: string;
  alt: string;
}

export default function BackPill({ label = "Back to gallery", slug, cover, alt }: BackPillProps) {
  const router = useRouter();
  const reduced = usePrefersReducedMotion();

  const handleClick = useCallback(() => {
    if (isCoverTransitionBusy()) return;

    // The card click already recorded the offset and this slug, and that record
    // is what the gallery restores from. It is deliberately left in place rather
    // than being re-armed here, so a reload on this page still has something to
    // return to. Nothing to do when the page was opened directly.
    const record = peekGalleryReturn();

    if (reduced) {
      router.push("/");
      if (!record) requestGalleryReturn();
      return;
    }

    // The overlay covers the screen, navigates home itself, then shrinks onto the
    // card once the gallery has reported where it landed.
    const hero = document.querySelector<HTMLImageElement>('[class*="detailMedia"] img');
    returnCover({
      slug,
      src: hero?.currentSrc || cover,
      preloadSrc: cover,
      alt: hero?.alt || alt,
      reduced,
    });
  }, [alt, cover, reduced, router, slug]);

  return (
    <button type="button" className={styles.backPill} onClick={handleClick}>
      <span aria-hidden="true">←</span> {label}
    </button>
  );
}
