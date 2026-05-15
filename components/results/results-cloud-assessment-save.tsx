"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { CloudUpload } from "lucide-react";
import { postCurrentAssessment } from "@/lib/assessments/assessments-api-client";
import { subscribeSupabaseSession } from "@/lib/plans/sync-plan-cloud-client";
import { createBrowserSupabase } from "@/lib/supabase/browser-client";
import type { PerformanceInput, UserProfile } from "@/lib/types";
import { Button } from "@/components/ui/button";

type Ui = "no_client" | "no_session" | "ready";

/**
 * V3 : enregistrer le snapshot profil + performances actuel comme ligne `assessments` (cloud).
 * N’apparaît que si le client Supabase navigateur est configuré.
 */
export function ResultsCloudAssessmentSave({
  profile,
  performance,
}: {
  profile: UserProfile;
  performance: PerformanceInput;
}) {
  const [ui, setUi] = useState<Ui>("no_client");
  const [saving, setSaving] = useState(false);
  const [okMsg, setOkMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    const sb = createBrowserSupabase();
    if (!sb) {
      setUi("no_client");
      return;
    }
    return subscribeSupabaseSession((has) => {
      setUi(has ? "ready" : "no_session");
    });
  }, []);

  const onSave = useCallback(async () => {
    setErr(null);
    setOkMsg(null);
    setSaving(true);
    try {
      const r = await postCurrentAssessment({
        profile,
        performance,
        source: "manual",
      });
      if (!r.ok) {
        if ("skipped" in r && r.skipped) {
          setErr("Base serveur indisponible (clé service role / migration). Voir docs/A_FAIRE_OPERATEUR.md.");
        } else {
          setErr(r.error === "no_session" ? "Session expirée — reconnecte-toi." : r.error);
        }
        return;
      }
      setOkMsg(
        r.deduplicated
          ? "Ce bilan était déjà enregistré — aucun doublon créé."
          : "Bilan enregistré dans le cloud.",
      );
    } finally {
      setSaving(false);
    }
  }, [profile, performance]);

  if (ui === "no_client") return null;

  return (
    <section
      className="rounded-2xl border border-border bg-surface/40 px-4 py-4 text-sm"
      aria-labelledby="results-cloud-assessment-heading"
    >
      <h2
        id="results-cloud-assessment-heading"
        className="text-xs font-semibold uppercase tracking-[0.16em] text-muted"
      >
        Bilan cloud (V3)
      </h2>
      {ui === "no_session" ? (
        <p className="mt-2 max-w-2xl leading-relaxed text-muted">
          Connecte-toi avec Supabase (ex. page{" "}
          <Link href="/daily" className="text-neon underline">
            Aujourd&apos;hui
          </Link>
          , ou lien magique depuis le rapport) pour pousser ce snapshot vers{" "}
          <Link href="/bilans" className="text-neon underline">
            Mes bilans
          </Link>
          .
        </p>
      ) : (
        <>
          <p className="mt-2 max-w-2xl leading-relaxed text-foreground/90">
            Enregistre une copie de <strong className="font-medium text-foreground">ce calcul</strong>{" "}
            (profil + performances affichés ici) dans ton historique cloud — complète la rétention V3
            hors historique local du score.
          </p>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="rounded-xl"
              disabled={saving}
              onClick={() => void onSave()}
            >
              <CloudUpload aria-hidden />
              {saving ? "Enregistrement…" : "Enregistrer ce bilan sur le cloud"}
            </Button>
            <Link href="/bilans" className="text-xs text-neon underline">
              Mes bilans
            </Link>
          </div>
        </>
      )}
      {okMsg ? (
        <p className="mt-2 text-xs text-neon" role="status">
          {okMsg}{" "}
          <Link href="/bilans" className="font-medium underline">
            Ouvrir Mes bilans
          </Link>
          .
        </p>
      ) : null}
      {err ? (
        <p className="mt-2 rounded-lg border border-destructive/35 bg-destructive/10 px-2 py-1.5 text-xs text-foreground/95" role="alert">
          {err}
        </p>
      ) : null}
    </section>
  );
}
