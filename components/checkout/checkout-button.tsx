"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useCheckoutAvailability } from "@/components/checkout/checkout-context";
import type { PurchaseProductKey } from "@/lib/future/cloud-types";
import { DEMO_PERFORMANCE, DEMO_PROFILE } from "@/lib/mock-data";
import { loadPerformance, loadProfile } from "@/lib/storage";
import { cn } from "@/lib/utils";

type ButtonProps = React.ComponentProps<typeof Button>;

export function CheckoutButton({
  productKey,
  children,
  className,
  variant = "default",
  size,
  fallbackHref,
  ...rest
}: {
  productKey: PurchaseProductKey;
  children: React.ReactNode;
  /** Sans Stripe : agit comme lien (parcours démo / rapport). */
  fallbackHref?: string;
} & Omit<ButtonProps, "onClick" | "disabled" | "children">) {
  const { status, stripeCheckout } = useCheckoutAvailability();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (status === "loading") {
    return (
      <Button className={cn(className)} variant={variant} size={size} disabled {...rest}>
        Chargement…
      </Button>
    );
  }

  if (!stripeCheckout && fallbackHref) {
    return (
      <Button asChild className={cn(className)} variant={variant} size={size} {...rest}>
        <Link href={fallbackHref}>{children}</Link>
      </Button>
    );
  }

  if (!stripeCheckout) {
    return (
      <Button
        className={cn(className)}
        variant={variant}
        size={size}
        disabled
        title="Paiement test : configure STRIPE_SECRET_KEY et STRIPE_PRICE_* (voir docs/V2_SETUP.md)."
        {...rest}
      >
        Bientôt disponible
      </Button>
    );
  }

  async function onClick() {
    setError(null);
    setPending(true);
    try {
      const profile = loadProfile() ?? DEMO_PROFILE;
      const performance = loadPerformance() ?? DEMO_PERFORMANCE;

      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productKey,
          snapshot: { profile, performance },
        }),
      });
      const data = (await res.json()) as {
        url?: string;
        message?: string;
        error?: string;
      };
      if (!res.ok) {
        throw new Error(data.message ?? data.error ?? `Erreur ${res.status}`);
      }
      if (!data.url) throw new Error("Réponse sans URL de paiement");
      window.location.href = data.url;
    } catch (e) {
      setPending(false);
      setError(e instanceof Error ? e.message : "Échec du checkout");
    }
  }

  return (
    <>
      <Button
        type="button"
        className={cn(className)}
        variant={variant}
        size={size}
        disabled={pending}
        onClick={onClick}
        {...rest}
      >
        {pending ? "Redirection vers Stripe…" : children}
      </Button>
      {error ? (
        <p className="mt-1 text-center text-xs text-destructive" role="alert">
          {error}
        </p>
      ) : null}
    </>
  );
}
