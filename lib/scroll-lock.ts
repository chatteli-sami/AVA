type ScrollStyleSnapshot = Pick<
  CSSStyleDeclaration,
  "overflow" | "position" | "top" | "left" | "right" | "width"
>;

const noop = () => {};

/**
 * Freezes page scrolling without shifting layout.
 *
 * `overflow: hidden` alone is unreliable on iOS Safari, so the body is pinned
 * with `position: fixed` at its current scroll offset. Returns a release
 * function that restores every touched property and the scroll position.
 */
export function lockPageScroll(): () => void {
  if (typeof window === "undefined") return noop;

  const scrollY = window.scrollY;
  const { style } = document.body;
  const previous: ScrollStyleSnapshot = {
    overflow: style.overflow,
    position: style.position,
    top: style.top,
    left: style.left,
    right: style.right,
    width: style.width,
  };

  style.overflow = "hidden";
  style.position = "fixed";
  style.top = `-${scrollY}px`;
  style.left = "0";
  style.right = "0";
  style.width = "100%";

  return () => {
    style.overflow = previous.overflow;
    style.position = previous.position;
    style.top = previous.top;
    style.left = previous.left;
    style.right = previous.right;
    style.width = previous.width;
    window.scrollTo(0, scrollY);
  };
}