"use client";

import type { SizingInput } from "../lib/types";
import { dailyRawGbToTb, dailyRawTbToGb, parseNumericInput } from "../lib/unitConversion";

interface SizingFormProps {
  value: SizingInput;
  onChange: (value: SizingInput) => void;
}

export function SizingForm({ value, onChange }: SizingFormProps) {
  return (
    <section className="panel">
      <h2>입력</h2>
      <div className="sheet-form">
        <fieldset className="field-group">
          <legend>일일 원본 수집량</legend>
          <div className="unit-pair">
            <label>
              GB/day
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
              TB/day
              <input
                min="0"
                step="0.001"
                type="number"
                value={dailyRawGbToTb(value.dailyRawGb)}
                onChange={(event) =>
                  onChange({ ...value, dailyRawGb: dailyRawTbToGb(event.target.value) })
                }
              />
            </label>
          </div>
        </fieldset>
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
