import type { PlanWeek } from "@/lib/plans/plan-types";

/** Validation légère pour JSON / API (4 semaines, sessions présentes). */
export function parsePlanWeeksPayload(value: unknown): PlanWeek[] | null {
  if (!Array.isArray(value) || value.length !== 4) return null;
  for (const item of value) {
    if (!item || typeof item !== "object") return null;
    const w = item as Record<string, unknown>;
    if (typeof w.week !== "number") return null;
    if (!Array.isArray(w.sessions)) return null;
    for (const s of w.sessions) {
      if (!s || typeof s !== "object") return null;
      const st = s as Record<string, unknown>;
      if (typeof st.kind !== "string") return null;
    }
  }
  return value as PlanWeek[];
}
