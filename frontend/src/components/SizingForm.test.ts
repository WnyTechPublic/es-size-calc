import { describe, expect, it } from "vitest";

import { dailyRawGbToTb, dailyRawTbToGb } from "../lib/unitConversion";

describe("daily raw volume unit conversion", () => {
  it("converts GB/day to TB/day using 1024 GB per TB", () => {
    expect(dailyRawGbToTb(1024)).toBe(1);
    expect(dailyRawGbToTb(1536)).toBe(1.5);
  });

  it("converts TB/day edits back to the canonical GB/day value", () => {
    expect(dailyRawTbToGb("1")).toBe(1024);
    expect(dailyRawTbToGb("0.5")).toBe(512);
  });

  it("keeps a cleared input empty instead of coercing it to zero", () => {
    expect(dailyRawGbToTb("")).toBe("");
    expect(dailyRawTbToGb("")).toBe("");
  });
});
