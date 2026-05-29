export type IngestUnit = "GB" | "TB";
export type TierName = "hot" | "warm" | "cold";
export type WorkloadType = "SIEM" | "General Logging" | "APM" | "Search" | "Metrics";
export type StorageProfileFlag = "parsed_only" | "tsds";

export interface StorageProfile {
  id: string;
  name: string;
  group: string;
  labCase: string;
  storageRatio: number;
  description: string;
  flags: StorageProfileFlag[];
}

export interface TierInput {
  name: TierName;
  retentionDays: number;
  effectiveDiskGbPerNode: number;
}

export interface SizingInput {
  projectName: string;
  customerName: string;
  workloadType: WorkloadType;
  dailyIngestValue: number;
  unit: IngestUnit;
  storageProfileId: string;
  replicaCount: number;
  safetyMargin: number;
  tiers: TierInput[];
}

export interface StorageProfileRef {
  id: string;
  name: string;
  labCase: string;
  storageRatio: number;
}

export interface TierResult {
  name: TierName;
  retentionDays: number;
  primaryGb: number;
  withReplicaGb: number;
  withSafetyMarginGb: number;
  requiredNodes: number;
  warnings: string[];
}

export interface SizingResult {
  dailyPrimaryGb: number;
  storageProfile: StorageProfileRef;
  tiers: TierResult[];
  totalWithSafetyMarginGb: number;
  totalRequiredNodes: number;
  warnings: string[];
}
