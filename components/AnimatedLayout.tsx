"use client";

import { useState, type ReactNode } from "react";
import { AnimatePresence, MotionConfig, useReducedMotion, type Easing } from "framer-motion";
import { usePathname } from "next/navigation";
import AnimatedPage from "./AnimatedPage";

export interface AnimatedLayoutProps {
  children: ReactNode;
  /** Route enter/exit duration, in seconds. */
  duration?: number;
  /** Framer Motion easing name or cubic-bezier tuple. */
  easing?: Easing;
}

const defaultEasing: Easing = [0.22, 1, 0.36, 1];

export default function AnimatedLayout({
  children,
  duration = 0.36,
  easing = defaultEasing,
}: AnimatedLayoutProps) {
  const pathname = usePathname();
  const [initialPathname] = useState(pathname);
  const reducedMotion = useReducedMotion() ?? false;
  const focusOnEnter = pathname !== initialPathname;

  return (
    <MotionConfig reducedMotion="user">
      <AnimatePresence mode="wait" initial={false}>
        <AnimatedPage
          key={pathname}
          pathname={pathname}
          duration={duration}
          easing={easing}
          reducedMotion={reducedMotion}
          focusOnEnter={focusOnEnter}
        >
          {children}
        </AnimatedPage>
      </AnimatePresence>
    </MotionConfig>
  );
}
