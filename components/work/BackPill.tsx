"use client";

import { useRouter } from "next/navigation";
import { useCallback } from "react";
import { isCoverTransitionBusy, returnCover } from "../../lib/cover-transition";
import { requestGalleryReturn } from "../../lib/gallery-scroll";
import { usePrefersReducedMotion } from "../../hooks/usePrefersReducedMotion";
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

    // The gallery restores the list offset it was left at instead of dropping the
    // visitor back at the top of the page.
    requestGalleryReturn();

    if (reduced) {
      router.push("/");
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
