import type { SizingInput, ValidSizingInput } from "./types";

export interface ValidationResult {
  valid: boolean;
  errors: string[];
  value?: ValidSizingInput;
}

function isPositiveFinite(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value) && value > 0;
}

function isNonNegativeFinite(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value) && value >= 0;
}

export function validateSizingInput(input: SizingInput): ValidationResult {
  const errors: string[] = [];

  if (!isPositiveFinite(input.dailyRawGb)) errors.push("일일 원본 수집량은 0보다 커야 합니다.");
  if (!isPositiveFinite(input.storageRatio)) errors.push("ES 저장 비율은 0보다 커야 합니다.");
  if (
    typeof input.retentionDays !== "number" ||
    !Number.isInteger(input.retentionDays) ||
    input.retentionDays <= 0
  ) {
    errors.push("보관일수는 1 이상의 정수여야 합니다.");
  }
  if (
    typeof input.replicaCount !== "number" ||
    !Number.isInteger(input.replicaCount) ||
    input.replicaCount < 0
  ) {
    errors.push("Replica 수는 0 이상의 정수여야 합니다.");
  }
  if (!isNonNegativeFinite(input.safetyMargin)) errors.push("운영 여유율은 0 이상이어야 합니다.");
  if (!isPositiveFinite(input.effectiveDiskGbPerNode)) {
    errors.push("노드당 유효 저장량은 0보다 커야 합니다.");
  }

  if (errors.length > 0) return { valid: false, errors };

  return {
    valid: true,
    errors,
    value: input as ValidSizingInput,
  };
}
