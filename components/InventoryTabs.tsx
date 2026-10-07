"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { countByType, UNIT_TYPES, type UnitType } from "../data/inventory";
import styles from "../styles/inventory.module.css";

const TYPE_PARAM = "type";

function slugToType(slug: string | null): UnitType {
  if (slug === "s3" || slug === "s45" || slug === "duplex") return slug;
  return "duplex";
}

export default function InventoryTabs() {
  const searchParams = useSearchParams();
  const current = slugToType(searchParams.get(TYPE_PARAM));
  const counts = UNIT_TYPES.map((t) => countByType(t.type));
  const tabsRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<Record<string, HTMLAnchorElement | null>>({});
  const [indicator, setIndicator] = useState({ left: 0, width: 0 });

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
        const href = `?${TYPE_PARAM}=${type.type}`;
        return (
          <Link
            key={type.type}
            href={href}
            role="tab"
            aria-selected={selected}
            aria-controls={`inventory-panel-${type.type}`}
            id={`inventory-tab-${type.type}`}
            className={styles.invTab}
            prefetch={false}
            scroll={false}
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