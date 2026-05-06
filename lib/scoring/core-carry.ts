import type { Sex } from "@/lib/types";
import { parseMmSs, parseFarmerCarry } from "./parse";
import { piecewiseScore } from "./utils";

export function scoreFarmerCarry(
  meters: number,
  seconds: number,
  sex: Sex,
): number {
  if (seconds <= 0 || meters <= 0) return 40;
  const speed = meters / seconds;
  const adj = sex === "femme" ? 0.02 : 0;
  const s = speed + adj;
  if (s >= 1.35) return 92;
  if (s >= 1.2) return 82;
  if (s >= 1.05) return 70;
  if (s >= 0.9) return 58;
  if (s >= 0.75) return 45;
  return 32;
}

/** Hollow hold — plus long = mieux (prompt 03) */
export function scoreHollowHold(seconds: number, sex: Sex): number {
  const t = seconds + (sex === "femme" ? 8 : 0);
  const pts: [number, number][] = [
    [20, 35],
    [30, 50],
    [45, 65],
    [60, 80],
    [90, 95],
  ];
  return piecewiseScore(t, pts, false);
}

/** L-sit — plus long = mieux (parallèles). */
export function scoreLSitHold(seconds: number, sex: Sex): number {
  const t = seconds + (sex === "femme" ? 5 : 0);
  const pts: [number, number][] = [
    [8, 35],
    [15, 52],
    [25, 68],
    [35, 80],
    [45, 90],
    [60, 97],
  ];
  return piecewiseScore(t, pts, false);
}

export function coreCarryScore(
  perf: {
    farmerCarry?: string;
    sandbagCarry?: string;
    sledCarry?: string;
    hollowHold?: string;
    lSitHold?: string;
  },
  sex: Sex,
): number | null {
  const parts: number[] = [];
  const carries: (
    | "farmerCarry"
    | "sandbagCarry"
    | "sledCarry"
  )[] = ["farmerCarry", "sandbagCarry", "sledCarry"];
  for (const key of carries) {
    const fc = parseFarmerCarry(perf[key]);
    if (fc) parts.push(scoreFarmerCarry(fc.meters, fc.seconds, sex));
  }
  const h = parseMmSs(perf.hollowHold);
  if (h != null) parts.push(scoreHollowHold(h, sex));
  const ls = parseMmSs(perf.lSitHold);
  if (ls != null) parts.push(scoreLSitHold(ls, sex));
  if (parts.length === 0) return null;
  return Math.round(parts.reduce((a, b) => a + b, 0) / parts.length);
}
