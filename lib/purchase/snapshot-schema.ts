import { z } from "zod";
import { profileSchema } from "@/lib/schemas";

/** Profil complet tel que sauvegardé dans localStorage. */
export const userProfileSnapshotSchema = profileSchema.extend({
  equipment: z
    .array(
      z.enum([
        "rower",
        "skierg",
        "bike",
        "incline_treadmill",
        "kettlebells",
        "dumbbells",
        "barbell",
        "sled",
        "box",
        "cable",
      ]),
    )
    .default([]),
  constraints: z
    .array(
      z.enum([
        "no_running",
        "light_legs",
        "3_days_max",
        "short_sessions",
        "commercial_gym",
      ]),
    )
    .default([]),
});

const performanceLoadNotesSchema = z
  .object({
    wallBall150Kg: z.number().positive().max(600).optional(),
    hybridDbChipperDbTotalKg: z.number().positive().max(600).optional(),
    kbSwing100Kg: z.number().positive().max(600).optional(),
    farmerCarryKg: z.number().positive().max(600).optional(),
    sandbagCarryKg: z.number().positive().max(600).optional(),
    sledCarryKg: z.number().positive().max(600).optional(),
  })
  .optional();

export const performanceInputSnapshotSchema = z.object({
  row1k: z.string().optional(),
  skiErg500: z.string().optional(),
  run400m: z.string().optional(),
  row2k: z.string().optional(),
  run5k: z.string().optional(),
  run10k: z.string().optional(),
  swim400m: z.string().optional(),
  run1kIncline: z.string().optional(),
  bikeErg1k: z.string().optional(),
  bikeErg2k: z.string().optional(),
  skiErg2k: z.string().optional(),
  echoBikeCal1min: z.number().optional(),
  echoBike10cal: z.string().optional(),
  echoBike30cal: z.string().optional(),
  wallBall150: z.string().optional(),
  pullups: z.number().optional(),
  dipsStrict: z.number().optional(),
  hspuStrict: z.number().optional(),
  muscleUp2min: z.number().optional(),
  toesToBar: z.number().optional(),
  burpees50: z.string().optional(),
  airSquat100: z.string().optional(),
  kbSwing100: z.string().optional(),
  hybridDbChipper: z.string().optional(),
  doubleUnders1min: z.number().optional(),
  pushupsStrict: z.number().optional(),
  ropeClimb2min: z.number().optional(),
  lunges2min: z.number().optional(),
  frontSquat5: z.number().optional(),
  backSquat3: z.number().optional(),
  bulgarianSplitSquat8: z.number().optional(),
  benchPress5: z.number().optional(),
  ohp5: z.number().optional(),
  tbarRow10: z.number().optional(),
  deadlift5: z.number().optional(),
  boxJumpMaxCm: z.number().optional(),
  farmerCarry: z.string().optional(),
  sandbagCarry: z.string().optional(),
  sledCarry: z.string().optional(),
  hollowHold: z.string().optional(),
  lSitHold: z.string().optional(),
  loadNotes: performanceLoadNotesSchema,
});

export const checkoutSnapshotBodySchema = z.object({
  profile: userProfileSnapshotSchema,
  performance: performanceInputSnapshotSchema,
});

export type CheckoutSnapshotBody = z.infer<typeof checkoutSnapshotBodySchema>;
