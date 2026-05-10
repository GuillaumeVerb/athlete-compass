import type { PerformanceInput } from "@/lib/types";
import type { PerformanceTestKey } from "@/lib/tests/test-protocols";
import type { SessionKind } from "@/lib/plans/plan-types";

/** Tests `/performances` les plus alignés avec chaque type de séance (aperçu V1). */
const KEYS_BY_KIND: Record<SessionKind, readonly PerformanceTestKey[]> = {
  force_upper: ["pullups", "benchPress5", "ohp5", "tbarRow10", "dipsStrict"],
  force_lower: ["backSquat3", "frontSquat5", "deadlift5", "bulgarianSplitSquat8", "boxJumpMaxCm"],
  zone2: ["row2k", "run5k", "bikeErg2k", "skiErg2k", "run10k"],
  metcon_short: ["burpees50", "wallBall150", "echoBike30cal", "row1k", "airSquat100"],
  hybrid_core: ["farmerCarry", "sandbagCarry", "sledCarry", "hollowHold", "lSitHold"],
  test_retest: ["row1k", "skiErg500", "run400m", "bikeErg1k"],
  recovery_active: [],
};

export function defaultPerformanceKeysForSessionKind(
  kind: SessionKind,
): PerformanceTestKey[] {
  return [...KEYS_BY_KIND[kind]];
}
