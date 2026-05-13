import Link from "next/link";
import { cookies } from "next/headers";
import { LockedCard } from "@/components/premium/locked-card";
import { PricingCard } from "@/components/pricing/pricing-card";
import { ReportLastPurchaseSummary } from "@/components/report/report-last-purchase-summary";
import { ReportLinkSupabaseAccountSection } from "@/components/report/report-link-supabase-account-section";
import { ReportPostPurchaseBanner } from "@/components/report/report-post-purchase-banner";
import { ReportPdfDownloadButton } from "@/components/report/report-pdf-download-button";
import { ReportStripeBillingPortalButton } from "@/components/report/report-stripe-billing-portal-button";
import { ReportUnlockedBody } from "@/components/report/report-unlocked-body";
import { MedicalDisclaimer } from "@/components/disclaimer";
import { isStripeCheckoutConfigured, isSupabaseBrowserConfigured } from "@/lib/env/cloud-ready";
import { fetchPremiumReportMeta } from "@/lib/purchase/fetch-premium-report-meta";
import {
  fetchPurchaseAccountLinkStatus,
  type PurchaseAccountLinkStatus,
} from "@/lib/purchase/fetch-purchase-account-link-status";
import { fetchPurchaseReceiptLine } from "@/lib/purchase/fetch-purchase-receipt-line";
import { fetchUnlockReportSnapshot } from "@/lib/purchase/fetch-unlock-report-snapshot";
import { productKeyLabelFr } from "@/lib/purchase/product-key-label";
import {
  REPORT_UNLOCK_COOKIE,
  verifyReportUnlock,
} from "@/lib/purchase/report-unlock-cookie";

export default async function ReportPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get(REPORT_UNLOCK_COOKIE)?.value;
  const unlock = token ? verifyReportUnlock(token) : null;

  const [serverSnapshot, premiumMeta, purchaseReceipt, accountLinkStatus] = unlock
    ? await Promise.all([
        fetchUnlockReportSnapshot(unlock.sessionId),
        fetchPremiumReportMeta(unlock.sessionId),
        fetchPurchaseReceiptLine(unlock.sessionId),
        fetchPurchaseAccountLinkStatus(unlock.sessionId),
      ])
    : [null, null, null, { kind: "unavailable" } as PurchaseAccountLinkStatus];

  const supabaseBrowserConfigured = isSupabaseBrowserConfigured();
  const stripeCheckoutReady = isStripeCheckoutConfigured();

  return (
    <div className="min-w-0 space-y-10">
      <div>
        <h1 className="text-display text-3xl font-semibold text-foreground">
          Ton rapport complet
        </h1>
        {unlock ? (
          <>
            <div
              role="status"
              className="mt-4 max-w-3xl min-w-0 break-words rounded-2xl border border-neon/40 bg-neon/10 px-4 py-3 text-sm leading-relaxed text-foreground/95"
            >
              <strong className="text-neon">Accès rapport activé.</strong> Achat
              enregistré : {productKeyLabelFr(unlock.productKey)}. Ci-dessous :{" "}
              {serverSnapshot
                ? "bilan figé au moment du paiement (serveur)."
                : "synthèse recalculée sur cet appareil (localStorage)."}
              {serverSnapshot ? (
                <>
                  <ReportPdfDownloadButton />
                  <span className="mt-1 block text-xs text-muted">
                    Historique cloud et export étendu — V2+. Aperçu gratuit sur{" "}
                    <Link href="/results" className="text-neon underline">
                      Résultats
                    </Link>
                    .
                  </span>
                </>
              ) : (
                <span className="mt-1 block text-xs text-muted">
                  PDF complet et historique cloud — V2+. Aperçu gratuit sur{" "}
                  <Link href="/results" className="text-neon underline">
                    Résultats
                  </Link>
                  .
                </span>
              )}
              {premiumMeta ? (
                <span className="mt-2 block text-xs text-foreground/85">
                  Rapport premium{" "}
                  <strong className="text-foreground/90">indexé en base</strong>{" "}
                  (statut {premiumMeta.status}
                  {premiumMeta.pdfUrl ? ", PDF disponible" : ""}).
                </span>
              ) : null}
            </div>
            <div className="mt-4 max-w-3xl min-w-0 space-y-4">
              <ReportLastPurchaseSummary
                cookieProductKey={unlock.productKey}
                cookieExpUnix={unlock.exp}
                receipt={purchaseReceipt}
              />
              <ReportLinkSupabaseAccountSection
                stripeCheckoutSessionId={unlock.sessionId}
                initialStatus={accountLinkStatus}
                supabaseBrowserConfigured={supabaseBrowserConfigured}
              />
              <ReportStripeBillingPortalButton
                stripeCheckoutSessionId={unlock.sessionId}
                stripeReady={stripeCheckoutReady}
              />
            </div>
          </>
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
        <>
          <ReportPostPurchaseBanner />
          <ReportUnlockedBody
            productKey={unlock.productKey}
            serverSnapshot={serverSnapshot}
          />
        </>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          <LockedCard
            title="Âge par système"
            description="Répartition cardio / force / résilience estimée."
            teaser="Cardio ~70 · Force ~58 · Endurance ~64 (aperçu fictif)"
          />
          <LockedCard
            title="Performance Gap"
            description="Écart entre ton niveau actuel et ton plafond hybride."
            teaser="Δ ciblé ≈ +10 pts sur le pilier prioritaire (ex.)"
          />
          <LockedCard
            title="Limiteur principal (détail)"
            description="Analyse approfondie + priorités d’entraînement."
            teaser="Priorité #1 : volume aérobie contrôlé (ex.)"
          />
          <LockedCard
            title="Objectifs 4 semaines"
            description="Version détaillée avec charges, volumes et retests."
            teaser="S1 base → S2 intensité → S3 consolidation → S4 retest"
          />
          <LockedCard
            title="Plan minimal efficace"
            description="Semaines structurées avec progressions guidées."
            teaser="3–5 séances / sem. · tags Force / Z2 / Conditioning…"
          />
          <LockedCard
            title="Équivalences machines"
            description="Traductions rameur, SkiErg, vélo, tapis incliné."
            teaser="Rameur 500 m ↔ SkiErg 500 m ↔ Bike tempo (logique)"
          />
          <LockedCard
            title="Retest 30 jours & export"
            description="Cadence de retest et export PDF du rapport — prévu après intégration paiement."
            teaser="J+30 · même protocole court · PDF étendu (V2+)"
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
        <div id="debloquer">
          <h2 className="text-display mb-4 text-xl font-semibold text-foreground">
            Débloquer
          </h2>
          <div className="grid gap-6 md:grid-cols-3">
            <PricingCard
              title="Bilan complet"
              price="9 €"
              productKey="bilan_9"
              fallbackHref="/pricing"
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
              fallbackHref="/pricing"
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
              fallbackHref="/pricing"
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
