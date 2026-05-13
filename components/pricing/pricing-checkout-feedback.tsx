"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

export function PricingCheckoutFeedback() {
  const searchParams = useSearchParams();
  const checkout = searchParams.get("checkout");
  if (!checkout) return null;

  if (checkout === "success") {
    return (
      <div
        role="status"
        className="rounded-2xl border border-neon/35 bg-neon/10 px-4 py-3 text-sm text-foreground/95"
      >
        <strong className="text-neon">Paiement reçu (test).</strong> Tu as dû
        être redirigé vers le <Link href="/report" className="text-neon underline">rapport</Link> avec accès activé. Sinon ouvre le rapport manuellement.
        Avec Supabase : tu peux{" "}
        <Link href="/report#report-supabase-account" className="text-neon underline">
          rattacher l’achat à ton compte
        </Link>{" "}
        depuis le rapport (même email que la facture).
        Le détail cloud / PDF arrive en V2 — ton aperçu gratuit reste sur{" "}
        <Link href="/results" className="text-neon underline">
          Résultats
        </Link>
        .
      </div>
    );
  }

  if (checkout === "fail") {
    return (
      <div
        role="status"
        className="rounded-2xl border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-foreground/95"
      >
        <strong className="text-destructive">Paiement non confirmé.</strong> La
        session Stripe est introuvable ou non payée. Réessaie depuis{" "}
        <Link href="/pricing" className="text-neon underline">
          Tarifs
        </Link>
        .
      </div>
    );
  }

  if (checkout === "cancel") {
    return (
      <div
        role="status"
        className="rounded-2xl border border-border bg-surface/60 px-4 py-3 text-sm text-muted"
      >
        Paiement annulé — aucun prélèvement. Tu peux relancer un achat test
        quand tu veux.
      </div>
    );
  }

  return null;
}
