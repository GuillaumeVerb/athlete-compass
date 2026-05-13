"use client";

import { Suspense, useCallback, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";

function ReportPostPurchaseBannerInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [dismissed, setDismissed] = useState(false);
  const show = !dismissed && searchParams.get("unlocked") === "1";

  const onDismiss = useCallback(() => {
    setDismissed(true);
    router.replace("/report");
  }, [router]);

  if (!show) return null;

  return (
    <div
      role="status"
      className="rounded-2xl border border-neon/40 bg-neon/10 px-4 py-3 text-sm leading-relaxed text-foreground/95"
    >
      <p>
        <strong className="text-neon">Paiement confirmé.</strong> L’accès à ce rapport est lié à{" "}
        <strong className="text-foreground">ce navigateur</strong> (cookie sécurisé). Tant que{" "}
        <strong className="text-foreground">l’email de confirmation n’est pas activé</strong> (Resend
        optionnel), garde cet onglet ou enregistre <span className="whitespace-nowrap">/report</span> en
        favori.
      </p>
      <p className="mt-2 text-xs leading-relaxed text-foreground/85">
        Compte Supabase ?{" "}
        <Link href="#report-supabase-account" className="font-medium text-neon underline">
          Rattacher l’achat
        </Link>{" "}
        (même email que la facture) — section plus bas sur cette page.
      </p>
      <Button type="button" variant="outline" size="sm" className="mt-3 rounded-xl" onClick={onDismiss}>
        Compris
      </Button>
    </div>
  );
}

/** Après redirection Stripe (`?unlocked=1`) : rappel cookie + absence d’email si Resend non branché. */
export function ReportPostPurchaseBanner() {
  return (
    <Suspense fallback={null}>
      <ReportPostPurchaseBannerInner />
    </Suspense>
  );
}
