"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { computeScoreResult } from "@/lib/scoring";
import { goalLabelFr } from "@/lib/scoring/goal-hybrid-copy";
import type { ReportSnapshotV1 } from "@/lib/purchase/report-snapshot-types";
import { DEMO_PERFORMANCE, DEMO_PROFILE } from "@/lib/mock-data";
import { loadPerformance, loadProfile } from "@/lib/storage";
import type { PurchaseProductKey } from "@/lib/future/cloud-types";
import type { PerformanceInput, ScoreResult, UserProfile } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

type Payload = {
  result: ScoreResult;
  profile: UserProfile;
  perf: PerformanceInput;
  source: "server" | "local";
  savedAt?: string;
};

export function ReportUnlockedBody({
  productKey,
  serverSnapshot,
}: {
  productKey: PurchaseProductKey;
  /** Bilan figé en base (Supabase) au paiement — sinon recalcul navigateur. */
  serverSnapshot?: ReportSnapshotV1 | null;
}) {
  const [payload, setPayload] = useState<Payload | null>(() =>
    serverSnapshot
      ? {
          result: serverSnapshot.result,
          profile: serverSnapshot.profile,
          perf: serverSnapshot.performance,
          source: "server",
          savedAt: serverSnapshot.savedAt,
        }
      : null,
  );

  useEffect(() => {
    if (serverSnapshot) return;
    queueMicrotask(() => {
      const profile = loadProfile() ?? DEMO_PROFILE;
      const perf = loadPerformance() ?? DEMO_PERFORMANCE;
      setPayload({
        profile,
        perf,
        result: computeScoreResult(profile, perf),
        source: "local",
      });
    });
  }, [serverSnapshot]);

  if (!payload) {
    return (
      <div className="grid animate-pulse gap-4 md:grid-cols-2">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="h-40 rounded-2xl border border-border bg-surface-elevated/50"
          />
        ))}
      </div>
    );
  }

  const { result, profile, source, savedAt } = payload;

  return (
    <div className="space-y-6">
      <p className="text-sm text-muted">
        {source === "server" ? (
          <>
            Bilan figé au paiement et{" "}
            <strong className="text-foreground/90">stocké sur le serveur</strong>
            {savedAt ? (
              <>
                {" "}
                (
                {new Date(savedAt).toLocaleString("fr-FR", {
                  dateStyle: "short",
                  timeStyle: "short",
                })}
                ).
              </>
            ) : null}{" "}
          </>
        ) : (
          <>
            Aperçu généré à partir de tes données{" "}
            <strong className="text-foreground/90">sur cet appareil</strong>{" "}
            (localStorage).{" "}
          </>
        )}
        Offre :{" "}
        <Badge variant="secondary" className="align-middle">
          {productKey === "bilan_9"
            ? "Bilan complet"
            : productKey === "plan_19"
              ? "Plan 4 semaines"
              : "Pack complet"}
        </Badge>
        . PDF, export et historique cloud : V2.
      </p>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="border-neon/25 bg-neon/5">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Synthèse chiffrée</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted">
            <p>
              <span className="text-foreground font-semibold tabular-nums text-neon">
                {result.hybridScore}
              </span>{" "}
              Hybrid Score — fiabilité{" "}
              <span className="text-foreground">{result.reliabilityPct}%</span>
            </p>
            <p>
              Âge athlétique{" "}
              <span className="text-foreground font-semibold tabular-nums">
                {result.athleticAge}
              </span>{" "}
              ans (réel {result.realAge} ans)
            </p>
            <p className="text-xs">Objectif pris en compte : {goalLabelFr(profile.goal)}</p>
          </CardContent>
        </Card>

        <Card className="border-amber/30 bg-amber/5">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Performance Gap</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted">
            <p className="text-display text-2xl font-semibold text-amber tabular-nums">
              {result.performanceGap}
              <span className="text-base font-normal text-muted"> /100</span>
            </p>
            <p className="mt-2 text-xs leading-relaxed">
              Écart estimé entre ton niveau actuel et un plafond hybride de
              référence — indicateur de marge de progression, pas une note scolaire.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Profil & limiteur</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <p className="text-display font-semibold text-neon">
              {result.profileLabel}
            </p>
            <p className="leading-relaxed text-muted">{result.profileDescription}</p>
            <div className="border-t border-border pt-3">
              <p className="text-[10px] font-medium uppercase tracking-wider text-muted">
                Limiteur principal
              </p>
              <p className="mt-1 leading-relaxed text-foreground/95">{result.limiter}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Next Best Move</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p className="font-semibold text-amber">{result.nextBestMovePlan.title}</p>
            <p className="text-muted">{result.nextBestMovePlan.action}</p>
            <p className="text-xs text-muted">
              Fréquence suggérée : {result.nextBestMovePlan.frequency}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="border-border bg-surface/60">
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Objectifs sur 4 semaines (extrait)</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-inside list-disc space-y-1.5 text-sm text-muted">
            {result.goals4Weeks.map((g) => (
              <li key={g}>{g}</li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <div className="flex flex-wrap gap-3">
        <Button asChild className="rounded-xl">
          <Link href="/results">Vue complète — résultats</Link>
        </Button>
        <Button asChild variant="outline" className="rounded-xl">
          <Link href="/plan">Plan 4 semaines</Link>
        </Button>
        <Button asChild variant="outline" className="rounded-xl">
          <Link href="/equivalences">Équivalences machines</Link>
        </Button>
      </div>
    </div>
  );
}
