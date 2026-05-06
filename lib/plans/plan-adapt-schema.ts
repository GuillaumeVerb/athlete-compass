import { z } from "zod";
import { isUuid } from "@/lib/uuid";
import { checkoutSnapshotBodySchema } from "@/lib/purchase/snapshot-schema";

/** Corps POST `/api/plan/adapt` — régénération avec biais récup (V4). */
export const postPlanAdaptSchema = checkoutSnapshotBodySchema.extend({
  clientSyncId: z.string().refine(isUuid, "clientSyncId invalide").optional(),
  previousPlanInstanceId: z.string().refine(isUuid, "previousPlanInstanceId invalide").optional(),
});

export type PostPlanAdaptBody = z.infer<typeof postPlanAdaptSchema>;
