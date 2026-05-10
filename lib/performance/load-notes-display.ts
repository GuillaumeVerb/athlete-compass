import type { PerformanceLoadNotes } from "@/lib/types";
import { PERFORMANCE_FORM_FIELDS } from "@/lib/performance/performance-form-fields";

export type LoadNoteDisplayRow = {
  noteKey: keyof PerformanceLoadNotes;
  testTitle: string;
  kg: number;
};

const kgFmt = new Intl.NumberFormat("fr-FR", {
  maximumFractionDigits: 1,
  minimumFractionDigits: 0,
});

export function formatLoadNoteKg(kg: number): string {
  return kgFmt.format(kg);
}

/** Lignes à afficher, dans l’ordre du formulaire `/performances`. */
export function loadNotesDisplayRows(
  ln: PerformanceLoadNotes | undefined,
): LoadNoteDisplayRow[] {
  if (!ln) return [];
  const rows: LoadNoteDisplayRow[] = [];
  for (const f of PERFORMANCE_FORM_FIELDS) {
    if (!f.optionalLoad) continue;
    const kg = ln[f.optionalLoad.noteKey];
    if (kg == null) continue;
    rows.push({
      noteKey: f.optionalLoad.noteKey,
      testTitle: f.title,
      kg,
    });
  }
  return rows;
}

export function hasAnyLoadNotes(ln: PerformanceLoadNotes | undefined): boolean {
  return loadNotesDisplayRows(ln).length > 0;
}
