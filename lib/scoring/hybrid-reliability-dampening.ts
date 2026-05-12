/**
 * Ajustement du Hybrid Score lorsque la **fiabilité** (couverture des tests) est faible :
 * on rapproche légèrement le score du neutre (50) pour limiter une lecture trop confiante
 * avec peu de données — sans remplacer l’indicateur « fiabilité % » affiché à part.
 */

function clamp(n: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, n));
}

/** Au-dessus de ce seuil, le hybrid brut est conservé tel quel. */
const RELIABILITY_FULL_TRUST = 55;

/** À fiabilité 0, fraction max de la distance vers 50 appliquée (0 = aucun effet, 1 = tirer jusqu’à 50). */
const MAX_SHIFT_AT_ZERO_RELIABILITY = 0.22;

export function dampenHybridTowardNeutralForLowReliability(
  hybridRaw: number,
  reliabilityPct: number,
): number {
  const raw = clamp(hybridRaw, 0, 100);
  const rel = clamp(reliabilityPct, 0, 100);
  if (rel >= RELIABILITY_FULL_TRUST) return Math.round(raw);
  const t = rel / RELIABILITY_FULL_TRUST;
  const shift = (1 - t) * MAX_SHIFT_AT_ZERO_RELIABILITY;
  const neutral = 50;
  const out = raw + (neutral - raw) * shift;
  return Math.round(clamp(out, 0, 100));
}
