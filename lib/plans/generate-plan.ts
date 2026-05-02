export interface PlanSession {
  title: string;
  tags: string[];
}

export interface PlanWeek {
  week: number;
  objective: string;
  objectiveChecks: string[];
  focus: string;
  coherencePct: number;
  sessions: PlanSession[];
}

const BASE_WEEKS: PlanWeek[] = [
  {
    week: 1,
    objective: "Installer un rythme hybride sans te cramer.",
    objectiveChecks: [
      "3 séances complétées",
      "1 sortie Zone 2 réelle (pas une « course » à fond)",
      "1 nuit sommeil 7h+ après la séance la plus dure",
    ],
    focus: "Qualité du mouvement + repères cardio",
    coherencePct: 68,
    sessions: [
      { title: "Séance 1 — Force haut du corps", tags: ["Force"] },
      { title: "Séance 2 — Zone 2", tags: ["Endurance"] },
      { title: "Séance 3 — Force jambes", tags: ["Force"] },
      { title: "Séance 4 — Metcon court", tags: ["Conditioning"] },
      { title: "Séance 5 — Hybride & core", tags: ["Hybride"] },
    ],
  },
  {
    week: 2,
    objective: "Monter légèrement le volume utile.",
    objectiveChecks: [
      "Ajouter 5–10 min sur la Zone 2 si la récup est verte",
      "Garder 1 jour off actif (marche)",
    ],
    focus: "Volume Endurance / Conditioning",
    coherencePct: 70,
    sessions: [
      { title: "Séance 1 — Force haut du corps", tags: ["Force"] },
      { title: "Séance 2 — Zone 2 + strides légers", tags: ["Endurance"] },
      { title: "Séance 3 — Force jambes", tags: ["Force"] },
      { title: "Séance 4 — Metcon court", tags: ["Conditioning"] },
      { title: "Séance 5 — Portage & core", tags: ["Hybride"] },
    ],
  },
  {
    week: 3,
    objective: "Intensifier sans casser la technique.",
    objectiveChecks: [
      "1 progression mesurée (charge ou temps)",
      "Hydratation + sommeil suivis 5/7",
    ],
    focus: "Intensité contrôlée",
    coherencePct: 72,
    sessions: [
      { title: "Séance 1 — Force haut du corps", tags: ["Force"] },
      { title: "Séance 2 — Zone 2", tags: ["Endurance"] },
      { title: "Séance 3 — Force jambes", tags: ["Force"] },
      { title: "Séance 4 — Metcon court", tags: ["Conditioning"] },
      { title: "Séance 5 — Hybride & core", tags: ["Hybride"] },
    ],
  },
  {
    week: 4,
    objective: "Consolider : même structure, meilleure exécution.",
    objectiveChecks: [
      "Retest léger (500 m rameur ou 10 min tempo)",
      "Noter RPE moyen par séance",
    ],
    focus: "Exécution & retest",
    coherencePct: 74,
    sessions: [
      { title: "Séance 1 — Force haut du corps", tags: ["Force"] },
      { title: "Séance 2 — Zone 2", tags: ["Endurance"] },
      { title: "Séance 3 — Force jambes", tags: ["Force"] },
      { title: "Séance 4 — Metcon court", tags: ["Conditioning"] },
      { title: "Séance 5 — Hybride & core", tags: ["Hybride"] },
    ],
  },
];

export function generateFourWeekPlan(): PlanWeek[] {
  return BASE_WEEKS;
}
