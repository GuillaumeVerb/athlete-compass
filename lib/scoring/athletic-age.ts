/** Âge athlétique — ludique, clampé (prompt 03 : ~ -10 / +12 ans) */

export function estimateAthleticAge(chronologicalAge: number, hybrid: number) {
  const shift = Math.round((hybrid - 50) * 0.16);
  const raw = chronologicalAge - shift;
  return Math.min(chronologicalAge + 12, Math.max(chronologicalAge - 10, raw));
}
