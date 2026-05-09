import { describe, expect, it } from "vitest";
import { DEMO_PERFORMANCE, DEMO_PROFILE } from "@/lib/mock-data";
import { computeScoreResult } from "@/lib/scoring";
import type { ScoreResult } from "@/lib/types";
import { computeFutureAthleticAge } from "@/lib/scoring/future-athletic-age";

function minimalResult(over: Partial<ScoreResult>): ScoreResult {
  const base = computeScoreResult(DEMO_PROFILE, DEMO_PERFORMANCE);
  return { ...base, ...over };
}

describe("computeFutureAthleticAge", () => {
  it("projette un âge ≤ à l’âge athlétique actuel et ≥ à un plancher (réel − 8)", () => {
    const r = computeScoreResult(DEMO_PROFILE, DEMO_PERFORMANCE);
    const f = computeFutureAthleticAge(r);
    expect(f.currentAthleticAge).toBe(r.athleticAge);
    expect(f.projectedAthleticAge).toBeLessThanOrEqual(f.currentAthleticAge);
    expect(f.projectedAthleticAge).toBeGreaterThanOrEqual(r.realAge - 8);
    expect(f.improvementPotential).toBe(f.currentAthleticAge - f.projectedAthleticAge);
    expect(f.improvementPotential).toBeGreaterThanOrEqual(0);
  });

  it("rappelle la formulation prudente obligatoire", () => {
    const r = computeScoreResult(DEMO_PROFILE, DEMO_PERFORMANCE);
    const f = computeFutureAthleticAge(r);
    expect(f.explanation).toMatch(/mesure biologique/i);
    expect(f.requiredMilestones.length).toBeGreaterThan(0);
    expect(f.requiredMilestones.some((m) => m.includes("J+14") || m.includes("bilan"))).toBe(true);
  });

  it("confiance basse si fiabilité du score < 60 %", () => {
    const r = minimalResult({ reliabilityPct: 45 });
    const f = computeFutureAthleticAge(r);
    expect(f.confidence).toBe("low");
  });

  it("confiance medium si fiabilité ≥ 60 %", () => {
    const r = minimalResult({ reliabilityPct: 72 });
    const f = computeFutureAthleticAge(r);
    expect(f.confidence).toBe("medium");
  });

  it("reprend jusqu’à 3 objectifs 4 semaines dans les jalons", () => {
    const goals = ["A", "B", "C", "D"];
    const r = minimalResult({ goals4Weeks: goals });
    const f = computeFutureAthleticAge(r);
    expect(f.requiredMilestones.slice(0, 3)).toEqual(["A", "B", "C"]);
  });
});
