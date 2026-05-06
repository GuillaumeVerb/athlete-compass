import type { PerformanceInput } from "@/lib/types";

/** Parse "mm:ss" or "m:ss" to seconds. Returns null if empty/invalid. */
export function parseMmSs(value: string | undefined): number | null {
  if (!value || !value.trim()) return null;
  const s = value.trim();
  const parts = s.split(":");
  if (parts.length !== 2) return null;
  const m = Number(parts[0]);
  const sec = Number(parts[1]);
  if (!Number.isFinite(m) || !Number.isFinite(sec) || sec >= 60 || sec < 0)
    return null;
  return m * 60 + sec;
}

export function parseFarmerCarry(value: string | undefined): {
  meters: number;
  seconds: number;
} | null {
  if (!value || !value.trim()) return null;
  const v = value.trim().toLowerCase();
  const slash = v.match(/(\d+)\s*\/\s*(\d+)/);
  if (slash) {
    return { meters: Number(slash[1]), seconds: Number(slash[2]) };
  }
  const en = v.match(/(\d+)\s*m[^\d]*(\d+)\s*s/);
  if (en) return { meters: Number(en[1]), seconds: Number(en[2]) };
  return null;
}

export function filledCount(perf: PerformanceInput): number {
  let n = 0;
  if (perf.row1k?.trim()) n++;
  if (perf.skiErg500?.trim()) n++;
  if (perf.run400m?.trim()) n++;
  if (perf.row2k?.trim()) n++;
  if (perf.run5k?.trim()) n++;
  if (perf.run10k?.trim()) n++;
  if (perf.swim400m?.trim()) n++;
  if (perf.run1kIncline?.trim()) n++;
  if (perf.bikeErg1k?.trim()) n++;
  if (perf.bikeErg2k?.trim()) n++;
  if (perf.skiErg2k?.trim()) n++;
  if (perf.echoBikeCal1min != null && perf.echoBikeCal1min >= 0) n++;
  if (perf.echoBike10cal?.trim()) n++;
  if (perf.echoBike30cal?.trim()) n++;
  if (perf.wallBall150?.trim()) n++;
  if (perf.pullups != null && perf.pullups >= 0) n++;
  if (perf.dipsStrict != null && perf.dipsStrict >= 0) n++;
  if (perf.hspuStrict != null && perf.hspuStrict >= 0) n++;
  if (perf.muscleUp2min != null && perf.muscleUp2min >= 0) n++;
  if (perf.toesToBar != null && perf.toesToBar >= 0) n++;
  if (perf.burpees50?.trim()) n++;
  if (perf.airSquat100?.trim()) n++;
  if (perf.kbSwing100?.trim()) n++;
  if (perf.hybridDbChipper?.trim()) n++;
  if (perf.doubleUnders1min != null && perf.doubleUnders1min >= 0) n++;
  if (perf.pushupsStrict != null && perf.pushupsStrict >= 0) n++;
  if (perf.ropeClimb2min != null && perf.ropeClimb2min >= 0) n++;
  if (perf.lunges2min != null && perf.lunges2min >= 0) n++;
  if (perf.frontSquat5 != null && perf.frontSquat5 > 0) n++;
  if (perf.backSquat3 != null && perf.backSquat3 > 0) n++;
  if (perf.bulgarianSplitSquat8 != null && perf.bulgarianSplitSquat8 > 0)
    n++;
  if (perf.benchPress5 != null && perf.benchPress5 > 0) n++;
  if (perf.ohp5 != null && perf.ohp5 > 0) n++;
  if (perf.tbarRow10 != null && perf.tbarRow10 > 0) n++;
  if (perf.deadlift5 != null && perf.deadlift5 > 0) n++;
  if (perf.boxJumpMaxCm != null && perf.boxJumpMaxCm > 0) n++;
  if (perf.farmerCarry?.trim()) n++;
  if (perf.sandbagCarry?.trim()) n++;
  if (perf.sledCarry?.trim()) n++;
  if (perf.hollowHold?.trim()) n++;
  if (perf.lSitHold?.trim()) n++;
  return n;
}
