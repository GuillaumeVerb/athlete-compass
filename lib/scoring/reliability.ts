import type { PerformanceInput } from "@/lib/types";
import { TEST_PROTOCOLS } from "@/lib/tests/test-protocols";

const REP_INT_KEYS = new Set<keyof PerformanceInput>([
  "pullups",
  "dipsStrict",
  "hspuStrict",
  "muscleUp2min",
  "toesToBar",
  "ropeClimb2min",
  "doubleUnders1min",
  "pushupsStrict",
  "lunges2min",
  "echoBikeCal1min",
]);

const WEIGHTS: Record<keyof PerformanceInput, number> = {
  row1k: 11,
  skiErg500: 5,
  run400m: 3,
  row2k: 8,
  run5k: 8,
  run10k: 4,
  swim400m: 3,
  run1kIncline: 3,
  bikeErg1k: 4,
  bikeErg2k: 3,
  skiErg2k: 3,
  echoBikeCal1min: 4,
  echoBike10cal: 2,
  echoBike30cal: 3,
  wallBall150: 4,
  pullups: 6,
  dipsStrict: 4,
  hspuStrict: 4,
  muscleUp2min: 3,
  toesToBar: 3,
  burpees50: 6,
  airSquat100: 3,
  kbSwing100: 3,
  hybridDbChipper: 3,
  doubleUnders1min: 3,
  pushupsStrict: 3,
  ropeClimb2min: 3,
  lunges2min: 2,
  frontSquat5: 6,
  backSquat3: 4,
  bulgarianSplitSquat8: 3,
  benchPress5: 5,
  ohp5: 5,
  tbarRow10: 4,
  deadlift5: 6,
  boxJumpMaxCm: 2,
  farmerCarry: 4,
  sandbagCarry: 3,
  sledCarry: 3,
  hollowHold: 3,
  lSitHold: 2,
};

/** Ordre de priorité pour « prochain test » (clés PerformanceInput) */
export const TEST_FILL_PRIORITY: (keyof PerformanceInput)[] = [
  "row1k",
  "skiErg500",
  "run400m",
  "row2k",
  "run5k",
  "run10k",
  "swim400m",
  "run1kIncline",
  "bikeErg1k",
  "bikeErg2k",
  "skiErg2k",
  "echoBikeCal1min",
  "echoBike10cal",
  "echoBike30cal",
  "wallBall150",
  "pullups",
  "dipsStrict",
  "hspuStrict",
  "muscleUp2min",
  "toesToBar",
  "burpees50",
  "airSquat100",
  "kbSwing100",
  "hybridDbChipper",
  "doubleUnders1min",
  "pushupsStrict",
  "ropeClimb2min",
  "lunges2min",
  "frontSquat5",
  "backSquat3",
  "bulgarianSplitSquat8",
  "benchPress5",
  "ohp5",
  "tbarRow10",
  "deadlift5",
  "boxJumpMaxCm",
  "farmerCarry",
  "sandbagCarry",
  "sledCarry",
  "hollowHold",
  "lSitHold",
];

export function computeReliabilityPct(perf: PerformanceInput): number {
  let earned = 0;
  let total = 0;
  for (const key of Object.keys(WEIGHTS) as (keyof PerformanceInput)[]) {
    total += WEIGHTS[key];
    if (isTestFilled(key, perf)) earned += WEIGHTS[key];
  }
  const weightPct = total === 0 ? 0 : Math.round((earned / total) * 100);

  const nFilled = Object.keys(WEIGHTS).filter((k) =>
    isTestFilled(k as keyof PerformanceInput, perf),
  ).length;
  let bucket = 32;
  if (nFilled >= 16) bucket = 92;
  else if (nFilled >= 11) bucket = 78;
  else if (nFilled >= 7) bucket = 58;
  else if (nFilled >= 4) bucket = 48;

  const pillars = pillarCoverageCount(perf);
  const diversityPct = Math.round((pillars / 5) * 100);

  const blended = Math.round(
    0.42 * weightPct + 0.28 * bucket + 0.3 * diversityPct,
  );
  return Math.max(0, Math.min(100, blended));
}

function pillarCoverageCount(perf: PerformanceInput): number {
  let n = 0;
  if (
    isTestFilled("row1k", perf) ||
    isTestFilled("skiErg500", perf) ||
    isTestFilled("run400m", perf) ||
    isTestFilled("echoBikeCal1min", perf) ||
    isTestFilled("echoBike10cal", perf) ||
    isTestFilled("echoBike30cal", perf)
  )
    n++;
  if (
    isTestFilled("row2k", perf) ||
    isTestFilled("run5k", perf) ||
    isTestFilled("run10k", perf) ||
    isTestFilled("swim400m", perf) ||
    isTestFilled("run1kIncline", perf) ||
    isTestFilled("bikeErg1k", perf) ||
    isTestFilled("bikeErg2k", perf) ||
    isTestFilled("skiErg2k", perf)
  )
    n++;
  if (
    isTestFilled("frontSquat5", perf) ||
    isTestFilled("backSquat3", perf) ||
    isTestFilled("bulgarianSplitSquat8", perf) ||
    isTestFilled("benchPress5", perf) ||
    isTestFilled("ohp5", perf) ||
    isTestFilled("tbarRow10", perf) ||
    isTestFilled("deadlift5", perf) ||
    isTestFilled("boxJumpMaxCm", perf)
  )
    n++;
  if (
    isTestFilled("pullups", perf) ||
    isTestFilled("dipsStrict", perf) ||
    isTestFilled("hspuStrict", perf) ||
    isTestFilled("muscleUp2min", perf) ||
    isTestFilled("burpees50", perf) ||
    isTestFilled("toesToBar", perf) ||
    isTestFilled("wallBall150", perf) ||
    isTestFilled("airSquat100", perf) ||
    isTestFilled("kbSwing100", perf) ||
    isTestFilled("hybridDbChipper", perf) ||
    isTestFilled("doubleUnders1min", perf) ||
    isTestFilled("pushupsStrict", perf) ||
    isTestFilled("ropeClimb2min", perf) ||
    isTestFilled("lunges2min", perf)
  )
    n++;
  if (
    isTestFilled("farmerCarry", perf) ||
    isTestFilled("hollowHold", perf) ||
    isTestFilled("sandbagCarry", perf) ||
    isTestFilled("sledCarry", perf) ||
    isTestFilled("lSitHold", perf)
  )
    n++;
  return Math.min(5, n);
}

function isTestFilled(key: keyof PerformanceInput, perf: PerformanceInput) {
  const v = perf[key];
  if (REP_INT_KEYS.has(key)) return typeof v === "number" && v >= 0;
  if (typeof v === "number") return v > 0;
  if (typeof v === "string") return v.trim().length > 0;
  return false;
}

/** Titres des tests non renseignés (pour messages utilisateur). */
export function listMissingTestTitles(perf: PerformanceInput): string[] {
  const out: string[] = [];
  for (const key of Object.keys(WEIGHTS) as (keyof PerformanceInput)[]) {
    if (!isTestFilled(key, perf)) {
      out.push(TEST_PROTOCOLS[key].title);
    }
  }
  return out;
}

export function listMissingTestKeys(
  perf: PerformanceInput,
): (keyof PerformanceInput)[] {
  return TEST_FILL_PRIORITY.filter((k) => !isTestFilled(k, perf));
}

export function isTestFilledExport(
  key: keyof PerformanceInput,
  perf: PerformanceInput,
): boolean {
  return isTestFilled(key, perf);
}
