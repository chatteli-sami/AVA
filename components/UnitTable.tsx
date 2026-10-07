// UnitTable.tsx
"use client";

import { type Unit } from "../data/inventory";
import styles from "../styles/inventory.module.css";

interface UnitTableProps {
  units: Unit[];
  onOpen: (unit: Unit) => void;
}

function PoolBadge({ pool }: { pool: boolean }) {
  if (pool) {
    return (
      <span className={styles.invPoolBadge} aria-label="Piscine privative">
        <svg viewBox="0 0 24 24" fill="none" width="14" height="14" aria-hidden="true">
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

export default function UnitTable({ units, onOpen }: UnitTableProps) {
  return (
    <div className={styles.invTableWrap}>
      <table className={styles.invTable}>
        <caption className="sr-only">Liste des unités et leurs caractéristiques</caption>
        <thead>
          <tr>
            <th scope="col">Référence</th>
            <th scope="col">Surface</th>
            <th scope="col">Chambres</th>
            <th scope="col">Piscine</th>
            <th scope="col" className={styles.invActions}>Plan</th>
          </tr>
        </thead>
        <tbody>
          {units.map((unit) => (
            <tr key={unit.ref}>
              <td className={styles.invStickyCell}>
                <span className={styles.invRef}>{unit.ref}</span>
              </td>
              <td>
                <span className={styles.invSurface}>
                  {unit.surface} <small>m²</small>
                </span>
              </td>
              <td>
                <span className={styles.invBedrooms}>{unit.bedrooms}</span>
              </td>
              <td>
                <PoolBadge pool={unit.pool} />
              </td>
              <td className={styles.invActions}>
                <button
                  type="button"
                  className={styles.invBtn}
                  onClick={() => onOpen(unit)}
                >
                  Voir plan
                  <ChevronIcon />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
