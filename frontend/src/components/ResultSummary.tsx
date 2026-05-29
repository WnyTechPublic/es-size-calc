"use client";

import { useState } from "react";

import { buildSizingMarkdown, formatGb } from "../lib/markdown";
import type { SizingInput, SizingResult } from "../lib/types";

export function ResultSummary({ input, result }: { input: SizingInput; result: SizingResult }) {
  const [copyState, setCopyState] = useState("Markdown 복사");

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
      <table className="sheet-table">
        <tbody>
          <tr>
            <th scope="row">일일 ES Primary</th>
            <td>{formatGb(result.dailyPrimaryGb)}</td>
            <td>일일 원본 수집량 × ES 저장 비율</td>
          </tr>
          <tr>
            <th scope="row">보관 기간 Primary</th>
            <td>{formatGb(result.retentionPrimaryGb)}</td>
            <td>일일 ES Primary × 보관일수</td>
          </tr>
          <tr>
            <th scope="row">Replica 포함</th>
            <td>{formatGb(result.withReplicaGb)}</td>
            <td>보관 기간 Primary × (1 + Replica 수)</td>
          </tr>
          <tr>
            <th scope="row">여유율 포함</th>
            <td>{formatGb(result.withSafetyMarginGb)}</td>
            <td>Replica 포함 × (1 + 운영 여유율)</td>
          </tr>
          <tr>
            <th scope="row">필요 data node</th>
            <td>{result.requiredDataNodes}</td>
            <td>ROUNDUP(여유율 포함 ÷ 노드당 유효 저장량)</td>
          </tr>
        </tbody>
      </table>
    </section>
  );
}
