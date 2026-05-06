import type { Sex } from "@/lib/types";
import {
  scoreBikeErg1k,
  scoreBikeErg2k,
  scoreRow2k,
  scoreRun1kIncline,
  scoreRun5k,
  scoreRun10k,
  scoreSkiErg2k,
  scoreSwim400m,
} from "./cardio";
import { parseMmSs } from "./parse";

export function enduranceScore(
  perf: {
    row2k?: string;
    run5k?: string;
    run10k?: string;
    run1kIncline?: string;
    bikeErg1k?: string;
    bikeErg2k?: string;
    skiErg2k?: string;
    swim400m?: string;
  },
  sex: Sex,
): number | null {
  const s2 = parseMmSs(perf.row2k);
  const r5 = parseMmSs(perf.run5k);
  const r10 = parseMmSs(perf.run10k);
  const r1i = parseMmSs(perf.run1kIncline);
  const b1 = parseMmSs(perf.bikeErg1k);
  const b2 = parseMmSs(perf.bikeErg2k);
  const sk2 = parseMmSs(perf.skiErg2k);
  const sw = parseMmSs(perf.swim400m);
  if (
    s2 == null &&
    r5 == null &&
    r10 == null &&
    r1i == null &&
    b1 == null &&
    b2 == null &&
    sk2 == null &&
    sw == null
  )
    return null;
  const parts: number[] = [];
  if (s2 != null) parts.push(scoreRow2k(s2, sex));
  if (r5 != null) parts.push(scoreRun5k(r5, sex));
  if (r10 != null) parts.push(scoreRun10k(r10, sex));
  if (r1i != null) parts.push(scoreRun1kIncline(r1i, sex));
  if (b1 != null) parts.push(scoreBikeErg1k(b1, sex));
  if (b2 != null) parts.push(scoreBikeErg2k(b2, sex));
  if (sk2 != null) parts.push(scoreSkiErg2k(sk2, sex));
  if (sw != null) parts.push(scoreSwim400m(sw, sex));
  return Math.round(parts.reduce((a, b) => a + b, 0) / parts.length);
}
