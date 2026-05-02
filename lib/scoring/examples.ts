/**
 * Exemples de scores calculés — utile en dev (import ponctuel).
 * @example import { EXAMPLE_SCORES } from '@/lib/scoring/examples'
 */
import { DEMO_PERFORMANCE, DEMO_PROFILE } from "@/lib/mock-data";
import { computeScoreResult } from "@/lib/scoring";

export const EXAMPLE_SCORES = {
  demo: computeScoreResult(DEMO_PROFILE, DEMO_PERFORMANCE),
};
