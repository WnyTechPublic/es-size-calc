import type { NumericInput, SizingInput, SizingResult } from "./types";

export function formatGb(value: number): string {
  const gb = Number(value || 0).toFixed(2);
  if (Number(value || 0) >= 1024) {
    return `${gb} GB (${(Number(value || 0) / 1024).toFixed(2)} TB)`;
  }
  return `${gb} GB`;
}

function formatInput(value: NumericInput): string {
  return value === "" ? "" : String(value);
}

function formatInputGb(value: NumericInput): string {
  return value === "" ? "" : formatGb(Number(value));
}

function formatPercent(value: NumericInput): string {
  return value === "" ? "" : `${(Number(value) * 100).toFixed(0)}%`;
}

export function buildSizingMarkdown(input: SizingInput, result: SizingResult): string {
  return `# Elastic Size Calculator 결과

## 입력
- 일일 원본 수집량: ${formatInput(input.dailyRawGb)} GB/day
- ES 저장 비율: ${formatInput(input.storageRatio)}
- 보관일수: ${formatInput(input.retentionDays)}일
- Replica 수: ${formatInput(input.replicaCount)}
- 운영 여유율: ${formatPercent(input.safetyMargin)}
- 노드당 유효 저장량: ${formatInputGb(input.effectiveDiskGbPerNode)}

## 계산식
- 일일 ES Primary = 일일 원본 수집량 × ES 저장 비율
- 보관 기간 Primary = 일일 ES Primary × 보관일수
- Replica 포함 = 보관 기간 Primary × (1 + Replica 수)
- 여유율 포함 = Replica 포함 × (1 + 운영 여유율)
- 필요 data node = ROUNDUP(여유율 포함 ÷ 노드당 유효 저장량)

## 결과
- 일일 ES Primary: ${formatGb(result.dailyPrimaryGb)}
- 보관 기간 Primary: ${formatGb(result.retentionPrimaryGb)}
- Replica 포함: ${formatGb(result.withReplicaGb)}
- 여유율 포함: ${formatGb(result.withSafetyMarginGb)}
- 필요 data node 수: ${result.requiredDataNodes}
`;
}
