"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { usePrefersReducedMotion } from "../../hooks/usePrefersReducedMotion";
import { riseVariants } from "../../lib/animations";
import styles from "./PromoterSection.module.css";

export default function PromoterSection() {
  const reduced = usePrefersReducedMotion();

  return (
    <motion.section
      className={styles.promoterSection}
      initial="initial"
      animate="animate"
      variants={riseVariants(reduced)}
    >
      <div className={styles.promoterContainer}>
        <motion.div
          className={styles.promoterCard}
          variants={riseVariants(reduced, 0.06)}
        >
          <motion.div
            className={styles.promoterLogo}
            variants={riseVariants(reduced, 0.12)}
          >
            <Image
              src="/images/PROMEDGROUP.png"
              alt="PROMED GROUP"
              width={250}
              height={60}
              className={styles.promoterLogoImage}
              loading="eager"
              priority
            />
          </motion.div>

          <motion.h2 className={styles.promoterTitle} variants={riseVariants(reduced, 0.18)}>
            Un promoteur au savoir-faire maîtrisé
          </motion.h2>

          <motion.p className={styles.promoterContent} variants={riseVariants(reduced, 0.24)}>
            Derrière <strong>AVA Residences</strong> se trouve <strong>PROMED GROUP</strong>, dont le savoir-faire résonne dans toute la Tunisie. Fort d’une expérience éprouvée et d’un engagement sans faille, PROMED GROUP compose des projets immobiliers comme des œuvres intemporelles, en respectant les plus hauts standards de qualité et d’excellence. Chaque réalisation est une mélodie de maîtrise, rigueur et innovation.
          </motion.p>

          <motion.div
            className={styles.promoterBottom}
            variants={riseVariants(reduced, 0.3)}
          >
            <div className={styles.promoterLogo1}>
              <Image
                src="/images/DHILEL IMMOBILIERE.png"
                alt="DHILEL Immobilière"
                width={220}
                height={60}
                className={styles.promoterLogo1Image}
                loading="lazy"
              />
            </div>
            <motion.div className={styles.signature} variants={riseVariants(reduced, 0.36)}>
              L’excellence en héritage
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </motion.section>
  );
}
