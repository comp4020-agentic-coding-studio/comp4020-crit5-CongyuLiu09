import { readdirSync, readFileSync } from "node:fs";
import { join, relative, resolve, sep } from "node:path";
import { JSDOM } from "jsdom";
import { describe, expect, it } from "vitest";

// This week's spec (crits/05-game): "it can be lost: a wrong move is possible,
// and play ends somewhere — a win, a loss or a finish". Whether the ending
// actually feels fair is for the crit, but shipping *some* detectable end
// state is a mechanical floor worth asserting on the built site.
//
// "one rule of the game has a focused automated test" is also spec, but which
// rule and what it asserts is mine to decide once the mechanic exists — add
// that test to this file alongside the one below as the game takes shape.
const DIST = resolve("dist");

function files(dir: string = DIST): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name);
    return entry.isDirectory() ? files(path) : [path];
  });
}

const shipped = files().map((path) => relative(DIST, path).split(sep).join("/"));
const htmlPaths = shipped.filter((name) => name.endsWith(".html"));
const jsPaths = shipped.filter((name) => name.endsWith(".js"));

// Every script that ships: inline <script> bodies from every page, plus every
// built .js file they might point at.
const shippedScript = [
  ...htmlPaths.flatMap((name) => {
    const doc = new JSDOM(readFileSync(join(DIST, name), "utf8")).window.document;
    return Array.from(doc.querySelectorAll("script:not([src])")).map((s) => s.textContent ?? "");
  }),
  ...jsPaths.map((name) => readFileSync(join(DIST, name), "utf8")),
].join("\n");

describe("crit 5 spec: it can be lost", () => {
  it("renders some detectable end state — a win, a loss, or a finish", () => {
    expect(
      /\bgame[\s-]?over\b|\byou\s+(won|win|lost|lose)\b|\btry\s+again\b|\bplay\s+again\b|\bfinal\s+score\b/i.test(
        shippedScript,
      ),
      "no end-state text found in the shipped script --- replace the starter with a game that ends somewhere",
    ).toBe(true);
  });
});
