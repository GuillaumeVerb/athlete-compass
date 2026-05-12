/**
 * Readiness Score déterministe (prompt 07) — pas d’API santé, entrées déclaratives.
 */

export type ReadinessStatus = "excellent" | "good" | "moderate" | "low" | "very_low";

export type RecommendationType = "push" | "train_normal" | "moderate" | "deload" | "rest";

export type PreviousDayIntensity = "rest" | "easy" | "moderate" | "hard" | "very_hard";

export type WeeklyTrainingLoad = "low" | "normal" | "high" | "very_high";

export type ReadinessInput = {
  sleepHours: number;
  sleepQuality: 1 | 2 | 3 | 4 | 5;
  fatigue: number;
  soreness: number;
  motivation: number;
  restingHeartRate?: number;
  previousDayIntensity: PreviousDayIntensity;
  weeklyTrainingLoad: WeeklyTrainingLoad;
  /** Pas du jour (local) — optionnel, issu du suivi activité. */
  stepsToday?: number;
  /** Objectif pas / jour — requis si `stepsToday` est fourni pour interpréter le ratio. */
  stepsGoal?: number;
};

export type ReadinessResult = {
  readinessScore: number;
  status: ReadinessStatus;
  recommendationType: RecommendationType;
  warningMessage?: string;
  recommendedSessionType: string;
  avoidToday: string[];
  explanation: string;
};

function clamp(n: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, n));
}

export function computeReadiness(input: ReadinessInput): ReadinessResult {
  let score = 72;

  if (input.sleepHours < 6) score -= 22;
  else if (input.sleepHours < 7) score -= 8;
  else if (input.sleepHours >= 8) score += 4;

  score += (input.sleepQuality - 3) * 3;

  if (input.fatigue >= 8) score -= 18;
  else if (input.fatigue > 7) score -= 14;
  else if (input.fatigue > 5) score -= 6;

  if (input.soreness >= 8) score -= 12;
  else if (input.soreness > 7) score -= 8;
  else if (input.soreness > 5) score -= 3;

  if (input.motivation <= 3) score -= 8;
  else if (input.motivation <= 5) score -= 3;

  if (input.restingHeartRate != null && input.restingHeartRate > 58) {
    score -= Math.min(8, Math.round((input.restingHeartRate - 55) / 3));
  }

  switch (input.previousDayIntensity) {
    case "very_hard":
      score -= 12;
      break;
    case "hard":
      score -= 5;
      break;
    case "rest":
      score += 4;
      break;
    default:
      break;
  }

  switch (input.weeklyTrainingLoad) {
    case "very_high":
      score -= 14;
      break;
    case "high":
      score -= 6;
      break;
    case "low":
      score += 3;
      break;
    default:
      break;
  }

  const goal = input.stepsGoal;
  const steps = input.stepsToday;
  if (
    typeof steps === "number" &&
    Number.isFinite(steps) &&
    typeof goal === "number" &&
    Number.isFinite(goal) &&
    goal > 0
  ) {
    const ratio = steps / goal;
    if (ratio < 0.25) score -= 6;
    else if (ratio < 0.45) score -= 3;
    else if (ratio >= 1) score += 2;
    else if (ratio >= 0.85) score += 1;
  }

  score = Math.round(clamp(score, 0, 100));

  let status: ReadinessStatus;
  if (score >= 82) status = "excellent";
  else if (score >= 68) status = "good";
  else if (score >= 48) status = "moderate";
  else if (score >= 28) status = "low";
  else status = "very_low";

  let recommendationType: RecommendationType;
  if (score > 80) recommendationType = "push";
  else if (score >= 65) recommendationType = "train_normal";
  else if (score >= 45) recommendationType = "moderate";
  else if (score >= 22) recommendationType = "deload";
  else recommendationType = "rest";

  const avoidToday: string[] = [];
  if (input.soreness > 6 || input.fatigue > 6) {
    avoidToday.push("Metcon jambes lourd");
    avoidToday.push("Volume course / escaliers intense");
  }
  if (score < 50) {
    avoidToday.push("Test maximal ou séance compétition");
  }
  if (input.fatigue >= 8) {
    avoidToday.push("Double séance même jour");
  }

  if (
    typeof steps === "number" &&
    Number.isFinite(steps) &&
    typeof goal === "number" &&
    Number.isFinite(goal) &&
    goal > 0 &&
    steps / goal < 0.35
  ) {
    avoidToday.push("Longue sortie jambes lourdes si journée très peu active (peu de pas)");
  }

  let explanation: string;
  if (score > 80) {
    explanation =
      "Tu peux pousser aujourd’hui. Bonne journée pour force ou intervalles — garde la technique propre.";
  } else if (score >= 65) {
    explanation =
      "Entraînement normal possible. Garde 1 à 2 reps en réserve sur les charges lourdes.";
  } else if (score >= 45) {
    explanation =
      "Privilégie une séance modérée, Zone 2 ou technique. Limite les spikes d’intensité.";
  } else if (score >= 22) {
    explanation =
      "Réduis fortement l’intensité : mobilité, marche active ou séance très légère haut du corps.";
  } else {
    explanation = "Priorité récupération : repos, sommeil, hydratation — évite d’ajouter de la fatigue.";
  }

  let recommendedSessionType: string;
  switch (recommendationType) {
    case "push":
      recommendedSessionType = "Force ou intervalles courts";
      break;
    case "train_normal":
      recommendedSessionType = "Hybride modéré ou force volume standard";
      break;
    case "moderate":
      recommendedSessionType = "Zone 2 ou technique + accessoires";
      break;
    case "deload":
      recommendedSessionType = "Mobilité + Zone 2 très facile";
      break;
    default:
      recommendedSessionType = "Repos actif ou marche";
  }

  let warningMessage: string | undefined;
  if (input.sleepHours < 6) {
    warningMessage = "Sommeil court : la progression passe d’abord par la récupération.";
  } else if (input.weeklyTrainingLoad === "very_high" && score < 60) {
    warningMessage = "Charge hebdomadaire élevée avec readiness moyenne — redistribue l’intensité.";
  } else if (
    typeof steps === "number" &&
    Number.isFinite(steps) &&
    typeof goal === "number" &&
    Number.isFinite(goal) &&
    goal > 0 &&
    steps / goal < 0.25 &&
    input.sleepHours >= 6.5
  ) {
    warningMessage =
      "Activité quotidienne très faible (peu de pas) : complète par marche facile ou mobilité légère.";
  }

  return {
    readinessScore: score,
    status,
    recommendationType,
    warningMessage,
    recommendedSessionType,
    avoidToday,
    explanation,
  };
}
