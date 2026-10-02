"use client";

import Link from "next/link";
import { useState, type CSSProperties } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { usePrefersReducedMotion } from "../../hooks/usePrefersReducedMotion";
import { springSoft, transition } from "../../lib/animations";
import styles from "../../styles/work.module.css";

interface SiteHeaderProps {
  /** Detail pages pass the project accent so the logo can animate to it. */
  accent?: string;
}

const MENU_LINKS = [
  { href: "/gallery/duplex-ava", label: "Featured work", prefetch: false },
  { href: "/", label: "AVA Residences", prefetch: false },
  { href: "/#contact", label: "Contact", prefetch: false },
];

export default function SiteHeader({ accent }: SiteHeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const reduced = usePrefersReducedMotion();
  const solid = Boolean(accent);
  const headerStyle = accent ? ({ "--w-accent": accent } as CSSProperties) : undefined;

  return (
    <header
      className={`${styles.header} ${solid ? styles.headerSolid : styles.headerBlend}`}
      style={headerStyle}
    >
<Link href="/" className={styles.logo} aria-label="Studio AVA, retour à l’accueil">
        AVA
      </Link>

      <nav className={styles.pills} aria-label="Navigation principale">
        <a className={styles.iconPill} href="mailto:commercial@promed.tn" aria-label="Écrire au studio">
          <i className="fas fa-envelope" aria-hidden="true"></i>
        </a>

        <Link href="/#contact" className={styles.talkPill} prefetch={false}>
          Let’s talk
        </Link>

        <button
          type="button"
          className={styles.menuPill}
          aria-expanded={isMenuOpen}
          aria-controls="work-menu"
          onClick={() => setIsMenuOpen((open) => !open)}
        >
          Menu
        </button>
      </nav>

      <AnimatePresence>
        {isMenuOpen ? (
          <motion.nav
            id="work-menu"
            className={styles.menuPanel}
            aria-label="Menu"
            initial={reduced ? { opacity: 0 } : { opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduced ? { opacity: 0 } : { opacity: 0, y: -12 }}
            transition={transition(springSoft, reduced)}
          >
            {MENU_LINKS.map((link) => (
              <Link key={link.href} href={link.href} className={styles.menuLink} prefetch={link.prefetch} onClick={() => setIsMenuOpen(false)}>
                {link.label}
              </Link>
            ))}
          </motion.nav>
        ) : null}
      </AnimatePresence>
    </header>
  );
}