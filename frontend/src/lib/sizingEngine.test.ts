import { describe, expect, it } from "vitest";

import {
  PARSED_ONLY_WARNING,
  REPLICA_MIN_NODE_WARNING,
  TSDS_WARNING,
  calculateSizing,
  normalizeIngestToGb,
} from "./sizingEngine";
import type { SizingInput } from "./types";

const baseInput: SizingInput = {
  projectName: "Case",
  customerName: "Customer",
  workloadType: "SIEM",
  dailyIngestValue: 100,
  unit: "GB",
  storageProfileId: "fortigate-raw-parsed-recommended",
  replicaCount: 1,
  safetyMargin: 0.3,
  tiers: [
    { name: "hot", retentionDays: 14, effectiveDiskGbPerNode: 1024 },
    { name: "warm", retentionDays: 0, effectiveDiskGbPerNode: 10240 },
    { name: "cold", retentionDays: 0, effectiveDiskGbPerNode: 10240 },
  ],
};

describe("calculateSizing", () => {
  it("matches the fixed 100GB/day calculation example", () => {
    const result = calculateSizing(baseInput);
    const hot = result.tiers.find((tier) => tier.name === "hot");

    expect(result.dailyPrimaryGb).toBe(46.2);
    expect(hot).toMatchObject({
      primaryGb: 646.8,
      withReplicaGb: 1293.6,
      withSafetyMarginGb: 1681.68,
      requiredNodes: 2,
    });
  });

  it("matches the fixed 300GB/day warm calculation example", () => {
    const result = calculateSizing({
      ...baseInput,
      dailyIngestValue: 300,
      tiers: [{ name: "warm", retentionDays: 90, effectiveDiskGbPerNode: 10240 }],
    });

    expect(result.dailyPrimaryGb).toBe(138.6);
    expect(result.tiers[0]).toMatchObject({
      primaryGb: 12474,
      withReplicaGb: 24948,
      withSafetyMarginGb: 32432.4,
      requiredNodes: 4,
    });
  });

  it("converts TB input to GB before applying the storage ratio", () => {
    expect(normalizeIngestToGb(1.5, "TB")).toBe(1536);
    expect(calculateSizing({ ...baseInput, dailyIngestValue: 1, unit: "TB" }).dailyPrimaryGb).toBe(
      473.09,
    );
  });

  it("does not double-apply replica or safety margin inside the storage profile ratio", () => {
    const result = calculateSizing({
      ...baseInput,
      dailyIngestValue: 100,
      replicaCount: 0,
      safetyMargin: 0,
    });

    expect(result.dailyPrimaryGb).toBe(46.2);
    expect(result.tiers[0].withReplicaGb).toBe(646.8);
    expect(result.tiers[0].withSafetyMarginGb).toBe(646.8);
  });

  it("excludes zero-retention tiers from totals", () => {
    const result = calculateSizing(baseInput);

    expect(result.tiers.find((tier) => tier.name === "warm")?.withSafetyMarginGb).toBe(0);
    expect(result.totalWithSafetyMarginGb).toBe(1681.68);
    expect(result.totalRequiredNodes).toBe(2);
  });

  it("emits parsed-only, TSDS, and replica minimum node warnings", () => {
    const parsed = calculateSizing({ ...baseInput, storageProfileId: "web-parsed-only" });
    const tsds = calculateSizing({ ...baseInput, storageProfileId: "snmp-tsds-parsed-only" });
    const replica = calculateSizing({
      ...baseInput,
      dailyIngestValue: 1,
      tiers: [{ name: "hot", retentionDays: 1, effectiveDiskGbPerNode: 1024 }],
    });

    expect(parsed.warnings).toContain(PARSED_ONLY_WARNING);
    expect(tsds.warnings).toEqual([PARSED_ONLY_WARNING, TSDS_WARNING]);
    expect(replica.tiers[0].warnings).toContain(REPLICA_MIN_NODE_WARNING);
  });
});
