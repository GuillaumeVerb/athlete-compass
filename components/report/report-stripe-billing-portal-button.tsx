"use client";

import { useCallback, useState } from "react";
import { Loader2, Receipt } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createBrowserSupabase } from "@/lib/supabase/browser-client";

export function ReportStripeBillingPortalButton({
  stripeCheckoutSessionId,
  stripeReady,
}: {
  stripeCheckoutSessionId: string;
  stripeReady: boolean;
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onOpen = useCallback(async () => {
    if (!stripeReady) return;
    setError(null);
    setLoading(true);
    try {
      const headers: Record<string, string> = { "Content-Type": "application/json" };
      const sb = createBrowserSupabase();
      if (sb) {
        const { data } = await sb.auth.getSession();
        if (data.session?.access_token) {
          headers.Authorization = `Bearer ${data.session.access_token}`;
        }
      }
      const res = await fetch("/api/stripe/customer-portal", {
        method: "POST",
        headers,
        credentials: "include",
        body: JSON.stringify({ stripeCheckoutSessionId }),
      });
      const data = (await res.json()) as { url?: string; message?: string; error?: string };
      if (!res.ok) {
        setError(data.message ?? data.error ?? `Erreur ${res.status}`);
        return;
      }
      if (!data.url) {
        setError("Réponse sans URL de portail.");
        return;
      }
      window.location.href = data.url;
    } catch (e) {
      setError(e instanceof Error ? e.message : "Échec.");
    } finally {
      setLoading(false);
    }
  }, [stripeCheckoutSessionId, stripeReady]);

  if (!stripeReady) return null;

  return (
    <div className="rounded-2xl border border-border bg-surface/35 px-4 py-3 text-sm">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">Facturation Stripe</p>
      <p className="mt-2 max-w-2xl text-xs leading-relaxed text-muted">
        Reçus, moyens de paiement et factures (portail hébergé par Stripe). Tu dois être sur cet appareil avec
        l’accès rapport actif, ou connecté avec le compte Supabase lié à l’achat.
      </p>
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="mt-3 rounded-xl"
        disabled={loading}
        onClick={() => void onOpen()}
      >
        {loading ? (
          <>
            <Loader2 className="animate-spin" aria-hidden />
            Ouverture…
          </>
        ) : (
          <>
            <Receipt aria-hidden />
            Facturation & reçus
          </>
        )}
      </Button>
      {error ? (
        <p className="mt-2 rounded-lg border border-destructive/35 bg-destructive/10 px-2 py-1.5 text-xs text-foreground/95" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
