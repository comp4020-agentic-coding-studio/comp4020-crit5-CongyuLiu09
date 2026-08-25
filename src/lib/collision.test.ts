import { describe, expect, it } from "vitest";
import { rectsOverlap } from "./collision";

// crit 5 spec: "one rule of the game has a focused automated test" --- this is
// that rule. A collision between the runner and an obstacle is what ends the
// round; everything else about the game loop is orchestration around it.
describe("rectsOverlap", () => {
  it("is true when two rects overlap", () => {
    expect(
      rectsOverlap({ x: 0, y: 0, width: 10, height: 10 }, { x: 5, y: 5, width: 10, height: 10 }),
    ).toBe(true);
  });

  it("is false when two rects are apart", () => {
    expect(
      rectsOverlap({ x: 0, y: 0, width: 10, height: 10 }, { x: 20, y: 20, width: 10, height: 10 }),
    ).toBe(false);
  });

  it("is false when two rects only touch at an edge", () => {
    expect(
      rectsOverlap({ x: 0, y: 0, width: 10, height: 10 }, { x: 10, y: 0, width: 10, height: 10 }),
    ).toBe(false);
  });

  it("is true when one rect fully contains another", () => {
    expect(
      rectsOverlap({ x: 0, y: 0, width: 20, height: 20 }, { x: 5, y: 5, width: 5, height: 5 }),
    ).toBe(true);
  });
});
