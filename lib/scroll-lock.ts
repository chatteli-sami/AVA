type ScrollStyleSnapshot = Pick<
  CSSStyleDeclaration,
  "overflow" | "position" | "top" | "left" | "right" | "width" | "paddingRight"
>;

const noop = () => {};
let activeLocks = 0;
let lockedScrollY = 0;
let previousBodyStyles: ScrollStyleSnapshot | null = null;

/**
 * Freezes document scrolling without shifting layout. Nested overlays share
 * one lock so closing one cannot release another overlay's scroll lock.
 *
 * `overflow: hidden` alone is unreliable on iOS Safari, so the body is pinned
 * with `position: fixed` at its current scroll offset. Returns a release
 * function that restores every touched property and the scroll position.
 */
export function lockPageScroll(): () => void {
  if (typeof window === "undefined") return noop;

  if (activeLocks === 0) {
    lockedScrollY = window.scrollY;
    const { style } = document.body;
    previousBodyStyles = {
      overflow: style.overflow,
      position: style.position,
      top: style.top,
      left: style.left,
      right: style.right,
      width: style.width,
      paddingRight: style.paddingRight,
    };

    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    style.overflow = "hidden";
    style.position = "fixed";
    style.top = `-${lockedScrollY}px`;
    style.left = "0";
    style.right = "0";
    style.width = "100%";
    if (scrollbarWidth > 0) {
      style.paddingRight = `${scrollbarWidth}px`;
    }
  }

  activeLocks += 1;
  let released = false;

  return () => {
    if (released) return;
    released = true;
    activeLocks = Math.max(0, activeLocks - 1);
    if (activeLocks > 0 || !previousBodyStyles) return;

    const { style } = document.body;
    style.overflow = previousBodyStyles.overflow;
    style.position = previousBodyStyles.position;
    style.top = previousBodyStyles.top;
    style.left = previousBodyStyles.left;
    style.right = previousBodyStyles.right;
    style.width = previousBodyStyles.width;
    style.paddingRight = previousBodyStyles.paddingRight;
    previousBodyStyles = null;
    window.scrollTo({ top: lockedScrollY, left: 0, behavior: "instant" });
  };
}