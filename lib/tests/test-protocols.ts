import type { PerformanceInput } from "@/lib/types";

/** Contenu aligné sur le prompt 04 — protocoles standardisés V1 */
export interface TestProtocol {
  id: keyof PerformanceInput;
  title: string;
  estimatedMinutes: string;
  category: string;
  equipment: string;
  measures: string;
  protocol: string[];
  inputHint: string;
  commonMistakes: string[];
  scoreImpact: string;
}

export const TEST_PROTOCOLS: Record<keyof PerformanceInput, TestProtocol> = {
  row1k: {
    id: "row1k",
    title: "1 km rameur",
    estimatedMinutes: "25–35 min (avec échauffement)",
    category: "Cardio intense",
    equipment: "Rameur Concept2 ou équivalent",
    measures: "Moteur court / cardio intense.",
    protocol: [
      "Échauffement : 8 à 10 min faciles + 2 accélérations de ~20 s.",
      "Damper modéré, idéalement entre 4 et 6.",
      "Réaliser 1000 m le plus vite possible avec une technique propre.",
    ],
    inputHint: "Saisir le temps total au format mm:ss (ex. 03:32).",
    commonMistakes: [
      "Partir trop vite dès le départ.",
      "Tirer surtout avec les bras.",
      "Arrondir le dos en fin d’effort.",
    ],
    scoreImpact: "Pilier « Cardio intense » du radar et poids fort dans le Hybrid Score.",
  },
  row2k: {
    id: "row2k",
    title: "2 km rameur",
    estimatedMinutes: "30–40 min",
    category: "Endurance / moteur",
    equipment: "Rameur Concept2 ou équivalent",
    measures: "Capacité à maintenir une intensité plus longue qu’au 1 km.",
    protocol: [
      "Échauffement léger puis montée en régime progressive.",
      "Pacing régulier : éviter le sprint sur les 500 premiers mètres.",
      "Viser une allure stable sur la 2e moitié.",
    ],
    inputHint: "Temps total mm:ss pour 2000 m.",
    commonMistakes: [
      "Exploser le début puis s’effondrer.",
      "Damper trop haut pour tenir la distance.",
    ],
    scoreImpact: "Pilier « Endurance » et distinction moteur court vs hybride.",
  },
  run5k: {
    id: "run5k",
    title: "5 km course",
    estimatedMinutes: "40–55 min",
    category: "Endurance",
    equipment: "Piste, route plate ou tapis",
    measures: "Endurance « terrain » utile en hybride / HYROX.",
    protocol: [
      "Parcours plutôt plat, allure régulière.",
      "Éviter de passer ce test le lendemain d’une grosse séance jambes.",
    ],
    inputHint: "Temps total mm:ss pour 5 km.",
    commonMistakes: [
      "Départ trop rapide sur les 2 premiers km.",
      "Parcours très vallonné sans le noter (biaise la comparaison).",
    ],
    scoreImpact: "Pilier « Endurance » et cohérence avec les données rameur.",
  },
  pullups: {
    id: "pullups",
    title: "Tractions strictes",
    estimatedMinutes: "15–25 min",
    category: "Force relative / haut du corps",
    equipment: "Barre de traction",
    measures: "Force relative et résistance en tirage.",
    protocol: [
      "Départ bras tendus, menton au-dessus de la barre.",
      "Pas de kipping, pas d’élan excessif.",
      "Arrêter quand l’amplitude ou la vitesse se dégrade nettement.",
    ],
    inputHint: "Nombre de répétitions strictes complètes.",
    commonMistakes: [
      "Demi-amplitude pour gonfler le compteur.",
      "Kipping ou balancement des jambes.",
    ],
    scoreImpact: "Pilier « Résistance musculaire » et cohérence force haut du corps.",
  },
  frontSquat5: {
    id: "frontSquat5",
    title: "Front squat ×5",
    estimatedMinutes: "25–40 min",
    category: "Force jambes + tronc",
    equipment: "Barre, rack, poids",
    measures: "Charge maximale pour 5 répétitions propres (pas de 1RM en V1).",
    protocol: [
      "Amplitude maîtrisée, buste stable, rack solide sur les épaules.",
      "Montée en charge par paliers jusqu’à 5 reps difficiles mais propres.",
    ],
    inputHint: "Charge en kg pour un set de 5 reps propres.",
    commonMistakes: [
      "S’effondrer en bas de squat.",
      "Coude qui chute / barre qui roule.",
    ],
    scoreImpact: "Pilier « Force » (ratio charge / poids de corps).",
  },
  ohp5: {
    id: "ohp5",
    title: "Développé militaire ×5",
    estimatedMinutes: "20–35 min",
    category: "Force épaules",
    equipment: "Barre ou haltères",
    measures: "Force épaules / gainage en extension.",
    protocol: [
      "Strict press debout, pas de poussée des jambes (pas de push press).",
      "Gainage serré, amplitude complète.",
    ],
    inputHint: "Charge en kg pour 5 reps strictes debout.",
    commonMistakes: [
      "Arche lombaire excessive.",
      "Pousser avec les jambes ou les hanches.",
    ],
    scoreImpact: "Pilier « Force » (haut du corps, ratio au poids de corps).",
  },
  deadlift5: {
    id: "deadlift5",
    title: "Deadlift ×5",
    estimatedMinutes: "25–40 min",
    category: "Chaîne postérieure",
    equipment: "Barre ou trap bar (noter si trap bar)",
    measures: "Force de chaîne postérieure en répétitions.",
    protocol: [
      "5 reps propres, dos neutre, pas d’échec technique.",
      "Trap bar acceptée si c’est ton référentiel habituel.",
    ],
    inputHint: "Charge en kg pour 5 reps propres.",
    commonMistakes: [
      "Dos rond sous charge.",
      "Hanches trop hautes / barre éloignée du corps.",
    ],
    scoreImpact: "Pilier « Force » (souvent le lift le plus « lourd » du triplet).",
  },
  burpees50: {
    id: "burpees50",
    title: "50 burpees",
    estimatedMinutes: "15–25 min",
    category: "Résistance musculaire + cardio",
    equipment: "Espace au sol",
    measures: "Capacité à enchaîner volume + cardio intégré.",
    protocol: [
      "Poitrine au sol, extension complète en haut.",
      "Petit saut ou extension debout : rester cohérent du début à la fin.",
    ],
    inputHint: "Temps total mm:ss pour enchaîner 50 burpees.",
    commonMistakes: [
      "Poitrine qui ne touche plus le sol en fin de série.",
      "S’arrêter trop longtemps (garder un rythme fluide).",
    ],
    scoreImpact: "Pilier « Résistance musculaire » + partie cardio courte.",
  },
  farmerCarry: {
    id: "farmerCarry",
    title: "Farmer carry",
    estimatedMinutes: "15–25 min",
    category: "Core & carry",
    equipment: "Haltères, kettlebells ou trap bar chargée",
    measures: "Grip, trapèzes, core, capacité à porter sous fatigue.",
    protocol: [
      "Charge par main, distance et temps mesurés.",
      "Posture stable, pas de straps pour coller au standard.",
    ],
    inputHint:
      "Format conseillé : mètres / secondes séparés par un slash, ex. 40/35 (= 40 m en 35 s).",
    commonMistakes: [
      "Dos voûté ou pas rythme de marche instable.",
      "Straps qui masquent la limite de grip (hors protocole strict).",
    ],
    scoreImpact: "Pilier « Core & carry ».",
  },
  hollowHold: {
    id: "hollowHold",
    title: "Hollow hold",
    estimatedMinutes: "10–15 min",
    category: "Gainage profond",
    equipment: "Tapis",
    measures: "Gainage profond / contrôle du tronc.",
    protocol: [
      "Bas du dos collé au sol, jambes tendues si possible.",
      "Bras au-dessus de la tête, arrêt si le bas du dos se décolle.",
    ],
    inputHint: "Temps maximal tenu au format mm:ss.",
    commonMistakes: [
      "Compenser en fléchissant trop les genoux.",
      "Tenir avec le dos qui se décole (fausse la mesure).",
    ],
    scoreImpact: "Pilier « Core & carry ».",
  },
};

export const TEST_PROTOCOL_LIST = (
  Object.keys(TEST_PROTOCOLS) as (keyof PerformanceInput)[]
).map((id) => TEST_PROTOCOLS[id]);
