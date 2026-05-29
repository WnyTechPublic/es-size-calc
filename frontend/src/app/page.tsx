"use client";

import { useEffect, useMemo, useState } from "react";

import { ResultSummary } from "../components/ResultSummary";
import { SizingForm } from "../components/SizingForm";
import { calculateSizing } from "../lib/sizingEngine";
import { STORAGE_PROFILES } from "../lib/storageProfiles";
import type { SizingInput, SizingResult } from "../lib/types";
import { validateSizingInput } from "../lib/validation";

const defaultInput: SizingInput = {
  projectName: "300GB SIEM",
  customerName: "고객명",
  workloadType: "SIEM",
  dailyIngestValue: 300,
  unit: "GB",
  storageProfileId: "fortigate-raw-parsed-recommended",
  replicaCount: 1,
  safetyMargin: 0.3,
  tiers: [
    { name: "hot", retentionDays: 14, effectiveDiskGbPerNode: 5120 },
    { name: "warm", retentionDays: 90, effectiveDiskGbPerNode: 10240 },
    { name: "cold", retentionDays: 0, effectiveDiskGbPerNode: 10240 },
  ],
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

  const selectedProfile = useMemo(
    () => STORAGE_PROFILES.find((profile) => profile.id === input.storageProfileId),
    [input.storageProfileId],
  );

  return (
    <main>
      <header className="page-header">
        <h1>Elastic Size Calculator</h1>
        <p>v0.1 MVP</p>
      </header>
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
        <SizingForm value={input} profiles={STORAGE_PROFILES} onChange={setInput} />
        <ResultSummary input={input} result={result} />
      </div>
      {selectedProfile ? (
        <section className="panel profile-note">
          <h2>선택된 Profile</h2>
          <p>
            {selectedProfile.group} / {selectedProfile.description}
          </p>
        </section>
      ) : null}
    </main>
  );
}
