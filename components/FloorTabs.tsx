"use client";

import { FLOORS, countByFloor, totalUnits, type FloorFilter } from "../data/inventory";
import styles from "../styles/inventory.module.css";

interface FloorTabsProps {
  activeFloor: FloorFilter;
  onFloorChange: (floor: FloorFilter) => void;
}

const FLOOR_OPTIONS: ReadonlyArray<{
  floor: FloorFilter;
  label: string;
  count: number;
  disabled: boolean;
}> = [
  { floor: "all", label: "Tous", count: totalUnits(), disabled: false },
  ...FLOORS.map(({ floor, tabLabel }) => ({
    floor,
    label: tabLabel,
    count: countByFloor(floor),
    disabled: countByFloor(floor) === 0,
  })),
];

export default function FloorTabs({ activeFloor, onFloorChange }: FloorTabsProps) {
  const selectedIndex = FLOOR_OPTIONS.findIndex((option) => option.floor === activeFloor);

  return (
    <div className={styles.invFloorTabsViewport}>
      <div
        className={styles.invFloorTabs}
        role="tablist"
        aria-label="Filtrer par étage"
      >
        {FLOOR_OPTIONS.map((option, index) => (
          <button
            key={option.floor}
            id={`floor-tab-${option.floor}`}
            type="button"
            role="tab"
            aria-selected={activeFloor === option.floor}
            aria-controls="inventory-panel"
            aria-disabled={option.disabled || undefined}
            disabled={option.disabled}
            tabIndex={activeFloor === option.floor ? 0 : -1}
            className={styles.invFloorTab}
            onClick={() => onFloorChange(option.floor)}
            onKeyDown={(event) => {
              if (
                event.key !== "ArrowLeft" &&
                event.key !== "ArrowRight" &&
                event.key !== "Home" &&
                event.key !== "End"
              ) {
                return;
              }
              event.preventDefault();
              const direction = event.key === "ArrowLeft" ? -1 : 1;
              let nextIndex = index;
              if (event.key === "Home") nextIndex = 0;
              else if (event.key === "End") nextIndex = FLOOR_OPTIONS.length - 1;
              while (
                event.key === "End" && FLOOR_OPTIONS[nextIndex].disabled && nextIndex > 0
              ) {
                nextIndex -= 1;
              }
              while (event.key === "Home" && FLOOR_OPTIONS[nextIndex].disabled) {
                nextIndex += 1;
              }
              while (event.key !== "Home" && event.key !== "End") {
                nextIndex = (nextIndex + direction + FLOOR_OPTIONS.length) % FLOOR_OPTIONS.length;
                if (!FLOOR_OPTIONS[nextIndex].disabled) break;
              }
              const next = FLOOR_OPTIONS[nextIndex];
              if (next.disabled) return;
              document.getElementById(`floor-tab-${next.floor}`)?.focus();
              onFloorChange(next.floor);
            }}
          >
            <span>{option.label}</span>
            <span className={styles.invTabCount}>{option.count}</span>
          </button>
        ))}
        <span
          className={styles.invFloorIndicator}
          style={{ transform: `translateX(${selectedIndex * 100}%)` }}
          aria-hidden="true"
        />
      </div>
    </div>
  );
}
