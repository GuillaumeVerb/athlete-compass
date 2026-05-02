/** Utilitaires scoring — fonctions pures partagées */

export function clamp(n: number, lo = 0, hi = 100) {
  return Math.max(lo, Math.min(hi, Math.round(n)));
}

/**
 * Interpolation linéaire par segments. `lowerIsBetter` : plus la valeur est
 * petite, plus le score est élevé (ex. temps en secondes).
 */
export function piecewiseScore(
  value: number,
  points: [number, number][],
  lowerIsBetter: boolean,
): number {
  if (points.length === 0) return 50;
  const sorted = [...points].sort((a, b) => a[0] - b[0]);
  if (!lowerIsBetter) {
    if (value <= sorted[0][0]) {
      return clamp(sorted[0][1] - (sorted[0][0] - value) * 0.5);
    }
    const last = sorted[sorted.length - 1];
    if (value >= last[0]) {
      return clamp(last[1] + (value - last[0]) * 0.15);
    }
    for (let i = 0; i < sorted.length - 1; i++) {
      const [x0, y0] = sorted[i];
      const [x1, y1] = sorted[i + 1];
      if (value >= x0 && value <= x1) {
        const t = (value - x0) / (x1 - x0);
        return clamp(y0 + t * (y1 - y0));
      }
    }
    return 50;
  }
  if (lowerIsBetter) {
    if (value <= sorted[0][0]) {
      return clamp(sorted[0][1] + (sorted[0][0] - value) * 0.08);
    }
    const last = sorted[sorted.length - 1];
    if (value >= last[0]) {
      return clamp(last[1] - (value - last[0]) * 0.06);
    }
    for (let i = 0; i < sorted.length - 1; i++) {
      const [x0, y0] = sorted[i];
      const [x1, y1] = sorted[i + 1];
      if (value >= x0 && value <= x1) {
        const t = (value - x0) / (x1 - x0);
        return clamp(y0 + t * (y1 - y0));
      }
    }
  }
  return 50;
}

export type ScoreQuality =
  | "tres_faible"
  | "faible"
  | "moyen"
  | "bon"
  | "tres_bon"
  | "excellent";

export function scoreToQuality(score: number): ScoreQuality {
  if (score >= 93) return "excellent";
  if (score >= 82) return "tres_bon";
  if (score >= 68) return "bon";
  if (score >= 50) return "moyen";
  if (score >= 35) return "faible";
  return "tres_faible";
}

export function qualityLabelFr(q: ScoreQuality): string {
  const m: Record<ScoreQuality, string> = {
    tres_faible: "Très faible",
    faible: "Faible",
    moyen: "Moyen",
    bon: "Bon",
    tres_bon: "Très bon",
    excellent: "Excellent",
  };
  return m[q];
}
