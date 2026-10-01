"use client";

import { useRef, type CSSProperties, type ReactNode } from "react";
import { motion, type Easing } from "framer-motion";
import { scrollToAnchor, takePendingAnchor } from "../lib/anchor-navigation";
import styles from "../styles/animated-layout.module.css";

export interface AnimatedPageProps {
  children: ReactNode;
  pathname: string;
  duration: number;
  easing: Easing;
  reducedMotion: boolean;
  focusOnEnter: boolean;
}

type AnimationStyle = CSSProperties & {
  "--duration": string;
  "--easing": string;
};

function toCssEasing(easing: Easing): string {
  if (typeof easing !== "string") {
    return Array.isArray(easing) ? `cubic-bezier(${easing.join(", ")})` : "ease-out";
  }
  if (easing === "easeIn") return "ease-in";
  if (easing === "easeOut") return "ease-out";
  if (easing === "easeInOut") return "ease-in-out";
  return easing;
}

export default function AnimatedPage({
  children,
  pathname,
  duration,
  easing,
  reducedMotion,
  focusOnEnter,
}: AnimatedPageProps) {
  const pageRef = useRef<HTMLDivElement>(null);
  const animationDuration = reducedMotion ? 0 : duration;
  const style = {
    "--duration": `${animationDuration}s`,
    "--easing": toCssEasing(easing),
  } as AnimationStyle;

  function handleAnimationComplete() {
    if (!focusOnEnter) return;

    const pendingAnchor = takePendingAnchor(pathname);
    if (pendingAnchor) {
      window.requestAnimationFrame(() => {
        scrollToAnchor(pendingAnchor.id, {
          offset: pendingAnchor.offset,
          behavior: pendingAnchor.behavior,
        });
      });
      return;
    }

    pageRef.current?.focus({ preventScroll: true });
  }

  return (
    <motion.div
      ref={pageRef}
      className={styles.page}
      style={style}
      tabIndex={-1}
      role="region"
      aria-label="Contenu de la page"
      variants={{
        initial: { opacity: 0, y: 12 },
        enter: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -8 },
      }}
      initial={focusOnEnter && !reducedMotion ? "initial" : false}
      animate="enter"
      exit={reducedMotion ? { opacity: 1 } : "exit"}
      transition={{ duration: animationDuration, ease: easing }}
      onAnimationComplete={handleAnimationComplete}
    >
      {children}
    </motion.div>
  );
}
