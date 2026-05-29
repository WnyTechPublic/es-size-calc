import { STORAGE_PROFILES } from "./storageProfiles";
import type { SizingInput } from "./types";

export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

function isNonNegativeFinite(value: number): boolean {
  return Number.isFinite(value) && value >= 0;
}

function isPositiveFinite(value: number): boolean {
  return Number.isFinite(value) && value > 0;
}

export function validateSizingInput(input: SizingInput): ValidationResult {
  const errors: string[] = [];

  if (!input.projectName.trim()) errors.push("프로젝트명을 입력해 주세요.");
  if (!input.customerName.trim()) errors.push("고객명을 입력해 주세요.");
  if (!isPositiveFinite(input.dailyIngestValue)) {
    errors.push("일일 원본 수집량은 0보다 커야 합니다.");
  }
  if (!STORAGE_PROFILES.some((profile) => profile.id === input.storageProfileId)) {
    errors.push("알 수 없는 Storage Profile입니다.");
  }
  if (!Number.isInteger(input.replicaCount) || input.replicaCount < 0) {
    errors.push("Replica 수는 0 이상의 정수여야 합니다.");
  }
  if (!isNonNegativeFinite(input.safetyMargin)) {
    errors.push("운영 여유율은 0 이상이어야 합니다.");
  }

  for (const tier of input.tiers) {
    if (!Number.isInteger(tier.retentionDays) || tier.retentionDays < 0) {
      errors.push(`${tier.name} 보관일수는 0 이상의 정수여야 합니다.`);
    }
    if (!isPositiveFinite(tier.effectiveDiskGbPerNode)) {
      errors.push(`${tier.name} 노드당 유효 저장량은 0보다 커야 합니다.`);
    }
  }

  return { valid: errors.length === 0, errors };
}
