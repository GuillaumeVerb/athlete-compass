import type { LucideIcon } from "lucide-react";
import type { PerformanceInput } from "@/lib/types";
import type { PerformanceFormFieldMeta } from "@/lib/performance/performance-form-fields";

/** Aligné sur les piliers du score (libellés orientés utilisateur). */
export type PerfFormSectionId =
  | "cardioIntense"
  | "endurance"
  | "force"
  | "muscularEndurance"
  | "coreCarry";

export const PERF_FORM_SECTION_ORDER: PerfFormSectionId[] = [
  "cardioIntense",
  "endurance",
  "force",
  "muscularEndurance",
  "coreCarry",
];

export const PERF_FORM_SECTION_COPY: Record<
  PerfFormSectionId,
  { title: string; blurb: string }
> = {
  cardioIntense: {
    title: "Cardio intense",
    blurb: "Efforts courts et très intenses : ergs, sprints, air bike.",
  },
  endurance: {
    title: "Endurance",
    blurb: "Tenue dans la durée : course, rameur long, piscine, tapis, BikeErg / SkiErg longs.",
  },
  force: {
    title: "Force & puissance",
    blurb: "Barre, haltères, machines — respecte le protocole pour comparer dans le temps.",
  },
  muscularEndurance: {
    title: "Résistance musculaire",
    blurb: "Volume, reps, formats type WOD / hybride.",
  },
  coreCarry: {
    title: "Portage & gainage",
    blurb: "Grip, gainage profond, portages, sled.",
  },
};

const KEY_SECTION = {
  row1k: "cardioIntense",
  skiErg500: "cardioIntense",
  run400m: "cardioIntense",
  echoBikeCal1min: "cardioIntense",
  echoBike10cal: "cardioIntense",
  echoBike30cal: "cardioIntense",
  row2k: "endurance",
  run5k: "endurance",
  run10k: "endurance",
  swim400m: "endurance",
  run1kIncline: "endurance",
  bikeErg1k: "endurance",
  bikeErg2k: "endurance",
  skiErg2k: "endurance",
  wallBall150: "muscularEndurance",
  pullups: "muscularEndurance",
  dipsStrict: "muscularEndurance",
  hspuStrict: "muscularEndurance",
  muscleUp2min: "muscularEndurance",
  toesToBar: "muscularEndurance",
  burpees50: "muscularEndurance",
  airSquat100: "muscularEndurance",
  kbSwing100: "muscularEndurance",
  hybridDbChipper: "muscularEndurance",
  doubleUnders1min: "muscularEndurance",
  pushupsStrict: "muscularEndurance",
  ropeClimb2min: "muscularEndurance",
  lunges2min: "muscularEndurance",
  frontSquat5: "force",
  backSquat3: "force",
  bulgarianSplitSquat8: "force",
  benchPress5: "force",
  ohp5: "force",
  tbarRow10: "force",
  deadlift5: "force",
  boxJumpMaxCm: "force",
  farmerCarry: "coreCarry",
  sandbagCarry: "coreCarry",
  sledCarry: "coreCarry",
  hollowHold: "coreCarry",
  lSitHold: "coreCarry",
  loadNotes: "muscularEndurance",
} as const satisfies Record<keyof PerformanceInput, PerfFormSectionId>;

export type PerformanceFormFieldWithIcon = PerformanceFormFieldMeta & {
  icon: LucideIcon;
};

export function groupPerformanceFormFields(
  fields: PerformanceFormFieldWithIcon[],
): {
  sectionId: PerfFormSectionId;
  title: string;
  blurb: string;
  fields: PerformanceFormFieldWithIcon[];
}[] {
  const indexByKey = new Map(
    fields.map((f, i) => [f.key, i] as const),
  );
  return PERF_FORM_SECTION_ORDER.map((sectionId) => {
    const copy = PERF_FORM_SECTION_COPY[sectionId];
    const sectionFields = fields
      .filter((f) => KEY_SECTION[f.key] === sectionId)
      .sort((a, b) => indexByKey.get(a.key)! - indexByKey.get(b.key)!);
    return {
      sectionId,
      title: copy.title,
      blurb: copy.blurb,
      fields: sectionFields,
    };
  }).filter((g) => g.fields.length > 0);
}
