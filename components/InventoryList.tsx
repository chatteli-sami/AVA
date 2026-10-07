"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { type Unit, type UnitType } from "../data/inventory";
import { useInViewReveal } from "../hooks/useInViewReveal";
import { saveInventoryScrollState } from "../lib/inventory-scroll";
import UnitTable from "./UnitTable";
import UnitCard from "./UnitCard";
import PlanLightbox from "./PlanLightbox";
import Toolbar from "./Toolbar";
import styles from "../styles/inventory.module.css";

type SortKey = "surface" | "bedrooms";
type SortDir = "asc" | "desc";

interface InventoryListProps {
  units: Unit[];
  activeType: UnitType;
}

export default function InventoryList({ units, activeType }: InventoryListProps) {
  const [sort, setSort] = useState<SortKey>("surface");
  const [sortDir, setSortDir] = useState<SortDir>("asc");
  const [hasPool, setHasPool] = useState(false);
  const [openUnit, setOpenUnit] = useState<Unit | null>(null);
  const { ref, inView } = useInViewReveal<HTMLDivElement>({ threshold: 0.1, rootMargin: "0px 0px -80px 0px", once: false });

  const visible = useMemo(() => {
    const filtered = units.filter((unit) => !hasPool || unit.pool);
    return filtered.sort((a, b) => {
      const comparison = sort === "surface"
        ? a.surface - b.surface
        : a.bedrooms.localeCompare(b.bedrooms, undefined, { numeric: true });
      return sortDir === "asc" ? comparison : -comparison;
    });
  }, [units, hasPool, sort, sortDir]);
  const closeLightbox = useCallback(() => setOpenUnit(null), []);

  // Persist scroll position + active tab before the page hides (Back button,
  // swipe-back, tab switch). The ScrollStateRestore component consumes it.
  useEffect(() => {
    const handleBeforeUnload = () => {
      saveInventoryScrollState({
        scrollY: window.scrollY,
        type: activeType,
      });
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [activeType]);

  // Also persist on visibility change (tab switch on mobile).
  useEffect(() => {
    const handleVisibility = () => {
      if (document.visibilityState === "hidden") {
        saveInventoryScrollState({
          scrollY: window.scrollY,
          type: activeType,
        });
      }
    };
    document.addEventListener("visibilitychange", handleVisibility);
    return () => document.removeEventListener("visibilitychange", handleVisibility);
  }, [activeType]);

  return (
    <div
      id={`inventory-panel-${activeType}`}
      role="tabpanel"
      aria-labelledby={`inventory-tab-${activeType}`}
      key={activeType}
      ref={ref}
      className={styles.invFadeUp}
      data-visible={inView ? "1" : "0"}
    >
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

      <UnitTable units={visible} onOpen={setOpenUnit} />

      <div className={styles.invCards}>
        {visible.map((unit) => (
          <UnitCard key={unit.ref} unit={unit} onOpen={setOpenUnit} />
        ))}
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
