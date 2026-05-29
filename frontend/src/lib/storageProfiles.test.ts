import { describe, expect, it } from "vitest";

import { STORAGE_PROFILES } from "./storageProfiles";

describe("STORAGE_PROFILES", () => {
  it("contains the 9 MVP storage profiles", () => {
    expect(STORAGE_PROFILES).toHaveLength(9);
  });

  it("contains the fixed goal profile ratios", () => {
    expect(profile("fortigate-raw-parsed-recommended").labCase).toBe("ldb.syn.zstd.p2");
    expect(profile("fortigate-raw-parsed-recommended").storageRatio).toBe(0.462);
    expect(profile("web-parsed-only").storageRatio).toBe(0.254);
    expect(profile("snmp-tsds-parsed-only").labCase).toBe("tsds.syn.zstd.p3");
    expect(profile("snmp-tsds-parsed-only").storageRatio).toBe(0.335);
  });

  it("marks parsed-only and TSDS profiles for warnings", () => {
    expect(profile("web-parsed-only").flags).toContain("parsed_only");
    expect(profile("snmp-tsds-parsed-only").flags).toEqual(["parsed_only", "tsds"]);
  });
});

function profile(id: string) {
  const found = STORAGE_PROFILES.find((candidate) => candidate.id === id);
  if (!found) throw new Error(`Missing profile ${id}`);
  return found;
}
