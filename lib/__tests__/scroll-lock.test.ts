import { lockPageScroll } from "../scroll-lock";

describe("lockPageScroll", () => {
  const scrollTo = jest.spyOn(window, "scrollTo").mockImplementation(() => {});

  beforeEach(() => {
    document.body.style.cssText = "";
    Object.defineProperty(window, "scrollY", { configurable: true, value: 240 });
    Object.defineProperty(window, "innerWidth", { configurable: true, value: 1024 });
    Object.defineProperty(document.documentElement, "clientWidth", {
      configurable: true,
      value: 1008,
    });
    scrollTo.mockClear();
  });

  afterAll(() => {
    scrollTo.mockRestore();
  });

  it("restores the original body styles and scroll position instantly", () => {
    document.body.style.paddingRight = "3px";
    const release = lockPageScroll();

    expect(document.body.style.position).toBe("fixed");
    expect(document.body.style.top).toBe("-240px");
    expect(document.body.style.paddingRight).toBe("16px");

    release();

    expect(document.body.style.position).toBe("");
    expect(document.body.style.top).toBe("");
    expect(document.body.style.paddingRight).toBe("3px");
    expect(scrollTo).toHaveBeenCalledWith({ top: 240, left: 0, behavior: "instant" });
  });

  it("keeps the page locked until the last nested overlay is released", () => {
    const releaseFirst = lockPageScroll();
    const releaseSecond = lockPageScroll();

    releaseFirst();
    expect(document.body.style.position).toBe("fixed");
    expect(scrollTo).not.toHaveBeenCalled();

    releaseSecond();
    expect(document.body.style.position).toBe("");
    expect(scrollTo).toHaveBeenCalledTimes(1);
  });

  it("makes each release function idempotent", () => {
    const release = lockPageScroll();

    release();
    release();

    expect(scrollTo).toHaveBeenCalledTimes(1);
  });
});
