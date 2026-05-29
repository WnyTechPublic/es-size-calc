import { describe, expect, it } from "vitest";

import { calculateSizing } from "./sizingEngine";
import type { SizingInput } from "./types";

const baseInput: SizingInput = {
  dailyRawGb: 300,
  storageRatio: 0.462,
  retentionDays: 104,
  replicaCount: 1,
  safetyMargin: 0.3,
  effectiveDiskGbPerNode: 10240,
};

describe("calculateSizing", () => {
  it("matches the spreadsheet-style sizing formula", () => {
    const result = calculateSizing(baseInput);

    expect(result).toEqual({
      dailyPrimaryGb: 138.6,
      retentionPrimaryGb: 14414.4,
      withReplicaGb: 28828.8,
      withSafetyMarginGb: 37477.44,
      requiredDataNodes: 4,
    });
  });

  it("does not double-apply replica or safety margin", () => {
    const result = calculateSizing({ ...baseInput, replicaCount: 0, safetyMargin: 0 });

    expect(result.retentionPrimaryGb).toBe(14414.4);
    expect(result.withReplicaGb).toBe(14414.4);
    expect(result.withSafetyMarginGb).toBe(14414.4);
  });
});
