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

/** Dips parallèles stricts — set max (échelle un peu au-dessus des pompes). */
export function scoreDipsStrict(reps: number, sex: Sex): number {
  const r = sex === "femme" ? reps + 2 : reps;
  if (r <= 0) return 25;
  if (r <= 5) return 42;
  if (r <= 10) return 58;
  if (r <= 15) return 72;
  if (r <= 22) return 84;
  if (r <= 30) return 92;
  return clamp(92 + (r - 30) * 0.35);
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

/** Toes-to-bar stricts — set max reps (échelle plus dure que tractions). */
export function scoreToesToBar(reps: number, sex: Sex): number {
  const r = sex === "femme" ? reps + 1 : reps;
  if (r <= 0) return 25;
  if (r <= 3) return 40;
  if (r <= 6) return 55;
  if (r <= 10) return 70;
  if (r <= 15) return 82;
  if (r <= 20) return 90;
  return clamp(90 + (r - 20) * 0.45);
}

/** Wall ball 150 — plus bas = mieux (charges standard protocole). */
export function scoreWallBall150(seconds: number, sex: Sex): number {
  const t = seconds + (sex === "femme" ? 45 : 0);
  const pts: [number, number][] = [
    [270, 98],
    [330, 88],
    [390, 75],
    [450, 60],
    [540, 45],
    [660, 30],
  ];
  return piecewiseScore(t, pts, true);
}

/** 100 air squats — plus bas = mieux. */
export function scoreAirSquat100(seconds: number, sex: Sex): number {
  const t = seconds + (sex === "femme" ? 15 : 0);
  const pts: [number, number][] = [
    [180, 96],
    [210, 88],
    [240, 76],
    [270, 62],
    [330, 45],
    [390, 32],
  ];
  return piecewiseScore(t, pts, true);
}

/** Chipper thrusters + burpees + DU — plus bas = mieux. */
export function scoreHybridDbChipper(seconds: number, sex: Sex): number {
  const t = seconds + (sex === "femme" ? 40 : 0);
  const pts: [number, number][] = [
    [360, 98],
    [420, 88],
    [480, 78],
    [540, 65],
    [630, 50],
    [720, 38],
    [900, 25],
  ];
  return piecewiseScore(t, pts, true);
}

export function scoreDoubleUnders1min(reps: number, sex: Sex): number {
  const r = sex === "femme" ? reps + 8 : reps;
  if (r <= 0) return 25;
  if (r <= 30) return 42;
  if (r <= 50) return 58;
  if (r <= 70) return 72;
  if (r <= 90) return 85;
  if (r <= 120) return 95;
  return clamp(95 + (r - 120) * 0.12);
}

export function scorePushupsStrict(reps: number, sex: Sex): number {
  const r = sex === "femme" ? reps + 3 : reps;
  if (r <= 0) return 25;
  if (r <= 8) return 40;
  if (r <= 15) return 55;
  if (r <= 22) return 68;
  if (r <= 30) return 80;
  if (r <= 40) return 90;
  return clamp(90 + (r - 40) * 0.35);
}

export function scoreRopeClimb2min(reps: number, sex: Sex): number {
  const r = sex === "femme" ? reps + 1 : reps;
  if (r <= 0) return 28;
  if (r <= 1) return 45;
  if (r <= 2) return 58;
  if (r <= 3) return 70;
  if (r <= 5) return 82;
  if (r <= 7) return 92;
  return clamp(92 + (r - 7) * 1.2);
}

export function scoreLunges2min(reps: number, sex: Sex): number {
  const r = sex === "femme" ? reps + 6 : reps;
  if (r <= 0) return 25;
  if (r <= 40) return 40;
  if (r <= 55) return 55;
  if (r <= 70) return 68;
  if (r <= 85) return 80;
  if (r <= 100) return 90;
  return clamp(90 + (r - 100) * 0.35);
}

/** HSPU stricts — set max (mur). */
export function scoreHspuStrict(reps: number, sex: Sex): number {
  const r = sex === "femme" ? reps + 1 : reps;
  if (r <= 0) return 25;
  if (r <= 3) return 42;
  if (r <= 6) return 58;
  if (r <= 10) return 72;
  if (r <= 15) return 84;
  if (r <= 20) return 92;
  return clamp(92 + (r - 20) * 0.4);
}

/** Muscle-ups stricts en 2 min (barre ou anneaux). */
export function scoreMuscleUp2min(reps: number, sex: Sex): number {
  const r = sex === "femme" ? reps : reps;
  if (r <= 0) return 25;
  if (r <= 2) return 45;
  if (r <= 4) return 58;
  if (r <= 6) return 70;
  if (r <= 9) return 82;
  if (r <= 12) return 90;
  return clamp(90 + (r - 12) * 0.55);
}

/** 100 kettlebell swings american — plus bas = mieux. */
export function scoreKbSwing100(seconds: number, sex: Sex): number {
  const t = seconds + (sex === "femme" ? 20 : 0);
  const pts: [number, number][] = [
    [210, 96],
    [240, 88],
    [270, 76],
    [300, 62],
    [360, 45],
    [420, 32],
  ];
  return piecewiseScore(t, pts, true);
}

export function muscularEnduranceScore(
  perf: {
    pullups?: number;
    dipsStrict?: number;
    hspuStrict?: number;
    muscleUp2min?: number;
    burpees50?: string;
    toesToBar?: number;
    wallBall150?: string;
    airSquat100?: string;
    hybridDbChipper?: string;
    doubleUnders1min?: number;
    pushupsStrict?: number;
    ropeClimb2min?: number;
    lunges2min?: number;
    kbSwing100?: string;
  },
  sex: Sex,
): number | null {
  const parts: number[] = [];
  if (perf.pullups != null && perf.pullups >= 0) {
    parts.push(scorePullupsStrict(perf.pullups, sex));
  }
  if (perf.dipsStrict != null && perf.dipsStrict >= 0) {
    parts.push(scoreDipsStrict(perf.dipsStrict, sex));
  }
  if (perf.hspuStrict != null && perf.hspuStrict >= 0) {
    parts.push(scoreHspuStrict(perf.hspuStrict, sex));
  }
  if (perf.muscleUp2min != null && perf.muscleUp2min >= 0) {
    parts.push(scoreMuscleUp2min(perf.muscleUp2min, sex));
  }
  const b = parseMmSs(perf.burpees50);
  if (b != null) parts.push(scoreBurpees50(b, sex));
  if (perf.toesToBar != null && perf.toesToBar >= 0) {
    parts.push(scoreToesToBar(perf.toesToBar, sex));
  }
  const wb = parseMmSs(perf.wallBall150);
  if (wb != null) parts.push(scoreWallBall150(wb, sex));
  const sq = parseMmSs(perf.airSquat100);
  if (sq != null) parts.push(scoreAirSquat100(sq, sex));
  const chip = parseMmSs(perf.hybridDbChipper);
  if (chip != null) parts.push(scoreHybridDbChipper(chip, sex));
  if (perf.doubleUnders1min != null && perf.doubleUnders1min >= 0) {
    parts.push(scoreDoubleUnders1min(perf.doubleUnders1min, sex));
  }
  if (perf.pushupsStrict != null && perf.pushupsStrict >= 0) {
    parts.push(scorePushupsStrict(perf.pushupsStrict, sex));
  }
  if (perf.ropeClimb2min != null && perf.ropeClimb2min >= 0) {
    parts.push(scoreRopeClimb2min(perf.ropeClimb2min, sex));
  }
  if (perf.lunges2min != null && perf.lunges2min >= 0) {
    parts.push(scoreLunges2min(perf.lunges2min, sex));
  }
  const kb = parseMmSs(perf.kbSwing100);
  if (kb != null) parts.push(scoreKbSwing100(kb, sex));
  if (parts.length === 0) return null;
  return Math.round(parts.reduce((a, b) => a + b, 0) / parts.length);
}
