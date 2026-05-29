import type { SizingInput, SizingResult } from "./types";

export function formatGb(value: number): string {
  const gb = Number(value || 0).toFixed(2);
  if (Number(value || 0) >= 1024) {
    return `${gb} GB (${(Number(value || 0) / 1024).toFixed(2)} TB)`;
  }
  return `${gb} GB`;
}

export function buildSizingMarkdown(input: SizingInput, result: SizingResult): string {
  const warnings = [
    ...(result.warnings || []),
    ...(result.tiers || []).flatMap((tier) => tier.warnings || []),
  ];
  const tierRows = (result.tiers || [])
    .map(
      (tier) =>
        `| ${tier.name} | ${tier.retentionDays} | ${formatGb(tier.primaryGb)} | ${formatGb(tier.withReplicaGb)} | ${formatGb(tier.withSafetyMarginGb)} | ${tier.requiredNodes} |`,
    )
    .join("\n");
  const warningText = warnings.length
    ? warnings.map((warning) => `- ${warning}`).join("\n")
    : "- 특이 사항 없음";

  return `# Elastic Size Calculator 결과

## 산정 케이스 요약
- 프로젝트명: ${input.projectName}
- 고객명: ${input.customerName}
- 업무 구분: ${input.workloadType}

## 입력값 요약
- 일일 원본 수집량: ${input.dailyIngestValue} ${input.unit}/day
- Replica 수: ${input.replicaCount}
- 운영 여유율: ${(input.safetyMargin * 100).toFixed(0)}%

## Storage Profile 근거
- Profile: ${result.storageProfile.name} (${result.storageProfile.id})
- Lab 조합: ${result.storageProfile.labCase}
- storageRatio: ${result.storageProfile.storageRatio}

## 티어별 계산 결과
| Tier | Retention Days | Primary | Replica 포함 | 여유율 포함 | 필요 노드 수 |
|---|---:|---:|---:|---:|---:|
${tierRows}

## 전체 권장 구성
- 일일 ES primary 저장량: ${formatGb(result.dailyPrimaryGb)}
- 전체 필요 저장량: ${formatGb(result.totalWithSafetyMarginGb)}
- 전체 필요 data node 수: ${result.totalRequiredNodes}

## 주의 사항
${warningText}
`;
}
