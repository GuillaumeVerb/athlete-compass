import type { ScoreResult, UserProfile } from "@/lib/types";

/**
 * Identifie la version du profil + archetype score utilisés pour générer le plan.
 * Si la chaîne change, on régénère (profil, fréquence, matériel, contraintes, profil athlétique).
 */
export function planGenerationFingerprint(
  profile: UserProfile,
  result: ScoreResult,
  /** Suffixe optionnel (ex. adaptation plan) pour distinguer les snapshots. */
  tag?: string | null,
): string {
  const equipment = [...profile.equipment].sort().join(",");
  const constraints = [...profile.constraints].sort().join(",");
  const base = JSON.stringify({
    pid: result.profileId,
    age: profile.age,
    sex: profile.sex,
    goal: profile.goal,
    frequency: profile.frequency,
    equipment,
    constraints,
    heightCm: profile.heightCm,
    weightKg: profile.weightKg,
    waistCm: profile.waistCm ?? null,
  });
  const t = tag?.trim();
  return t ? `${base}::${t}` : base;
}
