"use client";

import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import Link from "next/link";
import type { PerformanceInput, ScoreResult, UserProfile } from "@/lib/types";
import { computeScoreResult } from "@/lib/scoring";
import {
  loadScoreSnapshots,
  SCORE_SNAPSHOTS_CHANGED_EVENT,
} from "@/lib/scoring/score-snapshots";
import { DEMO_PERFORMANCE, DEMO_PROFILE } from "@/lib/mock-data";
import { loadPerformance, loadProfile } from "@/lib/storage";
import { listMissingTestTitles, listMissingTestKeys } from "@/lib/scoring/reliability";
import { filledCount } from "@/lib/scoring/parse";
import {
  reliabilityTierExplanationFr,
  reliabilityTierFromPct,
} from "@/lib/scoring/reliability-tier";
import { computeFutureAthleticAge } from "@/lib/scoring/future-athletic-age";
import {
  DAILY_ACTIVITY_STORAGE_CHANGED_EVENT,
  loadDailyActivityStore,
  todayLocalDateKey,
} from "@/lib/daily/daily-activity-storage";
import { enrichReadinessWithDailySteps } from "@/lib/daily/enrich-readiness-with-steps";
import { activityHintFromStepsStore } from "@/lib/daily/steps-activity-hint";
import { computeReadiness } from "@/lib/scoring/readiness";
import { computeTrainingDebt } from "@/lib/scoring/training-debt";
import { MOCK_DAILY_WELLNESS } from "@/lib/mock/daily";
import { useDailyStepsCloudPull } from "@/lib/daily/use-daily-steps-cloud-pull";
import { AthleticAgeCard } from "@/components/results/athletic-age-card";
import { HybridScoreCard } from "@/components/results/hybrid-score-card";
import { ScoreSnapshotsLocalSection } from "@/components/results/score-snapshots-local";
import { ResultsCloudAssessmentSave } from "@/components/results/results-cloud-assessment-save";
import { ResultsRadarChart } from "@/components/results/radar-chart";
import { ProfileCard } from "@/components/results/profile-card";
import { LimiterCard } from "@/components/results/limiter-card";
import { NextTestCard } from "@/components/results/next-test-card";
import { NextBestMoveCard } from "@/components/results/next-best-move-card";
import { GoalsFourWeeksCard } from "@/components/results/goals-four-weeks-card";
import { GoalHybridExplainer } from "@/components/results/goal-hybrid-explainer";
import { HybridCoachCard } from "@/components/coach/hybrid-coach-card";
import { FutureAthleticAgeCard } from "@/components/premium/future-athletic-age-card";
import { TrainingDebtCard } from "@/components/results/training-debt-card";
import { MedicalDisclaimer } from "@/components/disclaimer";
import { MobileStickyQuickBar } from "@/components/layout/mobile-sticky-quick-bar";
import { CheckoutButton } from "@/components/checkout/checkout-button";
import { PerformanceLoadNotesReadout } from "@/components/performance/performance-load-notes-readout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

