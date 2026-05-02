import type {
  AthleticProfileId,
  PerformanceInput,
  ScoreBreakdown,
} from "@/lib/types";
import { parseMmSs } from "./parse";

export interface NextBestMovePlan {
  title: string;
  reason: string;
  action: string;
  frequency: string;
  impact: string;
}

function planToSummary(p: NextBestMovePlan): string {
  return `${p.title} — ${p.action}`;
}

export function computeNextBestMovePlan(
  limiterKey: keyof ScoreBreakdown,
  profileId: AthleticProfileId,
  perf: PerformanceInput,
): NextBestMovePlan {
  if (profileId === "under_recovered") {
    return {
      title: "Réduire la charge avant d’optimiser",
      reason:
        "Les scores élevés côté moteur avec un core très bas suggèrent fatigue ou surentraînement.",
      action:
        "Baisse d’une séance intense cette semaine, ajoute 2× 30 min de marche légère.",
      frequency: "7 jours, puis réévalue ton RPE moyen.",
      impact: "Meilleure récup → scores plus stables au retest.",
    };
  }

  if (limiterKey === "endurance" || limiterKey === "cardioIntense") {
    const wantRow2k = !perf.row2k?.trim() && parseMmSs(perf.row1k) != null;
    return {
      title: wantRow2k ? "Fiabiliser avec le 2 km rameur" : "Construire le moteur long",
      reason:
        "Ton pilier endurance / cardio intense tire le Hybrid vers le bas par rapport à ton objectif.",
      action: wantRow2k
        ? "Programme un 2 km rameur à allure régulière (même allure que ton 1 km + pacing)."
        : "Ajoute 1 séance zone 2 de 35–45 min (rameur, vélo fluide ou tapis incliné modéré).",
      frequency: "1× / semaine minimum, 3 semaines consécutives.",
      impact: "Meilleure endurance → radar plus équilibré et fiabilité ↑.",
    };
  }

  if (limiterKey === "force") {
    return {
      title: "Progresser sur la force relative",
      reason:
        "Les lifts / poids de corps structurent ton plafond hybride sur les WOD / stations.",
      action:
        "Ajoute un bloc « squat + press » + un bloc « tirage + deadlift léger » avec +2,5 % sur 2 semaines si les reps restent propres.",
      frequency: "2× / semaine (45–55 min).",
      impact: "Monte le pilier Force sans exploser le volume cardio.",
    };
  }

  if (limiterKey === "muscularEndurance") {
    return {
      title: "Volume spécifique « reps + tempo »",
      reason:
        "Burpees / tractions / séries longues manquent de données ou de niveau vs le reste.",
      action:
        "Intègre 2 circuits courts (10–12 min) : tirage + burpees contrôlés + core, RPE 7/10.",
      frequency: "2× / semaine, espace d’1 jour vs les séances jambes lourdes.",
      impact: "Remonte résistance musculaire et le score sur formats compétition.",
    };
  }

  if (limiterKey === "coreCarry") {
    return {
      title: "Portages & gainage profond",
      reason:
        "Le pilier core / carry conditionne posture, transferts de force et tenue en HYROX.",
      action:
        "2× / semaine : farmer carry 3–5 tours + hollow hold 4× 20–40 s + plank chargé.",
      frequency: "20 min en fin de séance.",
      impact: "Stabilise le tronc → meilleure transmission sur squats et rameur.",
    };
  }

  return {
    title: "Semaine type hybride",
    reason:
      "Les piliers sont proches : la priorité est la régularité et un retest protocolé.",
    action:
      "1 longue endurance + 1 force + 1 métcon court ; note temps RPE à chaque séance.",
    frequency: "Chaque semaine type identique pendant 2 semaines puis retest 1 km.",
    impact: "Mesure objective de progression sans surcharger.",
  };
}

export function computeNextBestMoveSummary(
  limiterKey: keyof ScoreBreakdown,
  profileId: AthleticProfileId,
  perf: PerformanceInput,
): string {
  return planToSummary(
    computeNextBestMovePlan(limiterKey, profileId, perf),
  );
}
