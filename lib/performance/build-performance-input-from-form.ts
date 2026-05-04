import type { PerformanceInput } from "@/lib/types";
import { parseFarmerCarry, parseMmSs } from "@/lib/scoring/parse";
import { PERFORMANCE_FORM_FIELDS } from "@/lib/performance/performance-form-fields";

/**
 * Valide les champs texte du formulaire Performances (onglet Perf / `/performances`)
 * et produit un `PerformanceInput` (champs vides ignorés).
 */
export function buildPerformanceInputFromForm(
  values: Record<string, string>,
):
  | { ok: true; data: PerformanceInput }
  | { ok: false; error: string } {
  const out: PerformanceInput = {};

  for (const f of PERFORMANCE_FORM_FIELDS) {
    const raw = values[f.key]?.trim();
    if (!raw) continue;

    if (f.type === "time") {
      const sec = parseMmSs(raw);
      if (sec == null) {
        return {
          ok: false,
          error: `Format temps invalide pour « ${f.title} » : utilise mm:ss (ex. 03:32).`,
        };
      }
      (out as Record<string, string>)[f.key] = raw;
    } else if (f.type === "text" && f.key === "farmerCarry") {
      const fc = parseFarmerCarry(raw);
      if (!fc || fc.meters <= 0 || fc.seconds < 0) {
        return {
          ok: false,
          error:
            "Farmer carry : format attendu 40/35 (mètres / secondes) ou 40 m 35 s.",
        };
      }
      (out as Record<string, string>)[f.key] = raw;
    } else if (f.type === "number") {
      const n = Number(raw.replace(",", "."));
      if (!Number.isFinite(n)) {
        return { ok: false, error: `Nombre invalide pour « ${f.title} ».` };
      }
      if (f.key === "pullups" && (n < 0 || !Number.isInteger(n))) {
        return { ok: false, error: "Tractions : entre un entier ≥ 0." };
      }
      if (f.key !== "pullups" && n <= 0) {
        return {
          ok: false,
          error: `« ${f.title} » : entre un poids strictement positif (kg).`,
        };
      }
      (out as Record<string, number>)[f.key] = n;
    } else {
      (out as Record<string, string>)[f.key] = raw;
    }
  }

  return { ok: true, data: out };
}
