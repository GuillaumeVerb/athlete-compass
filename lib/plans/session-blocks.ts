import type { UserProfile } from "@/lib/types";
import type { PlanSessionBlock, SessionKind } from "./plan-types";

type Ctx = {
  short: boolean;
  noRun: boolean;
  lightLegs: boolean;
  commercialGym: boolean;
  weekNum: number;
};

function buildCtx(profile: UserProfile, weekNum: number): Ctx {
  const c = profile.constraints;
  return {
    short: c.includes("short_sessions"),
    noRun: c.includes("no_running"),
    lightLegs: c.includes("light_legs"),
    commercialGym: c.includes("commercial_gym"),
    weekNum,
  };
}

function z2Modality(ctx: Ctx): string {
  if (ctx.noRun) {
    return "Rameur, SkiErg, BikeErg ou vélo stationnaire — pas de course.";
  }
  return "Course très facile, rameur, SkiErg, vélo ou marche inclinée.";
}

/** Blocs séries / reps / tempo — V1 démo, à adapter à la sensation (RPE). */
export function buildSessionBlocks(
  kind: SessionKind,
  profile: UserProfile,
  weekNum: number,
): PlanSessionBlock[] {
  const ctx = buildCtx(profile, weekNum);
  switch (kind) {
    case "force_upper":
      return blocksForceUpper(ctx);
    case "force_lower":
      return ctx.lightLegs ? blocksForceLowerLight(ctx) : blocksForceLower(ctx);
    case "zone2":
      return blocksZone2(ctx);
    case "metcon_short":
      return blocksMetcon(ctx);
    case "hybrid_core":
      return blocksHybridCore(ctx);
    case "test_retest":
      return blocksTestRetest(ctx);
    case "recovery_active":
      return blocksRecovery(ctx);
  }
}

function blocksForceUpper(ctx: Ctx): PlanSessionBlock[] {
  const wu: PlanSessionBlock = {
    label: "Échauffement (8–12 min)",
    exercises: ctx.short
      ? [
          {
            name: "Épaules / scapulas",
            prescription: "2 min mobilité + 10 cercles bras tendus.",
          },
          {
            name: "Tirage léger ou élastique",
            prescription: "2 × 12 reps lentes, omoplates actives.",
          },
        ]
      : [
          {
            name: "Mobilité thorax & omoplates",
            prescription: "3 min — ouvertures + rotations T-spine.",
            cue: "Respire calmement, pas de douleur vive.",
          },
          {
            name: "Activation tirage",
            prescription: "Ring rows ou tirage poulie haute léger : 2 × 12–15.",
          },
          {
            name: "Activation poussée",
            prescription: "Pompes surélevées ou strict press léger : 2 × 10.",
          },
        ],
  };

  const tier =
    ctx.weekNum <= 1 ? "RPE 7" : ctx.weekNum >= 4 ? "RPE 7–7,5 (qualité)" : "RPE 7–8";

  const mainA: PlanSessionBlock = {
    label: "Bloc principal — Tirage (25–35 min)",
    exercises: [
      {
        name: "Tractions pronation ou neutre",
        prescription: `4 × (4–8) si poids du corps ; sinon assistées / négatives. Repos 2:00–2:30. Cible ${tier} sur la dernière série.`,
        cue: "Descente contrôlée 2–3 s, menton haut sans cambrer.",
      },
      {
        name: "Rowing haltère ou tirage horizontal",
        prescription: "4 × 8–12 / bras ou bilatéral. Repos 90 s–2:00.",
        cue: "Coude à ~45°, gainage actif.",
      },
    ],
  };

  const mainB: PlanSessionBlock = {
    label: "Bloc principal — Poussée",
    exercises: [
      {
        name: "Développé militaire debout ou assis",
        prescription: "4 × 6–10 @ barre ou haltères. Repos 2:00–2:30.",
        cue: "Fesses serrées, côtes descendues, barre vertical au-dessus des épaules.",
      },
      {
        name: "Poussée inclinée haltères ou pompes lestées",
        prescription: "3 × 8–12. Repos 90 s.",
        cue: "Amplitude complète, pas de rebond en bas.",
      },
    ],
  };

  const acc: PlanSessionBlock = {
    label: "Accessoires & volume (10–15 min)",
    exercises: ctx.short
      ? [
          {
            name: "Curl ou tri ext poulie",
            prescription: "2 × 12–15 chaque.",
          },
          {
            name: "Face pull ou Y-T-W",
            prescription: "2 × 12–15 — posture scapulaire.",
          },
        ]
      : [
          {
            name: "Élévations latérales ou upright row léger",
            prescription: "3 × 12–15.",
          },
          {
            name: "Triceps poulie ou dips assistés",
            prescription: "3 × 10–15.",
          },
          {
            name: "Face pull ou external rotation",
            prescription: "2 × 15–20 — épaules saines.",
          },
        ],
  };

  const cool: PlanSessionBlock = {
    label: "Retour au calme (3–5 min)",
    exercises: [
      {
        name: "Étirements légers + respiration",
        prescription: "Pas d’étirement balistique après force.",
      },
    ],
  };

  return [wu, mainA, mainB, acc, cool];
}

