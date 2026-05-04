"use client";

import { CreditCard, Lock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useCheckoutAvailability } from "@/components/checkout/checkout-context";

export function PricingStripeBadge() {
  const { status, stripeCheckout } = useCheckoutAvailability();
  if (status === "loading") {
    return (
      <Badge variant="secondary" className="gap-1">
        …
      </Badge>
    );
  }
  if (stripeCheckout) {
    return (
      <Badge variant="secondary" className="gap-1 border-neon/40 bg-neon/15 text-neon">
        <CreditCard className="h-3 w-3" aria-hidden />
        Paiement test
      </Badge>
    );
  }
  return (
    <Badge variant="secondary" className="gap-1">
      <Lock className="h-3 w-3" aria-hidden />
      Démo V1
    </Badge>
  );
}

export function PricingStripeBanner() {
  const { status, stripeCheckout } = useCheckoutAvailability();
  if (status === "loading") return null;
  if (stripeCheckout) {
    return (
      <div className="rounded-2xl border border-neon/30 bg-neon/10 px-4 py-3 text-sm text-foreground/95">
        <strong className="text-neon">Paiement test actif.</strong> Les boutons
        ouvrent Stripe Checkout — utilise une carte de test du dashboard Stripe.
      </div>
    );
  }
  return (
    <div className="rounded-2xl border border-amber/30 bg-amber/10 px-4 py-3 text-sm text-foreground/95">
      <strong className="text-amber">Stripe non configuré.</strong> Les offres
      restent en prévisualisation. Pour un parcours réel, configure les clés
      (voir <code className="text-xs">docs/V2_SETUP.md</code>).
    </div>
  );
}
