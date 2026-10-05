"use client";

import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import { motion, useMotionValue, useMotionValueEvent, useSpring, useTransform } from "framer-motion";
import { usePrefersReducedMotion } from "../../hooks/usePrefersReducedMotion";
import { nearbyPlacesByDistance } from "../../data/locations";
import type { NearbyPlace } from "../../types/location";
import LocationTimelineItem from "./LocationTimelineItem";
import styles from "../../styles/location-timeline.module.css";

const useIsomorphicLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;

export interface LocationTimelineProps {
  /** Defaults to the site data, already sorted shortest → longest. */
  places?: NearbyPlace[];
  eyebrow?: string;
  title?: string;
  intro?: string;
  headingId?: string;
}

interface Point {
  x: number;
  y: number;
}

interface Geometry {
  d: string;
  width: number;
  height: number;
}

/**
 * Builds one continuous curve through every node centre.
 *
 * Each segment is a cubic whose control points sit either side of the midpoint,
 * which reads as a smooth S where the snake crosses and a straight run on
 * mobile, where every node shares a column and `dx` collapses to zero.
 */
function buildSnakePath(points: Point[]): string {
  if (points.length === 0) return "";
  if (points.length === 1) return `M ${points[0].x} ${points[0].y}`;

  let d = `M ${points[0].x} ${points[0].y}`;

  for (let index = 0; index < points.length - 1; index += 1) {
    const from = points[index];
    const to = points[index + 1];
    const dx = to.x - from.x;
    const dy = to.y - from.y;
    const direction = Math.sign(dx);
    // Pull the control points outward proportionally to the gap they have to span.
    const pull = Math.abs(dx) * 0.3 + Math.abs(dy) * 0.08;

    d += ` C ${from.x + direction * pull} ${from.y + dy * 0.45}, ${to.x - direction * pull} ${to.y - dy * 0.45}, ${to.x} ${to.y}`;
  }

  return d;
}

export default function LocationTimeline({
  places = nearbyPlacesByDistance,
  eyebrow = "Localisation",
  title = "À proximité",
  intro = "La résidence se situe au cœur des Jardins de Carthage, à quelques minutes des lieux qui comptent.",
  headingId = "location-timeline-heading",
}: LocationTimelineProps) {
const trackRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<SVGCircleElement>(null);
  const nodeRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [geometry, setGeometry] = useState<Geometry | null>(null);

  const prefersReducedMotion = usePrefersReducedMotion();
  const reduced = prefersReducedMotion;

  // Note: the node registry is deliberately never cleared. Clearing it lets a
  // ResizeObserver tick re-measure with empty refs, which collapses every point
  // onto the track box and degenerates the path into a single dot.
  const measure = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;

    // Wait until every node has mounted rather than measuring a partial list.
    if (places.some((_, index) => !nodeRefs.current[index])) return;

    const trackBox = track.getBoundingClientRect();
    const points = places.map((_, index) => {
      const box = (nodeRefs.current[index] as HTMLDivElement).getBoundingClientRect();
      return {
        x: box.left + box.width / 2 - trackBox.left,
        y: box.top + box.height / 2 - trackBox.top,
      };
    });

    setGeometry({ d: buildSnakePath(points), width: track.clientWidth, height: track.clientHeight });
  }, [places]);

  // Measured before paint so the line is already in place on the first frame.
  useIsomorphicLayoutEffect(() => {
    measure();
  }, [measure]);

  // Re-measure on any reflow: resize, font swap, or the cards settling.
  useEffect(() => {
    const track = trackRef.current;
    if (!track || typeof ResizeObserver === "undefined") return undefined;

    const observer = new ResizeObserver(measure);
    observer.observe(track);
    return () => observer.disconnect();
  }, [measure]);

  // Node positions shift without the track box changing size when the viewport
  // is rotated, when a webfont swaps in, or when a card's image loads, so those
  // are tracked separately and force a fresh measurement.
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return undefined;

    const refresh = () => measure();

    window.addEventListener("orientationchange", refresh);

    const fonts = (document as Document & { fonts?: FontFaceSet }).fonts;
    fonts?.ready?.then(refresh).catch(() => {});

    // `load` does not bubble, so it is captured at the track.
    track.addEventListener("load", refresh, true);

    // Catches the vertical ⇄ horizontal layout switch changing node offsets.
    const query = window.matchMedia("(max-width: 860px)");
    query.addEventListener("change", refresh);

    return () => {
      window.removeEventListener("orientationchange", refresh);
      track.removeEventListener("load", refresh, true);
      query.removeEventListener("change", refresh);
    };
  }, [measure]);

