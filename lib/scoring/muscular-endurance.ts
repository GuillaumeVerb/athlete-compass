import type { Sex } from "@/lib/types";
import { parseMmSs } from "./parse";
import { clamp, piecewiseScore } from "./utils";

/** Tractions strictes — paliers homme prompt 03 ; femme : -1 palier */
export function scorePullupsStrict(reps: number, sex: Sex): number {
  const r = sex === "femme" ? reps + 2 : reps;
  if (r <= 2) return 25;
  if (r <= 5) return 45;
  if (r <= 8) return 60;
  if (r <= 12) return 75;
  if (r <= 15) return 85;
  if (r <= 20) return 95;
  return clamp(95 + (r - 20) * 0.5);
}

/** 50 burpees — temps total secondes, plus bas = mieux (prompt 03 homme) */
export function scoreBurpees50(seconds: number, sex: Sex): number {
  const adj = sex === "femme" ? 45 : 0;
  const t = seconds + adj;
  const pts: [number, number][] = [
    [225, 98],
    [270, 90],
    [330, 80],
    [420, 65],
    [510, 50],
    [600, 35],
  ];
  return piecewiseScore(t, pts, true);
}

export function muscularEnduranceScore(
  perf: { pullups?: number; burpees50?: string },
  sex: Sex,
): number | null {
  const parts: number[] = [];
  if (perf.pullups != null && perf.pullups >= 0) {
    parts.push(scorePullupsStrict(perf.pullups, sex));
  }
  const b = parseMmSs(perf.burpees50);
  if (b != null) parts.push(scoreBurpees50(b, sex));
  if (parts.length === 0) return null;
  return Math.round(parts.reduce((a, b) => a + b, 0) / parts.length);
}
