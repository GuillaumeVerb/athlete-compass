import type { Sex } from "@/lib/types";
import { scoreRow2k, scoreRun5k } from "./cardio";
import { parseMmSs } from "./parse";

export function enduranceScore(
  perf: { row2k?: string; run5k?: string },
  sex: Sex,
): number | null {
  const s2 = parseMmSs(perf.row2k);
  const r5 = parseMmSs(perf.run5k);
  if (s2 == null && r5 == null) return null;
  const parts: number[] = [];
  if (s2 != null) parts.push(scoreRow2k(s2, sex));
  if (r5 != null) parts.push(scoreRun5k(r5, sex));
  return Math.round(parts.reduce((a, b) => a + b, 0) / parts.length);
}
