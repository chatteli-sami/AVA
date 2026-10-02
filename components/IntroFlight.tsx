"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import styles from "../styles/intro-flight.module.css";
import { lockPageScroll } from "../lib/scroll-lock";
import { INTRO_SKIP_LABEL, INTRO_STATUS_LABEL, SITE_CONTENT_ID } from "./intro-flight.constants";

type Point = { x: number; y: number };

type FlightPath = {
  points: Point[];
  distances: number[];
  length: number;
};

export type { FlightPath, Point };

const FLIGHT_DURATION = 4500;
const FLIGHT_END_DELAY = 300;

/**
 * Module-scoped, so it lives exactly as long as the loaded document:
 * a refresh (or a fresh tab) re-evaluates the module and the intro plays again,
 * while a client-side navigation back to the home page does not replay it.
 * `sessionStorage` cannot be used here because it survives a refresh.
 */
let introPlayed = false;

export function resetIntroPlayback(): void {
  introPlayed = false;
}

const BEAK_ANGLE = -64.7;

const BIRD_WIDTH = 343;
const BIRD_HEIGHT = 500;

const TWO_PI = 2 * Math.PI;
const LOOP_START_ANGLE = 0.75 * Math.PI;
const LOOP_RADIUS_RATIO = 0.15;
const LOOP_STEPS = 24;
const CURVE_SUBDIVISIONS = 18;

const EASE_RAMP = 0.08;
const EASE_RAMP_AREA = EASE_RAMP * 2;
const EASE_EXIT_AT = 0.92;
const EASE_MIDDLE_OFFSET = 0.04;
const EASE_SPAN = 0.92;

const HEADING_SAMPLE_DISTANCE = 8;
const TRAIL_LENGTH_RATIO = 0.22;
const TRAIL_GAP_RATIO = 2;

const START_LEAD = { x: -60, y: 20 };
const END_LEAD = { x: 80, y: 0 };

const MIN_SEGMENT_LENGTH = 1;
const RESIZE_DEBOUNCE = 120;

const APPROACH_WAYPOINTS: Point[] = [
  { x: -0.1, y: 0.85 },
  { x: 0.12, y: 0.65 },
  { x: 0.14, y: 0.3 },
  { x: 0.2, y: 0.12 },
  { x: 0.36, y: 0.25 },
  { x: 0.3, y: 0.55 },
  { x: 0.22, y: 0.82 },
  { x: 0.38, y: 0.9 },
];

const EXIT_WAYPOINTS: Point[] = [
  { x: 0.66, y: 0.86 },
  { x: 0.84, y: 0.8 },
  { x: 0.92, y: 0.55 },
  { x: 0.8, y: 0.38 },
  { x: 0.66, y: 0.3 },
  { x: 0.7, y: 0.14 },
  { x: 0.84, y: 0.1 },
  { x: 1.12, y: 0.16 },
];

function distance(first: Point, second: Point): number {
  return Math.hypot(second.x - first.x, second.y - first.y);
}

function toViewportPoints(waypoints: readonly Point[], width: number, height: number): Point[] {
  return waypoints.map((waypoint) => ({ x: waypoint.x * width, y: waypoint.y * height }));
}

function createLoopPoints(centerX: number, centerY: number, radius: number, steps: number): Point[] {
  const points: Point[] = [];

  for (let step = 0; step < steps; step += 1) {
    const angle = LOOP_START_ANGLE - (step / steps) * TWO_PI;
    points.push({
      x: centerX + radius * Math.cos(angle),
      y: centerY + radius * Math.sin(angle),
    });
  }

  return points;
}

function nextKnotTime(time: number, first: Point, second: Point): number {
  return time + Math.max(distance(first, second), MIN_SEGMENT_LENGTH);
}

function interpolatePoint(
  first: Point,
  second: Point,
  firstTime: number,
  secondTime: number,
  time: number,
): Point {
  const span = secondTime - firstTime;
  const amount = span === 0 ? 0 : (time - firstTime) / span;
  return {
    x: first.x + (second.x - first.x) * amount,
    y: first.y + (second.y - first.y) * amount,
  };
}

function appendCatmullRomSegment(
  point0: Point,
  point1: Point,
  point2: Point,
  point3: Point,
  subdivisions: number,
  output: Point[],
): void {
  const time0 = 0;
  const time1 = nextKnotTime(time0, point0, point1);
  const time2 = nextKnotTime(time1, point1, point2);
  const time3 = nextKnotTime(time2, point2, point3);

  for (let index = 0; index < subdivisions; index += 1) {
    const time = time1 + ((time2 - time1) * index) / subdivisions;
    const a1 = interpolatePoint(point0, point1, time0, time1, time);
    const a2 = interpolatePoint(point1, point2, time1, time2, time);
    const a3 = interpolatePoint(point2, point3, time2, time3, time);
    const b1 = interpolatePoint(a1, a2, time0, time2, time);
    const b2 = interpolatePoint(a2, a3, time1, time3, time);
    output.push(interpolatePoint(b1, b2, time1, time2, time));
  }
}

