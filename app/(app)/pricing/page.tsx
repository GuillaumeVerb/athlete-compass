import Link from "next/link";
import { Suspense } from "react";
import { PricingCard } from "@/components/pricing/pricing-card";
import {
  PricingStripeBadge,
  PricingStripeBanner,
} from "@/components/pricing/pricing-checkout-ui";
import { PricingCheckoutFeedback } from "@/components/pricing/pricing-checkout-feedback";
import { MedicalDisclaimer } from "@/components/disclaimer";
import { Button } from "@/components/ui/button";

const FREE_INCLUDES = [
  "Âge athlétique estimé",
  "Hybrid Score + radar",
  "Profil athlète + fiabilité",
  "Limiteur principal (synthèse)",
  "Prochain test recommandé",
  "Next Best Move (résumé)",
];

const PREMIUM_INCLUDES = [
  "Âge par système (détail)",
  "Performance Gap détaillé",
  "Limiteur expliqué + priorités",
  "Objectifs 4 semaines détaillés",
  "Plan minimal + séances",
  "Équivalences machines complètes",
  "Protocole de retest à 30 jours",
];

export default function PricingPage() {
  return (
    <div className="min-w-0 space-y-12">
      <Suspense fallback={null}>
        <PricingCheckoutFeedback />
      </Suspense>
      <div className="space-y-4">
        <div className="flex min-w-0 flex-wrap items-center gap-3">
          <h1 className="text-display min-w-0 text-3xl font-semibold text-foreground">
            Tarifs
          </h1>
          <PricingStripeBadge />
        </div>
        <p className="max-w-2xl text-muted">
          Le premium débloque le rapport détaillé et le plan — le paiement n&apos;est
          actif que si Stripe est configuré (sinon navigation démo inchangée).
        </p>
        <PricingStripeBanner />
      </div>

      <section className="space-y-4" aria-labelledby="value-prop">
        <h2 id="value-prop" className="text-display text-lg font-semibold text-foreground">
          Tu ne paies pas pour un chiffre
        </h2>
        <p className="max-w-3xl text-sm leading-relaxed text-muted">
          Tu paies pour un{" "}
          <strong className="text-foreground">diagnostic de performance</strong>{" "}
          (limiteur, Performance Gap, priorités) et un{" "}
          <strong className="text-foreground">plan minimal sur 4 semaines</strong>
          — pas pour un carnet d&apos;entraînements infini. Le gratuit te donne déjà
          l&apos;âge athlétique estimé, le Hybrid Score et la direction ; le premium
          détaille quoi faire cette semaine (démo V1).
        </p>
      </section>

      <section
        className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center"
        aria-labelledby="pricing-cta-heading"
      >
        <h2 id="pricing-cta-heading" className="sr-only">
          Actions rapides
        </h2>
        <Button asChild className="min-h-11 w-full rounded-xl sm:w-auto">
          <Link href="/report">Débloquer mon rapport complet</Link>
        </Button>
        <Button asChild variant="outline" className="min-h-11 w-full rounded-xl sm:w-auto">
          <Link href="#offers-heading">Voir les offres</Link>
        </Button>
      </section>

      <section
        className="grid gap-6 lg:grid-cols-2"
        aria-labelledby="free-vs-premium"
      >
        <div className="rounded-2xl border border-border bg-surface/50 p-6">
          <h2
            id="free-vs-premium"
            className="text-display text-base font-semibold text-foreground"
          >
            Déjà inclus (gratuit)
          </h2>
          <ul className="mt-4 space-y-2 text-sm text-muted">
            {FREE_INCLUDES.map((item) => (
              <li key={item} className="flex gap-2">
                <span className="text-neon">✓</span>
                {item}
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-2xl border border-neon/25 bg-neon/5 p-6">
          <h2 className="text-display text-base font-semibold text-foreground">
            Débloqué avec le premium
          </h2>
          <ul className="mt-4 space-y-2 text-sm text-muted">
            {PREMIUM_INCLUDES.map((item) => (
              <li key={item} className="flex gap-2">
                <span className="text-amber">+</span>
                {item}
              </li>
            ))}
          </ul>
          <p className="mt-4 text-xs text-muted">
            Aperçu des modules verrouillés :{" "}
            <Link href="/report" className="text-neon hover:underline">
              page rapport
            </Link>
            .
          </p>
        </div>
      </section>

      <section className="space-y-4 scroll-mt-28" aria-labelledby="offers-heading">
        <h2 id="offers-heading" className="text-display text-lg font-semibold text-foreground">
          Offres
        </h2>
        <div className="grid gap-6 md:grid-cols-3">
          <PricingCard
            title="Bilan complet"
            price="9 €"
            productKey="bilan_9"
            features={[
              "Rapport détaillé",
              "Âge athlétique",
              "Hybrid Score",
              "Profil athlète",
              "Prochain test recommandé",
              "Limiteur principal résumé",
            ]}
          />
          <PricingCard
            title="Plan 4 semaines"
            price="19 €"
            productKey="plan_19"
            features={[
              "Objectifs 4 semaines",
              "Plan minimal efficace",
              "Séances détaillées",
              "Cohérence hebdomadaire",
              "Protocole de retest",
            ]}
          />
          <PricingCard
            title="Pack complet"
            price="29 €"
            highlight
            productKey="pack_29"
            features={[
              "Tout du bilan complet",
              "Tout du plan 4 semaines",
              "Équivalences machines",
              "Retest 30 jours",
            ]}
          />
        </div>
      </section>

      <MedicalDisclaimer />
    </div>
  );
}
