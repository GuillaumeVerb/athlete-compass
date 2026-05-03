/** Niveaux de fiabilité du score (prompt 09) — seuils sur 0–100 %. */
export type ReliabilityTier = "faible" | "moyen" | "bon" | "élevé";

export function reliabilityTierFromPct(pct: number): ReliabilityTier {
  if (pct < 40) return "faible";
  if (pct < 60) return "moyen";
  if (pct < 80) return "bon";
  return "élevé";
}

export function reliabilityTierExplanationFr(
  pct: number,
  missingCount: number,
): string {
  const tier = reliabilityTierFromPct(pct);
  const base: Record<ReliabilityTier, string> = {
    faible:
      "Peu de tests renseignés : le score reflète surtout des défauts ou des biais de calcul.",
    moyen:
      "Les piliers manquants pèsent encore : le profil est lisible mais à confirmer avec 1–2 tests clés.",
    bon:
      "La majorité des leviers est couverte : lecture fiable pour orienter l’entraînement.",
    élevé:
      "Presque tous les tests utiles sont là : le score est exploitable pour prioriser.",
  };
  const miss =
    missingCount > 0
      ? ` Il manque encore ${missingCount} donnée${missingCount > 1 ? "s" : ""} pondérante${missingCount > 1 ? "s" : ""}.`
      : "";
  return base[tier] + miss;
}
