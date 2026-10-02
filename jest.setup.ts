import "@testing-library/jest-dom";

Object.defineProperty(window, "matchMedia", {
  writable: true,
  configurable: true,
  value: (query: string): MediaQueryList =>
    ({
      matches: false,
      media: query,
      onchange: null,
      addEventListener: () => {},
      removeEventListener: () => {},
      addListener: () => {},
      removeListener: () => {},
      dispatchEvent: () => false,
    }) as unknown as MediaQueryList,
});

Object.defineProperty(window, "scrollTo", {
  writable: true,
  configurable: true,
  value: () => {},
});

if (!("inert" in HTMLElement.prototype)) {
  Object.defineProperty(HTMLElement.prototype, "inert", {
    configurable: true,
    get(this: HTMLElement) {
      return this.hasAttribute("inert");
    },
    set(this: HTMLElement, value: boolean) {
      if (value) this.setAttribute("inert", "");
      else this.removeAttribute("inert");
    },
  });
}