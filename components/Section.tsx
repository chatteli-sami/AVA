"use client";

import { Children, type ReactNode, type CSSProperties } from "react";
import { motion, useReducedMotion, type Easing, type Variants } from "framer-motion";
import { useInViewReveal, type UseInViewRevealOptions } from "../hooks/useInViewReveal";
import styles from "../styles/section.module.css";

export interface SectionProps extends UseInViewRevealOptions {
  children: ReactNode;
  id?: string;
  className?: string;
  role?: string;
  "aria-label"?: string;
  /** Delay between direct child reveals in seconds. Use 0 to disable stagger. */
  staggerChildren?: number;
  /** Reveal duration in seconds. */
  duration?: number;
  /** Framer Motion easing name or cubic-bezier tuple. */
  easing?: Easing;
}

type SectionStyle = CSSProperties & {
  "--duration": string;
  "--easing": string;
};

const defaultEasing: Easing = [0.16, 1, 0.3, 1];

function toCssEasing(easing: Easing): string {
  if (typeof easing !== "string") {
    return Array.isArray(easing) ? `cubic-bezier(${easing.join(", ")})` : "ease-out";
  }
  if (easing === "easeIn") return "ease-in";
  if (easing === "easeOut") return "ease-out";
  if (easing === "easeInOut") return "ease-in-out";
  return easing;
}

export default function Section({
  children,
  threshold = 0.15,
  rootMargin = "0px 0px -64px 0px",
  once = true,
  staggerChildren = 0,
  duration = 0.72,
  easing = defaultEasing,
  className,
  id,
  role,
  "aria-label": ariaLabel,
}: SectionProps) {
  const { ref, inView } = useInViewReveal<HTMLDivElement>({ threshold, rootMargin, once });
  const prefersReducedMotion = useReducedMotion() ?? false;
  const reducedMotion = prefersReducedMotion;
  const content = Children.toArray(children);
  const variants: Variants = {
    hidden: reducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 22 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: reducedMotion ? 0 : duration,
        ease: easing,
        ...(staggerChildren > 0 ? { staggerChildren } : {}),
      },
    },
  };
  const childVariants: Variants = {
    hidden: reducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: reducedMotion ? 0 : Math.min(duration, 0.55), ease: easing },
    },
  };
  const style = {
    "--duration": `${reducedMotion ? 0 : duration}s`,
    "--easing": toCssEasing(easing),
  } as SectionStyle;
  const renderedChildren = staggerChildren > 0
    ? content.map((child, index) => (
        <motion.div className={styles.staggerItem} variants={childVariants} key={index}>
          {child}
        </motion.div>
      ))
    : children;

  return (
    <motion.div
      ref={ref}
      id={id}
      role={role}
      aria-label={ariaLabel}
      className={[styles.section, className].filter(Boolean).join(" ")}
      style={style}
      variants={variants}
      initial={false}
      animate={reducedMotion || inView ? "visible" : "hidden"}
    >
      {renderedChildren}
    </motion.div>
  );
}
