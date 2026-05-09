import type { AthleticProfileId, ConstraintKey, EquipmentKey, PrimaryGoal } from "@/lib/types";

export type CoachQuickActionId =
  | "adapt_session"
  | "tired"
  | "30min"
  | "replace_machine"
  | "row_progress"
  | "light_legs"
  | "next_best";

export type CoachContext = {
  profileId: AthleticProfileId;
  goal: PrimaryGoal;
  readinessScore: number;
  constraints: ConstraintKey[];
  equipment: EquipmentKey[];
  nextBestMove: string;
};

const disclaimer =
  "Conseils d’entraînement généraux, à adapter à tes sensations — pas un avis médical.";

export function coachQuickResponse(action: CoachQuickActionId, ctx: CoachContext): string {
  const tired = ctx.readinessScore < 60;
  const light = ctx.constraints.includes("light_legs");

  switch (action) {
    case "tired":
      return tired
        ? "Évite de transformer cette journée en test mental. Fais 35–45 minutes de Zone 2 ou une séance haut du corps légère. L’objectif est de préserver la progression, pas d’ajouter de la fatigue.\n\n" + disclaimer
        : "Si la fatigue est surtout mentale, garde une séance courte : technique + un bloc modéré. Si les jambes sont lourdes, privilégie SkiErg ou haut du corps.\n\n" + disclaimer;

    case "replace_machine":
      return "Pas de SkiErg ? Rameur si tu acceptes plus de jambes/dos, vélo si tu veux limiter l’impact. Pour le stimulus haut du corps : tirage poulie + gainage en fin de séance.\n\n" + disclaimer;

    case "light_legs":
      return light
        ? "Évite gros volumes escaliers, fentes lourdes et vélo intense. Privilégie tapis incliné modéré, SkiErg, rameur technique, Zone 2 et renforcement haut du corps.\n\n" + disclaimer
        : "Même sans contrainte, espace les gros volumes jambes : alterne qualité (technique) et quantité.\n\n" + disclaimer;

    case "row_progress":
      return "Garde 2 touches rameur / semaine : une séance intervalles courts (ex. 8 × 250 m) et une endurance modérée (ex. 4 × 500 m). Ne reteste pas ton 1 km toutes les semaines.\n\n" + disclaimer;

    case "30min":
      return "En 30 minutes : échauffement 6 min, puis 18 min en alternance 1 min fort / 1 min facile sur rameur ou bike, 6 min retour au calme + gainage court.\n\n" + disclaimer;

    case "adapt_session":
      if (ctx.readinessScore >= 75) {
        return "Readiness correcte : tu peux garder ton plan, en terminant les blocs lourds avec 1–2 reps en réserve.\n\n" + disclaimer;
      }
      return "Réduis le volume de 20–30 %, garde l’intention (même type de séance) mais des charges plus conservatrices.\n\n" + disclaimer;

    case "next_best":
      return `Piste prioritaire alignée avec ton profil : ${ctx.nextBestMove}\n\n` + disclaimer;

    default:
      return disclaimer;
  }
}

export const COACH_QUICK_ACTIONS: { id: CoachQuickActionId; label: string }[] = [
  { id: "adapt_session", label: "Adapter ma séance" },
  { id: "tired", label: "Je suis fatigué" },
  { id: "30min", label: "Je n’ai que 30 minutes" },
  { id: "replace_machine", label: "Remplacer une machine" },
  { id: "row_progress", label: "Progresser au rameur" },
  { id: "light_legs", label: "Ménager les cuisses" },
  { id: "next_best", label: "Ma prochaine meilleure action" },
];
