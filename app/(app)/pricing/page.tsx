import { PricingCard } from "@/components/pricing/pricing-card";
import { MedicalDisclaimer } from "@/components/disclaimer";

export default function PricingPage() {
  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-display text-3xl font-semibold text-white">
          Tarifs
        </h1>
        <p className="text-[#9aa3b8] mt-2 max-w-2xl">
          Paiement non connecté en V1 — interface de prévisualisation produit.
        </p>
      </div>
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
          ]}
        />
        <PricingCard
          title="Plan 4 semaines"
          price="19 €"
          features={[
            "Objectifs 4 semaines",
            "Plan d’entraînement",
            "Séances détaillées",
            "Cohérence hebdomadaire",
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
      <MedicalDisclaimer />
    </div>
  );
}
