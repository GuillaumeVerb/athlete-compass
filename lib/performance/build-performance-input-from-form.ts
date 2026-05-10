import type { PerformanceInput, PerformanceLoadNotes } from "@/lib/types";
import { parseFarmerCarry, parseMmSs } from "@/lib/scoring/parse";
import { PERFORMANCE_FORM_FIELDS } from "@/lib/performance/performance-form-fields";
import { perfLoadNoteFormKey } from "@/lib/performance/performance-load-notes";

const CARRY_KEYS = new Set<keyof PerformanceInput>([
  "farmerCarry",
  "sandbagCarry",
  "sledCarry",
]);

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
    } else if (f.type === "text" && CARRY_KEYS.has(f.key)) {
      const fc = parseFarmerCarry(raw);
      if (!fc || fc.meters <= 0 || fc.seconds < 0) {
        return {
          ok: false,
          error: `« ${f.title} » : format mètres/secones attendu (ex. 40/35).`,
        };
      }
      (out as Record<string, string>)[f.key] = raw;
    } else if (f.type === "number") {
      const n = Number(raw.replace(",", "."));
      if (!Number.isFinite(n)) {
        return { ok: false, error: `Nombre invalide pour « ${f.title} ».` };
      }
      const kind = f.numberKind ?? "kg";
      if (kind === "reps") {
        if (n < 0 || !Number.isInteger(n)) {
          return {
            ok: false,
            error: `« ${f.title} » : entre un entier ≥ 0.`,
          };
        }
        (out as Record<string, number>)[f.key] = n;
      } else if (kind === "cm") {
        if (!Number.isInteger(n) || n < 25 || n > 150) {
          return {
            ok: false,
            error: `« ${f.title} » : entre une hauteur entière entre 25 et 150 cm.`,
          };
        }
        (out as Record<string, number>)[f.key] = n;
      } else {
        if (n <= 0) {
          return {
            ok: false,
            error: `« ${f.title} » : entre un poids strictement positif (kg).`,
          };
        }
        (out as Record<string, number>)[f.key] = n;
      }
    } else {
      (out as Record<string, string>)[f.key] = raw;
    }
  }

  const maxOptionalKg = 600;
  const ln: PerformanceLoadNotes = {};
  for (const f of PERFORMANCE_FORM_FIELDS) {
    if (!f.optionalLoad) continue;
    const formKey = perfLoadNoteFormKey(f.optionalLoad.noteKey);
    const raw = values[formKey]?.trim();
    if (!raw) continue;
    const n = Number(raw.replace(",", "."));
    if (!Number.isFinite(n) || n <= 0 || n > maxOptionalKg) {
      return {
        ok: false,
        error: `« ${f.optionalLoad.label} » : entre un poids en kg (1–${maxOptionalKg}).`,
      };
    }
    ln[f.optionalLoad.noteKey] = n;
  }
  if (Object.keys(ln).length > 0) {
    out.loadNotes = ln;
  }

  return { ok: true, data: out };
}
