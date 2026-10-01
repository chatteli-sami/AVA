"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import styles from "../styles/intro-flight.module.css";

type Point = { x: number; y: number };

type FlightPath = {
  points: Point[];
  distances: number[];
  length: number;
};

const FLIGHT_DURATION = 4500;
const BEAK_ANGLE = -64.7;
const IMAGE_WIDTH = 319;
const IMAGE_HEIGHT = 466;

function createFlightPath(width: number, height: number): FlightPath {
  const minDimension = Math.min(width, height);
  const radius = minDimension * 0.15;
  const centerX = width * 0.5;
  const centerY = height * 0.5;
  const waypoints: Point[] = [];
  const addRelativePoint = (x: number, y: number) => waypoints.push({ x: x * width, y: y * height });

  addRelativePoint(-0.1, 0.85);
  addRelativePoint(0.12, 0.65);
  addRelativePoint(0.14, 0.3);
  addRelativePoint(0.2, 0.12);
  addRelativePoint(0.36, 0.25);
  addRelativePoint(0.3, 0.55);
  addRelativePoint(0.22, 0.82);
  addRelativePoint(0.38, 0.9);

  for (let step = 0; step <= 24; step += 1) {
    const angle = 0.75 * Math.PI - (step / 24) * 2 * Math.PI;
    waypoints.push({
      x: centerX + radius * Math.cos(angle),
      y: centerY + radius * Math.sin(angle),
    });
  }

  addRelativePoint(0.66, 0.86);
  addRelativePoint(0.84, 0.8);
  addRelativePoint(0.92, 0.55);
  addRelativePoint(0.8, 0.38);
  addRelativePoint(0.66, 0.3);
  addRelativePoint(0.7, 0.14);
  addRelativePoint(0.84, 0.1);
  addRelativePoint(1.12, 0.16);

  waypoints.unshift({ x: waypoints[0].x - 60, y: waypoints[0].y + 20 });
  waypoints.push({ x: waypoints[waypoints.length - 1].x + 80, y: waypoints[waypoints.length - 1].y });

  const points: Point[] = [];
  for (let index = 0; index < waypoints.length - 3; index += 1) {
    appendCatmullRomSegment(
      waypoints[index],
      waypoints[index + 1],
      waypoints[index + 2],
      waypoints[index + 3],
      18,
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

function appendCatmullRomSegment(
  point0: Point,
  point1: Point,
  point2: Point,
  point3: Point,
  subdivisions: number,
  output: Point[],
): void {
  const nextTime = (time: number, first: Point, second: Point) =>
    time + Math.sqrt(Math.hypot(second.x - first.x, second.y - first.y) || 1e-3);
  const time0 = 0;
  const time1 = nextTime(time0, point0, point1);
  const time2 = nextTime(time1, point1, point2);
  const time3 = nextTime(time2, point2, point3);

  const interpolate = (first: Point, second: Point, firstTime: number, secondTime: number, time: number): Point => {
    const amount = (time - firstTime) / (secondTime - firstTime);
    return {
      x: first.x * (1 - amount) + second.x * amount,
      y: first.y * (1 - amount) + second.y * amount,
    };
  };

  for (let index = 0; index < subdivisions; index += 1) {
    const time = time1 + ((time2 - time1) * index) / subdivisions;
    const a1 = interpolate(point0, point1, time0, time1, time);
    const a2 = interpolate(point1, point2, time1, time2, time);
    const a3 = interpolate(point2, point3, time2, time3, time);
    const b1 = interpolate(a1, a2, time0, time2, time);
    const b2 = interpolate(a2, a3, time1, time3, time);
    output.push(interpolate(b1, b2, time1, time2, time));
  }
}

function distance(first: Point, second: Point): number {
  return Math.hypot(second.x - first.x, second.y - first.y);
}

function pointAtDistance(path: FlightPath, targetDistance: number): Point {
  let low = 1;
  let high = path.distances.length - 1;

  while (low < high) {
    const middle = (low + high) >> 1;
    if (path.distances[middle] < targetDistance) low = middle + 1;
    else high = middle;
  }

  const segmentStartDistance = path.distances[low - 1];
  const segmentLength = path.distances[low] - segmentStartDistance || 1;
  const amount = (targetDistance - segmentStartDistance) / segmentLength;
  const start = path.points[low - 1];
  const end = path.points[low];

  return {
    x: start.x + (end.x - start.x) * amount,
    y: start.y + (end.y - start.y) * amount,
  };
}

function easeFlight(progress: number): number {
  const eased = progress < 0.08
    ? (progress * progress) / 0.16
    : progress > 0.92
      ? 0.92 - ((1 - progress) * (1 - progress)) / 0.16
      : progress - 0.04;

  return Math.max(0, Math.min(1, eased / 0.92));
}

export default function IntroFlight() {
  const birdRef = useRef<HTMLImageElement>(null);
  const trailRef = useRef<SVGPathElement>(null);
  const countRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<number | null>(null);
  const finishTimerRef = useRef<number | null>(null);
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
  }, []);

  const playIntro = useCallback(() => {
    stopFlight();

    if (reducedMotionRef.current) {
      setIsActive(false);
      setIsComplete(true);
      return;
    }

    const bird = birdRef.current;
    const trail = trailRef.current;
    const count = countRef.current;
    if (!bird || !trail || !count) return;

    const runId = runIdRef.current;
    setIsComplete(false);
    setIsActive(true);
    bird.style.display = "";

    const path = createFlightPath(window.innerWidth, window.innerHeight);
    const trailLength = path.length * 0.22;
    trail.setAttribute(
      "d",
      `M${path.points.map((point) => `${point.x.toFixed(1)} ${point.y.toFixed(1)}`).join("L")}`,
    );
    trail.style.strokeDasharray = `${trailLength} ${path.length * 2}`;
    trail.style.strokeDashoffset = `${trailLength}`;

    let startTime: number | null = null;
    let previousAngle = BEAK_ANGLE;

    const tick = (now: number) => {
      if (runId !== runIdRef.current) return;
      if (startTime === null) startTime = now;

      const progress = Math.min((now - startTime) / FLIGHT_DURATION, 1);
      const traveled = easeFlight(progress) * path.length;
      const position = pointAtDistance(path, traveled);
      const nextPoint = pointAtDistance(path, Math.min(traveled + 8, path.length));
      const previousPoint = pointAtDistance(path, Math.max(traveled - 8, 0));
      const angle = (Math.atan2(nextPoint.y - previousPoint.y, nextPoint.x - previousPoint.x) * 180) / Math.PI;
      let angleDelta = angle - previousAngle;
      while (angleDelta > 180) angleDelta -= 360;
      while (angleDelta < -180) angleDelta += 360;
      previousAngle += angleDelta;

      bird.style.transform = `translate3d(${position.x - bird.offsetWidth / 2}px, ${position.y - bird.offsetHeight / 2}px, 0) rotate(${previousAngle - BEAK_ANGLE}deg)`;
      trail.style.strokeDashoffset = `${trailLength - traveled}`;
      count.textContent = `${Math.round(progress * 100)}%`;

      if (progress < 1) {
        frameRef.current = requestAnimationFrame(tick);
      } else {
        frameRef.current = null;
        count.textContent = "100%";
        finishTimerRef.current = window.setTimeout(() => {
          if (runId !== runIdRef.current) return;
          setIsActive(false);
          setIsComplete(true);
        }, 300);
      }
    };

    frameRef.current = requestAnimationFrame(tick);
  }, [stopFlight]);

  useEffect(() => {
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const applyMotionPreference = () => {
      reducedMotionRef.current = motionQuery.matches;

      if (motionQuery.matches) {
        stopFlight();
        setIsActive(false);
        setIsComplete(true);
      } else {
        playIntro();
      }
    };

    const startupFrame = window.requestAnimationFrame(applyMotionPreference);
    motionQuery.addEventListener("change", applyMotionPreference);

    return () => {
      window.cancelAnimationFrame(startupFrame);
      stopFlight();
      motionQuery.removeEventListener("change", applyMotionPreference);
    };
  }, [playIntro, stopFlight]);

  useEffect(() => {
    if (!isActive) return undefined;

    const previousOverflow = document.body.style.overflow;
    const siteContent = document.getElementById("site-content");
    const previouslyInert = siteContent?.inert ?? false;
    document.body.style.overflow = "hidden";
    if (siteContent) siteContent.inert = true;

    return () => {
      document.body.style.overflow = previousOverflow;
      if (siteContent) siteContent.inert = previouslyInert;
    };
  }, [isActive]);

  return (
    <>
      <div
        className={`${styles.intro} ${isActive ? styles.active : isComplete ? styles.done : ""}`}
        role="status"
        aria-label="Animation d’introduction AVA"
        aria-hidden={!isActive}
      >
        <div className={styles.ava} aria-hidden="true">AVA</div>
        <svg className={styles.trail} aria-hidden="true">
          <path ref={trailRef} />
        </svg>
        <Image
          ref={birdRef}
          className={styles.bird}
          src="/images/Oiseau.png"
          alt=""
          width={IMAGE_WIDTH}
          height={IMAGE_HEIGHT}
          priority
          aria-hidden="true"
        />
        <div ref={countRef} className={styles.count} aria-hidden="true">0%</div>
      </div>
    </>
  );
}
