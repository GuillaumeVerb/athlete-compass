import type { AthleticProfileId, EquipmentKey, ScoreResult, UserProfile } from "@/lib/types";
import { buildSessionBlocks } from "@/lib/plans/session-blocks";
import { defaultPerformanceKeysForSessionKind } from "@/lib/plans/session-performance-links";
import type {
  PlanSession,
  PlanWeek,
  SessionKind,
} from "@/lib/plans/plan-types";

export type {
  PlanSession,
  PlanSessionBlock,
  PlanSessionExercise,
  PlanWeek,
  SessionKind,
} from "@/lib/plans/plan-types";

type Bias = "endurance" | "strength" | "muscle" | "recovery" | "balanced";

function hasEq(eq: EquipmentKey[], k: EquipmentKey) {
  return eq.includes(k);
}

function sessionSlots(freq: UserProfile["frequency"]): number {
  if (freq === "1-2") return 3;
  if (freq === "3") return 4;
  return 5;
}

function capDays(profile: UserProfile): number {
  return profile.constraints.includes("3_days_max") ? 3 : sessionSlots(profile.frequency);
}

function biasFromProfile(id: AthleticProfileId): Bias {
  if (id === "endurance_gap" || id === "diesel") return "endurance";
  if (id === "strength_gap" || id === "strong_slow") return "strength";
  if (id === "muscular_endurance_gap") return "muscle";
  if (id === "under_recovered") return "recovery";
  return "balanced";
}

function dialDuration(base: number, profile: UserProfile): number {
  let d = base;
  if (profile.constraints.includes("short_sessions")) d = Math.min(d, 42);
  return d;
}

const KIND_LABEL: Record<SessionKind, string> = {
  force_upper: "Force haut du corps",
  force_lower: "Force jambes",
  zone2: "Zone 2",
  metcon_short: "Metcon court",
  hybrid_core: "Hybride & core",
  test_retest: "Test / retest",
  recovery_active: "Récupération active",
};

function baseSession(
  kind: SessionKind,
  profile: UserProfile,
  weekNum: number,
): PlanSession {
  const title = `Séance — ${KIND_LABEL[kind]}`;
  const baseDur =
    kind === "zone2" ? 55 : kind === "recovery_active" ? 35 : kind === "test_retest" ? 40 : 50;
  const durationMin = dialDuration(baseDur, profile);

  const objectives: Record<SessionKind, string> = {
    force_upper: "Qualité de tirage et de poussée — volume modéré.",
    force_lower: "Patrons de squat / hip hinge sans gronder les genoux.",
    zone2: "Construire la base aérobie sans saturer le système nerveux.",
    metcon_short: "Conditionnement intégré sans partir en zone rouge dès le début.",
    hybrid_core: "Chaîne complète gainage + cardio léger intégré.",
    test_retest: "Mesurer pour ajuster la semaine suivante.",
    recovery_active: "Descendre le stress systémique tout en bougent.",
  };

  const short: Record<SessionKind, string> = {
    force_upper: "Haut du corps propre, pas une séance « max out ».",
    force_lower: "Jambes + posterior, charges progressives.",
    zone2: "Allure stable — si tu parles difficilement, tu es trop vite.",
    metcon_short: "Court, intense mais répétable.",
    hybrid_core: "Core utile sur la fatigue, pas 1000 sit-ups.",
    test_retest: "Un chiffre, une sensation, une décision.",
    recovery_active: "Ça compte comme une séance : récup = progression.",
  };

  const tags: Record<SessionKind, string[]> = {
    force_upper: ["Force"],
    force_lower: ["Force"],
    zone2: ["Endurance"],
    metcon_short: ["Conditioning"],
    hybrid_core: ["Hybride", "Core"],
    test_retest: ["Hybride", "Test"],
    recovery_active: ["Recovery"],
  };

  const blocks = buildSessionBlocks(kind, profile, weekNum);

  return {
    title,
    tags: tags[kind],
    kind,
    durationMin,
    sessionObjective: objectives[kind],
    blocks,
    shortVersion: short[kind],
    relatedPerformanceKeys: defaultPerformanceKeysForSessionKind(kind),
  };
}

