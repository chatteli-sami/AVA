const SCROLL_KEY = "ava.gallery-scroll-position";
const RETURN_KEY = "ava.gallery-return-pending";

export interface GalleryReturn {
  /** Saved scroll offset, or null when the visitor never scrolled the gallery list. */
  scrollY: number | null;
}

/** Records where the gallery list was when a project was opened. */
export function rememberGalleryScroll(): void {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.setItem(SCROLL_KEY, String(Math.round(window.scrollY)));
  } catch {
    // Without sessionStorage the Back button still returns to the gallery section.
  }
}

/** Flags that the next gallery mount should restore a position rather than start at the top. */
export function requestGalleryReturn(): void {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.setItem(RETURN_KEY, "1");
  } catch {
    // Non-fatal: the Back link still navigates home.
  }
}

/** Reads and clears any pending gallery return. */
export function consumeGalleryReturn(): GalleryReturn | null {
  if (typeof window === "undefined") return null;
  try {
    if (window.sessionStorage.getItem(RETURN_KEY) !== "1") return null;

    window.sessionStorage.removeItem(RETURN_KEY);
    const raw = window.sessionStorage.getItem(SCROLL_KEY);
    window.sessionStorage.removeItem(SCROLL_KEY);
    if (raw === null) return { scrollY: null };

    const scrollY = Number.parseInt(raw, 10);
    return { scrollY: Number.isFinite(scrollY) ? scrollY : null };
  } catch {
    return null;
  }
}
