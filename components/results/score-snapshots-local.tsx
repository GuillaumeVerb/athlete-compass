"use client";

import type { ScoreSnapshotEntry } from "@/lib/scoring/score-snapshots";

function formatWhen(iso: string): string {
  try {
    return new Date(iso).toLocaleString("fr-FR", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  } catch {
    return iso;
  }
}

/** Liste courte des derniers scores enregistrés localement (pré-V3 cloud). */
export function ScoreSnapshotsLocalSection({ entries }: { entries: ScoreSnapshotEntry[] }) {
  if (entries.length === 0) return null;
  const slice = entries.slice(0, 8);
  return (
    <section className="space-y-3" aria-labelledby="results-snapshots-heading">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">Progression</p>
        <h2
          id="results-snapshots-heading"
          className="text-display mt-1.5 text-lg font-semibold tracking-tight text-foreground sm:text-xl"
        >
          Historique local du score
        </h2>
        <p className="mt-2 max-w-2xl text-sm text-muted">
          Chaque enregistrement depuis la page Performances ajoute un point (navigateur uniquement).
          Base pour la future courbe « Mes bilans » (V3).
        </p>
      </div>
      <ul className="divide-y divide-border rounded-2xl border border-border bg-surface/50">
        {slice.map((row, i) => (
          <li key={`${row.savedAt}-${i}`} className="flex flex-wrap items-baseline justify-between gap-3 px-4 py-3 text-sm">
            <span className="text-muted">{formatWhen(row.savedAt)}</span>
            <span className="font-medium text-foreground">
              Hybrid <span className="text-neon">{row.hybridScore}</span>
              <span className="text-muted"> · fiabilité {row.reliabilityPct} %</span>
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