function substitutionFor(
  kind: SessionKind,
  profile: UserProfile,
): string | undefined {
  const { equipment: eq, constraints: c } = profile;
  const bits: string[] = [];

  if (kind === "zone2" || kind === "metcon_short" || kind === "hybrid_core") {
    if (c.includes("no_running")) {
      bits.push("Pas de course : privilégie rameur, SkiErg ou vélo.");
    }
    if (!hasEq(eq, "rower") && hasEq(eq, "bike")) {
      bits.push("Sans rameur : vélo erg ou tapis incliné en remplacement de durée équivalente.");
    }
    if (!hasEq(eq, "rower") && !hasEq(eq, "bike") && hasEq(eq, "skierg")) {
      bits.push("SkiErg ou marche active si les ergs sont pris.");
    }
  }

  if (kind === "force_lower" && c.includes("light_legs")) {
    bits.push("Moins de cuisses : remplace squat lourd par split squat léger, step-up ou sled push haut du corps.");
  }

  if (c.includes("commercial_gym")) {
    bits.push("Salle classique : adapte aux machines disponibles (poulie, leg press tempo, vélo).");
  }

  if (bits.length === 0) return undefined;
  return bits.join(" ");
}

function personalizeSession(s: PlanSession, profile: UserProfile): PlanSession {
  const sub = substitutionFor(s.kind, profile);
  return { ...s, substitution: sub };
}

/** Données legacy (mainMoves) ou snapshots sans `blocks`. */
function ensureSessionBlocks(
  sess: PlanSession,
  profile: UserProfile,
  weekNum: number,
): PlanSession {
  if (Array.isArray(sess.blocks) && sess.blocks.length > 0) {
    return sess;
  }
  const withLegacy = sess as PlanSession & { mainMoves?: string[] };
  if (withLegacy.mainMoves?.length) {
    return {
      ...sess,
      blocks: [
        {
          label: "Exercices principaux",
          exercises: withLegacy.mainMoves.map((text) => ({
            name: text,
            prescription: "",
          })),
        },
      ],
    };
  }
  return {
    ...sess,
    blocks: buildSessionBlocks(sess.kind, profile, weekNum),
  };
}

function withRelatedPerformanceKeys(sess: PlanSession): PlanSession {
  if (
    Array.isArray(sess.relatedPerformanceKeys) &&
    sess.relatedPerformanceKeys.length > 0
  ) {
    return sess;
  }
  return {
    ...sess,
    relatedPerformanceKeys: defaultPerformanceKeysForSessionKind(sess.kind),
  };
}

/** Snapshots localStorage : blocs + liens perfs à jour après changement de schéma. */
export function rehydratePlanWeeks(
  weeks: PlanWeek[],
  profile: UserProfile,
): PlanWeek[] {
  return weeks.map((w) => ({
    ...w,
    sessions: w.sessions.map((s) =>
      withRelatedPerformanceKeys(ensureSessionBlocks(s, profile, w.week)),
    ),
  }));
}

function rotateKinds(base: SessionKind[], bias: Bias, week: number): SessionKind[] {
  if (bias === "recovery") {
    return [
      "recovery_active",
      "zone2",
      "hybrid_core",
      "force_upper",
      "zone2",
    ];
  }
  const pool = [...base];
  if (bias === "endurance" && week >= 2) {
    const z = pool.filter((k) => k === "zone2").length;
    if (z < 2) pool.splice(2, 0, "zone2");
  }
  if (bias === "strength") {
    if (pool[0] !== "force_upper" && pool[0] !== "force_lower") {
      pool.unshift("force_upper");
    }
  }
  if (bias === "muscle") {
    const i = pool.findIndex((k) => k === "metcon_short");
    if (i === -1) pool.splice(2, 0, "metcon_short");
  }
  return pool;
}

