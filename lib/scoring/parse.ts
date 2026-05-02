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
  if (perf.row2k?.trim()) n++;
  if (perf.run5k?.trim()) n++;
  if (perf.pullups != null && perf.pullups >= 0) n++;
  if (perf.frontSquat5 != null && perf.frontSquat5 > 0) n++;
  if (perf.ohp5 != null && perf.ohp5 > 0) n++;
  if (perf.deadlift5 != null && perf.deadlift5 > 0) n++;
  if (perf.burpees50?.trim()) n++;
  if (perf.farmerCarry?.trim()) n++;
  if (perf.hollowHold?.trim()) n++;
  return n;
}
