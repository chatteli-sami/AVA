export type AnchorScrollBehavior = "smooth" | "instant";

export interface PendingAnchorNavigation {
  pathname: string;
  id: string;
  offset: number;
  behavior: AnchorScrollBehavior;
}

const pendingAnchorKey = "ava.pending-anchor-navigation";

/** Scroll below fixed UI, then focus the target without triggering a second scroll. */
export function scrollToAnchor(
  id: string,
  options: { offset?: number; behavior?: AnchorScrollBehavior } = {},
): boolean {
  if (typeof window === "undefined") return false;

  const target = document.getElementById(id);
  if (!target) return false;

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const header = document.querySelector<HTMLElement>("[data-site-header]");
  const fixedHeaderHeight = header?.getBoundingClientRect().height ?? 0;
  const scrollMargin = Number.parseFloat(getComputedStyle(target).scrollMarginTop) || 0;
  const offset = Math.max(options.offset ?? 0, fixedHeaderHeight, scrollMargin);
  const targetTop = Math.max(0, window.scrollY + target.getBoundingClientRect().top - offset);

  window.scrollTo({
    top: targetTop,
    behavior: reducedMotion ? "instant" : options.behavior ?? "smooth",
  });

  const originalTabIndex = target.getAttribute("tabindex");
  target.setAttribute("tabindex", "-1");
  target.focus({ preventScroll: true });

  const restoreTabIndex = () => {
    if (originalTabIndex === null) {
      target.removeAttribute("tabindex");
    } else {
      target.setAttribute("tabindex", originalTabIndex);
    }
  };

  target.addEventListener("blur", restoreTabIndex, { once: true });
  window.setTimeout(restoreTabIndex, 2000);
  return true;
}

export function storePendingAnchor(navigation: PendingAnchorNavigation): void {
  try {
    window.sessionStorage.setItem(pendingAnchorKey, JSON.stringify(navigation));
  } catch {
    // The native URL hash still works if session storage is unavailable.
  }
}

export function takePendingAnchor(pathname: string): PendingAnchorNavigation | null {
  try {
    const stored = window.sessionStorage.getItem(pendingAnchorKey);
    if (!stored) return null;

    window.sessionStorage.removeItem(pendingAnchorKey);
    const navigation = JSON.parse(stored) as PendingAnchorNavigation;
    return navigation.pathname === pathname ? navigation : null;
  } catch {
    return null;
  }
}
