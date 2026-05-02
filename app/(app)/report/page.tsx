import Link from "next/link";
import { LockedCard } from "@/components/premium/locked-card";
import { PricingCard } from "@/components/pricing/pricing-card";
import { MedicalDisclaimer } from "@/components/disclaimer";

export default function ReportPage() {
  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-display text-3xl font-semibold text-white">
          Ton rapport complet
        </h1>
        <p className="text-[#9aa3b8] mt-2 max-w-2xl">
          Aperçu premium verrouillé — monétisation simulée pour la V1.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <LockedCard title="Âge par système" description="Répartition cardio / force / résilience estimée." />
        <LockedCard title="Performance Gap" description="Écart entre ton niveau actuel et ton plafond hybride." />
        <LockedCard title="Limiteur principal (détail)" description="Analyse approfondie + priorités d’entraînement." />
        <LockedCard title="Objectifs 4 semaines" description="Version détaillée avec charges, volumes et retests." />
        <LockedCard title="Plan minimal efficace" description="Semaines structurées avec progressions guidées." />
        <LockedCard title="Équivalences machines" description="Traductions rameur, SkiErg, vélo, tapis incliné." />
      </div>

      <div>
        <h2 className="text-display text-xl font-semibold text-white mb-4">
          Débloquer
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
      </div>

      <div className="flex flex-wrap gap-4">
        <Link
          href="/pricing"
          className="text-sm text-[#52ff72] hover:underline"
        >
          Voir la page tarifs
        </Link>
        <Link href="/plan" className="text-sm text-[#52ff72] hover:underline">
          Aperçu du plan 4 semaines
        </Link>
      </div>

      <MedicalDisclaimer />
    </div>
  );
}
