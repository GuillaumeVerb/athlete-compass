/** Données produit — prompt 05. Les équivalences sont indicatives, pas « labo ». */

export const EQUIVALENCES_PRACTICAL_NOTE =
  "Les équivalences sont des estimations pratiques. Elles varient selon ton niveau, ton poids, ta technique et ton intensité.";

export interface MachineCard {
  id: string;
  title: string;
  tag: string;
  summary: string;
  /** Conseil si contrainte « moins de cuisses » */
  lightLegsTip?: string;
}

export const MACHINE_CARDS: MachineCard[] = [
  {
    id: "rower",
    title: "Rameur",
    tag: "Référence cardio / full body",
    summary:
      "Erg le plus neutre pour calibrer moteur court et endurance. Base idéale pour comparer les autres machines.",
    lightLegsTip:
      "Technique jambes modérée, damper modéré : moins de smash quads qu’un vélo lourd.",
  },
  {
    id: "skierg",
    title: "SkiErg",
    tag: "Haut du corps + cardio",
    summary:
      "Proche du rameur côté rythme, plus haut du corps. Bon pour alterner sans dupliquer exactement le même stimulus jambes.",
    lightLegsTip:
      "Souvent mieux toléré que gros volumes vélo ou escaliers pour limiter la charge quadriceps.",
  },
  {
    id: "bike_classic",
    title: "Vélo classique",
    tag: "Endurance / moteur",
    summary:
      "Très accessible en salle. Le stimulus diffère : moins de tirage, plus de cadence et contrôle des cuisses.",
    lightLegsTip:
      "Privilégier cadence fluide, résistance modérée ; éviter grosses résistances type force pure.",
  },
  {
    id: "bike_erg",
    title: "BikeErg",
    tag: "Cardio + jambes dos",
    summary:
      "Proche du rameur en chaîne de transmission, mais pattern mécanique différent (cyclisme).",
  },
  {
    id: "assault_bike",
    title: "Assault bike",
    tag: "Intensité maximale",
    summary:
      "Pic d’intensité et fatigue globale très rapide. Utile pour remplacer des blocs courts intenses du rameur.",
    lightLegsTip:
      "Sessions courtes ; volume élevé peut surcharger quads — alterner avec SkiErg ou rameur modéré.",
  },
  {
    id: "incline_treadmill",
    title: "Tapis incliné",
    tag: "Endurance / charge marchée",
    summary:
      "Très compatible salle classique. Souvent plus « zone 2 » que sprint pur ; réduit le travail bras du rameur.",
    lightLegsTip:
      "Inclinaison modérée = bon compromis pour limiter la domination quadriceps vs escaliers lourds.",
  },
  {
    id: "run",
    title: "Course",
    tag: "Spécificité terrain",
    summary:
      "Mesure la capacité réelle hors erg. Complète le rameur pour l’endurance longue.",
  },
  {
    id: "stairmaster",
    title: "Escalier / StairMaster",
    tag: "Quads + cardio",
    summary:
      "Charge importante sur les cuisses. Bon pour le moteur, moins pour « épargner » les jambes.",
    lightLegsTip:
      "Réduire durée ou intensité ; préférer tapis incliné modéré ou SkiErg si objectif cuisses light.",
  },
  {
    id: "burpees",
    title: "Burpees",
    tag: "Conditioning sans machine",
    summary:
      "Remplace des blocs courts intenses quand pas d’erg. Impact global plus brutal que rameur seul.",
    lightLegsTip:
      "Volume modéré : beaucoup de flexions → fatigue jambes + impact ; surveiller récupération.",
  },
  {
    id: "kb_swing",
    title: "Kettlebell swing",
    tag: "Chaîne postérieure + cardio léger",
    summary:
      "Bon relais pour stimulus hip hinge + cardio léger sans erg. Ne remplace pas 1:1 un 5 km.",
  },
  {
    id: "farmer_carry",
    title: "Farmer carry",
    tag: "Grip / core / hybride",
    summary:
      "Très proche du besoin « HYROX / hybride » pour le portage. Combine avec marche ou distance fixe.",
  },
];

export interface EquivTableRow {
  id: string;
  scenario: string;
  rower: string;
  skierg: string;
  bike: string;
  assaultBike: string;
  inclineTread: string;
  run: string;
  other: string;
  locked?: boolean;
}

