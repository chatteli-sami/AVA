import styles from "../styles/inventory.module.css";

interface SummaryStripProps {
  total: number;
  withPool: number;
  minSurface: number;
  maxSurface: number;
}

export default function SummaryStrip({
  total,
  withPool,
  minSurface,
  maxSurface,
}: SummaryStripProps) {
  return (
    <section className={styles.invSummary} aria-label="Synthèse de l'inventaire">
      <div className={styles.invStat}>
        <span className={styles.invStatValue}>{total}</span>
        <span className={styles.invStatLabel}>Unités au total</span>
      </div>
      <div className={styles.invStat}>
        <span className={styles.invStatValue}>{minSurface} – {maxSurface} m²</span>
        <span className={styles.invStatLabel}>Surface des lots</span>
      </div>
      <div className={styles.invStat}>
        <span className={styles.invStatValue}>{withPool}</span>
        <span className={styles.invStatLabel}>Avec piscine privative</span>
      </div>
    </section>
  );
}
