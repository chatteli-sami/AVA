"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  FLOORS,
  countPools,
  surfaceRange,
  unitsForFloor,
  type FloorFilter,
  type Unit,
} from "../data/inventory";
import { useInViewReveal } from "../hooks/useInViewReveal";
import { saveInventoryScrollState } from "../lib/inventory-scroll";
import UnitTable from "./UnitTable";
import UnitCard from "./UnitCard";
import PlanLightbox from "./PlanLightbox";
import Toolbar from "./Toolbar";
import FloorTabs from "./FloorTabs";
import styles from "../styles/inventory.module.css";

type SortKey = "surface" | "bedrooms";
type SortDir = "asc" | "desc";

interface InventoryListProps {
  units: ReadonlyArray<Unit>;
  initialFloor: FloorFilter;
}

function readFloorFromLocation(): FloorFilter {
  const floorValue = new URLSearchParams(window.location.search).get("etage");
  return FLOORS.find((entry) => entry.urlValue === floorValue)?.floor ?? "all";
}

export default function InventoryList({ units, initialFloor }: InventoryListProps) {
  const [sort, setSort] = useState<SortKey>("surface");
  const [sortDir, setSortDir] = useState<SortDir>("asc");
  const [hasPool, setHasPool] = useState(false);
  const [openUnit, setOpenUnit] = useState<Unit | null>(null);
  const [activeFloor, setActiveFloor] = useState<FloorFilter>(initialFloor);
  const { ref, inView } = useInViewReveal<HTMLDivElement>({ threshold: 0.1, rootMargin: "0px 0px -80px 0px", once: false });

  const floorUnits = useMemo(
    () => activeFloor === "all" ? units : unitsForFloor(activeFloor, units),
    [activeFloor, units],
  );
  const visible = useMemo(() => {
    const filtered = floorUnits.filter((unit) => !hasPool || unit.pool);
    return [...filtered].sort((a, b) => {
      const comparison = sort === "surface"
        ? a.surface - b.surface
        : a.bedrooms.localeCompare(b.bedrooms, undefined, { numeric: true });
      return sortDir === "asc" ? comparison : -comparison;
    });
  }, [floorUnits, hasPool, sort, sortDir]);
  const range = surfaceRange(floorUnits);
  const closeLightbox = useCallback(() => setOpenUnit(null), []);
  const changeFloor = useCallback((floor: FloorFilter) => {
    setActiveFloor(floor);
    const url = new URL(window.location.href);
    if (floor === "all") {
      url.searchParams.delete("etage");
    } else {
      const urlValue = FLOORS.find((entry) => entry.floor === floor)?.urlValue;
      if (urlValue) url.searchParams.set("etage", urlValue);
    }
    const nextUrl = `${url.pathname}${url.search}${url.hash}`;
    if (nextUrl !== `${window.location.pathname}${window.location.search}${window.location.hash}`) {
      window.history.pushState(null, "", nextUrl);
    }
  }, []);

  // Persist scroll position + active floor before the page hides (Back button,
  // swipe-back, tab switch). The ScrollStateRestore component consumes it.
  useEffect(() => {
    const handleBeforeUnload = () => {
      saveInventoryScrollState({ scrollY: window.scrollY });
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, []);

  // Also persist on visibility change (tab switch on mobile).
  useEffect(() => {
    const handleVisibility = () => {
      if (document.visibilityState === "hidden") {
        saveInventoryScrollState({ scrollY: window.scrollY });
      }
    };
    document.addEventListener("visibilitychange", handleVisibility);
    return () => document.removeEventListener("visibilitychange", handleVisibility);
  }, []);

  useEffect(() => {
    const syncFloorFromHistory = () => setActiveFloor(readFloorFromLocation());
    window.addEventListener("popstate", syncFloorFromHistory);
    return () => window.removeEventListener("popstate", syncFloorFromHistory);
  }, []);

  return (
    <div
      id="inventory-panel"
      role="tabpanel"
       aria-labelledby={`floor-tab-${activeFloor}`}
      ref={ref}
      className={styles.invFadeUp}
      data-visible={inView ? "1" : "0"}
    >
      <FloorTabs activeFloor={activeFloor} onFloorChange={changeFloor} />

      {activeFloor !== "all" && (
        <div className={styles.invFloorSummary} aria-live="polite">
          <span><strong>{floorUnits.length}</strong> unités</span>
          <span>
            Surface :{" "}
            {range ? `${range.min}–${range.max} m²` : "—"}
          </span>
          <span><strong>{countPools(floorUnits)}</strong> avec piscine</span>
        </div>
      )}

      <Toolbar
        hasPool={hasPool}
        sort={sort}
        sortDir={sortDir}
        onTogglePool={setHasPool}
        onSortChange={(key, dir) => {
          setSort(key);
          setSortDir(dir);
        }}
      />

      <div className={styles.invFloorContent} key={activeFloor}>
        {visible.length === 0 ? (
          <div className={styles.invEmptyState} role="status">
            <span className={styles.invEmptyOrnament} aria-hidden="true">✦</span>
            <h2>Aucune unité pour ces critères</h2>
            <p>Essayez un autre étage ou modifiez les filtres.</p>
          </div>
        ) : (
          <>
            <UnitTable units={visible} onOpen={setOpenUnit} />

            <div className={styles.invCards}>
              {visible.map((unit) => (
                <UnitCard key={unit.ref} unit={unit} onOpen={setOpenUnit} />
              ))}
            </div>
          </>
        )}
      </div>

      <PlanLightbox
        open={openUnit !== null}
        unit={openUnit}
        onClose={closeLightbox}
        contactHref="/#contact"
      />
    </div>
  );
}
