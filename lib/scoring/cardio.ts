import type { Sex } from "@/lib/types";
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

export function cardioIntenseFromRow1k(
  row1k: string | undefined,
  sex: Sex,
): number | null {
  const sec = parseMmSs(row1k);
  if (sec == null) return null;
  return scoreRow1k(sec, sex);
}
