"use client";

import { useMemo } from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
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

function buildChartSeries(entries: ScoreSnapshotEntry[]) {
  return [...entries]
    .sort((a, b) => new Date(a.savedAt).getTime() - new Date(b.savedAt).getTime())
    .map((e) => ({
      t: new Date(e.savedAt).getTime(),
      hybrid: e.hybridScore,
      reliability: e.reliabilityPct,
    }));
}

/** Liste courte + courbe des derniers scores enregistrés localement (pré-V3 cloud). */
export function ScoreSnapshotsLocalSection({ entries }: { entries: ScoreSnapshotEntry[] }) {
  const chartData = useMemo(() => buildChartSeries(entries), [entries]);
  if (entries.length === 0) return null;
  const slice = entries.slice(0, 8);
  const showChart = chartData.length >= 2;

  const tickDate = (ts: number) =>
    new Date(ts).toLocaleDateString("fr-FR", { month: "short", day: "numeric" });

  const tooltipLabel = (ts: number) =>
    new Date(ts).toLocaleString("fr-FR", {
      dateStyle: "medium",
      timeStyle: "short",
    });

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
          Préfiguration de « Mes bilans » (V3, persistance cloud).
        </p>
      </div>

      {showChart ? (
        <div
          className="rounded-2xl border border-border bg-surface/50 p-4 sm:p-5"
          role="img"
          aria-label="Courbe Hybrid Score et fiabilité dans le temps"
        >
          <p className="text-[11px] font-medium uppercase tracking-wider text-muted">
            Hybrid & fiabilité (%)
          </p>
          <div className="mt-3 h-52 w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                <XAxis
                  type="number"
                  dataKey="t"
                  domain={["dataMin", "dataMax"]}
                  tickFormatter={(v) => tickDate(v as number)}
                  stroke="rgba(255,255,255,0.35)"
                  fontSize={10}
                  tickMargin={6}
                />
                <YAxis
                  domain={[0, 100]}
                  stroke="rgba(255,255,255,0.35)"
                  fontSize={10}
                  width={32}
                />
                <Tooltip
                  labelFormatter={(v) => tooltipLabel(v as number)}
                  formatter={(value, name) => {
                    const suffix = name === "Fiabilité" ? " %" : "";
                    return [`${value ?? ""}${suffix}`, name];
                  }}
                  contentStyle={{
                    background: "rgba(18,18,22,0.96)",
                    border: "1px solid rgba(255,255,255,0.12)",
                    borderRadius: "12px",
                    fontSize: "12px",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="hybrid"
                  stroke="rgba(82,255,114,0.9)"
                  strokeWidth={2}
                  dot={{ r: 3, fill: "rgba(82,255,114,0.95)" }}
                  name="Hybrid"
                />
                <Line
                  type="monotone"
                  dataKey="reliability"
                  stroke="rgba(147, 197, 253, 0.95)"
                  strokeWidth={2}
                  dot={{ r: 3, fill: "rgba(147, 197, 253, 0.95)" }}
                  name="Fiabilité"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <p className="mt-2 text-xs text-muted">
            Axe temps : du plus ancien au plus récent parmi les points enregistrés.
          </p>
        </div>
      ) : (
        <p className="rounded-2xl border border-border bg-surface/40 px-4 py-3 text-sm text-muted">
          Enregistre au moins <span className="font-medium text-foreground">deux fois</span> tes
          performances pour afficher la courbe (un seul point pour l’instant).
        </p>
      )}

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
