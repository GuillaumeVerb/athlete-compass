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
        <strong className="text-neon">Paiement reçu (test).</strong> Le déblocage
        automatique du rapport dans l&apos;app arrive en V2 — en attendant, ton
        aperçu gratuit reste sur{" "}
        <Link href="/results" className="text-neon underline">
          Résultats
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
