import type { Sex } from "@/lib/types";
import { clamp } from "./utils";

function ratioScore(ratio: number, tiers: [number, number][]): number {
  if (ratio <= tiers[0][0]) return tiers[0][1];
  for (let i = 0; i < tiers.length - 1; i++) {
    const [r0, s0] = tiers[i];
    const [r1, s1] = tiers[i + 1];
    if (ratio >= r0 && ratio <= r1) {
      const t = (ratio - r0) / (r1 - r0);
      return clamp(s0 + t * (s1 - s0));
    }
  }
  const last = tiers[tiers.length - 1];
  return clamp(last[1] + (ratio - last[0]) * 12);
}

/** Seuils relatifs — prompt 03 (homme), ajustement léger femme */
export function scoreFrontSquatRatio(ratio: number, sex: Sex): number {
  const adj = sex === "femme" ? -0.06 : 0;
  const r = ratio + adj;
  const tiers: [number, number][] = [
    [0.6, 35],
    [0.8, 50],
    [1.0, 65],
    [1.2, 78],
    [1.4, 90],
    [1.6, 98],
  ];
  return ratioScore(r, tiers);
}

export function scoreOhpRatio(ratio: number, sex: Sex): number {
  const adj = sex === "femme" ? -0.05 : 0;
  const r = ratio + adj;
  const tiers: [number, number][] = [
    [0.35, 35],
    [0.45, 50],
    [0.55, 65],
    [0.7, 80],
    [0.8, 90],
    [0.9, 98],
  ];
  return ratioScore(r, tiers);
}

export function scoreDeadliftRatio(ratio: number, sex: Sex): number {
  const adj = sex === "femme" ? -0.1 : 0;
  const r = ratio + adj;
  const tiers: [number, number][] = [
    [1.0, 35],
    [1.25, 50],
    [1.5, 65],
    [1.8, 80],
    [2.0, 90],
    [2.2, 98],
  ];
  return ratioScore(r, tiers);
}

export function forceScore(input: {
  weightKg: number;
  sex: Sex;
  frontSquat5?: number;
  ohp5?: number;
  deadlift5?: number;
}): number | null {
  const w = input.weightKg;
  if (!w) return null;
  const parts: number[] = [];
  if (input.frontSquat5 && input.frontSquat5 > 0) {
    parts.push(scoreFrontSquatRatio(input.frontSquat5 / w, input.sex));
  }
  if (input.ohp5 && input.ohp5 > 0) {
    parts.push(scoreOhpRatio(input.ohp5 / w, input.sex));
  }
  if (input.deadlift5 && input.deadlift5 > 0) {
    parts.push(scoreDeadliftRatio(input.deadlift5 / w, input.sex));
  }
  if (parts.length === 0) return null;
  return Math.round(parts.reduce((a, b) => a + b, 0) / parts.length);
}
