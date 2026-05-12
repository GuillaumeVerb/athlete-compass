"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Activity, ArrowRight, BedDouble, Footprints, HeartPulse, Zap } from "lucide-react";
import {
  DEFAULT_STEPS_GOAL,
  loadDailyActivityStore,
  patchDailyActivityStore,
  todayLocalDateKey,
  type DailyActivityStoreV1,
} from "@/lib/daily/daily-activity-storage";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { HybridCoachCard } from "@/components/coach/hybrid-coach-card";
import { MedicalDisclaimer } from "@/components/disclaimer";
import { MOCK_DAILY_ACTIVITY, MOCK_DAILY_ATHLETIC_SNAPSHOT, MOCK_DAILY_TODAY, MOCK_DAILY_WELLNESS } from "@/lib/mock/daily";
import { computeScoreResult } from "@/lib/scoring";
import { listMissingTestKeys } from "@/lib/scoring/reliability";
import { filledCount } from "@/lib/scoring/parse";
import {
  reliabilityTierExplanationFr,
  reliabilityTierFromPct,
} from "@/lib/scoring/reliability-tier";
import { computeReadiness } from "@/lib/scoring/readiness";
import { computeTrainingDebt } from "@/lib/scoring/training-debt";
import { DEMO_PERFORMANCE, DEMO_PROFILE } from "@/lib/mock-data";
import { loadPerformance, loadProfile } from "@/lib/storage";
import { TrainingDebtCard } from "@/components/results/training-debt-card";
import { PerformanceLoadNotesReadout } from "@/components/performance/performance-load-notes-readout";
import { hasAnyLoadNotes } from "@/lib/performance/load-notes-display";
import { MobileStickyQuickBar } from "@/components/layout/mobile-sticky-quick-bar";

function formatSleep(h: number): string {
  const hh = Math.floor(h);
  const mm = Math.round((h - hh) * 60);
  return `${hh}h${mm.toString().padStart(2, "0")}`;
}

/** Raccourcis prompt agrégé 13 — V1 mockée (panneau simple). */
function DailyLoopActions() {
  const [fatigueTipOpen, setFatigueTipOpen] = useState(false);
  return (
    <section
      className="order-11 rounded-2xl border border-border bg-surface/50 p-4 sm:p-5"
      aria-labelledby="daily-loop-actions-heading"
    >
      <h2 id="daily-loop-actions-heading" className="text-display text-sm font-semibold text-foreground">
        Boucle du jour
      </h2>
      <p className="mt-1 text-xs text-muted">
        Raccourcis V1 — version riche (historique, feedback) prévue côté cloud (V3+).
      </p>
      <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
        <Button asChild variant="outline" size="sm" className="rounded-xl">
          <Link href="/results">J&apos;ai fait ma séance</Link>
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="rounded-xl"
          aria-expanded={fatigueTipOpen}
          onClick={() => setFatigueTipOpen((o) => !o)}
        >
          Je suis fatigué
        </Button>
        <Button asChild variant="outline" size="sm" className="rounded-xl">
          <Link href="/equivalences">Adapter ma séance</Link>
        </Button>
        <Button asChild variant="secondary" size="sm" className="rounded-xl sm:ml-auto">
          <Link href="/plan">Plan 4 semaines</Link>
        </Button>
      </div>
      {fatigueTipOpen ? (
        <p
          role="status"
          className="mt-3 rounded-xl border border-amber/25 bg-amber/5 px-3 py-3 text-xs leading-relaxed text-muted"
        >
          <span className="font-medium text-amber">Aperçu V1 : </span>
          baisse la densité (moins de blocs « all-out »), garde 20–30 min de Zone 2 ou une
          mobilité active, couche-toi plus tôt. Demain, réévalue ton readiness — viser la
          cohérence, pas un max du jour.
        </p>
      ) : null}
    </section>
  );
}

