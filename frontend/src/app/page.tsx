"use client";

import { useEffect, useState } from "react";

import { ResultSummary } from "../components/ResultSummary";
import { SizingForm } from "../components/SizingForm";
import { calculateSizing } from "../lib/sizingEngine";
import type { SizingInput, SizingResult } from "../lib/types";
import { validateSizingInput } from "../lib/validation";

const defaultInput: SizingInput = {
  dailyRawGb: 300,
  storageRatio: 0.462,
  retentionDays: 104,
  replicaCount: 1,
  safetyMargin: 0.3,
  effectiveDiskGbPerNode: 10240,
};

export default function Home() {
  const [input, setInput] = useState<SizingInput>(defaultInput);
  const [result, setResult] = useState<SizingResult>(() => calculateSizing(defaultInput));
  const [errors, setErrors] = useState<string[]>([]);

  useEffect(() => {
    const validation = validateSizingInput(input);
    setErrors(validation.errors);
    if (validation.valid) {
      setResult(calculateSizing(input));
    }
  }, [input]);

  return (
    <main>
      <header className="page-header">
        <h1>Elastic Size Calculator</h1>
        <p>v0.1 spreadsheet MVP</p>
      </header>
      <p className="lead">
        구글 스프레드시트 계산식 수준으로 단순화한 Elasticsearch 저장 용량 계산기입니다.
      </p>
      {errors.length > 0 ? (
        <div className="error">
          <strong>입력값을 확인해 주세요.</strong>
          <ul>
            {errors.map((error) => (
              <li key={error}>{error}</li>
            ))}
          </ul>
        </div>
      ) : null}
      <div className="layout">
        <SizingForm value={input} onChange={setInput} />
        <ResultSummary input={input} result={result} />
      </div>
    </main>
  );
}
