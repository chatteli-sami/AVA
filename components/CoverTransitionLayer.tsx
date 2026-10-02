"use client";

import { useCallback, useEffect, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  beginSettle,
  beginShrink,
  getCoverTransition,
  resetCoverTransition,
  subscribeCoverTransition,
  type CoverRect,
} from "../lib/cover-transition";

/** Matches `.gallery-card-media`; the detail hero uses `--w-radius: 20px`. */
const CARD_RADIUS = 24;
const HERO_RADIUS = 20;

const EXPAND_DURATION = 0.95;
const SETTLE_DURATION = 0.55;
const RETURN_DURATION = 0.4;
const SHRINK_DURATION = 0.8;
const REDUCED_DURATION = 0.2;
/** Long enough for expand + settle, short enough to never feel stuck. */
const WATCHDOG_MS = 3000;
const EASE = [0.76, 0, 0.24, 1] as const;

function easeInOutQuart(t: number): number {
  return t < 0.5 ? 8 * t * t * t * t : 1 - Math.pow(-2 * t + 2, 4) / 2;
}

/**
 * The corner is painted on a box that is being scaled, so a raw radius of `r`
 * reaches the screen as `r * scale`. Dividing by the scale at each point in the
 * easing keeps the visible corner the size the design asks for, and lets it land
 * on zero exactly as the image reaches the edge of the viewport.
 */
function radiusRamp(startScale: number, endScale: number, startRadius: number, endRadius: number, samples = 13): number[] {
  return Array.from({ length: samples }, (_, index) => {
    const eased = easeInOutQuart(index / (samples - 1));
    const scale = startScale + (endScale - startScale) * eased;
    if (scale <= 0.001) return endRadius;
    return (startRadius + (endRadius - startRadius) * eased) / scale;
  });
}

function transformFor(rect: CoverRect, viewport: { width: number; height: number }): string {
  if (!viewport.width || !viewport.height) return "none";
  return `translate3d(${rect.left}px, ${rect.top}px, 0) scale(${rect.width / viewport.width}, ${rect.height / viewport.height})`;
}

const FULLSCREEN_TRANSFORM = "translate3d(0px, 0px, 0) scale(1, 1)";

export default function CoverTransitionLayer() {
  const router = useRouter();
  const state = useSyncExternalStore(subscribeCoverTransition, getCoverTransition, getCoverTransition);

  const { phase, runId, src, alt, viewport, from, to, reduced, href } = state;
  const active = phase !== "idle";

  // Scroll stays pinned and the page cannot be clicked for the whole run.
  useEffect(() => {
    if (!active) return undefined;
    const root = document.documentElement;
    const previousOverflow = root.style.overflow;
    root.style.overflow = "hidden";
    root.classList.add("is-cover-transitioning");
    return () => {
      root.style.overflow = previousOverflow;
      root.classList.remove("is-cover-transitioning");
    };
  }, [active, runId]);

  // Returning: cover the screen straight away, then let the gallery mount behind.
  useEffect(() => {
    if (phase !== "returning" || !href) return;
    router.push(href);
  }, [phase, href, router]);

  // The gallery has restored its scroll offset and reported the card, so shrink.
  useEffect(() => {
    if (phase !== "returning" || !from) return;
    if (from.width >= viewport.width || from.height >= viewport.height) return;
    beginShrink();
  }, [phase, from, viewport.width, viewport.height]);

  const finish = useCallback(() => resetCoverTransition(), []);

  const handleExpandComplete = useCallback(() => {
    if (href) router.push(href);
    beginSettle();
  }, [href, router]);

  // Safety net: a transition must never leave the page covered. If the hero or
  // the gallery card never reports a position, drop the overlay regardless.
  useEffect(() => {
    if (!active) return undefined;
    const timer = window.setTimeout(finish, WATCHDOG_MS);
    return () => window.clearTimeout(timer);
  }, [active, runId, finish]);

  if (!active || !src || !viewport.width) return null;

  const settling = phase === "settling" && Boolean(to);
  const shrinking = phase === "shrinking" && Boolean(from);
  const destination: CoverRect | null = settling ? (to as CoverRect) : shrinking ? (from as CoverRect) : null;

  let initialTransform = FULLSCREEN_TRANSFORM;
  let animateTransform = FULLSCREEN_TRANSFORM;
  let radii = [0];
  let duration = EXPAND_DURATION;
  let opacityKeyframes: number[] = [1];
  let opacityTimes: number[] | undefined;
  let onComplete: (() => void) | undefined;

  if (phase === "expanding") {
    const source = from ?? { top: 0, left: 0, width: viewport.width, height: viewport.height };
    if (reduced) {
      duration = REDUCED_DURATION;
      radii = [0];
      opacityKeyframes = [0, 1];
    } else {
      const sourceScaleX = source.width / viewport.width;
      initialTransform = transformFor(source, viewport);
      radii = radiusRamp(sourceScaleX, 1, CARD_RADIUS, 0);
      opacityKeyframes = [1];
    }
    onComplete = handleExpandComplete;
  } else if (phase === "returning") {
    duration = reduced ? REDUCED_DURATION : RETURN_DURATION;
    radii = [0];
    opacityKeyframes = [0, 1];
    opacityTimes = [0, 1];
  } else if (settling && destination) {
    if (reduced) {
      duration = REDUCED_DURATION;
      radii = [0];
      opacityKeyframes = [1, 0];
    } else {
      duration = SETTLE_DURATION;
      animateTransform = transformFor(destination, viewport);
      radii = radiusRamp(1, destination.width / viewport.width, 0, HERO_RADIUS);
      opacityKeyframes = [1, 1, 0];
      opacityTimes = [0, 0.7, 1];
    }
    onComplete = finish;
  } else if (shrinking && destination) {
    if (reduced) {
      duration = REDUCED_DURATION;
      radii = [0];
      opacityKeyframes = [1, 0];
    } else {
      duration = SHRINK_DURATION;
      animateTransform = transformFor(destination, viewport);
      radii = radiusRamp(1, destination.width / viewport.width, 0, CARD_RADIUS);
      opacityKeyframes = [1, 1, 0];
      opacityTimes = [0, 0.68, 1];
    }
    onComplete = finish;
  }

  return (
    <div className="cover-transition" aria-hidden="true">
      <motion.div
        key={`backdrop-${runId}`}
        className="cover-transition__backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: reduced ? 0.15 : 0.45, ease: "easeOut" }}
      />
      <motion.img
        key={`image-${runId}-${phase}`}
        className="cover-transition__image"
        src={src}
        alt={alt}
        draggable={false}
        initial={{ transform: initialTransform, opacity: opacityKeyframes[0], borderRadius: radii[0] }}
        animate={{ transform: animateTransform, opacity: opacityKeyframes, borderRadius: radii }}
        transition={{
          duration,
          ease: EASE,
          opacity: { duration: reduced ? REDUCED_DURATION : duration, times: opacityTimes },
        }}
        onAnimationComplete={onComplete}
      />
    </div>
  );
}
