"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { usePrefersReducedMotion } from "../../hooks/usePrefersReducedMotion";
import styles from "./IntroSection.module.css";

type Stat = { value: number | string; label: string };

type AnimatedStatProps = {
  value: number | string;
  label: string;
  index: number;
};

function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

const FALLBACK_DELAY = 2500;

export default function AnimatedStat({ value, label, index }: AnimatedStatProps) {
  const isNumeric = typeof value === "number";
  const [count, setCount] = useState(isNumeric ? 0 : value);
  const statRef = useRef<HTMLLIElement>(null);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    if (!isNumeric || reduced) return;

    const target = value as number;
    let fired = false;

    const element = statRef.current;
    if (!element) {
      setCount(target);
      return;
    }

    let rafId = 0;

    const animate = () => {
      fired = true;
      const duration = 1600;
      const start = performance.now();

      const tick = (now: number) => {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        const eased = easeOutCubic(progress);
        setCount(Math.floor(eased * target));
        if (progress < 1) rafId = requestAnimationFrame(tick);
      };

      rafId = requestAnimationFrame(tick);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.15) {
            if (!fired) animate();
            observer.disconnect();
          }
        });
      },
      { threshold: [0, 0.15] },
    );

    observer.observe(element);

    const fallback = setTimeout(() => {
      if (!fired) {
        setCount(target);
        observer.disconnect();
      }
    }, FALLBACK_DELAY);

    const rect = element.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.85) {
      if (!fired) animate();
      observer.disconnect();
    }

    return () => {
      cancelAnimationFrame(rafId);
      observer.disconnect();
      clearTimeout(fallback);
    };
  }, [isNumeric, value, reduced]);

  const displayValue = isNumeric ? (reduced ? value : count) : value;

  return (
    <li
      ref={statRef}
      className={styles.statItem}
      style={{ "--stat-delay": `${index * 0.12}s` } as CSSProperties}
    >
      <span
        className={`${styles.statValue} ${isNumeric ? "" : styles.text}`}
        style={{ "--count-up-value": displayValue } as CSSProperties}
      >
        {displayValue}
      </span>
      <span className={styles.statLabel}>{label}</span>
    </li>
  );
}

export type { Stat };