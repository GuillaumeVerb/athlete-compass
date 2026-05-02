import type { PrimaryGoal } from "@/lib/types";

const TARGET: Record<PrimaryGoal, number> = {
  crossfit: 88,
  hyrox: 88,
  recomp: 85,
  endurance: 88,
  strength_aesthetics: 86,
};

/** Écart vs un plafond « haute perf » cohérent avec l’objectif */
export function computePerformanceGap(
  hybridScore: number,
  goal: PrimaryGoal,
): number {
  return Math.max(0, TARGET[goal] - hybridScore);
}
