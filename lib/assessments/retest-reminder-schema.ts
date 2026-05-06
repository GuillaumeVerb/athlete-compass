import { z } from "zod";

/** Corps POST `/api/retest-reminders` — rappel opt-in e-mail (V3). */
export const createRetestReminderBodySchema = z.object({
  anchorAssessmentId: z.string().uuid(),
  dueInDays: z.coerce.number().int().min(1).max(365).optional().default(30),
});

export type CreateRetestReminderBody = z.infer<typeof createRetestReminderBodySchema>;
