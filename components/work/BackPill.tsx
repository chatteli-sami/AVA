"use client";

import { useRouter } from "next/navigation";
import { useCallback } from "react";
import { requestGalleryReturn } from "../../lib/gallery-scroll";
import styles from "../../styles/work.module.css";

interface BackPillProps {
  label?: string;
}

export default function BackPill({ label = "Back to gallery" }: BackPillProps) {
  const router = useRouter();

  const handleClick = useCallback(() => {
    // Client-side navigation, and the gallery restores the list offset it was
    // left at instead of dropping the visitor back at the top of the page.
    requestGalleryReturn();
    router.push("/");
  }, [router]);

  return (
    <button type="button" className={styles.backPill} onClick={handleClick}>
      <span aria-hidden="true">←</span> {label}
    </button>
  );
}