export function createFlightPath(width: number, height: number): FlightPath {
  const radius = Math.min(width, height) * LOOP_RADIUS_RATIO;
  const waypoints: Point[] = [
    ...toViewportPoints(APPROACH_WAYPOINTS, width, height),
    ...createLoopPoints(width * 0.5, height * 0.5, radius, LOOP_STEPS),
    ...toViewportPoints(EXIT_WAYPOINTS, width, height),
  ];

  waypoints.unshift({ x: waypoints[0].x + START_LEAD.x, y: waypoints[0].y + START_LEAD.y });
  waypoints.push({
    x: waypoints[waypoints.length - 1].x + END_LEAD.x,
    y: waypoints[waypoints.length - 1].y + END_LEAD.y,
  });

  const points: Point[] = [];
  for (let index = 0; index < waypoints.length - 3; index += 1) {
    appendCatmullRomSegment(
      waypoints[index],
      waypoints[index + 1],
      waypoints[index + 2],
      waypoints[index + 3],
      CURVE_SUBDIVISIONS,
      points,
    );
  }
  points.push(waypoints[waypoints.length - 2]);

  const distances = [0];
  for (let index = 1; index < points.length; index += 1) {
    distances.push(distances[index - 1] + distance(points[index - 1], points[index]));
  }

  return { points, distances, length: distances[distances.length - 1] };
}

export function pointAtDistance(path: FlightPath, targetDistance: number): Point {
  const lastIndex = path.points.length - 1;
  if (lastIndex <= 0) return path.points[0] ?? { x: 0, y: 0 };

  let low = 1;
  let high = path.distances.length - 1;
  const clampedDistance = Math.max(0, Math.min(targetDistance, path.length));

  while (low < high) {
    const middle = Math.floor((low + high) / 2);
    if (path.distances[middle] < clampedDistance) low = middle + 1;
    else high = middle;
  }

  const endIndex = Math.min(low, lastIndex);
  const segmentStartDistance = path.distances[endIndex - 1];
  const segmentLength = path.distances[endIndex] - segmentStartDistance || MIN_SEGMENT_LENGTH;
  const amount = (clampedDistance - segmentStartDistance) / segmentLength;
  const start = path.points[endIndex - 1];
  const end = path.points[endIndex];

  return {
    x: start.x + (end.x - start.x) * amount,
    y: start.y + (end.y - start.y) * amount,
  };
}

export function easeFlight(progress: number): number {
  const eased =
    progress < EASE_RAMP
      ? (progress * progress) / EASE_RAMP_AREA
      : progress > EASE_EXIT_AT
        ? EASE_EXIT_AT - ((1 - progress) * (1 - progress)) / EASE_RAMP_AREA
        : progress - EASE_MIDDLE_OFFSET;

  return Math.max(0, Math.min(1, eased / EASE_SPAN));
}

function applyTrailGeometry(trail: SVGPathElement, path: FlightPath): number {
  const trailLength = path.length * TRAIL_LENGTH_RATIO;
  const geometry = path.points
    .map((point) => `${point.x.toFixed(1)} ${point.y.toFixed(1)}`)
    .join("L");

  trail.setAttribute("d", `M${geometry}`);
  trail.style.strokeDasharray = `${trailLength} ${path.length * TRAIL_GAP_RATIO}`;
  trail.style.strokeDashoffset = `${trailLength}`;

  return trailLength;
}

function measureBird(bird: HTMLImageElement): { width: number; height: number } {
  return bird.offsetWidth > 0 && bird.offsetHeight > 0
    ? { width: bird.offsetWidth, height: bird.offsetHeight }
    : { width: BIRD_WIDTH, height: BIRD_HEIGHT };
}

