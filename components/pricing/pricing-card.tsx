"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckoutButton } from "@/components/checkout/checkout-button";
import { useCheckoutAvailability } from "@/components/checkout/checkout-context";
import type { PurchaseProductKey } from "@/lib/future/cloud-types";
import { cn } from "@/lib/utils";

export function PricingCard({
  title,
  price,
  features,
  highlight,
  productKey,
  checkoutCtaLabel,
  simulationCtaLabel,
  fallbackHref = "/report",
}: {
  title: string;
  price: string;
  features: string[];
  highlight?: boolean;
  /** Si défini : bouton Stripe quand configuré, sinon lien simulation (démo). */
  productKey?: PurchaseProductKey;
  checkoutCtaLabel?: string;
  /** Libellé bouton sans Stripe (défaut : parcours rapport verrouillé). */
  simulationCtaLabel?: string;
  /** Sans Stripe : lien pour prévisualiser le déblocage (défaut `/report`). */
  fallbackHref?: string;
}) {
  const { status, stripeCheckout } = useCheckoutAvailability();

  return (
    <div
      className={cn(
        "flex flex-col rounded-2xl border p-6 h-full",
        highlight
          ? "border-amber/55 bg-amber/10 shadow-[0_0_40px_-12px_rgba(245,184,46,0.35)]"
          : "border-border bg-surface/80",
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <h3 className="text-display text-lg font-semibold text-foreground">{title}</h3>
        {highlight ? (
          <Badge variant="amber">Le meilleur choix</Badge>
        ) : null}
      </div>
      <p className="mt-4 text-3xl font-semibold text-foreground">
        {price}
        <span className="text-base font-normal text-muted"> / achat</span>
      </p>
      <ul className="mt-6 flex-1 space-y-2 text-sm text-muted">
        {features.map((f) => (
          <li key={f} className="flex gap-2">
            <span className="text-neon">✓</span>
            {f}
          </li>
        ))}
      </ul>
      {productKey ? (
        <CheckoutButton
          productKey={productKey}
          fallbackHref={stripeCheckout ? undefined : fallbackHref}
          className="mt-8 w-full rounded-xl"
          variant={highlight ? "amber" : "default"}
        >
          {stripeCheckout
            ? (checkoutCtaLabel ?? "Payer (test)")
            : (simulationCtaLabel ?? "Voir la simulation (démo)")}
        </CheckoutButton>
      ) : (
        <Button
          className="mt-8 w-full rounded-xl"
          variant={highlight ? "amber" : "default"}
          disabled
          title="Offre sans checkout — renseigne productKey sur la carte."
        >
          Bientôt disponible
        </Button>
      )}
      {productKey && status === "ready" && !stripeCheckout ? (
        <p className="mt-2 text-center text-[10px] leading-relaxed text-muted">
          Simulation V1 — pas de prélèvement. Configure Stripe pour un checkout
          réel (voir <code className="text-[10px]">docs/V2_SETUP.md</code>).
        </p>
      ) : null}
      {productKey && status === "ready" && stripeCheckout ? (
        <p className="mt-2 text-center text-[10px] text-muted">
          Redirection sécurisée vers Stripe
        </p>
      ) : null}
    </div>
  );
}
