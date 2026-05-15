"use client";

import Link from "next/link";
import { useCallback, useEffect, useId, useState } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { PurchaseAccountLinkStatus } from "@/lib/purchase/fetch-purchase-account-link-status";
import { createBrowserSupabase } from "@/lib/supabase/browser-client";

type Props = {
  stripeCheckoutSessionId: string;
  initialStatus: PurchaseAccountLinkStatus;
  supabaseBrowserConfigured: boolean;
};

export function ReportLinkSupabaseAccountSection({
  stripeCheckoutSessionId,
  initialStatus,
  supabaseBrowserConfigured,
}: Props) {
  const [status, setStatus] = useState<PurchaseAccountLinkStatus>(initialStatus);
  const [sessionToken, setSessionToken] = useState<string | null>(null);
  const [loadingSession, setLoadingSession] = useState(true);
  const [linking, setLinking] = useState(false);
  const [otpEmail, setOtpEmail] = useState("");
  const [otpSending, setOtpSending] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const headingId = useId();

  const refreshSession = useCallback(async () => {
    const sb = createBrowserSupabase();
    if (!sb) {
      setSessionToken(null);
      setLoadingSession(false);
      return;
    }
    const { data } = await sb.auth.getSession();
    setSessionToken(data.session?.access_token ?? null);
    setLoadingSession(false);
  }, []);

  useEffect(() => {
    void refreshSession();
    const sb = createBrowserSupabase();
    if (!sb) return undefined;
    const { data: sub } = sb.auth.onAuthStateChange(() => {
      void refreshSession();
    });
    return () => {
      sub.subscription.unsubscribe();
    };
  }, [refreshSession]);

  const onLink = useCallback(async () => {
    if (!sessionToken) return;
    setError(null);
    setMessage(null);
    setLinking(true);
    try {
      const res = await fetch("/api/purchase/link-user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionToken}`,
        },
        body: JSON.stringify({ stripeCheckoutSessionId }),
      });
      const data = (await res.json()) as {
        ok?: boolean;
        linked?: boolean;
        alreadyLinked?: boolean;
        message?: string;
        error?: string;
      };
      if (!res.ok) {
        setError(data.message ?? data.error ?? `Erreur ${res.status}`);
        return;
      }
      if (data.alreadyLinked) {
        setMessage("Cet achat était déjà lié à ton compte.");
        setStatus({ kind: "linked" });
        return;
      }
      setMessage("Compte lié : tes prochains accès (PDF, etc.) pourront utiliser ton user_id Supabase.");
      setStatus({ kind: "linked" });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Liaison impossible.");
    } finally {
      setLinking(false);
    }
  }, [sessionToken, stripeCheckoutSessionId]);

  const onSendOtp = useCallback(async () => {
    const sb = createBrowserSupabase();
    if (!sb) return;
    const email = otpEmail.trim();
    if (!email) {
      setError("Indique l’email utilisé sur la facture Stripe.");
      return;
    }
    setError(null);
    setOtpSending(true);
    try {
      const redirect = `${window.location.origin}/report`;
      const { error: otpErr } = await sb.auth.signInWithOtp({
        email,
        options: { emailRedirectTo: redirect },
      });
      if (otpErr) {
        setError(otpErr.message);
        return;
      }
      setOtpSent(true);
      setMessage(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Envoi impossible.");
    } finally {
      setOtpSending(false);
    }
  }, [otpEmail]);

  if (!supabaseBrowserConfigured) {
    return (
      <section
        className="scroll-mt-28 rounded-2xl border border-border bg-surface/30 px-4 py-3 text-sm text-muted"
        aria-labelledby={headingId}
      >
        <h2 id={headingId} className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">
          Compte Supabase
        </h2>
        <p className="mt-2 leading-relaxed">
          Pour lier un achat à un compte, configure{" "}
          <span className="font-mono text-[11px] text-foreground/80">NEXT_PUBLIC_SUPABASE_URL</span> et{" "}
          <span className="font-mono text-[11px] text-foreground/80">NEXT_PUBLIC_SUPABASE_ANON_KEY</span>{" "}
          (voir <span className="font-mono text-[11px]">.env.example</span>).
        </p>
      </section>
    );
  }

  if (status.kind === "unavailable") {
    return (
      <section
        className="scroll-mt-28 rounded-2xl border border-border bg-surface/30 px-4 py-3 text-sm text-muted"
        aria-labelledby={headingId}
      >
        <h2 id={headingId} className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">
          Compte Supabase
        </h2>
        <p className="mt-2 leading-relaxed">
          Liaison indisponible tant que la base (service role) ne répond pas — réessaie plus tard.
        </p>
      </section>
    );
  }

  if (status.kind === "no_row") {
    return (
      <section
        className="scroll-mt-28 rounded-2xl border border-border bg-surface/30 px-4 py-3 text-sm text-muted"
        aria-labelledby={headingId}
      >
        <h2 id={headingId} className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">
          Compte Supabase
        </h2>
        <p className="mt-2 leading-relaxed">
          Aucune ligne d’achat en base pour cette session — dès que le webhook Stripe a synchronisé, le lien
          compte pourra apparaître ici.
        </p>
      </section>
    );
  }

  if (status.kind === "linked") {
    return (
      <section
        className="scroll-mt-28 rounded-2xl border border-neon/25 bg-neon/5 px-4 py-3 text-sm text-foreground/95"
        aria-labelledby={headingId}
      >
        <h2 id={headingId} className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">
          Compte Supabase
        </h2>
        <p className="mt-2 leading-relaxed">
          Cet achat est <strong className="font-medium text-neon">déjà lié</strong> à un compte (champ{" "}
          <span className="font-mono text-[11px]">user_id</span> en base).
        </p>
      </section>
    );
  }

  return (
    <section
      className="scroll-mt-28 rounded-2xl border border-border bg-surface/40 px-4 py-4 text-sm"
      aria-labelledby={headingId}
    >
      <h2 id={headingId} className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">
        Compte Supabase
      </h2>
      <p className="mt-2 max-w-2xl leading-relaxed text-foreground/90">
        Rattache cet achat à ton <strong className="font-medium text-foreground">user_id</strong> Supabase (même
        email que sur la facture Stripe) pour les accès API / PDF avec Bearer, ou après connexion sur un autre
        appareil.
      </p>
      <p className="mt-2 text-xs leading-relaxed text-muted">
        Déjà une session sur ce navigateur (ex. page{" "}
        <Link href="/daily" className="text-neon underline">
          Aujourd’hui
        </Link>
        ) ? Utilise le bouton ci-dessous. Sinon reçois un lien magique sur l’email de facture.
      </p>

      {loadingSession ? (
        <p className="mt-3 flex items-center gap-2 text-xs text-muted">
          <Loader2 className="size-4 animate-spin" aria-hidden />
          Vérification de session…
        </p>
      ) : sessionToken ? (
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="rounded-xl"
            disabled={linking}
            onClick={() => void onLink()}
          >
            {linking ? (
              <>
                <Loader2 className="animate-spin" aria-hidden />
                Liaison…
              </>
            ) : (
              "Lier cet achat à mon compte"
            )}
          </Button>
        </div>
      ) : (
        <div className="mt-4 space-y-2">
          <label htmlFor="report-link-otp-email" className="sr-only">
            Email (facture Stripe)
          </label>
          <div className="flex max-w-md flex-col gap-2 sm:flex-row sm:items-center">
            <Input
              id="report-link-otp-email"
              type="email"
              autoComplete="email"
              placeholder="Email (celui de la facture)"
              value={otpEmail}
              onChange={(ev) => setOtpEmail(ev.target.value)}
              className="rounded-xl border-border bg-background/80"
            />
            <Button
              type="button"
              variant="secondary"
              size="sm"
              className="rounded-xl shrink-0"
              disabled={otpSending}
              onClick={() => void onSendOtp()}
            >
              {otpSending ? (
                <>
                  <Loader2 className="animate-spin" aria-hidden />
                  Envoi…
                </>
              ) : (
                "Recevoir le lien"
              )}
            </Button>
          </div>
          {otpSent ? (
            <p className="text-xs leading-relaxed text-neon" role="status">
              Si cet email est autorisé dans Supabase Auth, tu recevras un lien — ouvre-le puis reviens sur cette
              page et clique sur « Lier cet achat à mon compte ».
            </p>
          ) : null}
        </div>
      )}

      {message ? (
        <p className="mt-3 rounded-lg border border-neon/35 bg-neon/10 px-2 py-1.5 text-xs text-foreground/95" role="status">
          {message}
        </p>
      ) : null}
      {error ? (
        <p className="mt-3 rounded-lg border border-destructive/35 bg-destructive/10 px-2 py-1.5 text-xs text-foreground/95" role="alert">
          {error}
        </p>
      ) : null}
    </section>
  );
}
