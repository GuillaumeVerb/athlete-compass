import type { ScoreBreakdown, UserProfile } from "@/lib/types";

export type TrainingDebtKind =
  | "cardio"
  | "force"
  | "endurance"
  | "muscular_endurance"
  | "recovery"
  | "mobility"
  | "coherence"
  | "legs";

export type TrainingDebtSeverity = "low" | "moderate" | "high";

export type TrainingDebtResult = {
  primaryDebt: TrainingDebtKind;
  severity: TrainingDebtSeverity;
  explanation: string;
  recommendedCorrection: string;
  avoidThisWeek: string[];
};

function minPillar(b: ScoreBreakdown): { key: keyof ScoreBreakdown; v: number } | null {
  const entries = (Object.keys(b) as (keyof ScoreBreakdown)[])
    .map((k) => ({ key: k, v: b[k] }))
    .filter((e): e is { key: keyof ScoreBreakdown; v: number } => e.v != null);
  if (entries.length === 0) return null;
  return entries.reduce((a, c) => (c.v < a.v ? c : a));
}

export function computeTrainingDebt(
  breakdown: ScoreBreakdown,
  readinessScore: number,
  profile: UserProfile,
): TrainingDebtResult {
  const weakest = minPillar(breakdown);
  const lightLegs = profile.constraints.includes("light_legs");
  const avoidThisWeek: string[] = [];

  if (readinessScore < 48 && profile.frequency !== "1-2") {
    avoidThisWeek.push("Deux séances HIIT consécutives");
    avoidThisWeek.push("Course tempo + squat lourd le même jour");
    return {
      primaryDebt: "recovery",
      severity: readinessScore < 35 ? "high" : "moderate",
      explanation:
        "Tu accumules probablement de l’intensité avec une récupération moyenne. Cette semaine, le meilleur progrès vient d’une meilleure distribution des efforts.",
      recommendedCorrection:
        "Ajoute une séance de mobilité + une sortie Zone 2 facile, et décale les séances jambes lourdes.",
      avoidThisWeek,
    };
  }

  if (
    lightLegs &&
    breakdown.endurance != null &&
    breakdown.force != null &&
    breakdown.endurance > breakdown.force + 15
  ) {
    avoidThisWeek.push("Volume escaliers + fentes + squat dans la même micro-semaine");
    return {
      primaryDebt: "legs",
      severity: "moderate",
      explanation:
        "Beaucoup de stimulus jambes / course avec contrainte « ménager les cuisses » : la fatigue locale peut monter vite.",
      recommendedCorrection:
        "Privilégie SkiErg, rameur technique, tapis incliné modéré, et espace les blocs jambes.",
      avoidThisWeek,
    };
  }

  if (!weakest) {
    return {
      primaryDebt: "coherence",
      severity: "low",
      explanation:
        "Peu de données complètes sur les piliers : complète 2–3 tests clés pour cibler une dette précise.",
      recommendedCorrection: "Complète le bilan performances puis refais un tour sur cette carte.",
      avoidThisWeek: ["Enchaîner 3 séances dures sans jour technique"],
    };
  }

  let primaryDebt: TrainingDebtKind = "coherence";
  let explanation: string;
  let recommendedCorrection: string;

  switch (weakest.key) {
    case "force":
      primaryDebt = "force";
      explanation =
        "Ta force relative limite ton profil hybride : le plafond apparaît sur les charges et la tolérance sous fatigue.";
      recommendedCorrection =
        "Ajoute 2 expositions force / semaine : tirage, développé militaire, squat frontal modéré.";
      break;
    case "endurance":
      primaryDebt = "endurance";
      explanation =
        "La base endurance longue tire le score : utile pour tenir les formats longs sans exploser le cardio intense.";
      recommendedCorrection =
        "Ajoute 1 séance Zone 2 de 40 à 50 minutes (rameur, vélo ou course facile).";
      break;
    case "cardioIntense":
      primaryDebt = "cardio";
      explanation =
        "Le cardio intense structuré est en retard vs ton objectif : les intervalles courts progressent vite avec un peu de volume ciblé.";
      recommendedCorrection =
        "Intègre 1 séance répétitions courtes rameur ou bike, une autre en tempo modéré.";
      break;
    case "muscularEndurance":
      primaryDebt = "muscular_endurance";
      explanation =
        "La résistance musculaire sous charge modérée limite le score — peu de volume « reps » ou de metcons courts.";
      recommendedCorrection =
        "Ajoute un circuit 12–20 min (haltères) ou un chipper léger une fois par semaine.";
      break;
    case "coreCarry":
      primaryDebt = "mobility";
      explanation =
        "Gainage / carries : socle pour tenir les metcons et protéger le bas du dos sur les blocs hybrides.";
      recommendedCorrection =
        "2×/sem. : farmer carry + hollow ou L-sit, fin de séance 8–12 min.";
      break;
    default:
      primaryDebt = "coherence";
      explanation =
        "Les piliers sont proches : le gain vient surtout de la cohérence hebdo (répartition force / cardio / récup).";
      recommendedCorrection =
        "Cartographie 7 jours : 2 forces, 1 metcon, 1 Z2, 1 technique — puis ajuste selon readiness.";
  }

  const severity: TrainingDebtSeverity =
    weakest.v < 42 ? "high" : readinessScore < 58 ? "moderate" : "low";

  avoidThisWeek.push("Empiler 3 séances dures d’affilée sans jour technique");

  return {
    primaryDebt,
    severity,
    explanation,
    recommendedCorrection,
    avoidThisWeek,
  };
}