function blocksForceLower(ctx: Ctx): PlanSessionBlock[] {
  const wu: PlanSessionBlock = {
    label: "Échauffement (10–14 min)",
    exercises: ctx.short
      ? [
          { name: "Mobilité hanches + chevilles", prescription: "3 min." },
          { name: "Squat vide ou goblet léger", prescription: "2 × 8 reps profondes." },
        ]
      : [
          { name: "Marche / vélo très léger", prescription: "4–5 min." },
          { name: "Mobilité hanches / chevilles", prescription: "3 min." },
          {
            name: "Squat pattern à vide ou goblet",
            prescription: "2 × 8 + 2 × 5 montée progressive.",
          },
        ],
  };

  const squatPres =
    ctx.weekNum <= 2
      ? "4 × 5–8 @ RPE 7–8. Repos 2:30–3:00 entre séries lourdes."
      : "4 × 4–6 @ RPE 7,5–8 ou 3 × 6–8 technique parfaite.";

  const main: PlanSessionBlock = {
    label: "Bloc principal — Squat & hinge",
    exercises: [
      {
        name: "Squat avant ou back squat (selon confort)",
        prescription: squatPres,
        cue: "Même profondeur rep après rep, genoux alignés orteils.",
      },
      {
        name: "RDL ou soulevé de terre roumain",
        prescription: "4 × 6–10. Repos 2:00.",
        cue: "Hanche en arrière, barre proche des cuisses.",
      },
      {
        name: "Fentes bulgares ou walking lunges",
        prescription: "3 × 8–12 / jambe ou total. Repos 90 s.",
      },
    ],
  };

  const acc: PlanSessionBlock = {
    label: "Accessoires (10–12 min)",
    exercises: ctx.short
      ? [
          {
            name: "Leg curl ou Nordic assisté",
            prescription: "3 × 10–12.",
          },
          {
            name: "Mollets debout",
            prescription: "3 × 12–15 pause 1 s en haut.",
          },
        ]
      : [
          {
            name: "Leg extension + leg curl",
            prescription: "3 × 12–15 chaque machine.",
          },
          {
            name: "Mollets debout ou assis",
            prescription: "4 × 12–20.",
          },
          {
            name: "Gainage side plank",
            prescription: "2 × 30–45 s / côté.",
          },
        ],
  };

  return [wu, main, acc];
}

