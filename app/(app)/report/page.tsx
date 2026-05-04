import Link from "next/link";
import { cookies } from "next/headers";
import { LockedCard } from "@/components/premium/locked-card";
import { PricingCard } from "@/components/pricing/pricing-card";
import { ReportUnlockedBody } from "@/components/report/report-unlocked-body";
import { MedicalDisclaimer } from "@/components/disclaimer";
import { productKeyLabelFr } from "@/lib/purchase/product-key-label";
import {
  REPORT_UNLOCK_COOKIE,
  verifyReportUnlock,
} from "@/lib/purchase/report-unlock-cookie";

export default async function ReportPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get(REPORT_UNLOCK_COOKIE)?.value;
  const unlock = token ? verifyReportUnlock(token) : null;

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-display text-3xl font-semibold text-foreground">
          Ton rapport complet
        </h1>
        {unlock ? (
          <div
            role="status"
            className="mt-4 max-w-3xl rounded-2xl border border-neon/40 bg-neon/10 px-4 py-3 text-sm leading-relaxed text-foreground/95"
          >
            <strong className="text-neon">Accès rapport activé.</strong> Achat
            enregistré : {productKeyLabelFr(unlock.productKey)}. Ci-dessous :
            synthèse calculée sur cet appareil. PDF, exports et historique cloud
            arrivent en V2 — aperçu gratuit toujours sur{" "}
            <Link href="/results" className="text-neon underline">
              Résultats
            </Link>
            .
          </div>
        ) : (
          <>
            <p className="mt-2 max-w-2xl text-muted">
              Aperçu premium verrouillé — monétisation simulée pour la V1.
            </p>
            <p className="mt-4 max-w-3xl text-sm leading-relaxed text-muted">
              Débloque ton rapport complet pour comprendre ton{" "}
              <strong className="text-foreground">Performance Gap</strong> et
              obtenir ton{" "}
              <strong className="text-foreground">plan minimal sur 4 semaines</strong>{" "}
              : limiteur détaillé, objectifs et séances structurées (démo).
            </p>
            <p className="mt-2 max-w-3xl text-xs leading-relaxed text-muted/90">
              Le gratuit te montre où tu en es. Le rapport complet te montre
              quoi faire maintenant.
            </p>
          </>
        )}
      </div>

      {unlock ? (
        <ReportUnlockedBody productKey={unlock.productKey} />
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          <LockedCard
            title="Âge par système"
            description="Répartition cardio / force / résilience estimée."
          />
          <LockedCard
            title="Performance Gap"
            description="Écart entre ton niveau actuel et ton plafond hybride."
          />
          <LockedCard
            title="Limiteur principal (détail)"
            description="Analyse approfondie + priorités d’entraînement."
          />
          <LockedCard
            title="Objectifs 4 semaines"
            description="Version détaillée avec charges, volumes et retests."
          />
          <LockedCard
            title="Plan minimal efficace"
            description="Semaines structurées avec progressions guidées."
          />
          <LockedCard
            title="Équivalences machines"
            description="Traductions rameur, SkiErg, vélo, tapis incliné."
          />
          <LockedCard
            title="Retest 30 jours & export"
            description="Cadence de retest et export PDF du rapport — prévu après intégration paiement."
          />
        </div>
      )}

      {unlock ? (
        <section className="space-y-3 rounded-2xl border border-border bg-surface/40 p-6">
          <h2 className="text-display text-lg font-semibold text-foreground">
            Suite du parcours
          </h2>
          <p className="max-w-2xl text-sm text-muted">
            Les pages détaillées restent ouvertes : résultats, plan démo et
            équivalences.
          </p>
          <div className="flex flex-wrap gap-4 text-sm">
            <Link href="/results" className="text-neon hover:underline">
              Résultats détaillés
            </Link>
            <Link href="/plan" className="text-neon hover:underline">
              Plan 4 semaines
            </Link>
            <Link href="/equivalences" className="text-neon hover:underline">
              Équivalences
            </Link>
            <Link href="/pricing" className="text-muted hover:text-foreground hover:underline">
              Autre offre Stripe
            </Link>
          </div>
        </section>
      ) : (
        <div>
          <h2 className="text-display mb-4 text-xl font-semibold text-foreground">
            Débloquer
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
              ]}
            />
            <PricingCard
              title="Plan 4 semaines"
              price="19 €"
              productKey="plan_19"
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
              productKey="pack_29"
              features={[
                "Tout du bilan complet",
                "Tout du plan 4 semaines",
                "Équivalences machines",
                "Retest 30 jours",
              ]}
            />
          </div>
        </div>
      )}

      <div className="flex flex-wrap gap-4">
        <Link
          href="/pricing"
          className="text-sm text-neon hover:underline"
        >
          Voir la page tarifs
        </Link>
        <Link href="/plan" className="text-sm text-neon hover:underline">
          Aperçu du plan 4 semaines
        </Link>
      </div>

      <MedicalDisclaimer />
    </div>
  );
}
