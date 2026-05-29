import type { SizingInput, SizingResult } from "./types";

function round2(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

export function calculateSizing(input: SizingInput): SizingResult {
  const dailyPrimaryGb = input.dailyRawGb * input.storageRatio;
  const retentionPrimaryGb = dailyPrimaryGb * input.retentionDays;
  const withReplicaGb = retentionPrimaryGb * (1 + input.replicaCount);
  const withSafetyMarginGb = withReplicaGb * (1 + input.safetyMargin);
  const requiredDataNodes = Math.ceil(withSafetyMarginGb / input.effectiveDiskGbPerNode);

  return {
    dailyPrimaryGb: round2(dailyPrimaryGb),
    retentionPrimaryGb: round2(retentionPrimaryGb),
    withReplicaGb: round2(withReplicaGb),
    withSafetyMarginGb: round2(withSafetyMarginGb),
    requiredDataNodes,
  };
}
