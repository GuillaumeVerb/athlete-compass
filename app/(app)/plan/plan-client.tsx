"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { WeekPlan } from "@/components/plan/week-plan";
import { generateFourWeekPlan } from "@/lib/plans/generate-plan";
import type { PlanWeek } from "@/lib/plans/generate-plan";
import { MedicalDisclaimer } from "@/components/disclaimer";
import { Button } from "@/components/ui/button";
import { DEMO_PERFORMANCE, DEMO_PROFILE } from "@/lib/mock-data";
import { loadPerformance, loadProfile } from "@/lib/storage";
import { computeScoreResult } from "@/lib/scoring";

export function PlanClient() {
  const [weeks, setWeeks] = useState<PlanWeek[] | null>(null);

  useEffect(() => {
    queueMicrotask(() => {
      const profile = loadProfile() ?? DEMO_PROFILE;
      const perf = loadPerformance() ?? DEMO_PERFORMANCE;
      const result = computeScoreResult(profile, perf);
      setWeeks(generateFourWeekPlan(profile, result));
    });
  }, []);

  if (!weeks) {
    return (
      <div className="animate-pulse space-y-6">
        <div className="h-9 w-56 rounded-lg bg-surface-elevated" />
        <div className="h-32 rounded-2xl bg-surface-elevated/80" />
        <div className="h-64 rounded-2xl bg-surface-elevated/80" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-display text-3xl font-semibold text-foreground">
          Plan 4 semaines
        </h1>
        <p className="mt-2 max-w-2xl text-muted">
          Minimum structuré selon ton profil, ton limiteur détecté, ta fréquence,
          ton matériel et tes contraintes (démo V1 — pas un programme médical).
        </p>
      </div>

      <WeekPlan weeks={weeks} />

      <div className="flex flex-col gap-3 rounded-2xl border border-border bg-surface/40 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm leading-relaxed text-muted">
          Adapte les charges à ton niveau. Arrête ou modifie l&apos;exercice en
          cas de douleur inhabituelle.
        </p>
        <Button asChild variant="outline" className="shrink-0 rounded-xl">
          <Link href="/equivalences">Adapter selon mon matériel</Link>
        </Button>
      </div>

      <MedicalDisclaimer />
    </div>
  );
}
