import type { Sex } from "@/lib/types";
import { clamp, piecewiseScore } from "./utils";

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

/** Back squat ×3 — courbe proche du front, léger bonus de plafond. */
export function scoreBackSquatRatio(ratio: number, sex: Sex): number {
  const adj = sex === "femme" ? -0.07 : 0;
  const r = ratio + adj;
  const tiers: [number, number][] = [
    [0.75, 38],
    [0.95, 52],
    [1.15, 66],
    [1.35, 78],
    [1.55, 88],
    [1.75, 96],
    [1.95, 99],
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

/** T-bar row ×10 — ratio charge / poids de corps (tirage horizontal). */
export function scoreTbarRowRatio(ratio: number, sex: Sex): number {
  const adj = sex === "femme" ? -0.08 : 0;
  const r = ratio + adj;
  const tiers: [number, number][] = [
    [0.45, 35],
    [0.58, 48],
    [0.72, 60],
    [0.88, 74],
    [1.02, 85],
    [1.18, 95],
  ];
  return ratioScore(r, tiers);
}

/** Développé couché ×5 — ratio charge / poids de corps. */
export function scoreBenchPressRatio(ratio: number, sex: Sex): number {
  const adj = sex === "femme" ? -0.08 : 0;
  const r = ratio + adj;
  const tiers: [number, number][] = [
    [0.5, 38],
    [0.65, 52],
    [0.8, 65],
    [0.95, 78],
    [1.1, 88],
    [1.25, 96],
  ];
  return ratioScore(r, tiers);
}

/** Bulgarian split squat — somme des deux haltères / poids de corps (8 reps / jambe). */
export function scoreBulgarianSplitRatio(ratio: number, sex: Sex): number {
  const adj = sex === "femme" ? -0.06 : 0;
  const r = ratio + adj;
  const tiers: [number, number][] = [
    [0.4, 35],
    [0.52, 48],
    [0.65, 60],
    [0.78, 72],
    [0.92, 84],
    [1.05, 93],
  ];
  return ratioScore(r, tiers);
}

/** Box jump hauteur max (cm) — plus haut = mieux. */
export function scoreBoxJumpMaxCm(cm: number, sex: Sex): number {
  const h = cm + (sex === "femme" ? 5 : 0);
  const pts: [number, number][] = [
    [52, 42],
    [60, 55],
    [68, 68],
    [76, 80],
    [86, 90],
    [96, 98],
  ];
  return piecewiseScore(h, pts, false);
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
  backSquat3?: number;
  bulgarianSplitSquat8?: number;
  benchPress5?: number;
  ohp5?: number;
  tbarRow10?: number;
  deadlift5?: number;
  boxJumpMaxCm?: number;
}): number | null {
  const w = input.weightKg;
  if (!w) return null;
  const parts: number[] = [];
  if (input.frontSquat5 && input.frontSquat5 > 0) {
    parts.push(scoreFrontSquatRatio(input.frontSquat5 / w, input.sex));
  }
  if (input.backSquat3 && input.backSquat3 > 0) {
    parts.push(scoreBackSquatRatio(input.backSquat3 / w, input.sex));
  }
  if (input.bulgarianSplitSquat8 && input.bulgarianSplitSquat8 > 0) {
    parts.push(
      scoreBulgarianSplitRatio(input.bulgarianSplitSquat8 / w, input.sex),
    );
  }
  if (input.benchPress5 && input.benchPress5 > 0) {
    parts.push(scoreBenchPressRatio(input.benchPress5 / w, input.sex));
  }
  if (input.ohp5 && input.ohp5 > 0) {
    parts.push(scoreOhpRatio(input.ohp5 / w, input.sex));
  }
  if (input.tbarRow10 && input.tbarRow10 > 0) {
    parts.push(scoreTbarRowRatio(input.tbarRow10 / w, input.sex));
  }
  if (input.deadlift5 && input.deadlift5 > 0) {
    parts.push(scoreDeadliftRatio(input.deadlift5 / w, input.sex));
  }
  if (input.boxJumpMaxCm != null && input.boxJumpMaxCm > 0) {
    parts.push(scoreBoxJumpMaxCm(input.boxJumpMaxCm, input.sex));
  }
  if (parts.length === 0) return null;
  return Math.round(parts.reduce((a, b) => a + b, 0) / parts.length);
}
