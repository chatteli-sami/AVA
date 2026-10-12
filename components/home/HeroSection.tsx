"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { usePrefersReducedMotion } from "../../hooks/usePrefersReducedMotion";
import { EASE_OUT_EXPO, riseVariants, titleRevealVariants } from "../../lib/animations";
import { introLabel, introParagraph, introButtons, buildingImage, introImages } from "./content";
import styles from "./HeroSection.module.css";

export default function HeroSection() {
  const reduced = usePrefersReducedMotion();

  return (
    <section className={styles.hero} id="hero" aria-labelledby="hero-label">
      <div className={styles.heroBird}>
        <Image
          src={introImages.hummingbird.src}
          alt=""
          width={introImages.hummingbird.width}
          height={introImages.hummingbird.height}
          className={styles.heroBirdImage}
          loading="eager"
          priority
        />
      </div>
      <div className={styles.heroInner}>
          <motion.div
            className={styles.heroText}
            initial="initial"
            animate="animate"
          >
            <motion.span
              className={styles.heroKicker}
              id="hero-label"
              variants={riseVariants(reduced)}
            >
              {introLabel}
              <span className={styles.heroKickerDash} aria-hidden="true" />
            </motion.span>

            <motion.h1
              className={styles.heroTitle}
              variants={titleRevealVariants(reduced)}
              initial="initial"
              animate="animate"
            >
              {"Une Mélodie de "}
              <span className={styles.golden}>Luxe</span>
              {" et de Raffinement"}
            </motion.h1>

            <motion.div
              className={styles.heroDivider}
              variants={riseVariants(reduced, 0.08)}
              initial="initial"
              animate="animate"
              aria-hidden="true"
            />

            <motion.p
              className={styles.heroParagraph}
              variants={riseVariants(reduced, 0.16)}
              initial="initial"
              animate="animate"
            >
              {introParagraph}
            </motion.p>

            <motion.div
              className={styles.heroButtons}
              variants={riseVariants(reduced, 0.24)}
              initial="initial"
              animate="animate"
            >
              {introButtons.map((button) => {
                const isPrimary = !button.outlined;
                return (
                  <a
                    key={button.href}
                    href={button.href}
                    className={`${styles.heroButton} ${isPrimary ? styles.heroButtonFilled : styles.heroButtonGhost}`}
                  >
                    {button.label}
                    {isPrimary && (
                      <span className={styles.heroButtonArrow} aria-hidden="true">→</span>
                    )}
                  </a>
                );
              })}
            </motion.div>
          </motion.div>

          <motion.div
            className={styles.heroMedia}
            initial="initial"
            animate="animate"
            transition={{ duration: reduced ? 0 : 0.9, ease: EASE_OUT_EXPO }}
          >
            <div className={styles.heroMediaFrame}>
              <Image
                src={buildingImage.src}
                alt={buildingImage.alt}
                fill
                sizes="(min-width: 1200px) 48vw, 90vw"
                priority
                className={styles.heroMediaImage}
              />
            </div>
          </motion.div>
      </div>
    </section>
  );
}