"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { usePrefersReducedMotion } from "../../hooks/usePrefersReducedMotion";
import { EASE_OUT_EXPO, riseVariants, titleRevealVariants } from "../../lib/animations";
import type { GalleryProject } from "../../types/gallery";
import styles from "../../styles/work.module.css";

export default function DetailHero({ project }: { project: GalleryProject }) {
  const reduced = usePrefersReducedMotion();

  return (
    <section className={styles.detailHero}>
      <div className={styles.detailHeroText}>
        <motion.p
          className={styles.detailEyebrow}
          variants={riseVariants(reduced)}
          initial="initial"
          animate="animate"
          style={{ color: project.theme.accent }}
        >
          {project.category} · {project.year}
        </motion.p>

        <motion.h1
          className={styles.detailTitle}
          variants={titleRevealVariants(reduced)}
          initial="initial"
          animate="animate"
        >
          {project.title}
        </motion.h1>

        <motion.p
          className={styles.detailSummary}
          variants={riseVariants(reduced, 0.08)}
          initial="initial"
          animate="animate"
        >
          {project.description}
        </motion.p>

        <div className={styles.detailLists}>
          <div className={styles.detailList}>
            <h2 className={styles.detailListTitle} style={{ color: project.theme.accent }}>
              Details
            </h2>
            <dl className={styles.detailPairs}>
              {project.details.map((detail) => (
                <div className={styles.detailPair} key={detail.label}>
                  <dt>{detail.label}</dt>
                  <dd>{detail.value}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className={styles.detailList}>
            <h2 className={styles.detailListTitle} style={{ color: project.theme.accent }}>
              Features
            </h2>
            <ul className={styles.detailFeatures}>
              {project.features.map((feature) => (
                <li key={feature}>{feature}</li>
              ))}
            </ul>
          </div>
        </div>

        <motion.a
          className={styles.detailCta}
          href="/#contact"
          style={{ borderColor: project.theme.accent, color: project.theme.accent }}
          variants={riseVariants(reduced, 0.16)}
          initial="initial"
          animate="animate"
          transition={{ duration: 0.6, ease: EASE_OUT_EXPO }}
        >
          Launch project
        </motion.a>
      </div>

      <motion.div
        className={styles.detailMedia}
        layoutId={`cover-${project.slug}`}
        transition={{ duration: reduced ? 0 : 0.6, ease: EASE_OUT_EXPO }}
      >
        <Image
          className={styles.detailImage}
          src={project.cover}
          alt={project.summary}
          fill
          sizes="(min-width: 900px) 52vw, 100vw"
          priority
        />
      </motion.div>
    </section>
  );
}