type Payload = {
  result: ScoreResult;
  perf: PerformanceInput;
  profile: UserProfile;
  /** Nombre de tests renseignés côté utilisateur (hors démo). */
  userFilledTests: number;
  /** true si aucune sauvegarde performances en localStorage */
  performancesAreDemo: boolean;
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
  const [activityTick, setActivityTick] = useState(0);
  const [snapshotTick, setSnapshotTick] = useState(0);

  const bumpActivityTick = useCallback(() => {
    setActivityTick((t) => t + 1);
  }, []);

  useDailyStepsCloudPull(payload != null, bumpActivityTick, () =>
    setActivityTick((t) => t + 1),
  );

  useEffect(() => {
    const fn = () => setActivityTick((t) => t + 1);
    window.addEventListener(DAILY_ACTIVITY_STORAGE_CHANGED_EVENT, fn);
    return () => window.removeEventListener(DAILY_ACTIVITY_STORAGE_CHANGED_EVENT, fn);
  }, []);

  useEffect(() => {
    const fn = () => setSnapshotTick((t) => t + 1);
    window.addEventListener(SCORE_SNAPSHOTS_CHANGED_EVENT, fn);
    return () => window.removeEventListener(SCORE_SNAPSHOTS_CHANGED_EVENT, fn);
  }, []);

  const scoreSnapshots = useMemo(() => loadScoreSnapshots(), [snapshotTick]);

  useEffect(() => {
    queueMicrotask(() => {
      const profile = loadProfile() ?? DEMO_PROFILE;
      const savedPerf = loadPerformance();
      const performancesAreDemo = savedPerf == null;
      const perf = savedPerf ?? DEMO_PERFORMANCE;
      const userFilledTests = filledCount(savedPerf ?? {});
      setPayload({
        result: computeScoreResult(profile, perf),
        perf,
        profile,
        userFilledTests,
        performancesAreDemo,
      });
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

  const { result, perf, profile, userFilledTests, performancesAreDemo } = payload;
  void activityTick;
  const dayKey = todayLocalDateKey();
  const dailyStore = loadDailyActivityStore(profile);
  const readiness = computeReadiness(
    enrichReadinessWithDailySteps(MOCK_DAILY_WELLNESS, profile),
  );
  const trainingDebt = computeTrainingDebt(
    result.breakdown,
    readiness.readinessScore,
    profile,
    activityHintFromStepsStore(dailyStore.stepsByDay, dailyStore.stepsGoal, dayKey),
  );
  const futureAge = computeFutureAthleticAge(result);
  const missingTitles = listMissingTestTitles(perf);
  const missingKeys = listMissingTestKeys(perf);
  const showProvisional = result.reliabilityPct < 100 && missingTitles.length > 0;
  const tier = reliabilityTierFromPct(result.reliabilityPct);
  const tierExplain = reliabilityTierExplanationFr(
    result.reliabilityPct,
    missingKeys.length,
  );
  const showSparseHint =
    !performancesAreDemo && userFilledTests > 0 && userFilledTests < 3;

  return (
    <>
      <div className="space-y-12 pb-28 sm:space-y-14 lg:pb-0">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0 space-y-2">
          <SectionKicker>Résultats</SectionKicker>
          <h1 className="text-display text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Ton aperçu
          </h1>
          <p className="max-w-xl text-sm leading-relaxed text-muted sm:text-base">
            Hybrid Score, profil athlétique, limiteur principal, Performance Gap en
            lecture rapide, fiabilité du score — le détail pondéré par ton objectif
            est sous le score.
          </p>
        </div>
        <div className="flex w-full min-w-0 max-w-md shrink-0 flex-col gap-2 sm:items-end">
          <Button
            asChild
            variant="outline"
            size="sm"
            className="w-full rounded-xl border-neon/30 text-neon sm:w-fit"
          >
            <Link href="/daily">Aujourd&apos;hui</Link>
          </Button>
          <Badge variant="secondary" className="w-full justify-center px-4 py-2 text-sm sm:w-fit sm:justify-start">
            <span className="sr-only">Niveau de fiabilité du score : </span>
            Fiabilité : {tier} ({result.reliabilityPct}%)
          </Badge>
          <p className="break-words text-xs leading-relaxed text-muted sm:text-right">
            {tierExplain}
          </p>
        </div>
      </header>

      {showSparseHint ? (
        <div
          role="status"
          className="rounded-2xl border border-border bg-surface/60 p-4 sm:p-5"
        >
          <p className="text-sm font-medium text-foreground">
            Lecture encore limitée
          </p>
          <p className="mt-2 text-sm leading-relaxed text-muted">
            Ton score est encore provisoire. Ajoute au moins 3 tests pour obtenir
            une première lecture utile — la{" "}
            <strong className="text-foreground">fiabilité du score</strong>{" "}
            montera quand tu auras complété davantage de champs.
          </p>
          <Button asChild variant="outline" className="mt-4 rounded-xl">
            <Link href="/performances">Compléter mes performances</Link>
          </Button>
        </div>
      ) : null}

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

      <PerformanceLoadNotesReadout loadNotes={perf.loadNotes} />

      <section className="space-y-5" aria-labelledby="results-overview-heading">
        <div>
          <SectionKicker>Vue d&apos;ensemble</SectionKicker>
          <SectionTitle id="results-overview-heading">
            Âge athlétique & Hybrid Score
          </SectionTitle>
          <p className="mt-2 max-w-2xl text-sm text-muted">
            Les deux indicateurs principaux. Les pondérations liées à ton
            objectif sont rappelées au-dessus du Hybrid Score —{" "}
            <span className="text-muted/80">
              estimation de performance, pas mesure biologique.
            </span>
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
              reliabilityPct={result.reliabilityPct}
            />
          </div>
        </div>
      </section>

      <ScoreSnapshotsLocalSection
        entries={scoreSnapshots}
        hybridDampeningActive={result.reliabilityPct < 55}
      />

      <ResultsCloudAssessmentSave profile={profile} performance={perf} />

      <section className="space-y-5" aria-labelledby="results-radar-heading">
        <div>
          <SectionKicker>Répartition</SectionKicker>
          <SectionTitle id="results-radar-heading">
            Cinq piliers en radar
          </SectionTitle>
          <p className="mt-2 max-w-2xl text-sm text-muted">
            Lecture rapide des cinq piliers — repère ton{" "}
            <strong className="font-medium text-foreground/90">Performance Gap</strong>{" "}
            visuel.
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

      <section className="space-y-5" aria-labelledby="results-daily-heading">
        <div>
          <SectionKicker>Quotidien</SectionKicker>
          <SectionTitle id="results-daily-heading">Dette, coach, projection</SectionTitle>
          <p className="mt-2 max-w-2xl text-sm text-muted">
            Aperçu basé sur tes scores + déclarations démo (readiness) et, si tu en as saisi, tes
            pas du jour. Va sur{" "}
            <Link href="/daily" className="text-neon hover:underline">
              Aujourd&apos;hui
            </Link>{" "}
            pour la boucle complète.
          </p>
        </div>
        <div className="grid gap-6 lg:grid-cols-2">
          <TrainingDebtCard debt={trainingDebt} />
          <FutureAthleticAgeCard data={futureAge} locked />
        </div>
        <HybridCoachCard
          context={{
            profileId: result.profileId,
            goal: profile.goal,
            readinessScore: readiness.readinessScore,
            constraints: profile.constraints,
            equipment: profile.equipment,
            nextBestMove: result.nextBestMove,
          }}
        />
      </section>

      <div className="flex flex-col gap-4 rounded-2xl border border-neon/25 bg-neon/10 p-6 md:flex-row md:items-center md:justify-between">
        <div className="max-w-xl space-y-2 text-sm leading-relaxed text-muted">
          <p>
            Débloque ton rapport complet pour comprendre ton{" "}
            <strong className="text-foreground">Performance Gap</strong> et
            obtenir ton <strong className="text-foreground">plan minimal sur 4 semaines</strong>.
          </p>
          <p className="text-xs text-muted/90">
            Le gratuit te montre où tu en es. Le rapport complet te montre quoi
            faire maintenant.
          </p>
        </div>
        <div className="flex w-full shrink-0 flex-col gap-2 sm:w-auto sm:flex-row sm:items-center">
          <CheckoutButton
            productKey="pack_29"
            className="min-h-11 w-full rounded-xl sm:w-auto"
            fallbackHref="/report"
          >
            Débloquer mon rapport
          </CheckoutButton>
          <Button asChild variant="outline" className="min-h-11 w-full rounded-xl sm:w-auto">
            <Link href="/pricing">Voir les offres</Link>
          </Button>
        </div>
      </div>

      <MedicalDisclaimer />
      </div>

      <MobileStickyQuickBar>
        <Button asChild size="sm" variant="secondary" className="min-h-11 flex-1 rounded-xl">
          <Link href="/daily">Jour</Link>
        </Button>
        <Button asChild size="sm" className="min-h-11 flex-1 rounded-xl">
          <Link href="/plan">Plan</Link>
        </Button>
      </MobileStickyQuickBar>
    </>
  );
}
