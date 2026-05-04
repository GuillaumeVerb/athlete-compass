import { describe, expect, it } from "vitest";
import { DEMO_PERFORMANCE, DEMO_PROFILE } from "@/lib/mock-data";
import { computeScoreResult } from "@/lib/scoring";

describe("computeScoreResult (fixtures démo)", () => {
  it("produit un résultat cohérent pour profil + perfs démo", () => {
    const r = computeScoreResult(DEMO_PROFILE, DEMO_PERFORMANCE);
    expect(r.hybridScore).toBeGreaterThan(0);
    expect(r.hybridScore).toBeLessThanOrEqual(100);
    expect(r.reliabilityPct).toBeGreaterThan(0);
    expect(r.profileLabel.length).toBeGreaterThan(0);
    expect(r.limiter.length).toBeGreaterThan(0);
    expect(r.goals4Weeks.length).toBeGreaterThan(0);
  });
});
