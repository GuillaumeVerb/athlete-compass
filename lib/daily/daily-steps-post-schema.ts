import { z } from "zod";

export const postDailyStepsBodySchema = z.object({
  day: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  steps: z.number().int().min(0).max(300_000),
  stepsGoal: z.number().int().min(2000).max(80_000),
});

export type PostDailyStepsBody = z.infer<typeof postDailyStepsBodySchema>;
