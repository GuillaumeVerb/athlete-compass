import type { PerformanceInput, ScoreResult, UserProfile } from "@/lib/types";

/** Snapshot stocké en base au moment du checkout (recalcul serveur du score). */
export type ReportSnapshotV1 = {
  version: 1;
  profile: UserProfile;
  performance: PerformanceInput;
  result: ScoreResult;
  savedAt: string;
};
