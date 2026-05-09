import type { ReadinessInput } from "@/lib/scoring/readiness";

/** Données manuelles / démo pour le dashboard quotidien (pas d’API santé). */
export const MOCK_DAILY_WELLNESS: ReadinessInput = {
  sleepHours: 7.17,
  sleepQuality: 4,
  fatigue: 4,
  soreness: 3,
  motivation: 7,
  previousDayIntensity: "moderate",
  weeklyTrainingLoad: "normal",
};

export const MOCK_DAILY_ACTIVITY = {
  steps: 8900,
  stepsGoal: 10_000,
  recoveryPct: 68,
  recoveryLabel: "moyenne" as const,
};

export const MOCK_DAILY_ATHLETIC_SNAPSHOT = {
  /** Variation textuelle vs dernier bilan (démo). */
  athleticDeltaSinceLast: -1 as number,
  focusLine: "endurance longue + force relative",
};

export const MOCK_DAILY_TODAY = {
  do: [
    "35 à 45 min Zone 2",
    "8 min mobilité hanches / chevilles",
    "Pas de test maximal aujourd’hui",
  ],
  avoid: [
    "Burpees en volume élevé",
    "Escalier intense",
    "Intervalles rameur très durs",
    "Séance jambes lourde si fatigue > 6/10",
  ],
};
