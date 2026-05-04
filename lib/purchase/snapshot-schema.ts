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

export const performanceInputSnapshotSchema = z.object({
  row1k: z.string().optional(),
  row2k: z.string().optional(),
  run5k: z.string().optional(),
  pullups: z.number().optional(),
  frontSquat5: z.number().optional(),
  ohp5: z.number().optional(),
  deadlift5: z.number().optional(),
  burpees50: z.string().optional(),
  farmerCarry: z.string().optional(),
  hollowHold: z.string().optional(),
});

export const checkoutSnapshotBodySchema = z.object({
  profile: userProfileSnapshotSchema,
  performance: performanceInputSnapshotSchema,
});

export type CheckoutSnapshotBody = z.infer<typeof checkoutSnapshotBodySchema>;
