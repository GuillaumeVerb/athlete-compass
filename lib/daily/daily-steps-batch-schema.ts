import { z } from "zod";
import { postDailyStepsBodySchema } from "@/lib/daily/daily-steps-post-schema";

export const postDailyStepsBatchBodySchema = z.object({
  rows: z.array(postDailyStepsBodySchema).min(1).max(90),
});

export type PostDailyStepsBatchBody = z.infer<typeof postDailyStepsBatchBodySchema>;
