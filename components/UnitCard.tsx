// UnitCard.tsx
"use client";

import { type Unit } from "../data/inventory";
import styles from "../styles/inventory.module.css";

function PoolBadge({ pool }: { pool: boolean }) {
  if (pool) {
    return (
      <span className={styles.invPoolBadge} aria-label="Piscine privative">
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" width="14" height="14">
          <path d="M3 17c2-4 5-5 8-5s6 1 8 5M17 7a3 3 0 100-6 3 3 0 000 6z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        Piscine privative
      </span>
    );
  }
  return <span className={styles.invNopool} aria-label="Sans piscine">Sans piscine</span>;
}

function ChevronIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" width="16" height="16">
      <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

interface UnitCardProps {
  unit: Unit;
  onOpen: (unit: Unit) => void;
}

export default function UnitCard({ unit, onOpen }: UnitCardProps) {
  const typeLabel = unit.type === "duplex" ? "Duplex" : unit.type === "s3" ? "S+3" : "S+4.5";

  return (
    <article className={styles.invCard}>
      <div className={styles.invCardHead}>
        <span className={styles.invCardRef}>{unit.ref}</span>
        <span className={styles.invCardType}>{typeLabel}</span>
      </div>

      <div className={styles.invCardGrid}>
        <div className={styles.invCardField}>
          <span className={styles.invCardFieldK}>Surface</span>
          <span className={styles.invCardFieldV}>{unit.surface} m²</span>
        </div>
        <div className={styles.invCardField}>
          <span className={styles.invCardFieldK}>Chambres</span>
          <span className={styles.invCardFieldV}>{unit.bedrooms}</span>
        </div>
      </div>

      <div className={styles.invCardActions}>
        <PoolBadge pool={unit.pool} />
        <button type="button" className={styles.invBtn} onClick={() => onOpen(unit)}>
          Voir plan
          <ChevronIcon />
        </button>
      </div>
    </article>
  );
}
