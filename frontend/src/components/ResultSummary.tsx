"use client";

import { useState } from "react";

import { buildSizingMarkdown } from "../lib/markdown";
import type { SizingInput, SizingResult } from "../lib/types";
import { TierResultTable } from "./TierResultTable";

function formatGb(value: number): string {
  if (value >= 1024) {
    return `${value.toFixed(2)} GB (${(value / 1024).toFixed(2)} TB)`;
  }
  return `${value.toFixed(2)} GB`;
}

export function ResultSummary({ input, result }: { input: SizingInput; result: SizingResult }) {
  const [copyState, setCopyState] = useState("Markdown 복사");
  const tierWarnings = result.tiers.flatMap((tier) => tier.warnings);
  const warnings = [...result.warnings, ...tierWarnings];

  async function copyMarkdown() {
    const markdown = buildSizingMarkdown(input, result);
    await navigator.clipboard.writeText(markdown);
    setCopyState("복사됨");
    window.setTimeout(() => setCopyState("Markdown 복사"), 1200);
  }

  return (
    <section className="panel">
      <div className="result-heading">
        <h2>결과</h2>
        <button type="button" onClick={copyMarkdown}>
          {copyState}
        </button>
      </div>
      <div className="summary-grid">
        <div>
          <span>일일 ES primary 저장량</span>
          <strong>{formatGb(result.dailyPrimaryGb)}</strong>
        </div>
        <div>
          <span>전체 필요 저장량</span>
          <strong>{formatGb(result.totalWithSafetyMarginGb)}</strong>
        </div>
        <div>
          <span>전체 필요 data node</span>
          <strong>{result.totalRequiredNodes}</strong>
        </div>
      </div>

      <div className="profile-evidence">
        <h3>Storage Profile 근거</h3>
        <p>
          {result.storageProfile.name} ({result.storageProfile.id}) / {result.storageProfile.labCase} /
          storageRatio={result.storageProfile.storageRatio}
        </p>
      </div>

      <TierResultTable tiers={result.tiers} />

      <div className="warnings">
        <h3>주의 문구</h3>
        {warnings.length > 0 ? (
          <ul>
            {warnings.map((warning) => (
              <li key={warning}>{warning}</li>
            ))}
          </ul>
        ) : (
          <p>특이 사항 없음</p>
        )}
      </div>
    </section>
  );
}
