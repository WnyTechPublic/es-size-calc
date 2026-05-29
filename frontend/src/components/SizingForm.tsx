"use client";

import type { SizingInput, StorageProfile, TierInput, WorkloadType } from "../lib/types";

interface SizingFormProps {
  value: SizingInput;
  profiles: StorageProfile[];
  onChange: (value: SizingInput) => void;
}

const workloadTypes: WorkloadType[] = ["SIEM", "General Logging", "APM", "Search", "Metrics"];

function updateTier(tiers: TierInput[], index: number, patch: Partial<TierInput>): TierInput[] {
  return tiers.map((tier, tierIndex) => (tierIndex === index ? { ...tier, ...patch } : tier));
}

export function SizingForm({ value, profiles, onChange }: SizingFormProps) {
  return (
    <section className="panel">
      <h2>입력</h2>
      <div className="form-grid">
        <label>
          프로젝트명
          <input
            value={value.projectName}
            onChange={(event) => onChange({ ...value, projectName: event.target.value })}
          />
        </label>
        <label>
          고객명
          <input
            value={value.customerName}
            onChange={(event) => onChange({ ...value, customerName: event.target.value })}
          />
        </label>
        <label>
          업무 구분
          <select
            value={value.workloadType}
            onChange={(event) =>
              onChange({ ...value, workloadType: event.target.value as WorkloadType })
            }
          >
            {workloadTypes.map((workloadType) => (
              <option key={workloadType} value={workloadType}>
                {workloadType}
              </option>
            ))}
          </select>
        </label>
        <label>
          일일 원본 수집량
          <input
            min="0"
            step="0.01"
            type="number"
            value={value.dailyIngestValue}
            onChange={(event) =>
              onChange({ ...value, dailyIngestValue: Number(event.target.value) })
            }
          />
        </label>
        <label>
          수집량 단위
          <select
            value={value.unit}
            onChange={(event) => onChange({ ...value, unit: event.target.value as "GB" | "TB" })}
          >
            <option value="GB">GB/day</option>
            <option value="TB">TB/day</option>
          </select>
        </label>
        <label>
          Storage Profile
          <select
            value={value.storageProfileId}
            onChange={(event) => onChange({ ...value, storageProfileId: event.target.value })}
          >
            {profiles.map((profile) => (
              <option key={profile.id} value={profile.id}>
                {profile.group} - {profile.name} ({profile.storageRatio})
              </option>
            ))}
          </select>
        </label>
        <label>
          Replica 수
          <input
            min="0"
            step="1"
            type="number"
            value={value.replicaCount}
            onChange={(event) =>
              onChange({ ...value, replicaCount: Number(event.target.value) })
            }
          />
        </label>
        <label>
          운영 여유율
          <input
            min="0"
            step="0.05"
            type="number"
            value={value.safetyMargin}
            onChange={(event) =>
              onChange({ ...value, safetyMargin: Number(event.target.value) })
            }
          />
        </label>
      </div>

      <h3>티어 보관/노드 용량</h3>
      <div className="tier-input-grid">
        <span>Tier</span>
        <span>보관일수</span>
        <span>노드당 유효 저장량(GB)</span>
        {value.tiers.map((tier, index) => (
          <div className="tier-input-row" key={tier.name}>
            <strong>{tier.name}</strong>
            <input
              min="0"
              step="1"
              type="number"
              value={tier.retentionDays}
              onChange={(event) =>
                onChange({
                  ...value,
                  tiers: updateTier(value.tiers, index, {
                    retentionDays: Number(event.target.value),
                  }),
                })
              }
            />
            <input
              min="1"
              step="1"
              type="number"
              value={tier.effectiveDiskGbPerNode}
              onChange={(event) =>
                onChange({
                  ...value,
                  tiers: updateTier(value.tiers, index, {
                    effectiveDiskGbPerNode: Number(event.target.value),
                  }),
                })
              }
            />
          </div>
        ))}
      </div>
    </section>
  );
}
