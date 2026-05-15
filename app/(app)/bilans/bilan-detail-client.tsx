"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { isUuid } from "@/lib/uuid";
import {
  fetchAssessmentCompare,
  fetchAssessmentDetail,
  type AssessmentDetailClient,
} from "@/lib/assessments/assessments-api-client";
import type { AssessmentCompareDelta } from "@/lib/future/cloud-types";
import { productKeyLabelFr } from "@/lib/purchase/product-key-label";
import { profileDescription } from "@/lib/scoring/profiles";
import type { AthleticProfileId, ScoreResult } from "@/lib/types";
import { AthleticAgeCard } from "@/components/results/athletic-age-card";
import { HybridScoreCard } from "@/components/results/hybrid-score-card";
import { ResultsRadarChart } from "@/components/results/radar-chart";
import { ProfileCard } from "@/components/results/profile-card";
import { LimiterCard } from "@/components/results/limiter-card";
import { NextBestMoveCard } from "@/components/results/next-best-move-card";
import { GoalsFourWeeksCard } from "@/components/results/goals-four-weeks-card";
import { MedicalDisclaimer } from "@/components/disclaimer";
import { PerformanceLoadNotesReadout } from "@/components/performance/performance-load-notes-readout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

function scoreResultFromDetail(a: AssessmentDetailClient): ScoreResult {
  const profileId = a.profileKey as AthleticProfileId;
  return {
    hybridScore: a.hybridScore,
    hybridLabel: a.hybridLabel,
    reliabilityPct: a.reliabilityPct,
    athleticAge: a.athleticAge,
    realAge: a.profileSnapshot.age,
    athleticDelta: a.athleticAge - a.profileSnapshot.age,
    breakdown: a.breakdown,
    profileId,
    profileLabel: a.profileLabel,
    profileDescription: profileDescription(profileId),
    limiter: a.limiter,
    performanceGap: 0,
    nextBestMove: a.nextBestMovePlan.title,
    nextBestMovePlan: a.nextBestMovePlan,
    nextTestId: "",
    nextTestLabel: "",
    goals4Weeks: a.goals4Weeks,
  };
}

