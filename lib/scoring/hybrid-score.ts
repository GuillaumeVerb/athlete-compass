import type { PrimaryGoal, ScoreBreakdown } from "@/lib/types";
import { goalPillarWeights, type PillarKey } from "./goal-weights";

/** Hybrid pondéré par objectif ; piliers absents exclus (poids renormalisés). */
export function weightedHybridScore(
  breakdown: ScoreBreakdown,
  goal: PrimaryGoal,
): number {
  const w = goalPillarWeights(goal);
  let num = 0;
  let den = 0;
  for (const k of Object.keys(w) as PillarKey[]) {
    const v = breakdown[k];
    if (v != null) {
      num += v * w[k];
      den += w[k];
    }
  }
  if (den === 0) return 0;
  return Math.round(num / den);
}
