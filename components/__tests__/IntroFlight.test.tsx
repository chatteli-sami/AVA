import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import IntroFlight, {
  createFlightPath,
  easeFlight,
  pointAtDistance,
  resetIntroPlayback,
  type FlightPath,
} from "../IntroFlight";

const VIEWPORT = { width: 1440, height: 900 };

function buildPath(width = VIEWPORT.width, height = VIEWPORT.height): FlightPath {
  return createFlightPath(width, height);
}

describe("createFlightPath", () => {
  it("produces a monotonic cumulative distance table", () => {
    const path = buildPath();

    expect(path.points.length).toBeGreaterThan(100);
    expect(path.distances).toHaveLength(path.points.length);
    expect(path.distances[0]).toBe(0);

    for (let index = 1; index < path.distances.length; index += 1) {
      expect(path.distances[index]).toBeGreaterThan(path.distances[index - 1]);
    }

    expect(path.length).toBeCloseTo(path.distances[path.distances.length - 1], 10);
  });

  it("never emits duplicate consecutive points", () => {
    const path = buildPath();

    for (let index = 1; index < path.points.length; index += 1) {
      const previous = path.points[index - 1];
      const current = path.points[index];
      const gap = Math.hypot(current.x - previous.x, current.y - previous.y);

      expect(gap).toBeGreaterThan(0);
    }
  });

  it("contains no zero-length segments at loop seams across viewports", () => {
    for (const size of [
      { width: 375, height: 667 },
      { width: 768, height: 1024 },
      { width: 1920, height: 1080 },
      { width: 1440, height: 300 },
    ]) {
      const path = buildPath(size.width, size.height);

      for (let index = 1; index < path.distances.length; index += 1) {
        expect(path.distances[index] - path.distances[index - 1]).toBeGreaterThan(0);
      }
    }
  });

  it("keeps every point finite for degenerate viewports", () => {
    for (const size of [
      { width: 1, height: 1 },
      { width: 0, height: 0 },
      { width: 320, height: 0 },
    ]) {
      const path = buildPath(size.width, size.height);

      expect(Number.isFinite(path.length)).toBe(true);
      for (const point of path.points) {
        expect(Number.isFinite(point.x)).toBe(true);
        expect(Number.isFinite(point.y)).toBe(true);
      }
    }
  });

  it("scales with the viewport instead of using fixed pixels", () => {
    const small = buildPath(720, 450);
    const large = buildPath(1440, 900);

    expect(large.length).toBeGreaterThan(small.length);
    expect(large.length / small.length).toBeCloseTo(2, 1);
  });
});

describe("pointAtDistance", () => {
  const path = buildPath();

  it("returns the start point at distance zero", () => {
    const start = pointAtDistance(path, 0);

    expect(start.x).toBeCloseTo(path.points[0].x, 6);
    expect(start.y).toBeCloseTo(path.points[0].y, 6);
  });

  it("returns the end point at the full path length", () => {
    const end = pointAtDistance(path, path.length);
    const last = path.points[path.points.length - 1];

    expect(end.x).toBeCloseTo(last.x, 6);
    expect(end.y).toBeCloseTo(last.y, 6);
  });

  it("stays on the path when clamped beyond either end", () => {
    const before = pointAtDistance(path, -500);
    const after = pointAtDistance(path, path.length + 5000);

    expect(before).toEqual(pointAtDistance(path, 0));
    expect(after).toEqual(pointAtDistance(path, path.length));
  });

  it("samples continuously rather than teleporting between points", () => {
    const steps = 400;
    const maxJump = path.length / steps + 1;

    let previous = pointAtDistance(path, 0);

    for (let step = 1; step <= steps; step += 1) {
      const current = pointAtDistance(path, (path.length * step) / steps);
      const jump = Math.hypot(current.x - previous.x, current.y - previous.y);

      expect(jump).toBeLessThanOrEqual(maxJump);
      previous = current;
    }
  });

  it("clamps without throwing on an empty path", () => {
    const empty: FlightPath = { points: [{ x: 0, y: 0 }], distances: [0], length: 0 };

    expect(() => pointAtDistance(empty, 10)).not.toThrow();
  });
});

