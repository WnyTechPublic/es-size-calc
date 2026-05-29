export type NumericInput = number | "";

export interface SizingInput {
  dailyRawGb: NumericInput;
  storageRatio: NumericInput;
  retentionDays: NumericInput;
  replicaCount: NumericInput;
  safetyMargin: NumericInput;
  effectiveDiskGbPerNode: NumericInput;
}

export interface ValidSizingInput {
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
