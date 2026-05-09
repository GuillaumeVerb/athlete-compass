"use client";

import { useMemo } from "react";
import Link from "next/link";
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Button } from "@/components/ui/button";
import { MedicalDisclaimer } from "@/components/disclaimer";
import { computeBodyProgressSignal, MOCK_BODY_SERIES } from "@/lib/mock/body-progress";
import { computeScoreResult } from "@/lib/scoring";
import { DEMO_PERFORMANCE, DEMO_PROFILE } from "@/lib/mock-data";
import { loadPerformance, loadProfile } from "@/lib/storage";

export function BodyProgressClient() {
  const { signal, hybrid, athleticAge } = useMemo(() => {
    const profile = loadProfile() ?? DEMO_PROFILE;
    const perf = loadPerformance() ?? DEMO_PERFORMANCE;
    const r = computeScoreResult(profile, perf);
    const first = MOCK_BODY_SERIES[0];
    const last = MOCK_BODY_SERIES[MOCK_BODY_SERIES.length - 1];
    const w = last.weightKg - first.weightKg;
    const waist = last.waistCm - first.waistCm;
    return { signal: computeBodyProgressSignal(w, waist), hybrid: r.hybridScore, athleticAge: r.athleticAge };
  }, []);

  const chartData = MOCK_BODY_SERIES.map((row) => ({
    ...row,
    label: row.date.slice(5),
  }));

  return (
    <div className="space-y-10">
      <header>
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">Recomposition</p>
        <h1 className="text-display text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          Body Progress
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-muted">
          Suivi démo (pas de carnet poids régime). Les courbes illustrent une tendance — pas une mesure de masse grasse
          précise.
        </p>
      </header>

      <section className="rounded-2xl border border-neon/25 bg-neon/5 p-5 sm:p-6">
        <h2 className="text-display text-lg font-semibold text-foreground">Signal recomposition</h2>
        <p className="mt-2 text-sm font-medium text-neon">{signal.label}</p>
        <p className="mt-2 text-sm leading-relaxed text-muted">{signal.detail}</p>
        <p className="mt-3 text-xs text-muted">
          Hybrid Score actuel (bilan) : <span className="text-foreground">{hybrid}</span> — Âge athlétique :{" "}
          <span className="text-foreground">{athleticAge} ans</span>
        </p>
      </section>

      <section className="rounded-2xl border border-border bg-surface/70 p-4 sm:p-5">
        <h2 className="text-display text-sm font-semibold text-foreground">Tendances (démo)</h2>
        <div className="mt-4 w-full min-h-56 min-w-0">
          <ResponsiveContainer width="100%" height={224}>
            <LineChart data={chartData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
              <XAxis dataKey="label" stroke="#8b98a8" tick={{ fontSize: 11 }} />
              <YAxis yAxisId="w" stroke="#8b98a8" width={36} tick={{ fontSize: 11 }} domain={["dataMin - 1", "dataMax + 1"]} />
              <YAxis yAxisId="wa" orientation="right" stroke="#8b98a8" width={36} tick={{ fontSize: 11 }} domain={["dataMin - 1", "dataMax + 1"]} />
              <Tooltip
                contentStyle={{ background: "#111820", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 12 }}
                labelStyle={{ color: "#f4f7fa" }}
              />
              <Line yAxisId="w" type="monotone" dataKey="weightKg" name="Poids (kg)" stroke="#52ff72" strokeWidth={2} dot={false} />
              <Line yAxisId="wa" type="monotone" dataKey="waistCm" name="Taille (cm)" stroke="#f5b82e" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </section>

      <div className="flex flex-wrap gap-2">
        <Button asChild className="rounded-xl">
          <Link href="/daily">Retour Aujourd&apos;hui</Link>
        </Button>
        <Button asChild variant="outline" className="rounded-xl">
          <Link href="/performances">Mettre à jour mes perfs</Link>
        </Button>
      </div>

      <MedicalDisclaimer />
    </div>
  );
}
