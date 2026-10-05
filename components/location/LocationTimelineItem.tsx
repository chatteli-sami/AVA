"use client";

import { useCallback, useEffect, useRef, useState, type RefCallback } from "react";
import { animate, motion, useMotionValue, useMotionValueEvent, useTransform, type MotionValue } from "framer-motion";
import type { NearbyPlace } from "../../types/location";
import LocationIcon from "./LocationIcon";
import styles from "../../styles/location-timeline.module.css";

const EASE = [0.22, 1, 0.36, 1] as const;

interface LocationTimelineItemProps {
  place: NearbyPlace;
  index: number;
  total: number;
  /** Shared scroll progress across the whole track, 0 → 1. */
  progress: MotionValue<number>;
  reduced: boolean;
  registerNode: RefCallback<HTMLDivElement>;
}

/**
 * A fraction along the path at which this node should light up.
 *
 * The path links nodes in order with evenly spaced rows and symmetric
 * alternation, so each segment is close to the same arc length and the index
 * fraction tracks real distance along the line closely. The small lead keeps
 * the node lit while the line is still arriving, because `progress` is spring
 * smoothed and settles a hair short of the exact fraction.
 */
function nodeThreshold(index: number, total: number): number {
  if (total <= 1) return 0;
  return Math.max(0, index / (total - 1) - 0.02);
}

export default function LocationTimelineItem({ place, index, total, progress, reduced, registerNode }: LocationTimelineItemProps) {
  const side = index % 2 === 0 ? "right" : "left";
  const [latched, setLatched] = useState(false);
  const latchedRef = useRef(false);
  const [pulsed, setPulsed] = useState(false);
  const nodeElRef = useRef<HTMLDivElement | null>(null);

  // One-way latch: a node stays lit once the line has passed it.
  useMotionValueEvent(progress, "change", (value) => {
    if (latchedRef.current) return;
    if (value < nodeThreshold(index, total)) return;

    // The line can be drawn past a node that is still below the fold, so hold the
    // count-up until it is visible. Only "below the fold" blocks the latch: a node
    // that has already scrolled above the viewport was definitively passed, and
    // treating that as blocked would strand it dark on a fast scroll, because
    // progress stops changing afterwards and nothing would re-check it.
    const node = nodeElRef.current;
    if (node) {
      const box = node.getBoundingClientRect();
      if (box.top >= (window.innerHeight || 1)) return;
    }

    latchedRef.current = true;
    setLatched(true);
  });

  // A fast scroll or a flick can carry a node from "below the fold" to "already
  // passed" between two progress events, or leap straight past its threshold, so
  // re-check while the line has reached this node but the node is still below the
  // fold. Without this, such a node would stay dark for the rest of the visit.
  useEffect(() => {
    if (latchedRef.current) return undefined;

    const node = nodeElRef.current;
    if (!node) return undefined;

    const check = () => {
      if (latchedRef.current) return;
      if (progress.get() < nodeThreshold(index, total)) return;
      if (node.getBoundingClientRect().top >= (window.innerHeight || 1)) return;

      latchedRef.current = true;
      setLatched(true);
    };

    // `scroll` catches the node rising into view; the interval is a backstop for a
    // jump that skipped straight over the viewport band between two scroll events.
    const interval = window.setInterval(check, 100);
    window.addEventListener("scroll", check, { passive: true });

    return () => {
      window.clearInterval(interval);
      window.removeEventListener("scroll", check);
    };
  }, [index, total, progress]);

  // Reduced motion drops the scroll gating entirely, so the timeline is legible
  // without scrolling and without depending on a scroll event arriving.
  const reached = reduced || latched;

  // The count always starts at zero, on the server as well, so the markup the
  // browser hydrates matches what was sent.
  const count = useMotionValue(0);
  const display = useTransform(count, (value) => String(Math.round(value)).padStart(2, "0"));

  useEffect(() => {
    if (!reached) return undefined;

    if (reduced) {
      count.set(place.minutes);
      return undefined;
    }

    const controls = animate(count, place.minutes, { duration: 0.65, ease: EASE });
    const ring = window.setTimeout(() => setPulsed(true), 140);
    return () => {
      controls.stop();
      window.clearTimeout(ring);
    };
  }, [reached, reduced, place.minutes, count]);

  const slideFrom = side === "right" ? 40 : -40;

  // Feeds both the parent's measurement registry and this node's own
  // on-screen check, which decides when the count-up is allowed to start.
  const registerLocalNode = useCallback(
    (node: HTMLDivElement | null) => {
      nodeElRef.current = node;
      registerNode(node);
    },
    [registerNode],
  );

  const body = (
    <>
      <p className={styles.cardLabel}>À {place.minutes} minutes</p>
      <h3 className={styles.cardTitle}>{place.name}</h3>
      {place.description ? <p className={styles.cardDescription}>{place.description}</p> : null}
      <span className={styles.cardIcon}>
        <LocationIcon name={place.icon} />
      </span>
    </>
  );

  return (
    <li className={styles.item} data-side={side} data-reached={reached ? "true" : "false"}>
      <motion.div
        ref={registerLocalNode}
        className={styles.node}
        initial={{ opacity: reduced ? 1 : 0, scale: reduced ? 1 : 0.6 }}
        animate={reached ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.6 }}
        transition={{ duration: reduced ? 0 : 0.5, ease: EASE }}
      >
        <span className={styles.pulse} data-visible={pulsed ? "true" : "false"} aria-hidden="true" />
        <span className={styles.nodeValue}>
          <motion.span className={styles.nodeNumber}>{display}</motion.span>
          <span className={styles.nodeUnit}>MIN</span>
        </span>
      </motion.div>

      <motion.div
        className={styles.card}
        initial={{ opacity: reduced ? 1 : 0, x: reduced ? 0 : slideFrom }}
        animate={reached ? { opacity: 1, x: 0 } : { opacity: 0, x: slideFrom }}
        transition={{ duration: reduced ? 0 : 0.6, ease: EASE, delay: reduced ? 0 : 0.06 }}
      >
        {place.href ? (
          <a className={styles.cardLink} href={place.href}>
            {body}
          </a>
        ) : (
          body
        )}
      </motion.div>
    </li>
  );
}