/** Équivalences « distance / durée » issues du prompt 05 */
export const EQUIVALENCE_TABLE_ROWS: EquivTableRow[] = [
  {
    id: "row500",
    scenario: "≈ 500 m rameur (intense court)",
    rower: "500 m (référence)",
    skierg: "500 m SkiErg",
    bike: "≈ 1 000 m vélo / BikeErg",
    assaultBike: "≈ 2 min intense",
    inclineTread: "≈ 3 min rapide",
    run: "≈ 400 m",
    other: "≈ 2 min burpees modérés",
  },
  {
    id: "row1000",
    scenario: "≈ 1 000 m rameur",
    rower: "1 000 m (référence)",
    skierg: "1 000 m SkiErg",
    bike: "≈ 2 000 m vélo / BikeErg",
    assaultBike: "≈ 4 min",
    inclineTread: "≈ 6 min rapide",
    run: "≈ 800 m",
    other: "≈ 4 min burpees modérés",
  },
  {
    id: "run400",
    scenario: "≈ 400 m course",
    rower: "≈ 500 m rameur",
    skierg: "≈ 500 m SkiErg",
    bike: "≈ 1 000 m vélo",
    assaultBike: "≈ 2 min",
    inclineTread: "≈ 2–3 min rapide",
    run: "400 m (référence)",
    other: "—",
  },
  {
    id: "z2_15",
    scenario: "15 min zone 2",
    rower: "15 min facile",
    skierg: "15 min facile",
    bike: "≈ 20 min cadence fluide",
    assaultBike: "—",
    inclineTread: "≈ 20 min",
    run: "15 min marche rapide / footing très facile",
    other: "—",
  },
  {
    id: "premium_extra",
    scenario: "Blocs longs & sled (exemples)",
    rower: "—",
    skierg: "—",
    bike: "—",
    assaultBike: "—",
    inclineTread: "—",
    run: "—",
    other: "Sled, rope climb, formats compétition…",
    locked: true,
  },
];

export interface SwapInsight {
  title: string;
  body: string;
}

/** Ce que le remplacement change (pédagogie) */
export const SWAP_INSIGHTS: SwapInsight[] = [
  {
    title: "SkiErg → rameur",
    body: "Tu gardes un cardio « erg » complet, mais le rameur sollicite davantage les jambes et le rythme global.",
  },
  {
    title: "SkiErg → vélo",
    body: "Le moteur reste, en revanche le travail haut du corps chute : utile si épaules fatiguées, moins spécifique tirage.",
  },
  {
    title: "Rameur → tapis incliné",
    body: "Souvent moins intense côté bras/tirage ; devient plus « moteur bas / marche chargée », proche zone 2.",
  },
  {
    title: "Assault bike → burpees",
    body: "L’intensité perçue monte vite : plus d’impact et de fatigue globale pour un temps donné.",
  },
  {
    title: "Escalier → tapis incliné modéré",
    body: "Tu réduis souvent la charge quadriceps « pure » tout en gardant un cardio de marche chargée.",
  },
];

export interface CommercialGymAlt {
  movement: string;
  alternatives: string;
}

export const COMMERCIAL_GYM_ALTERNATIVES: CommercialGymAlt[] = [
  {
    movement: "Sled push",
    alternatives:
      "Tapis incliné + leg press modérée + farmer carry (distance / temps fixés).",
  },
  {
    movement: "Wall balls",
    alternatives: "Goblet squats ou thrusters haltères, mêmes séries × reps cibles.",
  },
  {
    movement: "Sandbag carry",
    alternatives: "Farmer carry ou bear hug haltères / kettlebell.",
  },
  {
    movement: "SkiErg",
    alternatives: "Rameur ou tirage poulie vertical + cardio court (vélo / tapis).",
  },
  {
    movement: "Assault bike",
    alternatives: "Vélo intense, rameur court, ou burpees modérés selon objectif.",
  },
  {
    movement: "Rope climb",
    alternatives: "Tractions strictes + tirage vertical progressif.",
  },
];

export const LIGHT_LEGS_INTRO =
  "Avec la contrainte « éviter de trop charger les cuisses », on privilégie plutôt : tapis incliné modéré, SkiErg, rameur technique modéré, vélo cadence haute résistance modérée ; on limite escalier intense, grosses plages vélo lourd et gros volumes de fentes.";
