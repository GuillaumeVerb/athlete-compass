import type { PerformanceLoadNotes } from "@/lib/types";

/** Préfixe des clés formulaire pour les charges optionnelles (`loadNotes`). */
export const PERF_LOAD_NOTE_FORM_PREFIX = "ln:" as const;

export function perfLoadNoteFormKey(
  k: keyof PerformanceLoadNotes,
): `${typeof PERF_LOAD_NOTE_FORM_PREFIX}${keyof PerformanceLoadNotes}` {
  return `${PERF_LOAD_NOTE_FORM_PREFIX}${k}`;
}
