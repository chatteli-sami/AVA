"use client";

import { useEffect, useRef, useState, type RefObject } from "react";

export interface UseInViewRevealOptions {
  /** Intersection ratio(s) required before a target is considered visible. */
  threshold?: number | number[];
  /** Expand or shrink the observer viewport. */
  rootMargin?: string;
  /** Keep the revealed state after the first entry. */
  once?: boolean;
}

export interface UseInViewRevealResult<T extends HTMLElement> {
  ref: RefObject<T | null>;
  inView: boolean;
}

type EntryListener = (entry: IntersectionObserverEntry) => void;

type ObserverPool = {
  observer: IntersectionObserver;
  listeners: Map<Element, Set<EntryListener>>;
};

const observerPools = new Map<string, ObserverPool>();

function subscribeToObserver(
  target: Element,
  listener: EntryListener,
  options: IntersectionObserverInit,
  poolKey: string,
): () => void {
  let pool = observerPools.get(poolKey);

  if (!pool) {
    const listeners = new Map<Element, Set<EntryListener>>();
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        for (const currentListener of listeners.get(entry.target) ?? []) {
          currentListener(entry);
        }
      }
    }, options);

    pool = { observer, listeners };
    observerPools.set(poolKey, pool);
  }

  let targetListeners = pool.listeners.get(target);
  if (!targetListeners) {
    targetListeners = new Set<EntryListener>();
    pool.listeners.set(target, targetListeners);
    pool.observer.observe(target);
  }
  targetListeners.add(listener);

  return () => {
    const currentPool = observerPools.get(poolKey);
    const currentListeners = currentPool?.listeners.get(target);
    currentListeners?.delete(listener);

    if (currentListeners?.size === 0) {
      currentPool?.observer.unobserve(target);
      currentPool?.listeners.delete(target);
    }

    if (currentPool?.listeners.size === 0) {
      currentPool.observer.disconnect();
      observerPools.delete(poolKey);
    }
  };
}

export function useInViewReveal<T extends HTMLElement = HTMLElement>(
  options: UseInViewRevealOptions = {},
): UseInViewRevealResult<T> {
  const { threshold = 0.15, rootMargin = "0px 0px -64px 0px", once = true } = options;
  const thresholdKey = Array.isArray(threshold) ? threshold.join(",") : String(threshold);
  const ref = useRef<T | null>(null);
  // Start visible in server-rendered HTML so content stays readable without JavaScript.
  const [inView, setInView] = useState(true);

  useEffect(() => {
    const target = ref.current;
    if (!target || typeof IntersectionObserver === "undefined") return undefined;

    const thresholdValues = thresholdKey.split(",").map(Number);
    const poolKey = JSON.stringify({ rootMargin, threshold: thresholdValues });
    let unsubscribe = () => {};

    unsubscribe = subscribeToObserver(
      target,
      (entry) => {
        const visible = entry.isIntersecting && entry.intersectionRatio >= Math.min(...thresholdValues);
        setInView((current) => (current === visible ? current : visible));
        if (once && visible) unsubscribe();
      },
      { rootMargin, threshold: thresholdValues },
      poolKey,
    );

    return unsubscribe;
  }, [once, rootMargin, thresholdKey]);

  return { ref, inView };
}
