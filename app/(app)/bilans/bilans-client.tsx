"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  fetchAssessmentsList,
  postCurrentAssessment,
  type AssessmentListItemClient,
} from "@/lib/assessments/assessments-api-client";
import {
  cancelRetestReminder,
  fetchRetestReminders,
  postRetestReminder,
  type RetestReminderListItem,
} from "@/lib/assessments/retest-reminders-api-client";
import { subscribeSupabaseSession } from "@/lib/plans/sync-plan-cloud-client";
import { DEMO_PERFORMANCE, DEMO_PROFILE } from "@/lib/mock-data";
import { loadPerformance, loadProfile } from "@/lib/storage";
import { isUuid } from "@/lib/uuid";
import { BilansTrendCharts } from "@/components/bilans/bilans-trend-charts";
import { MedicalDisclaimer } from "@/components/disclaimer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

function sourceLabel(source: string): string {
  switch (source) {
    case "retest_30d":
      return "Retest";
    case "import":
      return "Import";
    default:
      return "Manuel";
  }
}

function formatBilanOption(row: AssessmentListItemClient): string {
  const d = new Date(row.createdAt).toLocaleString("fr-FR", {
    dateStyle: "short",
    timeStyle: "short",
  });
  return `${d} · Hybrid ${row.hybridScore} · ${sourceLabel(row.source)}`;
}

