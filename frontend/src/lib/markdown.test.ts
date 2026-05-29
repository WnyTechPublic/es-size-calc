import { describe, expect, it } from "vitest";

import { buildSizingMarkdown } from "./markdown";

describe("buildSizingMarkdown", () => {
  it("includes required MVP sections and profile evidence", () => {
    const markdown = buildSizingMarkdown(
      {
        projectName: "300GB SIEM",
        customerName: "고객명",
        workloadType: "SIEM",
        dailyIngestValue: 300,
        unit: "GB",
        storageProfileId: "fortigate-raw-parsed-recommended",
        replicaCount: 1,
        safetyMargin: 0.3,
        tiers: [],
      },
      {
        dailyPrimaryGb: 138.6,
        storageProfile: {
          id: "fortigate-raw-parsed-recommended",
          name: "Fortigate 원문+파싱 보관",
          labCase: "ldb.syn.zstd.p2",
          storageRatio: 0.462,
        },
        tiers: [
          {
            name: "warm",
            retentionDays: 90,
            primaryGb: 12474,
            withReplicaGb: 24948,
            withSafetyMarginGb: 32432.4,
            requiredNodes: 4,
            warnings: [],
          },
        ],
        totalWithSafetyMarginGb: 32432.4,
        totalRequiredNodes: 4,
        warnings: [],
      },
    );

    expect(markdown).toMatch(/## 산정 케이스 요약/);
    expect(markdown).toMatch(/## Storage Profile 근거/);
    expect(markdown).toMatch(/ldb\.syn\.zstd\.p2/);
    expect(markdown).toMatch(/32432\.40 GB \(31\.67 TB\)/);
  });
});
