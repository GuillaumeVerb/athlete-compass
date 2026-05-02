import { z } from "zod";

const optionalWaist = z.preprocess((val) => {
  if (val === "" || val === undefined || val === null) return undefined;
  const n = Number(val);
  return Number.isFinite(n) ? n : undefined;
}, z.number().min(50).max(200).optional());

export const profileSchema = z.object({
  age: z.coerce.number().min(16).max(80),
  sex: z.enum(["homme", "femme", "autre"]),
  heightCm: z.coerce.number().min(120).max(230),
  weightKg: z.coerce.number().min(35).max(200),
  waistCm: optionalWaist,
  goal: z.enum([
    "crossfit",
    "hyrox",
    "recomp",
    "endurance",
    "strength_aesthetics",
  ]),
  frequency: z.enum(["1-2", "3", "4-5", "6+"]),
});

export type ProfileFormValues = z.infer<typeof profileSchema>;
