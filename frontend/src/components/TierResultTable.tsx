import type { TierResult } from "../lib/types";

function formatGb(value: number): string {
  if (value >= 1024) {
    return `${value.toFixed(2)} GB (${(value / 1024).toFixed(2)} TB)`;
  }
  return `${value.toFixed(2)} GB`;
}

export function TierResultTable({ tiers }: { tiers: TierResult[] }) {
  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            <th>Tier</th>
            <th>보관일수</th>
            <th>Primary</th>
            <th>Replica 포함</th>
            <th>여유율 포함</th>
            <th>필요 노드</th>
          </tr>
        </thead>
        <tbody>
          {tiers.map((tier) => (
            <tr key={tier.name}>
              <td>{tier.name}</td>
              <td>{tier.retentionDays}</td>
              <td>{formatGb(tier.primaryGb)}</td>
              <td>{formatGb(tier.withReplicaGb)}</td>
              <td>{formatGb(tier.withSafetyMarginGb)}</td>
              <td>{tier.requiredNodes}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