export default function IntroFlight() {
  const birdRef = useRef<HTMLImageElement>(null);
  const trailRef = useRef<SVGPathElement>(null);
  const skipButtonRef = useRef<HTMLButtonElement>(null);
  const frameRef = useRef<number | null>(null);
  const finishTimerRef = useRef<number | null>(null);
  const pathRef = useRef<FlightPath | null>(null);
  const progressRef = useRef(0);
  const birdSizeRef = useRef({ width: BIRD_WIDTH, height: BIRD_HEIGHT });
  const runIdRef = useRef(0);
  const reducedMotionRef = useRef(false);
  const [isActive, setIsActive] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  const stopFlight = useCallback(() => {
    runIdRef.current += 1;
    if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
    if (finishTimerRef.current !== null) window.clearTimeout(finishTimerRef.current);
    frameRef.current = null;
    finishTimerRef.current = null;
    pathRef.current = null;
  }, []);

  const finishIntro = useCallback(() => {
    stopFlight();
    setIsActive(false);
    setIsComplete(true);
  }, [stopFlight]);

  const refreshGeometry = useCallback(() => {
    const bird = birdRef.current;
    const trail = trailRef.current;
    const activePath = pathRef.current;
    if (!bird || !trail || !activePath) return;

    const path = createFlightPath(window.innerWidth, window.innerHeight);
    pathRef.current = path;
    birdSizeRef.current = measureBird(bird);

    const trailLength = applyTrailGeometry(trail, path);
    trail.style.strokeDashoffset = `${trailLength - easeFlight(progressRef.current) * path.length}`;
  }, []);

  const playIntro = useCallback(() => {
    stopFlight();

    if (reducedMotionRef.current || introPlayed) {
      finishIntro();
      return;
    }

    introPlayed = true;

    const bird = birdRef.current;
    const trail = trailRef.current;
    if (!bird || !trail) return;

    const runId = runIdRef.current;
    setIsComplete(false);
    setIsActive(true);
    progressRef.current = 0;

    const path = createFlightPath(window.innerWidth, window.innerHeight);
    pathRef.current = path;
    birdSizeRef.current = measureBird(bird);
    const trailLength = applyTrailGeometry(trail, path);

    let startTime: number | null = null;
    let previousAngle: number | null = null;

    const tick = (now: number) => {
      if (runId !== runIdRef.current) return;
      if (startTime === null) startTime = now;

      const activePath = pathRef.current;
      if (!activePath) return;

      const progress = Math.min((now - startTime) / FLIGHT_DURATION, 1);
      progressRef.current = progress;

      const traveled = easeFlight(progress) * activePath.length;
      const position = pointAtDistance(activePath, traveled);
      const ahead = pointAtDistance(activePath, Math.min(traveled + HEADING_SAMPLE_DISTANCE, activePath.length));
      const behind = pointAtDistance(activePath, Math.max(traveled - HEADING_SAMPLE_DISTANCE, 0));

      let angle = (Math.atan2(ahead.y - behind.y, ahead.x - behind.x) * 180) / Math.PI;
      if (previousAngle !== null) {
        let delta = angle - previousAngle;
        while (delta > 180) delta -= 360;
        while (delta < -180) delta += 360;
        angle = previousAngle + delta;
      }
      previousAngle = angle;

      const { width, height } = birdSizeRef.current;
      bird.style.transform = `translate3d(${position.x - width / 2}px, ${position.y - height / 2}px, 0) rotate(${angle - BEAK_ANGLE}deg)`;
      trail.style.strokeDashoffset = `${trailLength - traveled}`;

      if (progress < 1) {
        frameRef.current = requestAnimationFrame(tick);
      } else {
        frameRef.current = null;
        finishTimerRef.current = window.setTimeout(() => {
          if (runId !== runIdRef.current) return;
          finishIntro();
        }, FLIGHT_END_DELAY);
      }
    };

    frameRef.current = requestAnimationFrame(tick);
  }, [finishIntro, stopFlight]);

  useEffect(() => {
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    let resizeTimer: number | null = null;

    const applyMotionPreference = () => {
      reducedMotionRef.current = motionQuery.matches;
      if (motionQuery.matches) finishIntro();
      else playIntro();
    };

    const handleViewportChange = () => {
      if (resizeTimer !== null) window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(refreshGeometry, RESIZE_DEBOUNCE);
    };

    const startupFrame = window.requestAnimationFrame(applyMotionPreference);
    motionQuery.addEventListener("change", applyMotionPreference);
    window.addEventListener("resize", handleViewportChange);
    window.addEventListener("orientationchange", handleViewportChange);

    return () => {
      window.cancelAnimationFrame(startupFrame);
      if (resizeTimer !== null) window.clearTimeout(resizeTimer);
      window.removeEventListener("resize", handleViewportChange);
      window.removeEventListener("orientationchange", handleViewportChange);
      motionQuery.removeEventListener("change", applyMotionPreference);
      stopFlight();
    };
  }, [finishIntro, playIntro, refreshGeometry, stopFlight]);

  useEffect(() => {
    if (!isActive) return undefined;

    const releaseScroll = lockPageScroll();
    const siteContent = document.getElementById(SITE_CONTENT_ID);
    const previouslyInert = siteContent?.inert ?? false;
    const previouslyFocused = document.activeElement instanceof HTMLElement ? document.activeElement : null;

    if (siteContent) siteContent.inert = true;
    skipButtonRef.current?.focus();

    return () => {
      releaseScroll();
      if (siteContent) siteContent.inert = previouslyInert;
      if (previouslyFocused && previouslyFocused !== document.body && document.body.contains(previouslyFocused)) {
        previouslyFocused.focus();
      }
    };
  }, [isActive]);

  useEffect(() => {
    if (!isActive) return undefined;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") finishIntro();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [finishIntro, isActive]);

  const overlayClassName = [
    styles.intro,
    isActive ? styles.active : isComplete ? styles.done : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={overlayClassName}>
      <div className={styles.ava} aria-hidden="true">AVA</div>
      <svg className={styles.trail} aria-hidden="true">
        <path ref={trailRef} />
      </svg>
      <Image
        ref={birdRef}
        className={styles.bird}
        src="/images/Oiseau.png"
        alt=""
        width={BIRD_WIDTH}
        height={BIRD_HEIGHT}
        priority
        aria-hidden="true"
      />
      <p className={styles.status} role="status">{isActive ? INTRO_STATUS_LABEL : ""}</p>
      {isActive ? (
        <button ref={skipButtonRef} type="button" className={styles.skip} onClick={finishIntro}>
          {INTRO_SKIP_LABEL}
        </button>
      ) : null}
    </div>
  );
}