export function DailyClient() {
  const [ready, setReady] = useState(false);
  const [activityRevision, setActivityRevision] = useState(0);
  const [stepsDraft, setStepsDraft] = useState("");
  const [goalDraft, setGoalDraft] = useState("");
  const [activityFormError, setActivityFormError] = useState<string | null>(null);

  const bundle = useMemo(() => {
    void ready; // second run after hydration so storage reads match the client
    void activityRevision;
    const profile = loadProfile() ?? DEMO_PROFILE;
    const savedPerf = loadPerformance();
    const performancesAreDemo = savedPerf == null;
    const perf = savedPerf ?? DEMO_PERFORMANCE;
    const result = computeScoreResult(profile, perf);
    const readiness = computeReadiness(MOCK_DAILY_WELLNESS);
    const debt = computeTrainingDebt(result.breakdown, readiness.readinessScore, profile);
    const userFilledTests = filledCount(savedPerf ?? {});
    const reliabilityTier = reliabilityTierFromPct(result.reliabilityPct);
    const reliabilityExplain = reliabilityTierExplanationFr(
      result.reliabilityPct,
      listMissingTestKeys(perf).length,
    );
    const dailyActivity: DailyActivityStoreV1 = ready
      ? loadDailyActivityStore(profile)
      : {
          v: 1,
          stepsByDay: {},
          stepsGoal: DEFAULT_STEPS_GOAL,
        };
    return {
      profile,
      perf,
      result,
      readiness,
      debt,
      performancesAreDemo,
      userFilledTests,
      reliabilityTier,
      reliabilityExplain,
      dailyActivity,
    };
  }, [ready, activityRevision]);

  useEffect(() => {
    queueMicrotask(() => setReady(true));
  }, []);

  const {
    profile,
    perf,
    result,
    readiness,
    debt,
    performancesAreDemo,
    userFilledTests,
    reliabilityTier,
    reliabilityExplain,
    dailyActivity,
  } = bundle;

  useEffect(() => {
    if (!ready) return;
    const p = loadProfile() ?? DEMO_PROFILE;
    const da = loadDailyActivityStore(p);
    const dk = todayLocalDateKey();
    const ts = da.stepsByDay[dk];
    setStepsDraft(ts != null ? String(ts) : "");
    setGoalDraft(String(da.stepsGoal));
  }, [ready, activityRevision]);

  const dayKey = todayLocalDateKey();
  const todaySteps = dailyActivity.stepsByDay[dayKey];
  const stepsGoalDisplay = dailyActivity.stepsGoal;

  const showSparseHint =
    !performancesAreDemo && userFilledTests > 0 && userFilledTests < 3;

  const missionIntro =
    readiness.readinessScore >= 68
      ? "Ton profil supporte une charge normale aujourd’hui. Garde une marge sur les blocs les plus coûteux."
      : readiness.readinessScore >= 48
        ? "Ton readiness est moyen : privilégie qualité d’exécution et volume modéré."
        : "Priorité récupération : court, propre, sans maximal aujourd’hui.";

  function saveDailySteps() {
    setActivityFormError(null);
    const goal = Number(goalDraft.replace(",", ".").replace(/\s/g, ""));
    if (!Number.isFinite(goal) || goal < 2000 || goal > 80_000) {
      setActivityFormError("Objectif : entre 2 000 et 80 000 pas.");
      return;
    }
    const trim = stepsDraft.trim();
    const patch: { steps?: number; stepsGoal: number } = { stepsGoal: goal };
    if (trim !== "") {
      const s = Number(trim.replace(",", ".").replace(/\s/g, ""));
      if (!Number.isFinite(s) || s < 0 || s > 200_000) {
        setActivityFormError("Pas du jour : nombre entre 0 et 200 000.");
        return;
      }
      patch.steps = Math.round(s);
    }
    patchDailyActivityStore(profile, patch);
    setActivityRevision((n) => n + 1);
  }

  return (
    <>
      <div className="relative flex flex-col gap-10 pb-28 lg:pb-4">
        <header className="order-1 min-w-0 space-y-2">
          <p className="hidden text-xs font-semibold uppercase tracking-[0.16em] text-muted lg:block">
            Aujourd&apos;hui
          </p>
          <h1 className="text-display text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">Bonjour</h1>
          <p className="text-sm leading-relaxed text-muted lg:hidden">Voici ton résumé du jour.</p>
          <p className="hidden max-w-2xl text-sm leading-relaxed text-muted sm:text-base lg:block">
            Voici ton état du jour. Ta mission : progresser sans accumuler de fatigue inutile.
          </p>
        </header>

      {performancesAreDemo ? (
        <div
          role="status"
          className="order-2 rounded-2xl border border-border bg-surface/60 p-4 sm:p-5"
        >
          <p className="text-sm font-medium text-foreground">Données de démonstration</p>
          <p className="mt-2 text-sm leading-relaxed text-muted">
            Les scores et cartes ci-dessous utilisent des performances fictives. Renseigne tes
            mesures pour un readiness et une dette d&apos;entraînement alignés sur toi.
          </p>
          <Button asChild variant="outline" className="mt-4 rounded-xl">
            <Link href="/performances">Renseigner mes performances</Link>
          </Button>
        </div>
      ) : null}

      {showSparseHint ? (
        <div
          role="status"
          className="order-2 rounded-2xl border border-border bg-surface/60 p-4 sm:p-5"
        >
          <p className="text-sm font-medium text-foreground">Lecture encore limitée</p>
          <p className="mt-2 text-sm leading-relaxed text-muted">
            Ton score est encore provisoire. Ajoute au moins 3 tests pour obtenir une première
            lecture utile — idem sur la page Résultats.
          </p>
          <Button asChild variant="outline" className="mt-4 rounded-xl">
            <Link href="/performances">Compléter mes performances</Link>
          </Button>
        </div>
      ) : null}

      <section className="order-3 rounded-2xl border border-neon/25 bg-neon/5 p-5 sm:p-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="min-w-0 shrink">
            <p className="text-xs font-medium uppercase tracking-wide text-muted">Readiness</p>
            <p className="text-display text-4xl font-semibold text-neon">{readiness.readinessScore}%</p>
          </div>
          <div className="min-w-0 text-left text-sm text-muted sm:text-right">
            <p className="font-medium text-foreground">Séance conseillée</p>
            <p className="break-words">{readiness.recommendedSessionType}</p>
          </div>
        </div>
        <p className="mt-4 text-sm leading-relaxed text-foreground/90">{missionIntro}</p>
        <p className="mt-2 text-sm text-muted">{readiness.explanation}</p>
        {readiness.warningMessage ? (
          <p className="mt-3 rounded-xl border border-amber/30 bg-amber/10 px-3 py-2 text-xs text-amber">
            {readiness.warningMessage}
          </p>
        ) : null}
        <div className="mt-5 flex flex-wrap gap-2">
          <Button asChild size="sm" variant="secondary" className="rounded-xl">
            <Link href="/results">Voir mon bilan</Link>
          </Button>
          <Button asChild size="sm" className="rounded-xl">
            <Link href="/performances">Mettre à jour mes données</Link>
          </Button>
        </div>
        <div className="mt-5 flex flex-col gap-2 border-t border-neon/20 pt-4 sm:flex-row sm:flex-wrap sm:items-start sm:gap-3">
          <Badge variant="secondary" className="w-fit shrink-0 px-3 py-1.5 text-xs">
            <span className="sr-only">Niveau de fiabilité du score : </span>
            Fiabilité : {reliabilityTier} ({result.reliabilityPct}%)
          </Badge>
          <p className="min-w-0 text-xs leading-relaxed text-muted sm:max-w-xl">{reliabilityExplain}</p>
        </div>
      </section>

      {hasAnyLoadNotes(perf.loadNotes) ? (
        <div className="order-4">
          <PerformanceLoadNotesReadout loadNotes={perf.loadNotes} compact />
        </div>
      ) : null}

      <div className="order-5 grid gap-4 sm:grid-cols-2">
        <MiniStat
          icon={BedDouble}
          label="Sommeil"
          value={formatSleep(MOCK_DAILY_WELLNESS.sleepHours)}
          sub="Qualité : bonne"
        />
        <MiniStat
          icon={HeartPulse}
          label="Récupération"
          value={`${MOCK_DAILY_ACTIVITY.recoveryPct} %`}
          sub={`Statut : ${MOCK_DAILY_ACTIVITY.recoveryLabel}`}
        />
        <MiniStat
          icon={Footprints}
          label="Activité"
          value={
            todaySteps != null
              ? `${todaySteps.toLocaleString("fr-FR")} pas`
              : "Non renseigné"
          }
          sub={
            todaySteps != null && stepsGoalDisplay > 0
              ? `Objectif : ${stepsGoalDisplay.toLocaleString("fr-FR")} · ${Math.min(100, Math.round((todaySteps / stepsGoalDisplay) * 100))} % du jour`
              : `Objectif : ${stepsGoalDisplay.toLocaleString("fr-FR")} (10 000 par défaut si tu ne l’as pas encore fixé)`
          }
        />
        <MiniStat
          icon={Activity}
          label="Fatigue ressentie"
          value={`${MOCK_DAILY_WELLNESS.fatigue}/10`}
          sub="Acceptable"
        />
      </div>

      <section className="order-6 rounded-2xl border border-border bg-surface/50 p-4 sm:p-5">
        <h2 className="text-display text-sm font-semibold text-foreground">Pas du jour</h2>
        <p className="mt-1 text-xs leading-relaxed text-muted">
          En V1, pas d&apos;API santé : saisis les pas affichés par ta montre ou ton téléphone. L&apos;objectif
          par défaut est <strong className="text-foreground/90">10 000 pas</strong> (modifiable). Une synchro
          optionnelle (montre, agrégateur santé) est prévue dans la roadmap produit.
        </p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="daily-steps" className="text-xs text-muted">
              Pas aujourd&apos;hui
            </Label>
            <Input
              id="daily-steps"
              inputMode="numeric"
              placeholder="ex. 8 432"
              value={stepsDraft}
              onChange={(e) => {
                setActivityFormError(null);
                setStepsDraft(e.target.value);
              }}
              className="rounded-xl"
              autoComplete="off"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="daily-steps-goal" className="text-xs text-muted">
              Objectif / jour
            </Label>
            <Input
              id="daily-steps-goal"
              inputMode="numeric"
              placeholder="ex. 10 000"
              value={goalDraft}
              onChange={(e) => {
                setActivityFormError(null);
                setGoalDraft(e.target.value);
              }}
              className="rounded-xl"
              autoComplete="off"
            />
          </div>
        </div>
        {activityFormError ? (
          <p role="alert" className="mt-2 text-xs text-destructive">
            {activityFormError}
          </p>
        ) : null}
        <Button
          type="button"
          variant="secondary"
          className="mt-4 rounded-xl"
          onClick={saveDailySteps}
        >
          Enregistrer pas & objectif
        </Button>
      </section>

      <section className="order-7 rounded-2xl border border-border bg-surface/70 p-5 sm:p-6">
        <div className="flex items-center gap-2">
          <Zap className="h-5 w-5 text-neon" aria-hidden />
          <h2 className="text-display text-lg font-semibold text-foreground">Âge athlétique</h2>
        </div>
        <p className="mt-3 text-sm text-muted">
          Âge réel : <span className="font-medium text-foreground">{result.realAge} ans</span> — Âge athlétique :{" "}
          <span className="font-medium text-neon">{result.athleticAge} ans</span>
        </p>
        <p className="mt-2 text-sm text-muted">
          Variation depuis dernier bilan (démo) :{" "}
          <span className="text-neon">{MOCK_DAILY_ATHLETIC_SNAPSHOT.athleticDeltaSinceLast} an</span> — Focus :{" "}
          {MOCK_DAILY_ATHLETIC_SNAPSHOT.focusLine}
        </p>
        <Button
          asChild
          variant="ghost"
          className="mt-3 h-auto px-0 py-0 text-neon hover:bg-transparent hover:text-neon/90"
        >
          <Link href="/results" className="inline-flex items-center gap-1">
            Détails résultats <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </section>

      <div className="order-8">
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
      </div>

      <section className="order-9 flex flex-col gap-4 lg:order-10 lg:grid lg:grid-cols-2 lg:gap-4">
        <div className="rounded-2xl border border-border bg-surface/70 p-5">
          <h2 className="text-display text-sm font-semibold text-foreground">À faire aujourd&apos;hui</h2>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-muted">
            {MOCK_DAILY_TODAY.do.map((x) => (
              <li key={x}>{x}</li>
            ))}
          </ul>
        </div>
        <div className="rounded-2xl border border-amber/25 bg-amber/5 p-5">
          <h2 className="text-display text-sm font-semibold text-amber">À éviter</h2>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-muted">
            {readiness.avoidToday.length
              ? readiness.avoidToday.map((x) => <li key={x}>{x}</li>)
              : MOCK_DAILY_TODAY.avoid.map((x) => <li key={x}>{x}</li>)}
          </ul>
        </div>
      </section>

      <div className="order-10 lg:order-9">
        <TrainingDebtCard debt={debt} />
      </div>

      <DailyLoopActions />

      <MedicalDisclaimer className="order-12" />
      </div>

      <MobileStickyQuickBar>
        <Button asChild size="sm" variant="secondary" className="min-h-11 flex-1 rounded-xl">
          <Link href="/results">Bilan</Link>
        </Button>
        <Button asChild size="sm" className="min-h-11 flex-1 rounded-xl">
          <Link href="/plan">Plan</Link>
        </Button>
      </MobileStickyQuickBar>
    </>
  );
}

function MiniStat({
  icon: Icon,
  label,
  value,
  sub,
}: {
  icon: typeof BedDouble;
  label: string;
  value: string;
  sub: string;
}) {
  return (
    <div className="rounded-2xl border border-border bg-surface/60 p-4">
      <div className="flex items-center gap-2 text-muted">
        <Icon className="h-4 w-4" aria-hidden />
        <span className="text-[11px] font-semibold uppercase tracking-wide">{label}</span>
      </div>
      <p className="mt-2 min-w-0 break-words text-display text-xl font-semibold text-foreground">
        {value}
      </p>
      <p className="mt-1 text-xs text-muted">{sub}</p>
    </div>
  );
}
