"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { WeekPlan } from "@/components/plan/week-plan";
import {
  generateFourWeekPlan,
  rehydratePlanWeeks,
} from "@/lib/plans/generate-plan";
import type { PlanWeek } from "@/lib/plans/generate-plan";
import { planGenerationFingerprint } from "@/lib/plans/plan-fingerprint";
import type { PlanCloudHistoryRow } from "@/lib/plans/sync-plan-cloud-client";
import {
  fetchPlanCloudHistory,
  subscribeSupabaseSession,
  syncPlanWeeksToCloud,
} from "@/lib/plans/sync-plan-cloud-client";
import { MedicalDisclaimer } from "@/components/disclaimer";
import { MobileStickyQuickBar } from "@/components/layout/mobile-sticky-quick-bar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DEMO_PERFORMANCE, DEMO_PROFILE } from "@/lib/mock-data";
import {
  clearPlanSnapshot,
  loadPerformance,
  loadPlanClientSyncId,
  loadPlanLastInstanceId,
  loadPlanSnapshot,
  loadProfile,
  savePlanClientSyncId,
  savePlanLastInstanceId,
  savePlanSnapshot,
} from "@/lib/storage";
import { computeScoreResult } from "@/lib/scoring";
import { isUuid } from "@/lib/uuid";

