import type { ReadinessInput } from "@/lib/scoring/readiness";
import type { UserProfile } from "@/lib/types";
import { loadDailyActivityStore, todayLocalDateKey } from "@/lib/daily/daily-activity-storage";

/** Ajoute pas du jour + objectif au readiness si renseignés pour la date locale courante. */
export function enrichReadinessWithDailySteps(
  base: ReadinessInput,
  profile: UserProfile,
): ReadinessInput {
  const store = loadDailyActivityStore(profile);
  const day = todayLocalDateKey();
  const steps = store.stepsByDay[day];
  if (steps == null) return base;
  return {
    ...base,
    stepsToday: steps,
    stepsGoal: store.stepsGoal,
  };
}
