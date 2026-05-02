"use client";

import { useEffect, useState, type ReactNode } from "react";
import Link from "next/link";
import type { PerformanceInput, ScoreResult, UserProfile } from "@/lib/types";
import { computeScoreResult } from "@/lib/scoring";
import { DEMO_PERFORMANCE, DEMO_PROFILE } from "@/lib/mock-data";
import { loadPerformance, loadProfile } from "@/lib/storage";
import { listMissingTestTitles } from "@/lib/scoring/reliability";
import { AthleticAgeCard } from "@/components/results/athletic-age-card";
import { HybridScoreCard } from "@/components/results/hybrid-score-card";
import { ResultsRadarChart } from "@/components/results/radar-chart";
import { ProfileCard } from "@/components/results/profile-card";
import { LimiterCard } from "@/components/results/limiter-card";
import { NextTestCard } from "@/components/results/next-test-card";
import { NextBestMoveCard } from "@/components/results/next-best-move-card";
import { GoalsFourWeeksCard } from "@/components/results/goals-four-weeks-card";
import { GoalHybridExplainer } from "@/components/results/goal-hybrid-explainer";
import { MedicalDisclaimer } from "@/components/disclaimer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

type Payload = {
  result: ScoreResult;
  perf: PerformanceInput;
  profile: UserProfile;
};

function SectionKicker({ children }: { children: ReactNode }) {
  return (
    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">
      {children}
    </p>
  );
}

function SectionTitle({
  id,
  children,
}: {
  id?: string;
  children: ReactNode;
}) {
  return (
    <h2
      id={id}
      className="text-display mt-1.5 text-lg font-semibold tracking-tight text-foreground sm:text-xl"
    >
      {children}
    </h2>
  );
}

export function ResultsClient() {
  const [payload, setPayload] = useState<Payload | null>(null);

  useEffect(() => {
    const profile = loadProfile() ?? DEMO_PROFILE;
    const perf = loadPerformance() ?? DEMO_PERFORMANCE;
    setPayload({
      result: computeScoreResult(profile, perf),
      perf,
      profile,
    });
  }, []);

  if (!payload) {
    return (
      <div className="animate-pulse space-y-10">
        <div className="space-y-3">
          <div className="h-3 w-28 rounded bg-surface-elevated" />
          <div className="h-9 w-52 max-w-full rounded-lg bg-surface-elevated" />
          <div className="h-4 w-full max-w-md rounded bg-surface-elevated/70" />
        </div>
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="h-52 rounded-2xl bg-surface-elevated/80" />
          <div className="h-52 rounded-2xl bg-surface-elevated/80" />
        </div>
      </div>
    );
  }

  const { result, perf, profile } = payload;
  const missingTitles = listMissingTestTitles(perf);
  const showProvisional = result.reliabilityPct < 100 && missingTitles.length > 0;

  return (
    <div className="space-y-12 sm:space-y-14">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0 space-y-2">
          <SectionKicker>Résultats</SectionKicker>
          <h1 className="text-display text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Ton aperçu
          </h1>
          <p className="max-w-xl text-sm leading-relaxed text-muted sm:text-base">
            Vue synthétique — rapport détaillé disponible en offre premium
            (démo).
          </p>
        </div>
        <Badge variant="secondary" className="w-fit shrink-0 px-4 py-2 text-sm">
          Fiabilité du score : {result.reliabilityPct}%
        </Badge>
      </header>

      {showProvisional ? (
        <div
          role="status"
          className="rounded-2xl border border-amber/35 bg-amber/10 p-4 sm:p-5"
        >
          <p className="text-sm font-medium text-amber">Score provisoire</p>
          <p className="mt-2 text-sm leading-relaxed text-foreground/90">
            Fiabilité {result.reliabilityPct} %. Pour fiabiliser ton profil,
            ajoute notamment :{" "}
            <span className="font-medium text-foreground">
              {missingTitles.slice(0, 4).join(" · ")}
              {missingTitles.length > 4 ? "…" : ""}
            </span>
            .
          </p>
          <Button asChild variant="outline" className="mt-4 rounded-xl">
            <Link href="/performances">Compléter mes performances</Link>
          </Button>
        </div>
      ) : null}

      <section className="space-y-5" aria-labelledby="results-overview-heading">
        <div>
          <SectionKicker>Vue d&apos;ensemble</SectionKicker>
          <SectionTitle id="results-overview-heading">
            Âge athlétique & Hybrid Score
          </SectionTitle>
          <p className="mt-2 max-w-2xl text-sm text-muted">
            Les deux indicateurs principaux — le détail des poids appliqués à
            ton objectif est juste au-dessus du score.
          </p>
        </div>
        <div className="grid gap-6 lg:grid-cols-2 lg:items-start">
          <AthleticAgeCard
            athleticAge={result.athleticAge}
            realAge={result.realAge}
          />
          <div className="space-y-4">
            <GoalHybridExplainer goal={profile.goal} />
            <HybridScoreCard
              score={result.hybridScore}
              label={result.hybridLabel}
            />
          </div>
        </div>
      </section>

      <section className="space-y-5" aria-labelledby="results-radar-heading">
        <div>
          <SectionKicker>Répartition</SectionKicker>
          <SectionTitle id="results-radar-heading">
            Cinq piliers en radar
          </SectionTitle>
          <p className="mt-2 max-w-2xl text-sm text-muted">
            Lecture rapide des forces et angles morts par rapport au référentiel
            hybride.
          </p>
        </div>
        <ResultsRadarChart breakdown={result.breakdown} />
      </section>

      <section className="space-y-5" aria-labelledby="results-profile-heading">
        <div>
          <SectionKicker>Profil & prochaines étapes</SectionKicker>
          <SectionTitle id="results-profile-heading">
            Lecture, limiteur, test et action
          </SectionTitle>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          <ProfileCard
            title={result.profileLabel}
            description={result.profileDescription}
          />
          <LimiterCard text={result.limiter} />
          <NextTestCard
            testLabel={result.nextTestLabel}
            queryTest={result.nextTestId}
          />
          <NextBestMoveCard plan={result.nextBestMovePlan} />
        </div>
      </section>

      <section className="space-y-4" aria-labelledby="results-goals-heading">
        <div>
          <SectionKicker>Horizon</SectionKicker>
          <SectionTitle id="results-goals-heading">
            Objectifs sur 4 semaines
          </SectionTitle>
        </div>
        <GoalsFourWeeksCard items={result.goals4Weeks} />
      </section>

      <div className="flex flex-col gap-4 rounded-2xl border border-neon/25 bg-neon/10 p-6 md:flex-row md:items-center md:justify-between">
        <p className="max-w-xl text-sm leading-relaxed text-muted">
          Débloque ton rapport complet pour voir ton plan personnalisé, ton
          Performance Gap détaillé et les équivalences machines.
        </p>
        <Button asChild className="shrink-0 rounded-xl">
          <Link href="/report">Débloquer mon rapport</Link>
        </Button>
      </div>

      <MedicalDisclaimer />
    </div>
  );
}
