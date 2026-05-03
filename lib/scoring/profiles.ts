import type { AthleticProfileId, ScoreBreakdown } from "@/lib/types";

const PROFILE_COPY: Record<
  AthleticProfileId,
  { label: string; description: string }
> = {
  moteur_court: {
    label: "Moteur Court",
    description:
      "Tu es performant sur les efforts intenses et courts. Le prochain enjeu : vérifier ta capacité à tenir plus longtemps sans perdre la qualité.",
  },
  strong_slow: {
    label: "Strong but slow",
    description:
      "La force est là, le moteur cardio doit rattraper. Quelques blocs d’endurance structurée feront la différence sur le score hybride.",
  },
  diesel: {
    label: "Diesel",
    description:
      "Tu tiens l’effort dans la durée. Ajoute de la puissance et de la vitesse pour compléter le tableau d’un athlète hybride.",
  },
  crossfit_build: {
    label: "Crossfit build",
    description:
      "Profil polyvalent avec un bon équilibre force / moteur. Affinage des points faibles et volume intelligent = progression nette.",
  },
  hyrox_ready: {
    label: "HYROX ready",
    description:
      "Endurance + charge : tu es dans la zone hybride compétition. Travaille transitions et pacing pour solidifier la perf.",
  },
  balanced_hybrid: {
    label: "Balanced hybrid",
    description:
      "Peu de angles morts majeurs. La progression viendra de la régularité, du suivi et de micro-ajustements de charge.",
  },
  under_recovered: {
    label: "Under-recovered",
    description:
      "Les signaux suggèrent un déséquilibre charge / récup. Priorise sommeil, nutrition et semaines plus digestes avant d’ajouter du volume.",
  },
  strength_gap: {
    label: "Strength gap",
    description:
      "Le moteur est au rendez-vous mais la force relative ou les lifts ne suivent pas : priorise squats / tirages / charges progressives.",
  },
  endurance_gap: {
    label: "Endurance gap",
    description:
      "La force tient la route mais l’endurance longue ou le rythme sur la durée plafonne : volume aérobie structuré = levier n°1.",
  },
  muscular_endurance_gap: {
    label: "Muscular endurance gap",
    description:
      "Les efforts longs en reps / WOD te coûtent plus que la barre : ajoute du volume spécifique sans sacrifier la technique.",
  },
};

export function pickProfile(b: ScoreBreakdown): AthleticProfileId {
  const c = b.cardioIntense ?? 50;
  const e = b.endurance ?? 50;
  const f = b.force ?? 50;
  const m = b.muscularEndurance ?? 50;
  const k = b.coreCarry ?? 50;

  const hasCE = b.cardioIntense != null && b.endurance != null;
  const hasFM = b.force != null && b.muscularEndurance != null;

  if (k <= 45 && (c + e + f) / 3 >= 70) return "under_recovered";

  if (
    hasCE &&
    f >= 72 &&
    (c + e) / 2 <= 55 &&
    f > c + 4 &&
    f > e + 4
  ) {
    return "strength_gap";
  }
  if (
    hasCE &&
    e >= 72 &&
    (c + f) / 2 <= 55 &&
    e > f + 4
  ) {
    return "endurance_gap";
  }
  if (
    b.muscularEndurance != null &&
    m <= 52 &&
    (c + f) / 2 >= 62
  ) {
    return "muscular_endurance_gap";
  }

  if (c >= 74 && e <= 70 && f >= 60) return "moteur_court";
  if (f >= 75 && c <= 58) return "strong_slow";
  if (e >= 75 && c <= 62) return "diesel";
  if (e >= 72 && m >= 68 && c >= 65 && f >= 62) return "hyrox_ready";
  if (
    Math.abs(c - f) < 12 &&
    Math.abs(e - m) < 15 &&
    c >= 60 &&
    f >= 60
  ) {
    return "balanced_hybrid";
  }
  if (c >= 68 && f >= 68 && m >= 65) return "crossfit_build";
  if (hasFM && Math.abs(c - f) < 18 && Math.abs(e - m) < 20) {
    return "balanced_hybrid";
  }
  return "balanced_hybrid";
}

export function profileLabel(id: AthleticProfileId): string {
  return PROFILE_COPY[id].label;
}

export function profileDescription(id: AthleticProfileId): string {
  return PROFILE_COPY[id].description;
}
