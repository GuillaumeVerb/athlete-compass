import type { PerformanceInput } from "@/lib/types";

/** Query sur `/performances` pour faire défiler et mettre en avant un champ. */
export const PERF_FOCUS_QUERY = "focus";

export function performancesHrefFocused(key: keyof PerformanceInput): string {
  return `/performances?${PERF_FOCUS_QUERY}=${encodeURIComponent(key)}`;
}
