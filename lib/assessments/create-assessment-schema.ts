import { z } from "zod";
import { checkoutSnapshotBodySchema } from "@/lib/purchase/snapshot-schema";

/** Corps POST `/api/assessments` — même snapshot que checkout + métadonnées V3. */
export const createAssessmentBodySchema = checkoutSnapshotBodySchema.extend({
  source: z.enum(["manual", "retest_30d", "import"]).optional(),
  previousAssessmentId: z.string().uuid().optional(),
});

export type CreateAssessmentBody = z.infer<typeof createAssessmentBodySchema>;
