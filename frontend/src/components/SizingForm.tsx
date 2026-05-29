"use client";

import type { NumericInput, SizingInput } from "../lib/types";

interface SizingFormProps {
  value: SizingInput;
  onChange: (value: SizingInput) => void;
}

function parseNumericInput(value: string): NumericInput {
  return value === "" ? "" : Number(value);
}

export function SizingForm({ value, onChange }: SizingFormProps) {
  return (
    <section className="panel">
      <h2>입력</h2>
      <div className="sheet-form">
        <label>
          일일 원본 수집량 (GB/day)
          <input
            min="0"
            step="1"
            type="number"
            value={value.dailyRawGb}
            onChange={(event) =>
              onChange({ ...value, dailyRawGb: parseNumericInput(event.target.value) })
            }
          />
        </label>
        <label>
          ES 저장 비율
          <input
            min="0"
            step="0.001"
            type="number"
            value={value.storageRatio}
            onChange={(event) =>
              onChange({ ...value, storageRatio: parseNumericInput(event.target.value) })
            }
          />
        </label>
        <label>
          보관일수
          <input
            min="1"
            step="1"
            type="number"
            value={value.retentionDays}
            onChange={(event) =>
              onChange({ ...value, retentionDays: parseNumericInput(event.target.value) })
            }
          />
        </label>
        <label>
          Replica 수
          <input
            min="0"
            step="1"
            type="number"
            value={value.replicaCount}
            onChange={(event) =>
              onChange({ ...value, replicaCount: parseNumericInput(event.target.value) })
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
              onChange({ ...value, safetyMargin: parseNumericInput(event.target.value) })
            }
          />
        </label>
        <label>
          노드당 유효 저장량 (GB)
          <input
            min="1"
            step="1"
            type="number"
            value={value.effectiveDiskGbPerNode}
            onChange={(event) =>
              onChange({ ...value, effectiveDiskGbPerNode: parseNumericInput(event.target.value) })
            }
          />
        </label>
      </div>
    </section>
  );
}