function blocksForceLowerLight(ctx: Ctx): PlanSessionBlock[] {
  return [
    {
      label: "Échauffement (8–10 min)",
      exercises: [
        { name: "Activation hanche", prescription: "Clamshells + pont fessier : 2 × 12." },
        { name: "Step-up bas", prescription: "2 × 8 / jambe sans douleur au genou." },
      ],
    },
    {
      label: "Bloc principal — Charges modérées",
      exercises: [
        {
          name: "Split squat arrière ou step-up contrôlé",
          prescription: "4 × 8–12 / jambe. Repos 90 s. Charge modérée.",
          cue: "Genou qui ne part pas en valgus ; torse droit.",
        },
        {
          name: "RDL léger ou good morning haltères",
          prescription: "3 × 10–12. Repos 90 s.",
        },
        {
          name: "Leg press tempo (3-1-2-0) ou presse mono",
          prescription: "3 × 12–15 @ RPE 6–7.",
        },
      ],
    },
    {
      label: "Finisher léger (option)",
      exercises: [
        {
          name: "Extensions ischio ou curl ischio",
          prescription: "2 × 12–15.",
        },
      ],
    },
  ];
}

function blocksZone2(ctx: Ctx): PlanSessionBlock[] {
  const modality = z2Modality(ctx);
  const dur =
    ctx.short ? "30–38 min" : ctx.weekNum >= 3 ? "40–50 min" : "35–45 min";

  return [
    {
      label: "Consignes d’allure",
      exercises: [
        {
          name: "Zone 2 stricte",
          prescription: `${dur} en continu — conversation possible, légère gêne respiratoire max.`,
          cue: "Même cadence du début à la fin ; pas d’accélérations « bonus ».",
        },
        {
          name: "Modalité",
          prescription: modality,
        },
      ],
    },
    {
      label: "Structure simple (exemple)",
      exercises: [
        {
          name: "Bloc principal",
          prescription: ctx.short
            ? "10 min très facile → 18–22 min cible Z2 → 5 min retour facile."
            : "8 min facile → 28–38 min cible Z2 → 6–8 min retour facile.",
        },
        {
          name: "Hydratation & notes",
          prescription: "Note FC moyenne ou perception ; même parcours la semaine suivante pour comparer.",
        },
      ],
    },
    {
      label: "Option semaine avancée",
      exercises: [
        {
          name: "Progression douce",
          prescription:
            ctx.weekNum >= 2 && !ctx.short
              ? "Si sommeil OK : +5 min sur le segment central ou +1 allure très légère."
              : "Garde la même durée semaine 1 — priorité régularité.",
        },
      ],
    },
  ];
}

function blocksMetcon(ctx: Ctx): PlanSessionBlock[] {
  const cardio =
    ctx.noRun
      ? "Rameur / SkiErg / BikeErg en rotation."
      : "Course facile, rameur ou mix selon espace.";

  return [
    {
      label: "Échauffement (8–10 min)",
      exercises: [
        { name: "Mobilité globale + 2 montées en régime", prescription: "5 min + 2 × 20 s modéré." },
        {
          name: "Technique des mouvements du WOD",
          prescription: "2 tours légers des mouvements du jour.",
        },
      ],
    },
    {
      label: "Travail principal — Format court",
      exercises: [
        {
          name: "Option A — AMRAP 10 min",
          prescription:
            "8 burpees + 10 KB swings + 12 cal cardio (rameur/bike). Score = tours complets + reps partielles.",
          cue: "Garde 1–2 reps « en réserve » sur la dernière minute.",
        },
        {
          name: "Option B — EMOM 12",
          prescription:
            "Min 1 : 12 wall balls légers. Min 2 : 10 box step-ups. Min 3 : 200 m rameur facile. Répéter 4 fois.",
        },
        {
          name: "Choix matériel",
          prescription: ctx.commercialGym
            ? "Substitutions : poulie pour tirage, step, vélo si zone bondée."
            : cardio,
        },
      ],
    },
    {
      label: "Retour au calme",
      exercises: [
        {
          name: "Marche lente ou vélo très léger",
          prescription: "5–8 min + respiration ventrale 2 min.",
        },
      ],
    },
  ];
}

