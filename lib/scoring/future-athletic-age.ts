import type { ScoreResult } from "@/lib/types";

export type FutureAthleticAgeConfidence = "low" | "medium" | "high";

export type FutureAthleticAgeResult = {
  currentAthleticAge: number;
  projectedAthleticAge: number;
  improvementPotential: number;
  requiredMilestones: string[];
  confidence: FutureAthleticAgeConfidence;
  explanation: string;
};

export function computeFutureAthleticAge(result: ScoreResult): FutureAthleticAgeResult {
  const current = result.athleticAge;
  const gap = Math.min(6, Math.max(1, Math.round((100 - result.hybridScore) / 18)));
  const projected = Math.max(current - gap, Math.round(result.realAge - 8));
  const milestones = [
    ...result.goals4Weeks.slice(0, 3),
    "Refaire un bilan partiel à J+14 pour ajuster les charges.",
  ];
  const confidence: FutureAthleticAgeConfidence =
    result.reliabilityPct >= 60 ? "medium" : "low";

  return {
    currentAthleticAge: current,
    projectedAthleticAge: projected,
    improvementPotential: current - projected,
    requiredMilestones: milestones,
    confidence,
    explanation:
      "Projection indicative sur 4 à 8 semaines si tu tiens le plan minimal et la récupération. Ce n’est pas une mesure biologique.",
  };
}
