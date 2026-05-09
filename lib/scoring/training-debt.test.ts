import { describe, expect, it } from "vitest";
import { DEMO_PROFILE } from "@/lib/mock-data";
import type { ScoreBreakdown, UserProfile } from "@/lib/types";
import { computeTrainingDebt } from "@/lib/scoring/training-debt";

const fullBreakdown = (over: Partial<ScoreBreakdown>): ScoreBreakdown => ({
  cardioIntense: 65,
  endurance: 65,
  force: 65,
  muscularEndurance: 65,
  coreCarry: 65,
  ...over,
});

describe("computeTrainingDebt", () => {
  it("readiness très bas + fréquence élevée → dette récupération", () => {
    const profile: UserProfile = { ...DEMO_PROFILE, frequency: "4-5" };
    const r = computeTrainingDebt(fullBreakdown({}), 32, profile);
    expect(r.primaryDebt).toBe("recovery");
    expect(["moderate", "high"]).toContain(r.severity);
    expect(r.avoidThisWeek.length).toBeGreaterThan(0);
  });

  it("fréquence 1–2 j / sem → ne force pas la branche récupération malgré readiness bas", () => {
    const profile: UserProfile = { ...DEMO_PROFILE, frequency: "1-2" };
    const r = computeTrainingDebt(fullBreakdown({ force: 30, endurance: 70 }), 32, profile);
    expect(r.primaryDebt).not.toBe("recovery");
    expect(r.primaryDebt).toBe("force");
  });

  it("contrainte jambes légères + endurance >> force → dette jambes", () => {
    const profile: UserProfile = {
      ...DEMO_PROFILE,
      constraints: ["light_legs"],
    };
    const b = fullBreakdown({ endurance: 82, force: 50 });
    const r = computeTrainingDebt(b, 72, profile);
    expect(r.primaryDebt).toBe("legs");
    expect(r.explanation.length).toBeGreaterThan(20);
  });

  it("piliers vides → cohérence / compléter le bilan", () => {
    const empty: ScoreBreakdown = {
      cardioIntense: null,
      endurance: null,
      force: null,
      muscularEndurance: null,
      coreCarry: null,
    };
    const r = computeTrainingDebt(empty, 80, DEMO_PROFILE);
    expect(r.primaryDebt).toBe("coherence");
    expect(r.severity).toBe("low");
  });

  it("pilier force le plus bas → dette force", () => {
    const b = fullBreakdown({ force: 35, endurance: 72 });
    const r = computeTrainingDebt(b, 70, DEMO_PROFILE);
    expect(r.primaryDebt).toBe("force");
    expect(r.recommendedCorrection.toLowerCase()).toContain("force");
  });
});
