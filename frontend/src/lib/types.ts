export interface SizingInput {
  dailyRawGb: number;
  storageRatio: number;
  retentionDays: number;
  replicaCount: number;
  safetyMargin: number;
  effectiveDiskGbPerNode: number;
}

export interface SizingResult {
  dailyPrimaryGb: number;
  retentionPrimaryGb: number;
  withReplicaGb: number;
  withSafetyMarginGb: number;
  requiredDataNodes: number;
}
