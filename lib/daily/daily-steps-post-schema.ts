import { z } from "zod";

const postDailyStepsBodyInputSchema = z.object({
  day: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  /** Omis ou `null` = enregistrer seulement l’objectif pour ce jour (après migration SQL). */
  steps: z.union([z.number().int().min(0).max(300_000), z.null()]).optional(),
  stepsGoal: z.number().int().min(2000).max(80_000),
});

export const postDailyStepsBodySchema = postDailyStepsBodyInputSchema.transform((d) => ({
  day: d.day,
  steps: d.steps === undefined ? null : d.steps,
  stepsGoal: d.stepsGoal,
}));

export type PostDailyStepsBody = z.output<typeof postDailyStepsBodySchema>;