export function BilanDetailClient({ id }: { id: string }) {
  const [status, setStatus] = useState<"loading" | "error" | "ready">("loading");
  const [assessment, setAssessment] = useState<AssessmentDetailClient | null>(null);
  const [compare, setCompare] = useState<AssessmentCompareDelta | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setStatus("loading");
      setAssessment(null);
      setCompare(null);
      if (!isUuid(id)) {
        if (!cancelled) setStatus("error");
        return;
      }
      const res = await fetchAssessmentDetail(id);
      if (cancelled) return;
      if (!res.ok) {
        setAssessment(null);
        setStatus("error");
        return;
      }
      setAssessment(res.assessment);
      setStatus("ready");
      if (res.assessment.previousAssessmentId) {
        const cmp = await fetchAssessmentCompare(
          res.assessment.previousAssessmentId,
          res.assessment.id,
        );
        if (!cancelled && cmp.ok) setCompare(cmp.delta);
        else if (!cancelled) setCompare(null);
      } else {
        setCompare(null);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [id]);

  if (status === "loading") {
    return (
      <div className="animate-pulse space-y-8 pb-24 lg:pb-10">
        <div className="h-8 w-48 rounded-lg bg-surface-elevated" />
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="h-52 rounded-2xl bg-surface-elevated/80" />
          <div className="h-52 rounded-2xl bg-surface-elevated/80" />
        </div>
      </div>
    );
  }

  if (status === "error" || !assessment) {
    return (
      <div className="space-y-6 pb-24 lg:pb-10">
        <p className="text-sm text-muted">Bilan introuvable ou session expirée.</p>
        <Button asChild variant="outline" className="rounded-xl">
          <Link href="/bilans">Retour à mes bilans</Link>
        </Button>
      </div>
    );
  }

  const result = scoreResultFromDetail(assessment);

  return (
    <div className="space-y-10 pb-24 lg:pb-10">
      <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
        <div>
          <Button asChild variant="ghost" className="mb-2 -ml-2 h-auto rounded-xl px-2 text-muted">
            <Link href="/bilans">← Mes bilans</Link>
          </Button>
          <p className="text-xs font-medium uppercase tracking-widest text-muted">
            Bilan enregistré
          </p>
          <h1 className="text-display mt-2 text-3xl font-semibold text-foreground">
            {new Date(assessment.createdAt).toLocaleString("fr-FR", {
              dateStyle: "full",
              timeStyle: "short",
            })}
          </h1>
          <div className="mt-2 flex flex-wrap gap-2">
            <Badge variant="secondary">{assessment.profileLabel}</Badge>
            <Badge variant="outline">{assessment.source}</Badge>
            {assessment.purchaseProductKey ? (
              <Badge variant="outline" className="border-neon/30 text-neon/90">
                {productKeyLabelFr(assessment.purchaseProductKey)}
              </Badge>
            ) : null}
          </div>
        </div>
      </div>

      {compare ? (
        <Card className="border-neon/20 bg-neon/5">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Progression vs bilan précédent</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3 text-sm sm:grid-cols-3">
            <p className="text-muted">
              <span className="font-medium text-foreground">Hybrid Score : </span>
              {compare.hybridScoreDelta >= 0 ? "+" : ""}
              {compare.hybridScoreDelta.toFixed(0)} pts
            </p>
            <p className="text-muted">
              <span className="font-medium text-foreground">Âge athlétique : </span>
              {compare.athleticAgeDelta >= 0 ? "+" : ""}
              {compare.athleticAgeDelta.toFixed(1)} ans
            </p>
            <p className="text-muted">
              <span className="font-medium text-foreground">Fiabilité : </span>
              {compare.reliabilityPctDelta >= 0 ? "+" : ""}
              {compare.reliabilityPctDelta.toFixed(0)} pts
              {compare.limiterChanged ? (
                <span className="mt-1 block text-xs text-amber/90">
                  Limiteur modifié entre les deux bilans.
                </span>
              ) : null}
            </p>
          </CardContent>
        </Card>
      ) : null}

      <div className="grid gap-6 lg:grid-cols-2">
        <HybridScoreCard
          score={result.hybridScore}
          label={result.hybridLabel}
          reliabilityPct={result.reliabilityPct}
        />
        <AthleticAgeCard athleticAge={result.athleticAge} realAge={result.realAge} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <ProfileCard title={result.profileLabel} description={result.profileDescription} />
        <LimiterCard text={result.limiter} />
      </div>

      <ResultsRadarChart breakdown={result.breakdown} />

      <PerformanceLoadNotesReadout loadNotes={assessment.performanceSnapshot.loadNotes} />

      <div className="grid gap-6 lg:grid-cols-2">
        <NextBestMoveCard plan={result.nextBestMovePlan} />
        <GoalsFourWeeksCard items={result.goals4Weeks} />
      </div>

      <div className="flex flex-wrap gap-2">
        <Button asChild variant="outline" className="rounded-xl">
          <Link href="/results">Résultats actuels (navigateur)</Link>
        </Button>
        <Button asChild variant="outline" className="rounded-xl">
          <Link href="/plan">Plan 4 semaines</Link>
        </Button>
        <Button asChild variant="outline" className="rounded-xl">
          <Link
            href={`/next-test?retestAnchor=${encodeURIComponent(assessment.id)}`}
          >
            Protocole retest
          </Link>
        </Button>
        <Button asChild variant="ghost" className="rounded-xl text-muted">
          <Link href="/bilans">Choisir un autre ancrage retest</Link>
        </Button>
      </div>
      <p className="text-xs text-muted">
        L’ancrage explicite pour enregistrer un retest se fait depuis{" "}
        <Link href="/bilans" className="text-neon hover:underline">
          Mes bilans
        </Link>{" "}
        (liste déroulante « Bilan de référence »).
      </p>

      <MedicalDisclaimer />
    </div>
  );
}