function blocksHybridCore(ctx: Ctx): PlanSessionBlock[] {
  return [
    {
      label: "Préparation (6–8 min)",
      exercises: [
        { name: "Gainage dynamique", prescription: "Dead bug 2 × 8 + bird dog 2 × 8." },
        { name: "Activation grip", prescription: "Farmer hold léger 2 × 20 s." },
      ],
    },
    {
      label: "Portages & chaîne antérieure",
      exercises: [
        {
          name: "Farmer carry ou portage kettlebell",
          prescription: "5 tours × 30–40 m @ charge exigeante mais postures nickel. Repos marche entre tours.",
        },
        {
          name: "Sandbag carry ou sled marché (si dispo)",
          prescription: "4 × 20–30 m aller simple ou aller-retour.",
        },
      ],
    },
    {
      label: "Core profond",
      exercises: [
        {
          name: "Hollow hold ou dead bug lesté",
          prescription: "4 × 20–40 s ou 3 × 10 reps lentes.",
        },
        {
          name: "Planche avant / latérale",
          prescription: "3 × 20–30 s + 2 × 20 s / côté.",
        },
      ],
    },
    {
      label: "Finisher cardio léger + core",
      exercises: [
        {
          name: "Assault / Echo léger ou rameur Z3 courte",
          prescription: ctx.short
            ? "6 × 20 s modéré / 40 s très facile."
            : "8 × 20 s modéré / 40 s facile.",
        },
        {
          name: "Russian twist ou pallof press",
          prescription: "3 × 12–16.",
        },
      ],
    },
  ];
}

function blocksTestRetest(ctx: Ctx): PlanSessionBlock[] {
  const weekNote =
    ctx.weekNum >= 4
      ? "Semaine 4 : privilégie un retest court (500 m rameur ou 10 min allure fixe) plutôt qu’un max global."
      : "Choisir un test aligné avec ton limiteur (cf. page Résultats / Prochain test).";

  return [
    {
      label: "Préparation test (12–15 min)",
      exercises: [
        {
          name: "Échauffement spécifique",
          prescription: "Progressif vers l’allure cible sur 6–8 min + 2 touches proches de l’effort.",
        },
        {
          name: "Consigne générale",
          prescription: weekNote,
        },
      ],
    },
    {
      label: "Tests possibles (un seul au choix)",
      exercises: [
        {
          name: "500 m rameur",
          prescription: "Tout donner après échauffement — noter temps + RPE 1–10.",
        },
        {
          name: "10 min tempo fixe (rameur / bike / ski)",
          prescription: "Allure « dur mais stable » — distance ou watts moyen.",
        },
        {
          name: "AMRAP 6 min contrôlé",
          prescription: "Mouvements simples déjà maîtrisés ; note tours + perception.",
        },
      ],
    },
    {
      label: "Après l’effort",
      exercises: [
        {
          name: "Retour facile + log",
          prescription: "8 min très léger puis note résultat, sommeil veille, stress du jour.",
        },
      ],
    },
  ];
}

function blocksRecovery(ctx: Ctx): PlanSessionBlock[] {
  return [
    {
      label: "Flux très léger (20–30 min)",
      exercises: [
        {
          name: "Marche ou vélo outdoor / indoor",
          prescription: "Conversation facile — pas de montée « cardio ».",
        },
      ],
    },
    {
      label: "Mobilité ciblée (12–18 min)",
      exercises: [
        {
          name: "Hanches + adducteurs",
          prescription: "Squat pause basse assistée, 9090, fente isométrique douce : 6–8 min.",
        },
        {
          name: "Thorax & overhead",
          prescription: "Ouvertures sur rouleau ou brique, rotations : 6–8 min.",
        },
      ],
    },
    {
      label: "Respiration & NS bas",
      exercises: [
        {
          name: "Respiration ventrale 5–5 ou box breathing",
          prescription: "5 min assis, yeux fermés.",
        },
        {
          name: "Étirements statiques doux",
          prescription: "30–45 s / groupe musculaire, sans douleur vive.",
        },
      ],
    },
  ];
}
