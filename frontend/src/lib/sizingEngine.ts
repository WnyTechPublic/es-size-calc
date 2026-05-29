import { STORAGE_PROFILES } from "./storageProfiles";
import type {
  IngestUnit,
  SizingInput,
  SizingResult,
  StorageProfile,
  TierInput,
  TierName,
  TierResult,
} from "./types";

export const PARSED_ONLY_WARNING =
  "parsed-only Storage Profile은 원문 미보관으로 인해 감사/장애 분석 요구사항을 재검토해야 합니다.";
export const TSDS_WARNING =
  "TSDS Storage Profile은 메트릭/시계열 데이터에 적합하며 일반 이벤트 로그 적용 전 별도 검증이 필요합니다.";
export const REPLICA_MIN_NODE_WARNING = "Replica 1 구성은 최소 2 data node 이상을 권장합니다.";

function round2(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

export function normalizeIngestToGb(value: number, unit: IngestUnit): number {
  return unit === "TB" ? value * 1024 : value;
}

export function findStorageProfile(profileId: string): StorageProfile {
  const profile = STORAGE_PROFILES.find((candidate) => candidate.id === profileId);
  if (!profile) {
    throw new Error("Unknown storageProfileId");
  }
  return profile;
}

export function calculateTier(
  tier: TierInput,
  dailyPrimaryGb: number,
  replicaCount: number,
  safetyMargin: number,
): TierResult {
  const primaryGb = dailyPrimaryGb * tier.retentionDays;
  const withReplicaGb = primaryGb * (1 + replicaCount);
  const withSafetyMarginGb = withReplicaGb * (1 + safetyMargin);
  const requiredNodes =
    tier.retentionDays > 0 ? Math.ceil(withSafetyMarginGb / tier.effectiveDiskGbPerNode) : 0;
  const warnings =
    replicaCount >= 1 && requiredNodes === 1 ? [REPLICA_MIN_NODE_WARNING] : [];

  return {
    name: tier.name as TierName,
    retentionDays: tier.retentionDays,
    primaryGb: round2(primaryGb),
    withReplicaGb: round2(withReplicaGb),
    withSafetyMarginGb: round2(withSafetyMarginGb),
    requiredNodes,
    warnings,
  };
}

export function calculateSizing(input: SizingInput): SizingResult {
  const profile = findStorageProfile(input.storageProfileId);
  const dailyPrimaryGb = normalizeIngestToGb(input.dailyIngestValue, input.unit) * profile.storageRatio;
  const tiers = input.tiers.map((tier) =>
    calculateTier(tier, dailyPrimaryGb, input.replicaCount, input.safetyMargin),
  );
  const activeTiers = tiers.filter((tier) => tier.retentionDays > 0);
  const warnings: string[] = [];
  if (profile.flags.includes("parsed_only")) warnings.push(PARSED_ONLY_WARNING);
  if (profile.flags.includes("tsds")) warnings.push(TSDS_WARNING);

  return {
    dailyPrimaryGb: round2(dailyPrimaryGb),
    storageProfile: {
      id: profile.id,
      name: profile.name,
      labCase: profile.labCase,
      storageRatio: profile.storageRatio,
    },
    tiers,
    totalWithSafetyMarginGb: round2(
      activeTiers.reduce((total, tier) => total + tier.withSafetyMarginGb, 0),
    ),
    totalRequiredNodes: activeTiers.reduce((total, tier) => total + tier.requiredNodes, 0),
    warnings,
  };
}
