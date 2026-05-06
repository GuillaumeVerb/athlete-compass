import { z } from "zod";
import { isUuid } from "@/lib/uuid";

export const planWeekFatigueSchema = z.enum(["low", "ok", "high"]);

export const postPlanWeekFeedbackSchema = z.object({
  clientSyncId: z.string().refine(isUuid, "clientSyncId invalide"),
  fingerprint: z.string().min(1, "fingerprint requis"),
  weekIndex: z.number().int().min(1).max(4),
  fatigue: planWeekFatigueSchema,
  sessionsCompleted: z.number().int().min(0).max(50).optional(),
  note: z.string().max(500).optional(),
  planInstanceId: z.string().refine(isUuid, "planInstanceId invalide").optional(),
});

export type PostPlanWeekFeedbackBody = z.infer<typeof postPlanWeekFeedbackSchema>;
