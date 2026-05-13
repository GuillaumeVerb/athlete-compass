"use client";

import { useCallback, useMemo, useRef, useState, type ChangeEvent } from "react";
import { Download, Trash2, Upload } from "lucide-react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Button } from "@/components/ui/button";
import {
  applyScoreSnapshotsImport,
  buildScoreSnapshotsExport,
  clearScoreSnapshots,
  parseScoreSnapshotsImportPayload,
  type ScoreSnapshotEntry,
} from "@/lib/scoring/score-snapshots";

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
      athletic: typeof e.athleticAge === "number" && Number.isFinite(e.athleticAge) ? e.athleticAge : null,
    }));
}

/** Liste courte + courbe + export / effacement (pré-V3 cloud). */
export function ScoreSnapshotsLocalSection({
  entries,
  hybridDampeningActive = false,
}: {
  entries: ScoreSnapshotEntry[];
  /** Quand la fiabilité actuelle est sous 55 % : rappel amortissement (en plus de la carte Hybrid). */
  hybridDampeningActive?: boolean;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [importNotice, setImportNotice] = useState<{
    kind: "ok" | "err";
    text: string;
  } | null>(null);

  const chartData = useMemo(() => buildChartSeries(entries), [entries]);
  const slice = entries.slice(0, 8);
  const showChart = chartData.length >= 2;
  const athleticVals = useMemo(
    () => chartData.map((d) => d.athletic).filter((x): x is number => x != null),
    [chartData],
  );
  const showAthleticChart = athleticVals.length >= 2;
  const athMin = showAthleticChart ? Math.floor(Math.min(...athleticVals) - 1) : 0;
  const athMax = showAthleticChart ? Math.ceil(Math.max(...athleticVals) + 1) : 1;

  const tickDate = (ts: number) =>
    new Date(ts).toLocaleDateString("fr-FR", { month: "short", day: "numeric" });

  const tooltipLabel = (ts: number) =>
    new Date(ts).toLocaleString("fr-FR", {
      dateStyle: "medium",
      timeStyle: "short",
    });

  const onDownloadJson = useCallback(() => {
    const payload = buildScoreSnapshotsExport(entries);
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    const day = new Date().toISOString().slice(0, 10);
    a.href = url;
    a.download = `athlete-compass-historique-score-${day}.json`;
    a.rel = "noopener";
    a.click();
    URL.revokeObjectURL(url);
  }, [entries]);

  const onClearHistory = useCallback(() => {
    const ok = window.confirm(
      "Supprimer tout l’historique local du score (courbes et liste) ? Cette action est irréversible.",
    );
    if (!ok) return;
    clearScoreSnapshots();
  }, []);

  const onPickImportFile = useCallback(() => {
    setImportNotice(null);
    fileRef.current?.click();
  }, []);

  const onImportFile = useCallback(async (ev: ChangeEvent<HTMLInputElement>) => {
    const file = ev.target.files?.[0];
    ev.target.value = "";
    if (!file) return;
    setImportNotice(null);
    try {
      const text = await file.text();
      let data: unknown;
      try {
        data = JSON.parse(text) as unknown;
      } catch {
        setImportNotice({ kind: "err", text: "JSON illisible — vérifie le fichier exporté." });
        return;
      }
      const parsed = parseScoreSnapshotsImportPayload(data);
      if (!parsed.ok) {
        setImportNotice({ kind: "err", text: parsed.error });
        return;
      }
      const changed = applyScoreSnapshotsImport(parsed.entries);
      setImportNotice({
        kind: "ok",
        text: changed
          ? "Historique fusionné avec le fichier (doublons proches ignorés, plafond respecté)."
          : "Aucun changement : tout était déjà présent ou équivalent.",
      });
    } catch {
      setImportNotice({ kind: "err", text: "Lecture du fichier impossible." });
    }
  }, []);

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
        {hybridDampeningActive ? (
          <p
            className="mt-3 max-w-2xl rounded-xl border border-amber/30 bg-amber/10 px-3 py-2 text-xs leading-relaxed text-foreground/90"
            role="note"
          >
            Tant que la fiabilité est sous 55 %, le Hybrid (carte ci-dessus) est{" "}
            <strong className="font-medium text-foreground">légèrement amorti vers le neutre</strong>{" "}
            — les points de cette courbe suivent le chiffre affiché, pas le brut avant amortissement.
          </p>
        ) : null}
        <div className="mt-3 flex flex-wrap gap-2">
          <input
            id="score-snapshots-json-import"
            ref={fileRef}
            type="file"
            accept="application/json,.json"
            className="sr-only"
            tabIndex={-1}
            aria-label="Importer un fichier JSON d’historique de score"
            onChange={onImportFile}
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="rounded-xl"
            onClick={onPickImportFile}
          >
            <Upload aria-hidden />
            Importer JSON
          </Button>
          <Button type="button" variant="outline" size="sm" className="rounded-xl" onClick={onDownloadJson}>
            <Download aria-hidden />
            Télécharger JSON
          </Button>
          <Button
            type="button"
            variant="secondary"
            size="sm"
            className="rounded-xl border border-destructive/35 text-destructive hover:bg-destructive/10"
            onClick={onClearHistory}
          >
            <Trash2 aria-hidden />
            Effacer l&apos;historique
          </Button>
        </div>
        {importNotice ? (
          <p
            className={
              importNotice.kind === "ok"
                ? "mt-2 max-w-2xl rounded-xl border border-neon/35 bg-neon/10 px-3 py-2 text-xs text-foreground/95"
                : "mt-2 max-w-2xl rounded-xl border border-destructive/35 bg-destructive/10 px-3 py-2 text-xs text-foreground/95"
            }
            role="status"
          >
            {importNotice.text}
          </p>
        ) : null}
      </div>

      {entries.length === 0 ? (
        <p className="rounded-2xl border border-border bg-surface/40 px-4 py-3 text-sm text-muted">
          Aucun point enregistré pour l’instant. Enregistre tes performances depuis la page{" "}
          <span className="font-medium text-foreground/90">Performances</span>, ou importe un export JSON
          depuis un autre navigateur.
        </p>
      ) : null}

      {entries.length > 0 && showChart ? (
        <div
          className="space-y-6 rounded-2xl border border-border bg-surface/50 p-4 sm:p-5"
          role="group"
          aria-label="Courbes d’évolution du score enregistré localement"
        >
          <div role="img" aria-label="Courbe Hybrid Score et fiabilité dans le temps">
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
          </div>

          {showAthleticChart ? (
            <div role="img" aria-label="Courbe âge athlétique dans le temps">
              <p className="text-[11px] font-medium uppercase tracking-wider text-muted">
                Âge athlétique (ans)
              </p>
              <div className="mt-3 h-44 w-full min-w-0">
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
                      domain={[athMin, athMax]}
                      stroke="rgba(255,255,255,0.35)"
                      fontSize={10}
                      width={32}
                    />
                    <Tooltip
                      labelFormatter={(v) => tooltipLabel(v as number)}
                      formatter={(value) => [`${value ?? ""}`, "Âge athl."]}
                      contentStyle={{
                        background: "rgba(18,18,22,0.96)",
                        border: "1px solid rgba(255,255,255,0.12)",
                        borderRadius: "12px",
                        fontSize: "12px",
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="athletic"
                      stroke="rgba(251, 191, 36, 0.95)"
                      strokeWidth={2}
                      connectNulls={false}
                      dot={{ r: 3, fill: "rgba(251, 191, 36, 0.95)" }}
                      name="Âge athl."
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          ) : (
            <p className="text-xs leading-relaxed text-muted">
              Courbe âge athlétique : enregistre à nouveau tes performances (au moins deux points avec
              cette donnée) — les tout premiers snapshots n’avaient pas encore ce champ.
            </p>
          )}

          <p className="text-xs text-muted">
            Axe temps : du plus ancien au plus récent parmi les points enregistrés.
          </p>
        </div>
      ) : entries.length > 0 ? (
        <p className="rounded-2xl border border-border bg-surface/40 px-4 py-3 text-sm text-muted">
          Enregistre au moins <span className="font-medium text-foreground">deux fois</span> tes
          performances pour afficher la courbe (un seul point pour l’instant).
        </p>
      ) : null}

      {entries.length > 0 ? (
      <ul className="divide-y divide-border rounded-2xl border border-border bg-surface/50">
        {slice.map((row, i) => (
          <li key={`${row.savedAt}-${i}`} className="flex flex-wrap items-baseline justify-between gap-3 px-4 py-3 text-sm">
            <span className="text-muted">{formatWhen(row.savedAt)}</span>
            <span className="font-medium text-foreground">
              Hybrid <span className="text-neon">{row.hybridScore}</span>
              <span className="text-muted"> · fiabilité {row.reliabilityPct} %</span>
              {typeof row.athleticAge === "number" ? (
                <span className="text-muted">
                  {" "}
                  · âge athl. <span className="text-foreground/90">{row.athleticAge}</span> ans
                </span>
              ) : null}
            </span>
          </li>
        ))}
      </ul>
      ) : null}
    </section>
  );
}
