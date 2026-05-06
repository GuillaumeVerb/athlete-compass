import type { PerformanceInput, Sex } from "@/lib/types";
import { parseMmSs } from "./parse";
import { piecewiseScore } from "./utils";

function sexOffsetSeconds(sex: Sex): number {
  if (sex === "femme") return 14;
  return 0;
}

/** Seuils homme prompt 03 ; léger offset femme sur le temps */
export function scoreRow1k(seconds: number, sex: Sex): number {
  const t = seconds - sexOffsetSeconds(sex);
  const pts: [number, number][] = [
    [190, 96],
    [200, 88],
    [210, 78],
    [220, 68],
    [235, 55],
    [255, 40],
  ];
  return piecewiseScore(t, pts, true);
}

export function scoreRow2k(seconds: number, sex: Sex): number {
  const t = seconds - sexOffsetSeconds(sex) * 2;
  const pts: [number, number][] = [
    [390, 98],
    [405, 92],
    [420, 85],
    [435, 76],
    [450, 68],
    [480, 55],
    [510, 40],
  ];
  return piecewiseScore(t, pts, true);
}

export function scoreRun5k(seconds: number, sex: Sex): number {
  const t = seconds - sexOffsetSeconds(sex) * 3;
  const pts: [number, number][] = [
    [1110, 98],
    [1200, 90],
    [1260, 84],
    [1380, 72],
    [1500, 60],
    [1620, 50],
    [1800, 35],
  ];
  return piecewiseScore(t, pts, true);
}

/** 1000 m BikeErg — temps total, plus bas = mieux (calibrage type Concept2). */
export function scoreBikeErg1k(seconds: number, sex: Sex): number {
  const t = seconds - (sex === "femme" ? 18 : 0);
  const pts: [number, number][] = [
    [105, 96],
    [120, 88],
    [135, 76],
    [155, 60],
    [180, 45],
    [210, 30],
  ];
  return piecewiseScore(t, pts, true);
}

export function scoreSkiErg500(seconds: number, sex: Sex): number {
  const t = seconds - (sex === "femme" ? 10 : 0);
  const pts: [number, number][] = [
    [92, 96],
    [102, 88],
    [115, 76],
    [130, 62],
    [150, 48],
    [175, 32],
  ];
  return piecewiseScore(t, pts, true);
}

/** 400 m — plus bas = mieux. */
export function scoreRun400m(seconds: number, sex: Sex): number {
  const t = seconds - (sex === "femme" ? 8 : 0);
  const pts: [number, number][] = [
    [50, 99],
    [58, 92],
    [68, 82],
    [78, 70],
    [90, 55],
    [105, 40],
  ];
  return piecewiseScore(t, pts, true);
}

/** 10 km course — plus bas = mieux. */
export function scoreRun10k(seconds: number, sex: Sex): number {
  const t = seconds - (sex === "femme" ? 120 : 0);
  const pts: [number, number][] = [
    [1680, 98],
    [1860, 90],
    [2100, 80],
    [2400, 68],
    [2700, 55],
    [3000, 42],
    [3300, 30],
  ];
  return piecewiseScore(t, pts, true);
}

/** 1 km tapis incliné (~2 %) — plus bas = mieux. */
export function scoreRun1kIncline(seconds: number, sex: Sex): number {
  const t = seconds - (sex === "femme" ? 12 : 0);
  const pts: [number, number][] = [
    [210, 96],
    [230, 88],
    [250, 76],
    [275, 62],
    [300, 48],
    [330, 35],
  ];
  return piecewiseScore(t, pts, true);
}

/** 2000 m SkiErg — plus bas = mieux. */
export function scoreSkiErg2k(seconds: number, sex: Sex): number {
  const t = seconds - (sex === "femme" ? 30 : 0);
  const pts: [number, number][] = [
    [480, 98],
    [510, 90],
    [540, 82],
    [570, 72],
    [600, 62],
    [660, 48],
    [720, 35],
  ];
  return piecewiseScore(t, pts, true);
}

/** 2000 m BikeErg — plus bas = mieux. */
export function scoreBikeErg2k(seconds: number, sex: Sex): number {
  const t = seconds - (sex === "femme" ? 45 : 0);
  const pts: [number, number][] = [
    [240, 98],
    [270, 90],
    [300, 82],
    [330, 72],
    [360, 62],
    [420, 48],
    [480, 35],
  ];
  return piecewiseScore(t, pts, true);
}

/** 400 m nage piscine — plus bas = mieux. */
export function scoreSwim400m(seconds: number, sex: Sex): number {
  const t = seconds + (sex === "femme" ? 25 : 0);
  const pts: [number, number][] = [
    [300, 98],
    [330, 90],
    [360, 82],
    [390, 70],
    [420, 58],
    [480, 42],
    [540, 28],
  ];
  return piecewiseScore(t, pts, true);
}

/** Echo Bike — calories en 1 min, plus haut = mieux. */
export function scoreEchoBikeCal1min(cals: number, sex: Sex): number {
  const c = cals + (sex === "femme" ? 2 : 0);
  const pts: [number, number][] = [
    [8, 42],
    [10, 52],
    [12, 62],
    [14, 72],
    [16, 82],
    [18, 90],
    [21, 97],
  ];
  return piecewiseScore(c, pts, false);
}

/** Echo Bike — temps pour 10 cal, plus bas = mieux. */
export function scoreEchoBike10cal(seconds: number, sex: Sex): number {
  const t = seconds + (sex === "femme" ? 4 : 0);
  const pts: [number, number][] = [
    [28, 98],
    [35, 90],
    [42, 80],
    [52, 65],
    [65, 48],
    [80, 32],
  ];
  return piecewiseScore(t, pts, true);
}

/** Echo Bike — temps pour 30 cal, plus bas = mieux. */
export function scoreEchoBike30cal(seconds: number, sex: Sex): number {
  const t = seconds + (sex === "femme" ? 15 : 0);
  const pts: [number, number][] = [
    [90, 98],
    [110, 88],
    [130, 76],
    [150, 62],
    [180, 48],
    [210, 35],
  ];
  return piecewiseScore(t, pts, true);
}

/** Cardio intense : moyenne des scores disponibles (erg, course courte, Echo Bike). */
export function cardioIntenseFromPerf(
  perf: Pick<
    PerformanceInput,
    | "row1k"
    | "skiErg500"
    | "run400m"
    | "echoBikeCal1min"
    | "echoBike10cal"
    | "echoBike30cal"
  >,
  sex: Sex,
): number | null {
  const parts: number[] = [];
  const r1 = parseMmSs(perf.row1k);
  if (r1 != null) parts.push(scoreRow1k(r1, sex));
  const sk = parseMmSs(perf.skiErg500);
  if (sk != null) parts.push(scoreSkiErg500(sk, sex));
  const r4 = parseMmSs(perf.run400m);
  if (r4 != null) parts.push(scoreRun400m(r4, sex));
  if (perf.echoBikeCal1min != null && perf.echoBikeCal1min >= 0) {
    parts.push(scoreEchoBikeCal1min(perf.echoBikeCal1min, sex));
  }
  const e10 = parseMmSs(perf.echoBike10cal);
  if (e10 != null) parts.push(scoreEchoBike10cal(e10, sex));
  const e30 = parseMmSs(perf.echoBike30cal);
  if (e30 != null) parts.push(scoreEchoBike30cal(e30, sex));
  if (parts.length === 0) return null;
  return Math.round(parts.reduce((a, b) => a + b, 0) / parts.length);
}
