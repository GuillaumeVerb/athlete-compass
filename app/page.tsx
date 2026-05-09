import { LandingHero } from "@/components/landing/hero";
import { HowItWorks } from "@/components/landing/how-it-works";
import { MedicalDisclaimer } from "@/components/disclaimer";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Activity, Gauge, Layers } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col flex-1">
      <LandingHero />
      <HowItWorks />
      <section
        id="features"
        className="border-t border-border bg-surface/30 py-20 px-6"
      >
        <div className="mx-auto max-w-6xl">
          <h2 className="text-display text-center text-2xl font-semibold text-foreground">
            Fonctionnalités
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-center text-muted">
            Un flux court : profil → performances → aperçu chiffré → plan
            minimal. Pas de carnet d’entraînements infini.
          </p>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            <Card className="border-border bg-surface/80">
              <CardContent className="p-6 pt-8">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-neon/25 bg-neon/10 text-neon">
                  <Gauge className="h-5 w-5" />
                </span>
                <h3 className="text-display mt-4 text-lg font-semibold text-foreground">
                  Hybrid Score & radar
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  Cinq piliers (force, cardio intense, endurance, résistance
                  musculaire, core) pour lire ton profil en un coup d’œil.
                </p>
                <Link
                  href="/results"
                  className="mt-4 inline-block text-sm text-neon hover:underline"
                >
                  Voir un exemple
                </Link>
              </CardContent>
            </Card>
            <Card className="border-border bg-surface/80">
              <CardContent className="p-6 pt-8">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-neon/25 bg-neon/10 text-neon">
                  <Activity className="h-5 w-5" />
                </span>
                <h3 className="text-display mt-4 text-lg font-semibold text-foreground">
                  Tests & protocoles
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  Chaque test expliqué : exécution, saisie, erreurs à éviter —
                  crédibilité « labo ».
                </p>
                <Link
                  href="/tests"
                  className="mt-4 inline-block text-sm text-neon hover:underline"
                >
                  Lire les protocoles
                </Link>
              </CardContent>
            </Card>
            <Card className="border-border bg-surface/80">
              <CardContent className="p-6 pt-8">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-amber/25 bg-amber/10 text-amber">
                  <Layers className="h-5 w-5" />
                </span>
                <h3 className="text-display mt-4 text-lg font-semibold text-foreground">
                  Plan 4 semaines
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  Semaines structurées avec objectifs et cohérence — base avant
                  personnalisation premium.
                </p>
                <Link
                  href="/plan"
                  className="mt-4 inline-block text-sm text-neon hover:underline"
                >
                  Voir le plan démo
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
      <section
        id="about"
        className="border-t border-border bg-background py-20 px-6"
      >
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-display text-2xl font-semibold text-foreground">
            Pas une app fitness de plus
          </h2>
          <p className="mt-4 leading-relaxed text-muted">
            Athlete Compass ne remplace pas ton programme. Il t&apos;aide à
            comprendre si ton entraînement construit vraiment le corps que tu
            veux : fort, endurant, résistant et athlétique.
          </p>
          <div className="mt-8 flex justify-center">
            <MedicalDisclaimer />
          </div>
          <div className="mt-10">
            <Button asChild variant="secondary" className="rounded-xl">
              <Link href="/profile">Commencer</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
