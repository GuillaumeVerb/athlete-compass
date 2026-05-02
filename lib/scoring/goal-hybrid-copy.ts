import type { PrimaryGoal } from "@/lib/types";
import { goalPillarWeights, type PillarKey } from "./goal-weights";

const GOAL_LABEL_FR: Record<PrimaryGoal, string> = {
  crossfit: "CrossFit / hybride",
  hyrox: "HYROX",
  recomp: "Recomposition",
  endurance: "Endurance",
  strength_aesthetics: "Force & esthétique",
};

const PILLAR_LABEL_FR: Record<PillarKey, string> = {
  force: "Force",
  cardioIntense: "Cardio intense",
  endurance: "Endurance",
  muscularEndurance: "Résistance musculaire",
  coreCarry: "Core & carry",
};

/** Top poids théoriques (objectif) pour affichage UI — pas renormé aux piliers manquants */
export function topGoalWeightsForDisplay(
  goal: PrimaryGoal,
  limit = 3,
): { key: PillarKey; label: string; weightPct: number }[] {
  const w = goalPillarWeights(goal);
  return (Object.keys(w) as PillarKey[])
    .map((key) => ({
      key,
      label: PILLAR_LABEL_FR[key],
      weightPct: Math.round(w[key] * 100),
    }))
    .sort((a, b) => b.weightPct - a.weightPct)
    .slice(0, limit);
}

export function goalLabelFr(goal: PrimaryGoal): string {
  return GOAL_LABEL_FR[goal];
}
