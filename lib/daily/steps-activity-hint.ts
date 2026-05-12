import type { TrainingDebtActivityHint } from "@/lib/scoring/training-debt";

export function activityHintFromStepsStore(
  stepsByDay: Record<string, number>,
  stepsGoal: number,
  day: string,
): TrainingDebtActivityHint | undefined {
  const steps = stepsByDay[day];
  if (steps == null || stepsGoal <= 0) return undefined;
  return { stepsRatio: steps / stepsGoal };
}
