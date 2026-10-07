/**
 * Scroll-state channel for the inventory page.
 *
 * The gallery uses sessionStorage to remember where the visitor was, because a
 * browser Back button or a swipe-back is a POP navigation that never runs our
 * own link. The inventory list needs the same behaviour: a visitor who opens a
 * plan lightbox, closes it and presses Back should land back on the inventory
 * page at the scroll position and tab they left, not at the top.
 *
 * This module is deliberately small and dependency-free. It records the scroll
 * offset and the active tab whenever the page is about to hide, and the
 * ScrollStateRestore component consumes the record on mount.
 */

export interface InventoryScrollState {
  scrollY: number;
  type: string;
}

const KEY = "ava.inventory-scroll-state";

export function saveInventoryScrollState(state: InventoryScrollState): void {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    // Non-fatal: the page still works, it just resets to the top.
  }
}

export function takeInventoryScrollState(): InventoryScrollState | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.sessionStorage.getItem(KEY);
    if (!raw) return null;
    window.sessionStorage.removeItem(KEY);
    const parsed = JSON.parse(raw) as Partial<InventoryScrollState>;
    if (typeof parsed.scrollY !== "number" || typeof parsed.type !== "string") return null;
    return { scrollY: Math.max(0, Math.round(parsed.scrollY)), type: parsed.type };
  } catch {
    return null;
  }
}

export function peekInventoryScrollState(): InventoryScrollState | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.sessionStorage.getItem(KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<InventoryScrollState>;
    if (typeof parsed.scrollY !== "number" || typeof parsed.type !== "string") return null;
    return { scrollY: Math.max(0, Math.round(parsed.scrollY)), type: parsed.type };
  } catch {
    return null;
  }
}

export function clearInventoryScrollState(): void {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.removeItem(KEY);
  } catch {
    // Non-fatal.
  }
}