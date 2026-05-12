export type StepsCsvRow = { day: string; steps: number };

/**
 * Parse un CSV simple : `YYYY-MM-DD,pas` ou `YYYY-MM-DD;pas`.
 * Première ligne optionnelle avec en-têtes (date, pas, steps…).
 */
export function parseStepsCsv(
  text: string,
):
  | { ok: true; rows: StepsCsvRow[] }
  | { ok: false; error: string } {
  const lines = text
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l.length > 0);
  if (lines.length === 0) return { ok: false, error: "Fichier vide." };

  let start = 0;
  const head = lines[0].toLowerCase();
  if (
    head.includes("date") ||
    head.includes("jour") ||
    head.includes("day") ||
    head.includes("pas") ||
    head.includes("steps")
  ) {
    start = 1;
  }

  const rows: StepsCsvRow[] = [];
  for (let i = start; i < lines.length; i++) {
    const parts = lines[i].split(/[;,]/).map((x) => x.trim());
    if (parts.length < 2) continue;
    const day = /^\d{4}-\d{2}-\d{2}$/.test(parts[0]) ? parts[0] : null;
    if (!day) continue;
    const raw = parts[1].replace(/\s/g, "").replace(",", ".");
    const steps = Number(raw);
    if (!Number.isFinite(steps)) continue;
    rows.push({
      day,
      steps: Math.round(Math.max(0, Math.min(300_000, steps))),
    });
  }

  if (rows.length === 0) {
    return {
      ok: false,
      error:
        "Aucune ligne valide. Format attendu : YYYY-MM-DD,pas (une ligne par jour).",
    };
  }
  return { ok: true, rows };
}
