/**
 * Bookkeeping for the gallery → project cover transition.
 *
 * The two pages live in different route groups, each with its own
 * `AnimatePresence`, so there is never a moment where the card image and the
 * hero image coexist in one React tree. A shared `layoutId` therefore has
 * nothing to project between. Instead the transition is driven from a single
 * overlay mounted in the root layout, and this module is the channel the
 * gallery, the project hero and the back button use to talk to it.
 */

export interface CoverRect {
  top: number;
  left: number;
  width: number;
  height: number;
}

export type CoverPhase = "idle" | "expanding" | "settling" | "returning" | "shrinking";

export interface CoverState {
  phase: CoverPhase;
  /** Bumped on every new transition so the layer restarts its animations. */
  runId: number;
  slug: string | null;
  href: string | null;
  /** Already-optimised `currentSrc` of the card image, so pixels match exactly. */
  src: string | null;
  /** Original path, preloaded before the animation starts. */
  preloadSrc: string | null;
  alt: string;
  /** Viewport size captured at the start of the run, scrollbar excluded. */
  viewport: { width: number; height: number };
  /** Source card position, in viewport coordinates. */
  from: CoverRect | null;
  /** Destination hero position, in viewport coordinates. */
  to: CoverRect | null;
  reduced: boolean;
}

const INITIAL: CoverState = {
  phase: "idle",
  runId: 0,
  slug: null,
  href: null,
  src: null,
  preloadSrc: null,
  alt: "",
  viewport: { width: 0, height: 0 },
  from: null,
  to: null,
  reduced: false,
};

let state: CoverState = INITIAL;
const listeners = new Set<() => void>();

function emit(next: Partial<CoverState>) {
  state = { ...state, ...next };
  for (const listener of listeners) listener();
}

export function subscribeCoverTransition(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function getCoverTransition(): CoverState {
  return state;
}

export function resetCoverTransition() {
  state = INITIAL;
  for (const listener of listeners) listener();
}

export function isCoverTransitionBusy(): boolean {
  return state.phase !== "idle";
}

/**
 * Warms the full-resolution cover before the expansion starts, so the project
 * hero can paint immediately instead of waiting on the network mid-animation.
 */
export function preloadCover(src: string): void {
  if (typeof window === "undefined" || !src) return;
  const image = new Image();
  image.decoding = "async";
  image.src = src;
}

export interface OpenCoverOptions {
  href: string;
  slug: string;
  src: string;
  preloadSrc: string;
  alt: string;
  from: CoverRect;
  reduced: boolean;
}

/** Expanding: the card image grows to fill the viewport. */
export function openCover(options: OpenCoverOptions) {
  if (state.phase !== "idle") return;
  emit({
    phase: "expanding",
    runId: state.runId + 1,
    slug: options.slug,
    href: options.href,
    src: options.src,
    preloadSrc: options.preloadSrc,
    alt: options.alt,
    viewport: { width: window.innerWidth, height: window.innerHeight },
    from: options.from,
    to: null,
    reduced: options.reduced,
  });
}

/** Returning: the detail page is replaced by a full-screen cover. */
export function returnCover(options: { slug: string; src: string; preloadSrc: string; alt: string; reduced: boolean }) {
  if (state.phase !== "idle") return;
  emit({
    phase: "returning",
    runId: state.runId + 1,
    slug: options.slug,
    href: "/",
    src: options.src,
    preloadSrc: options.preloadSrc,
    alt: options.alt,
    viewport: { width: window.innerWidth, height: window.innerHeight },
    from: { top: 0, left: 0, width: window.innerWidth, height: window.innerHeight },
    to: null,
    reduced: options.reduced,
  });
}

/** The expanded cover has filled the screen; the project page takes over. */
export function beginSettle() {
  if (state.phase !== "expanding") return;
  emit({ phase: "settling" });
}

/** The gallery has restored itself, so the cover can shrink onto its card. */
export function beginShrink() {
  if (state.phase !== "returning") return;
  emit({ phase: "shrinking" });
}

/** The project hero reporting where it actually landed. */
export function reportHeroRect(slug: string, rect: CoverRect) {
  if (state.slug !== slug) return;
  if (state.phase !== "settling" && state.phase !== "returning") return;
  emit({ to: rect });
}

/** The gallery card reporting where it sits while a return is in progress. */
export function reportGalleryRect(slug: string, rect: CoverRect) {
  if (state.phase !== "returning" && state.phase !== "shrinking") return;
  if (state.slug !== slug) return;
  emit({ from: rect });
}