/* ------------------------------------------------------------------ progress
   * Progress is mapped across the section itself rather than between two fixed
   * lines on the viewport. The old `useScroll({ offset: ["start 0.82", "end 0.38"] })`
   * only reached 1 once the *whole track's* bottom had risen to 38% of the
   * viewport, which needs more scroll distance than the section has left, so the
   * value stalled below 1 and the final node was never reached.
   *
   * `t` now runs 0 → 1 from "first node has entered" to "last node is reached",
   * which makes the line complete while the section is still on screen.
   * ------------------------------------------------------------------------ */
  const rawProgress = useMotionValue(0);
  // Smooths trackpad and wheel jitter so the line does not step in 1px jumps.
  const progress = useSpring(rawProgress, { stiffness: 220, damping: 40, mass: 0.5 });

  // Live node geometry in viewport space, refreshed by `measure()`.
  const nodesRef = useRef<{ firstTop: number; span: number }>({ firstTop: 0, span: 1 });

  /**
   * Maps the current scroll position onto 0 → 1 across the section.
   *
   * `t = 0` when the first node sits at 70% of the viewport height, and `t = 1`
   * once the last node has been travelled past, which happens when the first node
   * has moved up by `span + 15%` of the viewport. Clamped so overscroll and
   * rubber-banding cannot push the line past its ends.
   */
  const computeProgress = useCallback(() => {
    const { firstTop, span } = nodesRef.current;
    const vh = window.innerHeight || 1;
    const denominator = span + vh * 0.15;
    if (denominator <= 0) return 1;

    const raw = (vh * 0.7 - firstTop) / denominator;
    return Math.min(1, Math.max(0, raw));
  }, []);

  /** Within half a pixel of the end, the line counts as finished. */
  const COMPLETE_TOLERANCE = 0.5;

  useEffect(() => {
    if (reduced) {
      // Reduced motion shows the finished timeline immediately, no scroll needed.
      rawProgress.jump(1);
      progress.jump(1);
      return undefined;
    }

    let frame = 0;

    const apply = () => {
      frame = 0;

      const track = trackRef.current;
      if (!track) return;

      // Re-read geometry every frame so a mid-section refresh is already correct
      // on the first paint rather than snapping into place afterwards.
      const first = nodeRefs.current[0];
      const last = nodeRefs.current[places.length - 1];
      if (!first || !last) return;

      const firstBox = first.getBoundingClientRect();
      const lastBox = last.getBoundingClientRect();
      const span = lastBox.top - firstBox.top;
      nodesRef.current = { firstTop: firstBox.top, span };

      const denominator = span + (window.innerHeight || 1) * 0.15;
      const t = computeProgress();

      // Pin the tail: once the remaining distance is under half a pixel the line
      // is drawn to its full length, every node is lit and the dot sits at the end.
      const atEnd = (1 - t) * denominator <= COMPLETE_TOLERANCE;

      // The spring keeps animating toward `rawProgress`, so a forced end has to pin
      // the source too. Jumping only the output lets the spring drag it back.
      if (atEnd || t >= 1) {
        rawProgress.jump(1);
        progress.jump(1);
      } else if (t <= 0) {
        rawProgress.jump(0);
        progress.jump(0);
      } else {
        rawProgress.set(t);
      }
    };

    const schedule = () => {
      if (!frame) frame = window.requestAnimationFrame(apply);
    };

    apply();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, [computeProgress, places.length, progress, rawProgress, reduced]);

  // `pathLength={1}` normalises the path, so dash maths stays 0 → 1.
  const dashOffset = useTransform(progress, [0, 1], [1, 0]);

  // `offset-distance` is written straight onto the element instead of through a
  // motion value: Framer Motion hands it to the SVG attr builder, which only
  // forwards transform, opacity and `offset-path` on early returns, so the value
  // never reaches the DOM and the dot would sit at the start of the line.
  useMotionValueEvent(progress, "change", (value) => {
    dotRef.current?.style.setProperty("offset-distance", `${(value * 100).toFixed(2)}%`);
  });

  const registerNode = useCallback(
    (index: number) => (node: HTMLDivElement | null) => {
      nodeRefs.current[index] = node;
    },
    [],
  );

  const items = useMemo(
    () =>
      places.map((place, index) => (
        <LocationTimelineItem
          key={place.id}
          place={place}
          index={index}
          total={places.length}
          progress={progress}
          reduced={reduced}
          registerNode={registerNode(index)}
        />
      )),
    [places, progress, reduced, registerNode],
  );

  return (
    <section className={styles.timeline} aria-labelledby={headingId}>
      <header className={styles.header}>
        <p className={styles.eyebrow}>{eyebrow}</p>
        <h2 className={styles.title} id={headingId}>
          {title}
        </h2>
        <p className={styles.intro}>{intro}</p>
      </header>

      <div className={styles.track} ref={trackRef}>
        {geometry ? (
          <svg
            className={styles.path}
            width={geometry.width}
            height={geometry.height}
            viewBox={`0 0 ${geometry.width} ${geometry.height}`}
            aria-hidden="true"
            focusable="false"
          >
            <defs>
              <linearGradient id="location-timeline-gold" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--tl-accent-soft)" />
                <stop offset="55%" stopColor="var(--tl-accent)" />
                <stop offset="100%" stopColor="var(--tl-accent-soft)" />
              </linearGradient>
            </defs>

            {/* Unreached line. */}
            <path className={styles.pathBase} d={geometry.d} pathLength={1} />
            {/* Reached line, drawn by scroll progress. */}
            <motion.path
              className={styles.pathProgress}
              d={geometry.d}
              pathLength={1}
              style={{ strokeDasharray: 1, strokeDashoffset: dashOffset }}
            />
            {/* The head of the line. It only needs `offset-path`, and CSS hides it
                where that is unsupported, so no runtime feature detection is needed. */}
            <circle
              ref={dotRef}
              className={styles.pathDot}
              r={4}
              style={{ offsetPath: `path("${geometry.d}")` } as CSSProperties}
            />
          </svg>
        ) : null}

        <ol className={styles.list}>{items}</ol>
      </div>
    </section>
  );
}