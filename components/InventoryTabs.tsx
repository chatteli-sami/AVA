"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { countByType, totalUnits, UNIT_TYPES, type UnitTypeFilter } from "../data/inventory";
import styles from "../styles/inventory.module.css";

const TYPE_PARAM = "type";

function slugToType(slug: string | null): UnitTypeFilter {
  if (slug === "s3" || slug === "s45" || slug === "duplex") return slug;
  return "all";
}

export default function InventoryTabs() {
  const searchParams = useSearchParams();
  const current = slugToType(searchParams.get(TYPE_PARAM));
  const counts = UNIT_TYPES.map((t) =>
    t.type === "all" ? totalUnits() : countByType(t.type),
  );
  const tabsRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<Record<string, HTMLAnchorElement | null>>({});
  const [indicator, setIndicator] = useState({ left: 0, width: 0 });
  const search = searchParams.toString();

  function measure() {
    const container = tabsRef.current;
    const item = itemRefs.current[current];
    if (!container || !item) return;

    const containerRect = container.getBoundingClientRect();
    const itemRect = item.getBoundingClientRect();
    setIndicator({
      left: itemRect.left - containerRect.left + container.scrollLeft,
      width: itemRect.width,
    });
  }

  useEffect(() => {
    measure();
    window.addEventListener("resize", measure);
    const raf = window.requestAnimationFrame(measure);
    return () => {
      window.removeEventListener("resize", measure);
      window.cancelAnimationFrame(raf);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current]);

  return (
    <nav
      ref={tabsRef}
      className={styles.invTabs}
      role="tablist"
      aria-label="Typologie des unités"
      style={
        {
          "--indicator-left": `${indicator.left}px`,
          "--indicator-width": `${indicator.width}px`,
        } as React.CSSProperties
      }
    >
      {UNIT_TYPES.map((type, index) => {
        const selected = type.type === current;
        const params = new URLSearchParams(search);
        if (type.type === "all") params.delete(TYPE_PARAM);
        else params.set(TYPE_PARAM, type.type);
        const query = params.toString();
        const href = query ? `?${query}` : "/inventaire";
        return (
          <Link
            key={type.type}
            href={href}
            role="tab"
            aria-selected={selected}
            aria-controls="inventory-panel"
            id={`inventory-tab-${type.type}`}
            className={styles.invTab}
            prefetch={false}
            scroll={false}
            onKeyDown={(event) => {
              if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
              event.preventDefault();
              const direction = event.key === "ArrowRight" ? 1 : -1;
              const nextIndex = (index + direction + UNIT_TYPES.length) % UNIT_TYPES.length;
              itemRefs.current[UNIT_TYPES[nextIndex].type]?.click();
            }}
            ref={(el) => {
              itemRefs.current[type.type] = el;
            }}
          >
            <span>{type.shortLabel}</span>
            <span className={styles.invTabCount}>{counts[index]}</span>
          </Link>
        );
      })}

      <span
        className={styles.invTabIndicator}
        style={{ left: indicator.left, width: indicator.width }}
        aria-hidden="true"
      />
    </nav>
  );
}