describe("easeFlight", () => {
  it("anchors the ends of the range", () => {
    expect(easeFlight(0)).toBe(0);
    expect(easeFlight(1)).toBeCloseTo(1, 10);
  });

  it("stays inside the unit range across the whole domain", () => {
    for (let step = 0; step <= 1000; step += 1) {
      const value = easeFlight(step / 1000);

      expect(value).toBeGreaterThanOrEqual(0);
      expect(value).toBeLessThanOrEqual(1);
    }
  });

  it("is monotonic so the bird never travels backwards", () => {
    let previous = -1;

    for (let step = 0; step <= 1000; step += 1) {
      const value = easeFlight(step / 1000);

      expect(value).toBeGreaterThanOrEqual(previous);
      previous = value;
    }
  });

  it("has no discontinuity at the ease ramp joins", () => {
    const epsilon = 1e-6;

    expect(easeFlight(0.08 - epsilon)).toBeCloseTo(easeFlight(0.08 + epsilon), 4);
    expect(easeFlight(0.92 - epsilon)).toBeCloseTo(easeFlight(0.92 + epsilon), 4);
  });

  it("decelerates into the end rather than stopping abruptly", () => {
    const lateDelta = easeFlight(1) - easeFlight(0.99);
    const midDelta = easeFlight(0.5) - easeFlight(0.49);

    expect(lateDelta).toBeLessThan(midDelta);
  });
});

describe("IntroFlight", () => {
  beforeEach(() => {
    // The intro guards on module state, so each test needs a fresh module to
    // observe it playing.
    resetIntroPlayback();
  });

  it("renders the skip control and announces its status while active", async () => {
    render(<IntroFlight />);

    expect(await screen.findByRole("button", { name: /passer/i })).toBeInTheDocument();
    expect(screen.getByRole("status")).toHaveTextContent(/introduction/i);
  });

  it("marks the rest of the page inert and restores it when skipped", async () => {
    render(
      <>
        <div id="site-content">
          <a href="/pack">lien</a>
        </div>
        <IntroFlight />
      </>,
    );

    const siteContent = document.getElementById("site-content");
    expect(siteContent).not.toBeNull();

    fireEvent.click(await screen.findByRole("button", { name: /passer/i }));

    expect(siteContent?.inert).toBe(false);
    await waitFor(() => {
      expect(screen.queryByRole("button", { name: /passer/i })).not.toBeInTheDocument();
    });
  });

  it("applies inert while the intro is active", async () => {
    render(
      <>
        <div id="site-content">contenu</div>
        <IntroFlight />
      </>,
    );

    const siteContent = document.getElementById("site-content");

    await screen.findByRole("button", { name: /passer/i });
    expect(siteContent?.inert).toBe(true);
    expect(siteContent?.hasAttribute("inert")).toBe(true);
  });

  it("does not replay when the component remounts within the same document", async () => {
    const first = render(<IntroFlight />);
    await screen.findByRole("button", { name: /passer/i });
    first.unmount();

    render(<IntroFlight />);

    await waitFor(() => {
      expect(screen.queryByRole("button", { name: /passer/i })).not.toBeInTheDocument();
    });
    expect(screen.getByRole("status")).toHaveTextContent("");
  });

  it("plays again once the module is re-evaluated, as on a refresh", async () => {
    const first = render(<IntroFlight />);
    await screen.findByRole("button", { name: /passer/i });
    first.unmount();

    render(<IntroFlight />);
    await waitFor(() => {
      expect(screen.queryByRole("button", { name: /passer/i })).not.toBeInTheDocument();
    });

    // A refresh tears down the JS module, so the flag starts over.
    resetIntroPlayback();

    render(<IntroFlight />);
    expect(await screen.findByRole("button", { name: /passer/i })).toBeInTheDocument();
  });
});