import { describe, expect, it } from "vitest";

import { validateSizingInput } from "./validation";
import type { SizingInput } from "./types";

const validInput: SizingInput = {
  dailyRawGb: 300,
  storageRatio: 0.462,
  retentionDays: 104,
  replicaCount: 1,
  safetyMargin: 0.3,
  effectiveDiskGbPerNode: 10240,
};

describe("validateSizingInput", () => {
  it("accepts the default spreadsheet input", () => {
    expect(validateSizingInput(validInput)).toEqual({ valid: true, errors: [] });
  });

  it("rejects invalid numeric inputs", () => {
    const result = validateSizingInput({
      ...validInput,
      dailyRawGb: 0,
      storageRatio: 0,
      retentionDays: 0,
      replicaCount: -1,
      safetyMargin: -0.1,
      effectiveDiskGbPerNode: 0,
    });

    expect(result.valid).toBe(false);
    expect(result.errors).toHaveLength(6);
  });
});
