"use client";

import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";
import { useScroll, useTransform } from "framer-motion";
import { usePrefersReducedMotion } from "../../hooks/usePrefersReducedMotion";
import styles from "./IntroSection.module.css";

type AnimatedIntroProps = {
  children: ReactNode;
};

const FALLBACK_DELAY = 2500;
const MAX_PARALLAX = 40;

export default function AnimatedIntro({ children }: AnimatedIntroProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();

  // Scroll tracking for parallax only (not reveal)
  const { scrollYProgress } = useScroll({
    target: wrapperRef,
    offset: ["start 0.8", "end 0.2"],
  });

  // Subtle parallax: building moves ±40px with scroll
  const buildingParallaxY = useTransform(
    scrollYProgress,
    [0, 1],
    [-MAX_PARALLAX, MAX_PARALLAX]
  );

  // Panel parallax (opposite direction, half intensity)
  const panelParallaxY = useTransform(
    scrollYProgress,
    [0, 1],
    [-20, 20]
  );

  // Only set parallax variables; reveal is controlled by CSS classes
  const motionStyle: CSSProperties = !reduced
    ? ({
        "--building-parallax-y": buildingParallaxY,
        "--panel-parallax": panelParallaxY,
      } as CSSProperties)
    : ({} as CSSProperties);

  useEffect(() => {
    if (typeof window === "undefined") return;

    document.documentElement.classList.add("js-ready");

    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    // Reduced motion: skip reveal, show immediately
    if (reduced) {
      wrapper.classList.remove("js-locked");
      wrapper.classList.add("forceFinal");
      wrapper.setAttribute("data-force-final", "");
      return;
    }

    // Lock content immediately (client-side only)
    wrapper.classList.add("js-locked");

    // Check if already intersecting on mount
    const checkImmediate = () => {
      const rect = wrapper.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      if (rect.top < viewportHeight * 0.85) {
        wrapper.classList.remove("js-locked");
        wrapper.classList.add("inView");
        wrapper.setAttribute("data-in-view", "");
        return true;
      }
      return false;
    };

    if (checkImmediate()) {
      return;
    }

    let fallbackTimer: ReturnType<typeof setTimeout> | null = null;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.15) {
            wrapper.classList.remove("js-locked");
            wrapper.classList.add("inView");
            wrapper.setAttribute("data-in-view", "");
            observer.disconnect();
            if (fallbackTimer !== null) {
              clearTimeout(fallbackTimer);
              fallbackTimer = null;
            }
          }
        });
      },
      { threshold: [0, 0.15] },
    );

    observer.observe(wrapper);

    // Fallback timer – forces final state after 2.5s
    fallbackTimer = setTimeout(() => {
      wrapper.classList.remove("js-locked");
      wrapper.classList.add("forceFinal");
      wrapper.setAttribute("data-force-final", "");
      observer.disconnect();
    }, FALLBACK_DELAY);

    return () => {
      observer.disconnect();
      if (fallbackTimer !== null) clearTimeout(fallbackTimer);
    };
  }, [reduced]);

  return (
    <div
      ref={wrapperRef}
      className={`${styles.introReveal} js-locked`}
      style={motionStyle}
      suppressHydrationWarning
    >
      {children}
    </div>
  );
}