export function PlanClient() {
  const [planFingerprint, setPlanFingerprint] = useState<string | null>(null);
  const [weeks, setWeeks] = useState<PlanWeek[] | null>(null);
  const [snapshotMeta, setSnapshotMeta] = useState<{
    savedAt: string;
    fromCache: boolean;
  } | null>(null);
  const [regenToken, setRegenToken] = useState(0);
  const [cloudHistory, setCloudHistory] = useState<{
    status: "idle" | "loading" | "ready";
    rows: PlanCloudHistoryRow[];
    lastSyncNote?: string;
  }>({ status: "idle", rows: [] });
  const [hasSession, setHasSession] = useState(false);
  const [planInstanceId, setPlanInstanceId] = useState<string | null>(null);
  const [planLimiter, setPlanLimiter] = useState("");

  useEffect(() => {
    const unsubSession = subscribeSupabaseSession(setHasSession);

    queueMicrotask(() => {
      const profile = loadProfile() ?? DEMO_PROFILE;
      const perf = loadPerformance() ?? DEMO_PERFORMANCE;
      const result = computeScoreResult(profile, perf);
      setPlanLimiter(result.limiter);
      const fingerprint = planGenerationFingerprint(profile, result);
      setPlanFingerprint(fingerprint);
      setPlanInstanceId(loadPlanLastInstanceId());
      const snap = loadPlanSnapshot();

      const pullCloudHistory = (note?: string) => {
        const sid = loadPlanClientSyncId();
        setCloudHistory((h) => ({
          ...h,
          status: "loading",
          lastSyncNote: note ?? h.lastSyncNote,
        }));
        void fetchPlanCloudHistory(sid ?? undefined)
          .then((rows) => {
            setCloudHistory({
              status: "ready",
              rows,
              lastSyncNote: note,
            });
          })
          .catch(() => {
            setCloudHistory({ status: "ready", rows: [], lastSyncNote: note });
          });
      };

      if (snap && snap.fingerprint === fingerprint) {
        setWeeks(rehydratePlanWeeks(snap.weeks, profile));
        setSnapshotMeta({ savedAt: snap.savedAt, fromCache: true });
        pullCloudHistory();
        return;
      }

      const fresh = generateFourWeekPlan(profile, result);
      savePlanSnapshot(fresh, fingerprint);
      setWeeks(fresh);
      setSnapshotMeta({
        savedAt: new Date().toISOString(),
        fromCache: false,
      });

      void (async () => {
        setCloudHistory((h) => ({ ...h, status: "loading" }));
        const sync = await syncPlanWeeksToCloud(fresh, fingerprint);
        if (sync.ok) {
          if (sync.serverId) {
            savePlanLastInstanceId(sync.serverId);
            setPlanInstanceId(sync.serverId);
          }
          const sid = loadPlanClientSyncId();
          const rows = await fetchPlanCloudHistory(sid ?? undefined);
          setCloudHistory({
            status: "ready",
            rows,
            lastSyncNote:
              sync.linkedUser && sync.linkedPurchase
                ? "Plan synchronisé sur le cloud (compte Supabase + achat Plan/Pack détecté)."
                : sync.linkedUser
                  ? "Plan synchronisé sur le cloud (lié à ton compte Supabase)."
                  : sync.linkedPurchase
                    ? "Plan synchronisé sur le cloud (lié à ton achat Plan/Pack via le cookie rapport)."
                    : "Plan synchronisé sur le cloud.",
          });
        } else {
          pullCloudHistory(
            sync.reason === "supabase_admin_not_configured"
              ? "Historique cloud : Supabase (service role) non configuré sur le serveur — seul le stockage local est utilisé."
              : undefined,
          );
        }
      })();
    });

    return unsubSession;
  }, [regenToken]);

  function handlePlanReplaced(
    newWeeks: PlanWeek[],
    newFingerprint: string,
    opts?: { clientSyncId?: string; planInstanceId?: string | null },
  ) {
    if (opts?.clientSyncId && isUuid(opts.clientSyncId)) {
      savePlanClientSyncId(opts.clientSyncId);
    }
    if (opts?.planInstanceId && isUuid(opts.planInstanceId)) {
      savePlanLastInstanceId(opts.planInstanceId);
      setPlanInstanceId(opts.planInstanceId);
    }
    const profile = loadProfile() ?? DEMO_PROFILE;
    const perf = loadPerformance() ?? DEMO_PERFORMANCE;
    setPlanLimiter(computeScoreResult(profile, perf).limiter);
    const hydrated = rehydratePlanWeeks(newWeeks, profile);
    savePlanSnapshot(hydrated, newFingerprint);
    setPlanFingerprint(newFingerprint);
    setWeeks(hydrated);
    setSnapshotMeta({ savedAt: new Date().toISOString(), fromCache: false });
    const sid = loadPlanClientSyncId();
    setCloudHistory((h) => ({ ...h, status: "loading" }));
    void fetchPlanCloudHistory(sid ?? undefined)
      .then((rows) => {
        setCloudHistory({
          status: "ready",
          rows,
          lastSyncNote:
            "Plan adapté (biais récupération) enregistré sur le cloud.",
        });
      })
      .catch(() => {
        setCloudHistory({ status: "ready", rows: [] });
      });
  }

  function regenerateFromProfile() {
    clearPlanSnapshot();
    setPlanFingerprint(null);
    setWeeks(null);
    setSnapshotMeta(null);
    setPlanInstanceId(null);
    setPlanLimiter("");
    setCloudHistory({ status: "idle", rows: [] });
    setRegenToken((t) => t + 1);
  }

  if (!weeks) {
    return (
      <div className="animate-pulse space-y-6">
        <div className="h-9 w-56 rounded-lg bg-surface-elevated" />
        <div className="h-32 rounded-2xl bg-surface-elevated/80" />
        <div className="h-64 rounded-2xl bg-surface-elevated/80" />
      </div>
    );
  }

  const savedLabel =
    snapshotMeta?.savedAt != null
      ? new Date(snapshotMeta.savedAt).toLocaleString("fr-FR", {
          dateStyle: "medium",
          timeStyle: "short",
        })
      : null;

  const showCloudCard =
    loadPlanClientSyncId() != null ||
    cloudHistory.rows.length > 0 ||
    cloudHistory.lastSyncNote != null ||
    hasSession;

  return (
    <>
      <div className="space-y-8 pb-28 lg:pb-0">
      <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-end sm:justify-between">
        <div>
          <h1 className="text-display text-3xl font-semibold text-foreground">
            Plan 4 semaines
          </h1>
          <p className="mt-2 max-w-2xl text-muted">
            Minimum structuré selon ton profil, ton limiteur détecté, ta fréquence,
            ton matériel et tes contraintes (démo V1 — pas un programme médical).
          </p>
          {savedLabel ? (
            <p className="mt-2 text-xs text-muted">
              {snapshotMeta?.fromCache
                ? `Plan conservé depuis ta dernière visite (${savedLabel}). Il se met à jour si tu modifies le profil, les performances, ou le scoring.`
                : `Plan enregistré sur cet appareil (${savedLabel}).`}
            </p>
          ) : null}
        </div>
        <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:flex-wrap sm:items-end">
          <Button
            type="button"
            variant="outline"
            className="min-h-11 w-full rounded-xl sm:w-auto"
            onClick={regenerateFromProfile}
          >
            Régénérer depuis le profil actuel
          </Button>
          <Button asChild variant="ghost" className="min-h-11 w-full rounded-xl text-muted sm:w-auto">
            <Link href="/profile">Modifier le profil</Link>
          </Button>
        </div>
      </div>

      <div className="rounded-2xl border border-neon/20 bg-gradient-to-br from-neon/5 via-transparent to-background/80 px-4 py-4 sm:px-5">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-neon">
          Minimum Effective Plan
        </p>
        <p className="mt-2 text-sm leading-relaxed text-muted">
          Quelques séances ciblées par semaine — objectifs, tags (Force, Endurance,
          Conditioning…), substitutions si ton matériel ou tes contraintes
          l&apos;exigent. Pas un programme médical.
        </p>
      </div>

      <WeekPlan
        key={planFingerprint ?? "pending"}
        weeks={weeks}
        planFingerprint={planFingerprint}
        planLimiter={planLimiter}
        planFeedback={{
          clientSyncId: loadPlanClientSyncId(),
          planInstanceId,
          hasSession,
          onPlanReplaced: handlePlanReplaced,
        }}
      />

      {showCloudCard ? (
        <Card className="border-border bg-surface/60">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Historique cloud (V3)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted">
            {cloudHistory.status === "loading" ? (
              <p className="text-xs">Chargement…</p>
            ) : null}
            {cloudHistory.lastSyncNote ? (
              <p className="text-xs leading-relaxed">{cloudHistory.lastSyncNote}</p>
            ) : null}
            {cloudHistory.rows.length > 0 ? (
              <ul className="space-y-2 text-xs">
                {cloudHistory.rows.map((row) => (
                  <li
                    key={row.id}
                    className="flex flex-wrap items-center justify-between gap-2 border-b border-border/60 pb-2 last:border-0 last:pb-0"
                  >
                    <span className="text-foreground/90">
                      {new Date(row.createdAt).toLocaleString("fr-FR", {
                        dateStyle: "short",
                        timeStyle: "short",
                      })}
                    </span>
                    <div className="flex flex-wrap items-center gap-2">
                      {row.userId ? (
                        <Badge variant="outline" className="text-[10px] font-normal">
                          Compte
                        </Badge>
                      ) : (
                        <Badge variant="secondary" className="text-[10px] font-normal">
                          Appareil
                        </Badge>
                      )}
                      {row.purchaseId ? (
                        <Badge variant="outline" className="text-[10px] font-normal">
                          Achat
                        </Badge>
                      ) : null}
                      <code className="max-w-[min(100%,14rem)] truncate text-[11px] text-muted">
                        {row.fingerprint.slice(0, 48)}
                        {row.fingerprint.length > 48 ? "…" : ""}
                      </code>
                    </div>
                  </li>
                ))}
              </ul>
            ) : cloudHistory.status === "ready" && loadPlanClientSyncId() ? (
              <p className="text-xs">
                Aucune entrée listée pour l’instant — la prochaine génération
                enregistrée sur le serveur apparaîtra ici.
              </p>
            ) : null}
            <p className="text-[11px] leading-relaxed text-muted/90">
              Les entrées « Compte » viennent d’une session Supabase ; « Appareil »
              du navigateur. Avec un achat Plan ou Pack et le cookie de déblocage
              rapport actif, la ligne est aussi reliée à ton achat (purchase_id).
            </p>
          </CardContent>
        </Card>
      ) : null}

      <div className="flex flex-col gap-3 rounded-2xl border border-border bg-surface/40 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm leading-relaxed text-muted">
          Adapte les charges à ton niveau. Arrête ou modifie l&apos;exercice en
          cas de douleur inhabituelle.
        </p>
        <Button asChild variant="outline" className="min-h-11 w-full shrink-0 rounded-xl sm:w-auto">
          <Link href="/equivalences">Adapter selon mon matériel</Link>
        </Button>
      </div>

      <MedicalDisclaimer />
      </div>

      <MobileStickyQuickBar>
        <Button asChild size="sm" variant="secondary" className="min-h-11 flex-1 rounded-xl">
          <Link href="/results">Score</Link>
        </Button>
        <Button asChild size="sm" className="min-h-11 flex-1 rounded-xl">
          <Link href="/daily">Jour</Link>
        </Button>
      </MobileStickyQuickBar>
    </>
  );
}
