const RECORD_KEY = "ava.gallery-return-record";

export interface GalleryReturn {
  /** Saved scroll offset, or null when the visitor never scrolled the gallery list. */
  scrollY: number | null;
  /** Slug of the card that was clicked, used to shrink the cover back onto it. */
  slug: string | null;
}

/** True while any gallery return is on record, so route-change resets stand down. */
export function isGalleryReturnPending(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return window.sessionStorage.getItem(RECORD_KEY) !== null;
  } catch {
    return false;
  }
}

/**
 * Reads the return record without consuming it.
 *
 * The record outlives a single navigation on purpose: a browser back or a
 * swipe-back never runs our Back button, so the gallery has to be able to ask
 * "is there somewhere I should return to?" on its own mount rather than being
 * handed the answer.
 */
export function peekGalleryReturn(): GalleryReturn | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.sessionStorage.getItem(RECORD_KEY);
    if (raw === null) return null;

    const parsed = JSON.parse(raw) as { scrollY?: unknown; slug?: unknown };
    const scrollY = typeof parsed.scrollY === "number" && Number.isFinite(parsed.scrollY)
      ? Math.round(parsed.scrollY)
      : null;
    const slug = typeof parsed.slug === "string" && parsed.slug ? parsed.slug : null;

    return { scrollY, slug };
  } catch {
    // A corrupt record is not worth recovering; the gallery falls back to its
    // section anchor.
    return null;
  }
}

/**
 * Records where the gallery list was and which card was clicked, before the
 * navigation starts.
 *
 * This doubles as the return marker for the whole session, because it is the
 * one thing all three ways out of a project page share: the Back button, the
 * browser Back button and the swipe-back gesture.
 */
export function rememberGalleryScroll(slug: string): void {
  if (typeof window === "undefined") return;
  try {
    const record: GalleryReturn = {
      scrollY: Number.isFinite(window.scrollY) ? Math.round(window.scrollY) : null,
      slug,
    };
    window.sessionStorage.setItem(RECORD_KEY, JSON.stringify(record));
  } catch {
    // Without sessionStorage the gallery still returns to its section anchor.
  }
}

/** Queues a return for a project that was opened without going through a card. */
export function requestGalleryReturn(): void {
  if (typeof window === "undefined") return;
  try {
    if (window.sessionStorage.getItem(RECORD_KEY) !== null) return;
    window.sessionStorage.setItem(RECORD_KEY, JSON.stringify({ scrollY: null, slug: null }));
  } catch {
    // Non-fatal: the Back link still navigates home.
  }
}

/** Consumes the record once the gallery has used it. */
export function clearGalleryReturn(): void {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.removeItem(RECORD_KEY);
  } catch {
    // Nothing to clear.
  }
}

/**
 * Kept for callers that want the record exactly once.
 *
 * The gallery does not use this: it needs the record to survive until it has
 * actually restored, which is not the same moment the route changes.
 */
export function consumeGalleryReturn(): GalleryReturn | null {
  const record = peekGalleryReturn();
  if (!record) return null;
  clearGalleryReturn();
  return record;
}