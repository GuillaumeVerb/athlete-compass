/** Points démo pour la page Body Progress (pas de stockage persistant en V1). */
export const MOCK_BODY_SERIES = [
  { date: "2026-03-01", weightKg: 79.2, waistCm: 86 },
  { date: "2026-03-15", weightKg: 78.8, waistCm: 85 },
  { date: "2026-04-01", weightKg: 78.4, waistCm: 84.2 },
  { date: "2026-04-15", weightKg: 78.1, waistCm: 83.5 },
  { date: "2026-05-01", weightKg: 78.0, waistCm: 83 },
] as const;

export type BodyProgressSignal =
  | "very_positive"
  | "likely_progress"
  | "maintenance"
  | "performance_risk"
  | "likely_surplus";

export function computeBodyProgressSignal(
  weightDelta: number,
  waistDelta: number,
): { signal: BodyProgressSignal; label: string; detail: string } {
  if (waistDelta < -0.5 && weightDelta <= 0.3) {
    return {
      signal: "very_positive",
      label: "Très bon signal",
      detail: "Tour de taille en baisse avec poids stable ou en légère baisse : recomposition probable.",
    };
  }
  if (waistDelta < 0 && weightDelta < -1) {
    return {
      signal: "performance_risk",
      label: "Risque de perte de performance",
      detail: "Poids qui baisse vite avec peu de mouvement sur le tour de taille : vérifie charge et récupération.",
    };
  }
  if (weightDelta > 0.8 && waistDelta > 0.5) {
    return {
      signal: "likely_surplus",
      label: "Surplus probable",
      detail: "Poids et tour de taille montent ensemble : ajuste calories ou charge d’entraînement.",
    };
  }
  if (Math.abs(weightDelta) < 0.4 && waistDelta < 0) {
    return {
      signal: "very_positive",
      label: "Recomposition idéale (démo)",
      detail: "Poids stable, taille qui se resserre : bon signal pour la performance relative.",
    };
  }
  return {
    signal: "maintenance",
    label: "Maintenance",
    detail: "Peu de variation sur la fenêtre — utile de densifier les tests de performance pour voir le signal côté score.",
  };
}
