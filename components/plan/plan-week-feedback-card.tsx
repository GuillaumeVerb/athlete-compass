"use client";

import { useState } from "react";
import type { PlanWeek } from "@/lib/plans/generate-plan";
import type { PlanWeekFatigue } from "@/lib/future/cloud-types";
import {
  postPlanAdapt,
  postPlanWeekFeedback,
} from "@/lib/plans/plan-feedback-api-client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

export type PlanFeedbackContext = {
  clientSyncId: string | null;
  planInstanceId: string | null;
  hasSession: boolean;
  onPlanReplaced?: (
    weeks: PlanWeek[],
    fingerprint: string,
    opts?: { clientSyncId?: string; planInstanceId?: string | null },
  ) => void;
};

export function PlanWeekFeedbackCard({
  weekNum,
  fingerprint,
  ctx,
  sessionsCount,
}: {
  weekNum: number;
  fingerprint: string | null;
  ctx: PlanFeedbackContext | null;
  sessionsCount: number;
}) {
  const [fatigue, setFatigue] = useState<PlanWeekFatigue>("ok");
  const [note, setNote] = useState("");
  const [sessionsDone, setSessionsDone] = useState("");
  const [busy, setBusy] = useState<"idle" | "save" | "adapt">("idle");
  const [msg, setMsg] = useState<string | null>(null);

  const canCloud =
    Boolean(ctx?.hasSession) &&
    Boolean(ctx?.clientSyncId) &&
    Boolean(fingerprint);

  async function onSendFeedback() {
    if (!canCloud || !ctx?.clientSyncId || !fingerprint) return;
    setBusy("save");
    setMsg(null);
    const raw = sessionsDone.trim() === "" ? undefined : Number(sessionsDone);
    let sessionsCompleted: number | undefined;
    if (raw !== undefined && Number.isFinite(raw)) {
      const n = Math.round(raw);
      if (n >= 0 && n <= sessionsCount) sessionsCompleted = n;
    }
    const res = await postPlanWeekFeedback({
      clientSyncId: ctx.clientSyncId,
      fingerprint,
      weekIndex: weekNum,
      fatigue,
      sessionsCompleted,
      note: note.trim() || undefined,
      planInstanceId: ctx.planInstanceId ?? undefined,
    });
    setBusy("idle");
    if (!res.ok) {
      setMsg("Envoi impossible (vérifie la connexion et la session).");
      return;
    }
    setMsg("Feedback enregistré sur le cloud.");
  }

  async function onAdaptRecovery() {
    if (!ctx?.onPlanReplaced || !canCloud || !ctx.clientSyncId || !fingerprint) return;
    setBusy("adapt");
    setMsg(null);
    const res = await postPlanAdapt({
      clientSyncId: ctx.clientSyncId,
      previousPlanInstanceId: ctx.planInstanceId ?? undefined,
    });
    setBusy("idle");
    if (!res.ok) {
      setMsg("Adaptation refusée ou serveur indisponible.");
      return;
    }
    ctx.onPlanReplaced(res.weeks, res.fingerprint, {
      clientSyncId: res.clientSyncId,
      planInstanceId: res.planInstanceId,
    });
    setMsg("Plan régénéré avec biais récupération (nouveau snapshot local + cloud).");
  }

  return (
    <Card className="border-neon/20 bg-neon/5">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Ressenti semaine (V4)</CardTitle>
        <p className="text-xs font-normal text-muted">
          Optionnel — aide à tracer la charge réelle. Connecte-toi (Supabase) et synchronise le
          plan au moins une fois pour activer l’envoi cloud.
        </p>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">
        {!canCloud ? (
          <p className="text-xs text-muted">
            Feedback cloud désactivé (session ou sync navigateur manquante).
          </p>
        ) : null}
        <div className="space-y-2">
          <Label className="text-foreground">Fatigue perçue</Label>
          <div className="flex flex-wrap gap-3 text-xs">
            {(
              [
                ["low", "Basse"],
                ["ok", "Normale"],
                ["high", "Élevée"],
              ] as const
            ).map(([v, label]) => (
              <label key={v} className="flex cursor-pointer items-center gap-1.5">
                <input
                  type="radio"
                  name={`fatigue-${weekNum}`}
                  className="accent-neon"
                  checked={fatigue === v}
                  disabled={!canCloud || busy !== "idle"}
                  onChange={() => setFatigue(v)}
                />
                <span>{label}</span>
              </label>
            ))}
          </div>
        </div>
        <div className="space-y-1">
          <Label htmlFor={`sess-${weekNum}`} className="text-foreground">
            Séances suivies (optionnel, 0–{sessionsCount})
          </Label>
          <input
            id={`sess-${weekNum}`}
            type="number"
            min={0}
            max={sessionsCount}
            inputMode="numeric"
            className="w-full max-w-32 rounded-lg border border-border bg-background px-2 py-1.5 text-sm"
            value={sessionsDone}
            onChange={(e) => setSessionsDone(e.target.value)}
            disabled={!canCloud || busy !== "idle"}
          />
        </div>
        <div className="space-y-1">
          <Label htmlFor={`note-${weekNum}`} className="text-foreground">
            Note courte (optionnel)
          </Label>
          <textarea
            id={`note-${weekNum}`}
            rows={2}
            maxLength={500}
            className="w-full rounded-lg border border-border bg-background px-2 py-2 text-sm text-foreground"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            disabled={!canCloud || busy !== "idle"}
            placeholder="Ex. sommeil moyen, douleurs, charge ressentie…"
          />
        </div>
        {msg ? <p className="text-xs text-muted">{msg}</p> : null}
        <div className="flex flex-wrap gap-2 pt-1">
          <Button
            type="button"
            size="sm"
            className="rounded-lg"
            disabled={!canCloud || busy !== "idle"}
            onClick={() => void onSendFeedback()}
          >
            {busy === "save" ? "Envoi…" : "Envoyer le feedback"}
          </Button>
          <Button
            type="button"
            size="sm"
            variant="outline"
            className="rounded-lg"
            disabled={!canCloud || busy !== "idle" || !ctx?.onPlanReplaced}
            onClick={() => void onAdaptRecovery()}
            title="Régénère le plan 4 semaines avec un biais récupération (nouvelle empreinte)."
          >
            {busy === "adapt" ? "Adaptation…" : "Régénérer (récup)"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
