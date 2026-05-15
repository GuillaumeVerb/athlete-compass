"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { Download } from "lucide-react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  fetchAssessmentsList,
  CLOUD_ASSESSMENT_LIST_CHANGED_EVENT,
  type AssessmentListItemClient,
} from "@/lib/assessments/assessments-api-client";
import { subscribeSupabaseSession } from "@/lib/plans/sync-plan-cloud-client";
import {
  loadScoreSnapshots,
  SCORE_SNAPSHOTS_CHANGED_EVENT,
  type ScoreSnapshotEntry,
} from "@/lib/scoring/score-snapshots";
import { Button } from "@/components/ui/button";

type TrendRow = {
  t: number;
  hybridLocal?: number;
  hybridCloud?: number;
  reliabilityLocal?: number;
  reliabilityCloud?: number;
  athleticLocal?: number;
  athleticCloud?: number;
};

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

function mergeTrendRows(
  local: ScoreSnapshotEntry[],
  cloud: AssessmentListItemClient[],
): TrendRow[] {
  const byT = new Map<number, TrendRow>();
  const bump = (t: number, patch: Partial<TrendRow>) => {
    const cur = byT.get(t) ?? { t };
    byT.set(t, { ...cur, ...patch, t });
  };
  for (const e of local) {
    bump(new Date(e.savedAt).getTime(), {
      hybridLocal: e.hybridScore,
      reliabilityLocal: e.reliabilityPct,
      athleticLocal:
        typeof e.athleticAge === "number" && Number.isFinite(e.athleticAge)
          ? e.athleticAge
          : undefined,
    });
  }
  for (const c of cloud) {
    bump(new Date(c.createdAt).getTime(), {
      hybridCloud: c.hybridScore,
      reliabilityCloud: c.reliabilityPct,
      athleticCloud: c.athleticAge,
    });
  }
  return [...byT.values()].sort((a, b) => a.t - b.t);
}

function latestLocal(entries: ScoreSnapshotEntry[]): ScoreSnapshotEntry | null {
  if (!entries.length) return null;
  return [...entries].sort(
    (a, b) => new Date(b.savedAt).getTime() - new Date(a.savedAt).getTime(),
  )[0]!;
}

function latestCloud(items: AssessmentListItemClient[]): AssessmentListItemClient | null {
  if (!items.length) return null;
  return [...items].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  )[0]!;
}

const tooltipStyle = {
  background: "rgba(18,18,22,0.96)",
  border: "1px solid rgba(255,255,255,0.12)",
  borderRadius: "12px",
  fontSize: "12px",
} as const;

