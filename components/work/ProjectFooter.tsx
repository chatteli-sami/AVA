"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { usePrefersReducedMotion } from "../../hooks/usePrefersReducedMotion";
import { riseVariants } from "../../lib/animations";
import type { GalleryProject } from "../../types/gallery";
import styles from "../../styles/work.module.css";

interface ProjectFooterProps {
  next: GalleryProject;
  accent: string;
}

export default function ProjectFooter({ next, accent }: ProjectFooterProps) {
  const reduced = usePrefersReducedMotion();

  return (
    <footer className={styles.detailFooter}>
      <motion.div variants={riseVariants(reduced)} initial="initial" animate="animate">
        <p className={styles.detailFooterLabel} style={{ color: accent }}>
          Next project
        </p>
        <Link href={`/gallery/${next.slug}`} className={styles.detailNext}>
          {next.title}
        </Link>
      </motion.div>

      <div className={styles.detailFooterActions}>
<Link href="/" className={styles.detailBackHome}>
          Back to gallery
        </Link>
        <Link href="/#contact" className={styles.detailContact} prefetch={false} style={{ background: accent }}>
          Contact
        </Link>
      </div>
    </footer>
  );
}