const WEEK_BLUEPRINTS: {
  weekTheme: string;
  objective: string;
  checks: string[];
  focus: string;
  coherence: number;
  kinds: SessionKind[];
}[] = [
  {
    weekTheme: "Construire la base",
    objective: "Installer un rythme hybride sans te cramer.",
    checks: [
      "3 séances complétées (ou toutes si fréquence basse)",
      "1 sortie Zone 2 réelle (pas une « course » à fond)",
      "1 nuit sommeil 7h+ après la séance la plus dure",
    ],
    focus: "Qualité du mouvement + repères cardio",
    coherence: 68,
    kinds: ["force_upper", "zone2", "force_lower", "metcon_short", "hybrid_core"],
  },
  {
    weekTheme: "Ajouter de l’intensité",
    objective:
      "Monter le volume utile : une touche intervalles (rameur / vélo) + conservation de la force.",
    checks: [
      "Ajouter 5–10 min sur la Zone 2 si la récup est verte",
      "Garder 1 jour off actif (marche)",
    ],
    focus: "Volume endurance / conditioning",
    coherence: 70,
    kinds: ["force_upper", "zone2", "force_lower", "metcon_short", "hybrid_core"],
  },
  {
    weekTheme: "Consolider",
    objective: "Intensifier sans casser la technique.",
    checks: [
      "1 progression mesurée (charge ou temps)",
      "Hydratation + sommeil suivis 5/7",
    ],
    focus: "Intensité contrôlée",
    coherence: 72,
    kinds: ["force_upper", "zone2", "force_lower", "metcon_short", "hybrid_core"],
  },
  {
    weekTheme: "Tester et ajuster",
    objective: "Consolider : même structure, meilleure exécution.",
    checks: [
      "Retest léger (500 m rameur ou 10 min tempo)",
      "Noter RPE moyen par séance",
    ],
    focus: "Exécution & retest",
    coherence: 74,
    kinds: ["force_upper", "test_retest", "zone2", "metcon_short", "hybrid_core"],
  },
];

function tweakWeekKinds(
  weekIdx: number,
  kinds: SessionKind[],
  bias: Bias,
): SessionKind[] {
  let k = rotateKinds(kinds, bias, weekIdx + 1);
  if (bias === "endurance" && weekIdx === 1) {
    k = ["zone2", "force_upper", "zone2", "force_lower", "metcon_short"];
  }
  if (bias === "strength" && weekIdx === 1) {
    k = ["force_upper", "force_lower", "metcon_short", "zone2", "hybrid_core"];
  }
  if (bias === "muscle" && weekIdx >= 2) {
    k = ["metcon_short", "force_upper", "hybrid_core", "zone2", "force_lower"];
  }
  return k;
}

export function sessionKindLabelFr(kind: SessionKind): string {
  return KIND_LABEL[kind];
}

/** Plan minimal efficace : profil, limiteur (via archetype), fréquence, matériel, contraintes. */
export function generateFourWeekPlan(
  profile: UserProfile,
  result: ScoreResult,
  genOpts?: { forceRecoveryBias?: boolean },
): PlanWeek[] {
  const bias: Bias = genOpts?.forceRecoveryBias
    ? "recovery"
    : biasFromProfile(result.profileId);
  const maxSessions = capDays(profile);

  return WEEK_BLUEPRINTS.map((bp, idx) => {
    const kinds = tweakWeekKinds(idx, bp.kinds, bias).slice(0, maxSessions);
    const weekNum = idx + 1;
    const sessions = kinds
      .map((kind) =>
        personalizeSession(baseSession(kind, profile, weekNum), profile),
      )
      .map((sess) =>
        withRelatedPerformanceKeys(ensureSessionBlocks(sess, profile, weekNum)),
      );
    return {
      week: weekNum,
      weekTheme: bp.weekTheme,
      objective: bp.objective,
      objectiveChecks: bp.checks,
      focus: bp.focus,
      coherencePct: bp.coherence + idx,
      sessions,
    };
  });
}
