import { describe, expect, it } from "vitest";

import { buildSizingMarkdown, formatGb } from "./markdown";
import { calculateSizing } from "./sizingEngine";
import type { SizingInput } from "./types";

const input: SizingInput = {
  dailyRawGb: 300,
  storageRatio: 0.462,
  retentionDays: 104,
  replicaCount: 1,
  safetyMargin: 0.3,
  effectiveDiskGbPerNode: 10240,
};

describe("markdown", () => {
  it("formats GB and TB values", () => {
    expect(formatGb(300)).toBe("300.00 GB");
    expect(formatGb(2048)).toBe("2048.00 GB (2.00 TB)");
  });

  it("builds a compact spreadsheet-style markdown summary", () => {
    const markdown = buildSizingMarkdown(input, calculateSizing(input));

    expect(markdown).toContain("# Elastic Size Calculator 결과");
    expect(markdown).toContain("일일 원본 수집량: 300 GB/day");
    expect(markdown).toContain("필요 data node 수: 4");
  });
});
