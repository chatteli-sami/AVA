// Toolbar.tsx
"use client";

import styles from "../styles/inventory.module.css";

type SortKey = "surface" | "bedrooms";
type SortDir = "asc" | "desc";

interface ToolbarProps {
  hasPool: boolean;
  sort: SortKey;
  sortDir: SortDir;
  onTogglePool: (next: boolean) => void;
  onSortChange: (key: SortKey, dir: SortDir) => void;
}

export default function Toolbar({
  hasPool,
  sort,
  sortDir,
  onTogglePool,
  onSortChange,
}: ToolbarProps) {
  return (
    <div className={styles.invToolbar}>
      <div className={styles.invFilter} role="group" aria-label="Filtre piscine">
        <button
          type="button"
          className={styles.invFilterBtn}
          aria-pressed={hasPool}
          onClick={() => onTogglePool(!hasPool)}
        >
          Avec piscine
          <span className={styles.invSwitchTrack} aria-hidden="true">
            <span />
          </span>
        </button>
      </div>

      <div className={styles.invSort}>
        <label htmlFor="inventory-sort">Trier par</label>
        <select
          id="inventory-sort"
          value={`${sort}-${sortDir}`}
          onChange={(event) => {
            const [key, dir] = event.target.value.split("-") as [SortKey, SortDir];
            onSortChange(key, dir);
          }}
        >
          <option value="surface-asc">Surface croissante</option>
          <option value="surface-desc">Surface décroissante</option>
          <option value="bedrooms-asc">Chambres croissant</option>
          <option value="bedrooms-desc">Chambres décroissant</option>
        </select>
      </div>
    </div>
  );
}