export function BilansClient() {
  const searchParams = useSearchParams();
  const [hasSession, setHasSession] = useState(false);
  const [status, setStatus] = useState<"idle" | "loading" | "ready">("idle");
  const [items, setItems] = useState<AssessmentListItemClient[]>([]);
  const [reminders, setReminders] = useState<RetestReminderListItem[]>([]);
  const [note, setNote] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [schedulingReminder, setSchedulingReminder] = useState(false);
  const [reminderDays, setReminderDays] = useState(30);
  const [retestAnchorId, setRetestAnchorId] = useState("");

  const load = useCallback(async () => {
    setStatus("loading");
    const [assRes, remRes] = await Promise.all([
      fetchAssessmentsList(60),
      fetchRetestReminders(),
    ]);

    if (remRes.ok) {
      setReminders(remRes.items);
    } else {
      setReminders([]);
    }

    if (!assRes.ok) {
      if (assRes.error === "no_session") {
        setItems([]);
        setRetestAnchorId("");
        setNote("Connecte-toi (Supabase) pour voir tes bilans enregistrés sur le cloud.");
      } else if (assRes.error === "skipped") {
        setItems([]);
        setRetestAnchorId("");
        setNote("Supabase n’est pas configuré côté serveur — impossible de charger l’historique.");
      } else {
        setItems([]);
        setRetestAnchorId("");
        setNote("Impossible de charger la liste pour le moment.");
      }
      setStatus("ready");
      return;
    }
    setNote(null);
    setItems(assRes.items);
    const remind = searchParams.get("remind")?.trim() ?? "";
    setRetestAnchorId((prev) => {
      if (remind && isUuid(remind) && assRes.items.some((i) => i.id === remind)) {
        return remind;
      }
      if (assRes.items.length === 0) return "";
      if (prev && assRes.items.some((i) => i.id === prev)) return prev;
      return assRes.items[0]!.id;
    });
    setStatus("ready");
  }, [searchParams]);

  useEffect(() => {
    const unsub = subscribeSupabaseSession(setHasSession);
    queueMicrotask(() => {
      void load();
    });
    return unsub;
  }, [load]);

  async function onSaveCurrent() {
    setSaving(true);
    setNote(null);
    const profile = loadProfile() ?? DEMO_PROFILE;
    const performance = loadPerformance() ?? DEMO_PERFORMANCE;
    const res = await postCurrentAssessment({ profile, performance, source: "manual" });
    setSaving(false);
    if (!res.ok) {
      if (res.skipped) {
        setNote("Supabase admin non configuré — enregistrement impossible.");
      } else if (res.error === "no_session") {
        setNote("Session requise : connecte-toi pour enregistrer un bilan.");
      } else {
        setNote("Enregistrement refusé ou erreur serveur.");
      }
      return;
    }
    await load();
  }

  async function onSaveRetest() {
    const anchor = retestAnchorId.trim();
    if (!anchor || !items.some((i) => i.id === anchor)) return;
    const anchorRow = items.find((i) => i.id === anchor);
    const anchorDateLabel =
      anchorRow != null
        ? new Date(anchorRow.createdAt).toLocaleString("fr-FR", {
            dateStyle: "medium",
            timeStyle: "short",
          })
        : "";
    setSaving(true);
    setNote(null);
    const profile = loadProfile() ?? DEMO_PROFILE;
    const performance = loadPerformance() ?? DEMO_PERFORMANCE;
    const res = await postCurrentAssessment({
      profile,
      performance,
      source: "retest_30d",
      previousAssessmentId: anchor,
    });
    setSaving(false);
    if (!res.ok) {
      if (res.skipped) {
        setNote("Supabase admin non configuré — enregistrement impossible.");
      } else if (res.error === "no_session") {
        setNote("Session requise : connecte-toi pour enregistrer un bilan.");
      } else {
        setNote("Enregistrement retest refusé ou erreur serveur.");
      }
      return;
    }
    await load();
    queueMicrotask(() => {
      setNote(
        anchorDateLabel
          ? `Bilan enregistré en mode retest, relié au snapshot du ${anchorDateLabel}.`
          : "Bilan enregistré en mode retest.",
      );
    });
  }

  async function onScheduleRetestReminder() {
    const anchor = retestAnchorId.trim();
    if (!anchor || !items.some((i) => i.id === anchor)) return;
    setSchedulingReminder(true);
    setNote(null);
    const res = await postRetestReminder({
      anchorAssessmentId: anchor,
      dueInDays: reminderDays,
    });
    setSchedulingReminder(false);
    if (!res.ok) {
      if (res.skipped) {
        setNote("Supabase admin non configuré — rappel impossible.");
      } else if (res.error === "no_session") {
        setNote("Session requise pour programmer un rappel.");
      } else if (res.error === "anchor_assessment_not_found") {
        setNote("Bilan de référence introuvable.");
      } else {
        setNote("Impossible de programmer le rappel.");
      }
      return;
    }
    const dueLabel = new Date(res.dueAt).toLocaleString("fr-FR", {
      dateStyle: "medium",
      timeStyle: "short",
    });
    setNote(`Rappel e-mail programmé pour le ${dueLabel} (heure serveur).`);
    const rem = await fetchRetestReminders();
    if (rem.ok) setReminders(rem.items);
  }

  async function onCancelReminder(id: string) {
    setSchedulingReminder(true);
    setNote(null);
    const res = await cancelRetestReminder(id);
    setSchedulingReminder(false);
    if (!res.ok) {
      setNote(
        res.error === "no_session"
          ? "Session requise."
          : "Annulation impossible (déjà envoyé ou déjà annulé).",
      );
      return;
    }
    const rem = await fetchRetestReminders();
    if (rem.ok) setReminders(rem.items);
    setNote("Rappel annulé.");
  }

  const busy =
    saving || schedulingReminder || !hasSession || status === "loading";
  const retestAnchorValid =
    retestAnchorId.length > 0 && items.some((i) => i.id === retestAnchorId);

  return (
    <div className="space-y-8 pb-24 lg:pb-10">
      <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-widest text-muted">
            V3 — Historique
          </p>
          <h1 className="text-display mt-2 text-3xl font-semibold text-foreground">
            Mes bilans
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-muted">
            Chaque ligne est un instantané du calculateur (profil + performances) enregistré
            sur ton compte. Utile pour comparer avant / après un cycle d’entraînement.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <Button
            type="button"
            variant="outline"
            className="rounded-xl"
            disabled={status === "loading"}
            onClick={() => {
              setNote(null);
              void load();
            }}
          >
            Actualiser
          </Button>
          {retestAnchorValid ? (
            <Button asChild variant="outline" className="rounded-xl">
              <Link
                href={`/next-test?retestAnchor=${encodeURIComponent(retestAnchorId)}`}
              >
                Protocole retest
              </Link>
            </Button>
          ) : null}
          <Button
            type="button"
            variant="outline"
            className="rounded-xl"
            disabled={busy || !retestAnchorValid}
            onClick={() => void onSaveRetest()}
            title="Enregistre le calcul actuel en le reliant au bilan de référence choisi ci-dessous."
          >
            {saving ? "Enregistrement…" : "Enregistrer retest"}
          </Button>
          <Button
            type="button"
            className="rounded-xl"
            disabled={busy}
            onClick={() => void onSaveCurrent()}
          >
            {saving ? "Enregistrement…" : "Enregistrer le bilan actuel"}
          </Button>
        </div>
      </div>

      {items.length > 0 && status === "ready" ? (
        <Card className="border-border bg-surface/35">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Ancrage retest</CardTitle>
            <p className="text-xs font-normal text-muted">
              Choisis le bilan cloud de référence : le prochain enregistrement « retest » et le
              lien « Protocole retest » s’y rattachent pour la comparaison et le parcours guidé.
            </p>
          </CardHeader>
          <CardContent className="space-y-2">
            <Label htmlFor="retest-anchor" className="text-foreground">
              Bilan de référence
            </Label>
            <select
              id="retest-anchor"
              className={cn(
                "block w-full max-w-2xl rounded-xl border border-border bg-background px-3 py-2.5 text-sm text-foreground",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neon/40",
              )}
              value={retestAnchorId}
              onChange={(e) => setRetestAnchorId(e.target.value)}
            >
              {items.map((row) => (
                <option key={row.id} value={row.id}>
                  {formatBilanOption(row)}
                </option>
              ))}
            </select>
          </CardContent>
        </Card>
      ) : null}

      {items.length > 0 && status === "ready" ? (
        <Card className="border-border bg-surface/35">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Rappel e-mail retest</CardTitle>
            <p className="text-xs font-normal text-muted">
              Optionnel — un e-mail à la date prévue (lien protocole + Mes bilans). Nécessite
              Resend côté serveur et un job cron (
              <code className="text-[11px]">POST /api/cron/retest-reminders</code> avec{" "}
              <code className="text-[11px]">CRON_SECRET</code>
              ). Tu peux annuler tant que le message n&apos;a pas été envoyé.
            </p>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <div className="flex flex-wrap items-end gap-3">
              <div className="space-y-1">
                <Label htmlFor="reminder-days" className="text-foreground">
                  Dans combien de jours ?
                </Label>
                <select
                  id="reminder-days"
                  className={cn(
                    "block min-w-[10rem] rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neon/40",
                  )}
                  value={reminderDays}
                  disabled={!hasSession || busy}
                  onChange={(e) => setReminderDays(Number(e.target.value))}
                >
                  {[7, 14, 30, 60, 90].map((d) => (
                    <option key={d} value={d}>
                      {d} jours
                    </option>
                  ))}
                </select>
              </div>
              <Button
                type="button"
                variant="outline"
                className="rounded-xl"
                disabled={busy || !retestAnchorValid}
                onClick={() => void onScheduleRetestReminder()}
              >
                {schedulingReminder ? "Programmation…" : "Programmer le rappel"}
              </Button>
            </div>
            {reminders.length > 0 ? (
              <ul className="space-y-2 border-t border-border/60 pt-3 text-xs text-muted">
                {reminders.map((r) => {
                  const pending = r.sentAt == null && r.cancelledAt == null;
                  const stateLabel = r.sentAt
                    ? "Envoyé"
                    : r.cancelledAt
                      ? "Annulé"
                      : "Programmé";
                  return (
                    <li
                      key={r.id}
                      className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-border/50 bg-background/40 px-3 py-2"
                    >
                      <div>
                        <span className="text-foreground/90">{stateLabel}</span>
                        {" · "}
                        échéance{" "}
                        {new Date(r.dueAt).toLocaleString("fr-FR", {
                          dateStyle: "short",
                          timeStyle: "short",
                        })}
                      </div>
                      {pending ? (
                        <Button
                          type="button"
                          size="sm"
                          variant="ghost"
                          className="h-8 rounded-lg text-xs"
                          disabled={schedulingReminder}
                          onClick={() => void onCancelReminder(r.id)}
                        >
                          Annuler
                        </Button>
                      ) : null}
                    </li>
                  );
                })}
              </ul>
            ) : (
              <p className="text-xs text-muted">Aucun rappel enregistré pour l’instant.</p>
            )}
          </CardContent>
        </Card>
      ) : null}

      {note ? (
        <p className="rounded-xl border border-border bg-surface/50 px-4 py-3 text-sm text-muted">
          {note}
        </p>
      ) : null}

      {status === "ready" ? <BilansTrendCharts items={items} /> : null}

      {status === "loading" ? (
        <div className="animate-pulse space-y-3">
          <div className="h-24 rounded-2xl bg-surface-elevated/80" />
          <div className="h-24 rounded-2xl bg-surface-elevated/80" />
        </div>
      ) : items.length === 0 ? (
        <Card className="border-border bg-surface/40">
          <CardHeader>
            <CardTitle className="text-base">Aucun bilan enregistré</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted">
            <p>
              Complète ton profil et tes performances, puis clique sur
              <span className="text-foreground"> Enregistrer le bilan actuel </span>
              (compte Supabase requis).
            </p>
            <div className="flex flex-wrap gap-2">
              <Button asChild variant="outline" className="rounded-xl">
                <Link href="/profile">Profil</Link>
              </Button>
              <Button asChild variant="outline" className="rounded-xl">
                <Link href="/performances">Performances</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <ul className="space-y-3">
          {items.map((row) => (
            <li key={row.id}>
              <Link
                href={`/bilans/${row.id}`}
                className="block rounded-2xl border border-border bg-surface/50 px-4 py-4 transition-colors hover:border-neon/35 hover:bg-surface/80"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-foreground">
                      {new Date(row.createdAt).toLocaleString("fr-FR", {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })}
                    </p>
                    <p className="mt-1 text-xs text-muted">
                      Hybrid {row.hybridScore}/100 · Âge athl. {row.athleticAge} · Fiabilité{" "}
                      {row.reliabilityPct}%
                    </p>
                    <p className="mt-1 text-xs text-muted line-clamp-2">{row.limiter}</p>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    <Badge variant="secondary" className="text-[10px] font-normal">
                      {row.profileLabel}
                    </Badge>
                    <Badge variant="outline" className="text-[10px] font-normal">
                      {sourceLabel(row.source)}
                    </Badge>
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}

      <MedicalDisclaimer />
    </div>
  );
}