function downloadChartSvg(container: HTMLElement | null, basename: string) {
  if (!container) return;
  const svg = container.querySelector("svg");
  if (!svg) return;
  const rect = svg.getBoundingClientRect();
  const clone = svg.cloneNode(true) as SVGSVGElement;
  clone.setAttribute("xmlns", "http://www.w3.org/2000/svg");
  clone.setAttribute("width", String(Math.max(1, Math.round(rect.width))));
  clone.setAttribute("height", String(Math.max(1, Math.round(rect.height))));
  const xml = new XMLSerializer().serializeToString(clone);
  const blob = new Blob([xml], { type: "image/svg+xml;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  const day = new Date().toISOString().slice(0, 10);
  a.href = url;
  a.download = `${basename}-${day}.svg`;
  a.rel = "noopener";
  a.click();
  URL.revokeObjectURL(url);
}

/** Courbes superposées : historique local (Performances) vs bilans cloud — même échelle que la section « historique local ». */
export function ScoreLocalCloudCompare() {
  const [localTick, setLocalTick] = useState(0);
  const [cloudItems, setCloudItems] = useState<AssessmentListItemClient[]>([]);
  const hybridChartWrapRef = useRef<HTMLDivElement | null>(null);
  const athleticChartWrapRef = useRef<HTMLDivElement | null>(null);

  const localEntries = useMemo(() => loadScoreSnapshots(), [localTick]);

  useEffect(() => {
    const fn = () => setLocalTick((x) => x + 1);
    window.addEventListener(SCORE_SNAPSHOTS_CHANGED_EVENT, fn);
    return () => window.removeEventListener(SCORE_SNAPSHOTS_CHANGED_EVENT, fn);
  }, []);

  const refreshCloud = useCallback(async () => {
    const res = await fetchAssessmentsList(40);
    setCloudItems(res.ok ? res.items : []);
  }, []);

  useEffect(() => {
    const fn = () => void refreshCloud();
    window.addEventListener(CLOUD_ASSESSMENT_LIST_CHANGED_EVENT, fn);
    return () => window.removeEventListener(CLOUD_ASSESSMENT_LIST_CHANGED_EVENT, fn);
  }, [refreshCloud]);

  useEffect(() => {
    return subscribeSupabaseSession((has) => {
      if (!has) {
        setCloudItems([]);
        return;
      }
      void refreshCloud();
    });
  }, [refreshCloud]);

  const rows = useMemo(
    () => mergeTrendRows(localEntries, cloudItems),
    [localEntries, cloudItems],
  );

  const hasLocal = localEntries.length > 0;
  const hasCloud = cloudItems.length > 0;
  const showHybridRel =
    rows.length > 0 &&
    rows.some(
      (r) =>
        r.hybridLocal != null ||
        r.hybridCloud != null ||
        r.reliabilityLocal != null ||
        r.reliabilityCloud != null,
    );

  const athleticLocals = rows.map((r) => r.athleticLocal).filter((x): x is number => x != null);
  const athleticClouds = rows.map((r) => r.athleticCloud).filter((x): x is number => x != null);
  const showAthletic =
    athleticLocals.length > 0 || athleticClouds.length > 0
      ? athleticLocals.length + athleticClouds.length >= 2 ||
        (athleticLocals.length >= 1 && athleticClouds.length >= 1)
      : false;

  const athVals = [...athleticLocals, ...athleticClouds];
  const athMin = athVals.length ? Math.floor(Math.min(...athVals) - 1) : 0;
  const athMax = athVals.length ? Math.ceil(Math.max(...athVals) + 1) : 1;

  const loc = latestLocal(localEntries);
  const clo = latestCloud(cloudItems);

  const tickDate = (ts: number) =>
    new Date(ts).toLocaleDateString("fr-FR", { month: "short", day: "numeric" });
  const tooltipLabel = (ts: number) =>
    new Date(ts).toLocaleString("fr-FR", { dateStyle: "medium", timeStyle: "short" });

  return (
    <section
      id="progression-local-cloud"
      className="scroll-mt-24 space-y-3"
      aria-labelledby="results-local-cloud-compare-heading"
    >
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">
          Comparaison
        </p>
        <h2
          id="results-local-cloud-compare-heading"
          className="text-display mt-1.5 text-lg font-semibold tracking-tight text-foreground sm:text-xl"
        >
          Local vs cloud (même navigateur)
        </h2>
        <p className="mt-2 max-w-2xl text-sm text-muted">
          {hasLocal && hasCloud ? (
            <>
              <strong className="font-medium text-foreground/90">Local</strong> : points créés quand
              tu enregistres tes performances (historique ci-dessus).{" "}
              <strong className="font-medium text-foreground/90">Cloud</strong> : bilans depuis{" "}
              <Link href="/bilans" className="text-neon underline">
                Mes bilans
              </Link>{" "}
              ou le bouton plus bas. Tirets = local, plein = cloud.
            </>
          ) : hasCloud && !hasLocal ? (
            <>
              <span className="rounded-md border border-neon/25 bg-neon/10 px-2 py-0.5 text-[11px] font-medium uppercase tracking-wide text-neon/95">
                Cloud seul
              </span>{" "}
              — courbes <strong className="font-medium text-foreground/90">pleines</strong> uniquement.
              Ajoute des points via{" "}
              <Link href="/performances" className="text-neon underline">
                Performances
              </Link>{" "}
              pour superposer le local (tirets).
            </>
          ) : (
            <>
              <span className="rounded-md border border-border bg-surface-elevated/80 px-2 py-0.5 text-[11px] font-medium uppercase tracking-wide text-muted">
                Local seul
              </span>{" "}
              — courbes en tirets. Connecte-toi et enregistre un bilan cloud pour la série pleine.
            </>
          )}
        </p>
      </div>

      {!hasLocal && !hasCloud ? (
        <p className="rounded-2xl border border-border bg-surface/40 px-4 py-3 text-sm text-muted">
          Aucune série à afficher : enregistre tes performances (local) et/ou connecte-toi pour
          pousser des bilans cloud.
        </p>
      ) : null}

      {loc || clo ? (
        <div className="rounded-2xl border border-border bg-surface/45 px-4 py-3 text-xs leading-relaxed text-muted">
          {loc ? (
            <p>
              <span className="font-medium text-foreground/90">Dernier point local</span> —{" "}
              {formatWhen(loc.savedAt)} : Hybrid{" "}
              <span className="text-neon">{loc.hybridScore}</span>, fiabilité {loc.reliabilityPct}{" "}
              %
              {typeof loc.athleticAge === "number" ? (
                <>, âge athl. {loc.athleticAge} ans</>
              ) : null}
              .
            </p>
          ) : (
            <p className="flex flex-wrap items-center gap-x-2 gap-y-1">
              <span className="rounded border border-border bg-surface-elevated/60 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-muted">
                Local absent
              </span>
              <span>
                Va sur{" "}
                <Link href="/performances" className="text-neon underline">
                  Performances
                </Link>{" "}
                pour ajouter la série en tirets.
              </span>
            </p>
          )}
          {clo ? (
            <p className="mt-1.5">
              <span className="font-medium text-foreground/90">Dernier bilan cloud</span> —{" "}
              {formatWhen(clo.createdAt)} : Hybrid{" "}
              <span className="text-neon">{clo.hybridScore}</span>, fiabilité {clo.reliabilityPct} %,
              âge athl. {clo.athleticAge} ans.
            </p>
          ) : (
            <p className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1">
              <span className="rounded border border-border bg-surface-elevated/60 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-muted">
                Cloud absent
              </span>
              <span>
                <Link href="/bilans" className="text-neon underline">
                  Mes bilans
                </Link>{" "}
                ou bouton « Bilan cloud » ci-dessous.
              </span>
            </p>
          )}
          {loc && clo ? (
            <p className="mt-1.5 text-foreground/85">
              Écart Hybrid (cloud − local, derniers en date) :{" "}
              <span className="font-semibold tabular-nums text-foreground">
                {clo.hybridScore >= loc.hybridScore ? "+" : ""}
                {clo.hybridScore - loc.hybridScore}
              </span>{" "}
              pt
            </p>
          ) : null}
        </div>
      ) : null}

      {showHybridRel ? (
        <div
          className="space-y-6 rounded-2xl border border-border bg-surface/50 p-4 sm:p-5"
          role="group"
          aria-label="Courbes Hybrid et fiabilité local vs cloud"
        >
          <div className="flex flex-wrap items-end justify-between gap-2">
            <p className="text-[11px] font-medium uppercase tracking-wider text-muted">
              Hybrid & fiabilité (%)
            </p>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="shrink-0 gap-1 rounded-xl text-xs"
              onClick={() =>
                downloadChartSvg(hybridChartWrapRef.current, "progression-hybrid-fiabilite")
              }
              aria-label="Télécharger la courbe Hybrid et fiabilité au format SVG"
            >
              <Download className="size-3.5" aria-hidden />
              SVG
            </Button>
          </div>
          <div ref={hybridChartWrapRef} className="mt-3 h-52 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={rows} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
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
                      const suffix = String(name).includes("Fiabilité") ? " %" : "";
                      return [`${value ?? "—"}${suffix}`, name];
                    }}
                    contentStyle={tooltipStyle}
                  />
                  {hasLocal ? (
                    <>
                      <Line
                        type="monotone"
                        dataKey="hybridLocal"
                        stroke="rgba(82,255,114,0.55)"
                        strokeWidth={2}
                        strokeDasharray="6 4"
                        dot={{ r: 3, fill: "rgba(82,255,114,0.7)" }}
                        name="Hybrid (local)"
                        connectNulls
                      />
                      <Line
                        type="monotone"
                        dataKey="reliabilityLocal"
                        stroke="rgba(147, 197, 253, 0.55)"
                        strokeWidth={2}
                        strokeDasharray="6 4"
                        dot={{ r: 3, fill: "rgba(147, 197, 253, 0.7)" }}
                        name="Fiabilité (local)"
                        connectNulls
                      />
                    </>
                  ) : null}
                  {hasCloud ? (
                    <>
                      <Line
                        type="monotone"
                        dataKey="hybridCloud"
                        stroke="rgba(82,255,114,0.95)"
                        strokeWidth={2}
                        dot={{ r: 3, fill: "rgba(82,255,114,0.95)" }}
                        name="Hybrid (cloud)"
                        connectNulls
                      />
                      <Line
                        type="monotone"
                        dataKey="reliabilityCloud"
                        stroke="rgba(147, 197, 253, 0.95)"
                        strokeWidth={2}
                        dot={{ r: 3, fill: "rgba(147, 197, 253, 0.95)" }}
                        name="Fiabilité (cloud)"
                        connectNulls
                      />
                    </>
                  ) : null}
                </LineChart>
              </ResponsiveContainer>
            </div>

          {showAthletic ? (
            <div className="min-w-0">
              <div className="flex flex-wrap items-end justify-between gap-2">
                <p className="text-[11px] font-medium uppercase tracking-wider text-muted">
                  Âge athlétique (ans)
                </p>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="shrink-0 gap-1 rounded-xl text-xs"
                  onClick={() =>
                    downloadChartSvg(
                      athleticChartWrapRef.current,
                      "progression-age-athletique",
                    )
                  }
                  aria-label="Télécharger la courbe âge athlétique au format SVG"
                >
                  <Download className="size-3.5" aria-hidden />
                  SVG
                </Button>
              </div>
              <div ref={athleticChartWrapRef} className="mt-3 h-44 w-full min-w-0">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={rows} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
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
                      formatter={(value, name) => [`${value ?? "—"}`, name]}
                      contentStyle={tooltipStyle}
                    />
                    {hasLocal ? (
                      <Line
                        type="monotone"
                        dataKey="athleticLocal"
                        stroke="rgba(251, 191, 36, 0.6)"
                        strokeWidth={2}
                        strokeDasharray="6 4"
                        dot={{ r: 3, fill: "rgba(251, 191, 36, 0.75)" }}
                        name="Âge athl. (local)"
                        connectNulls={false}
                      />
                    ) : null}
                    {hasCloud ? (
                      <Line
                        type="monotone"
                        dataKey="athleticCloud"
                        stroke="rgba(251, 191, 36, 0.95)"
                        strokeWidth={2}
                        dot={{ r: 3, fill: "rgba(251, 191, 36, 0.95)" }}
                        name="Âge athl. (cloud)"
                        connectNulls
                      />
                    ) : null}
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          ) : hasLocal && !athleticLocals.length ? (
            <p className="text-xs text-muted">
              Âge athlétique (local) : tes plus anciens points n’avaient pas encore ce champ — la
              courbe cloud reste affichée si disponible.
            </p>
          ) : null}

          <p className="text-xs text-muted">
            Axe temps : chronologique. Les séries peuvent diverger si profil ou perfs changent entre
            deux enregistrements. Les boutons <span className="text-foreground/80">SVG</span> produisent
            un fichier vectoriel (ouvrir dans le navigateur ou Figma ; PNG via capture ou export
            outil).
          </p>
        </div>
      ) : hasLocal || hasCloud ? (
        <p className="rounded-2xl border border-border bg-surface/40 px-4 py-3 text-sm text-muted">
          Pas assez de points pour tracer : au moins <strong className="font-medium text-foreground/90">deux dates</strong>{" "}
          sur une série, ou un point de chaque côté (local + cloud).
        </p>
      ) : null}
    </section>
  );
}
