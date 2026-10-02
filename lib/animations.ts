import type { Transition, Variants } from "framer-motion";

export const EASE_OUT_EXPO = [0.16, 1, 0.3, 1] as const;
export const EASE_SMOOTH = [0.22, 1, 0.36, 1] as const;

export const springSoft: Transition = { type: "spring", stiffness: 220, damping: 28, mass: 0.9 };
export const springSnappy: Transition = { type: "spring", stiffness: 420, damping: 34 };

export const MAX_BLUR_PX = 6;
export const MAX_SKEW_DEG = 2;

/** Collapses any transition to an instant cut when the user asks for less motion. */
export function transition(preset: Transition, reduced: boolean): Transition {
  return reduced ? { duration: 0 } : preset;
}

export function pageVariants(reduced: boolean): Variants {
  return {
    initial: reduced ? { opacity: 0 } : { opacity: 0, y: 18 },
    animate: {
      opacity: 1,
      y: 0,
      transition: transition({ duration: 0.5, ease: EASE_SMOOTH }, reduced),
    },
    exit: reduced
      ? { opacity: 0, transition: { duration: 0.2 } }
      : { opacity: 0, y: -12, transition: { duration: 0.32, ease: EASE_SMOOTH } },
  };
}

export function riseVariants(reduced: boolean, delay = 0): Variants {
  return {
    initial: reduced ? { opacity: 0 } : { opacity: 0, y: 24 },
    animate: {
      opacity: 1,
      y: 0,
      transition: transition({ duration: 0.6, delay, ease: EASE_OUT_EXPO }, reduced),
    },
  };
}

/** Title brightening used by the detail hero on load. */
export function titleRevealVariants(reduced: boolean): Variants {
  return {
    initial: reduced ? { opacity: 0 } : { opacity: 0.28 },
    animate: {
      opacity: 1,
      transition: transition({ duration: 0.9, ease: EASE_OUT_EXPO }, reduced),
    },
  };
}

type CardHoverState = Record<string, number>;

export function cardHoverVariants(reduced: boolean): Variants {
  const rest: CardHoverState = reduced
    ? { titleX: 0, arrowOpacity: 1, arrowX: 0 }
    : { titleX: 0, arrowOpacity: 0, arrowX: -12 };

  const hoverState: CardHoverState = reduced
    ? { titleX: 0, arrowOpacity: 1, arrowX: 0 }
    : { titleX: 24, arrowOpacity: 1, arrowX: 0 };

  return { rest, hover: hoverState } as Variants;
}

export function mapVelocityToBlur(reduced: boolean, velocity: number): number {
  if (reduced) return 0;
  return Math.min(MAX_BLUR_PX, Math.abs(velocity) / 220);
}

export function mapVelocityToSkew(reduced: boolean, velocity: number): number {
  if (reduced) return 0;
  const skew = (velocity / 1800) * MAX_SKEW_DEG;
  return Math.max(-MAX_SKEW_DEG, Math.min(MAX_SKEW_DEG, skew));
}