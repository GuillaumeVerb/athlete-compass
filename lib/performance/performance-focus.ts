import type { PerformanceTestKey } from "@/lib/tests/test-protocols";

/** Query sur `/performances` pour faire défiler et mettre en avant un champ. */
export const PERF_FOCUS_QUERY = "focus";

export function performancesHrefFocused(key: PerformanceTestKey): string {
  return `/performances?${PERF_FOCUS_QUERY}=${encodeURIComponent(key)}`;
}
