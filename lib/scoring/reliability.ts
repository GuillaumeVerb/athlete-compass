import type { PerformanceInput } from "@/lib/types";
import { TEST_PROTOCOLS } from "@/lib/tests/test-protocols";

const WEIGHTS: Record<keyof PerformanceInput, number> = {
  row1k: 15,
  row2k: 12,
  run5k: 12,
  pullups: 10,
  frontSquat5: 10,
  ohp5: 8,
  deadlift5: 10,
  burpees50: 10,
  farmerCarry: 8,
  hollowHold: 5,
};

/** Ordre de priorité pour « prochain test » (clés PerformanceInput) */
export const TEST_FILL_PRIORITY: (keyof PerformanceInput)[] = [
  "row1k",
  "row2k",
  "run5k",
  "pullups",
  "frontSquat5",
  "ohp5",
  "deadlift5",
  "burpees50",
  "farmerCarry",
  "hollowHold",
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
  if (nFilled >= 9) bucket = 92;
  else if (nFilled >= 6) bucket = 78;
  else if (nFilled >= 4) bucket = 58;
  else if (nFilled >= 3) bucket = 48;

  const pillars = pillarCoverageCount(perf);
  const diversityPct = Math.round((pillars / 5) * 100);

  const blended = Math.round(
    0.42 * weightPct + 0.28 * bucket + 0.3 * diversityPct,
  );
  return Math.max(0, Math.min(100, blended));
}

function pillarCoverageCount(perf: PerformanceInput): number {
  let n = 0;
  if (isTestFilled("row1k", perf)) n++;
  if (isTestFilled("row2k", perf) || isTestFilled("run5k", perf)) n++;
  if (
    isTestFilled("frontSquat5", perf) ||
    isTestFilled("ohp5", perf) ||
    isTestFilled("deadlift5", perf)
  )
    n++;
  if (isTestFilled("pullups", perf) || isTestFilled("burpees50", perf)) n++;
  if (isTestFilled("farmerCarry", perf) || isTestFilled("hollowHold", perf))
    n++;
  return Math.min(5, n);
}

function isTestFilled(key: keyof PerformanceInput, perf: PerformanceInput) {
  const v = perf[key];
  if (key === "pullups") return typeof v === "number" && v >= 0;
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
