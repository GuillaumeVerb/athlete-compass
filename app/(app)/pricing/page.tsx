import Link from "next/link";
import { PricingCard } from "@/components/pricing/pricing-card";
import { MedicalDisclaimer } from "@/components/disclaimer";
import { Badge } from "@/components/ui/badge";
import { Lock } from "lucide-react";

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
    <div className="space-y-12">
      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-display text-3xl font-semibold text-foreground">
            Tarifs
          </h1>
          <Badge variant="secondary" className="gap-1">
            <Lock className="h-3 w-3" aria-hidden />
            Simulation V1
          </Badge>
        </div>
        <p className="max-w-2xl text-muted">
          Paiement non connecté : tu prévisualises les offres et le parcours
          premium. Aucune carte bancaire, aucun compte obligatoire.
        </p>
        <div className="rounded-2xl border border-amber/30 bg-amber/10 px-4 py-3 text-sm text-foreground/95">
          <strong className="text-amber">Stripe plus tard.</strong> En V1, les
          boutons d&apos;achat restent désactivés — on valide la valeur perçue
          avant d&apos;industrialiser la caisse.
        </div>
      </div>

      <section className="space-y-4" aria-labelledby="value-prop">
        <h2 id="value-prop" className="text-display text-lg font-semibold text-foreground">
          Tu ne paies pas pour un chiffre
        </h2>
        <p className="max-w-3xl text-sm leading-relaxed text-muted">
          Tu paies pour un <strong className="text-foreground">diagnostic</strong>{" "}
          clair sur ce qui limite ton physique hybride, et un{" "}
          <strong className="text-foreground">plan minimal</strong> sur les
          semaines suivantes — pas pour un carnet d&apos;entraînements infini.
        </p>
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

      <section className="space-y-4" aria-labelledby="offers-heading">
        <h2 id="offers-heading" className="text-display text-lg font-semibold text-foreground">
          Offres
        </h2>
        <div className="grid gap-6 md:grid-cols-3">
          <PricingCard
            title="Bilan complet"
            price="9 €"
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
