import { describe, expect, it } from "vitest";

import type { SizingInput } from "./types";
import { validateSizingInput } from "./validation";

const validInput: SizingInput = {
  projectName: "Project",
  customerName: "Customer",
  workloadType: "SIEM",
  dailyIngestValue: 100,
  unit: "GB",
  storageProfileId: "fortigate-raw-parsed-recommended",
  replicaCount: 1,
  safetyMargin: 0.3,
  tiers: [{ name: "hot", retentionDays: 14, effectiveDiskGbPerNode: 1024 }],
};

describe("validateSizingInput", () => {
  it("accepts a valid sizing input", () => {
    expect(validateSizingInput(validInput)).toEqual({ valid: true, errors: [] });
  });

  it("rejects invalid numbers and unknown profiles", () => {
    const result = validateSizingInput({
      ...validInput,
      dailyIngestValue: 0,
      storageProfileId: "missing",
      replicaCount: 1.5,
      safetyMargin: -0.1,
      tiers: [{ name: "hot", retentionDays: -1, effectiveDiskGbPerNode: 0 }],
    });

    expect(result.valid).toBe(false);
    expect(result.errors).toEqual([
      "일일 원본 수집량은 0보다 커야 합니다.",
      "알 수 없는 Storage Profile입니다.",
      "Replica 수는 0 이상의 정수여야 합니다.",
      "운영 여유율은 0 이상이어야 합니다.",
      "hot 보관일수는 0 이상의 정수여야 합니다.",
      "hot 노드당 유효 저장량은 0보다 커야 합니다.",
    ]);
  });
});
