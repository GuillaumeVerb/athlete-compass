"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { isUuid } from "@/lib/uuid";
import { performancesHrefFocused } from "@/lib/performance/performance-focus";
import {
  TEST_PROTOCOLS,
  performanceTestKeyFromQuery,
  type PerformanceTestKey,
} from "@/lib/tests/test-protocols";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { MedicalDisclaimer } from "@/components/disclaimer";

const EXTRA: Partial<
  Record<PerformanceTestKey, { body: string; bullets: string[] }>
> = {
  row2k: {
    body: "Ton 1 km rameur montre un excellent moteur court. Le 2 km permettra de mesurer ta capacité à tenir l’intensité plus longtemps.",
    bullets: [
      "Affiner ton score endurance",
      "Mieux évaluer ton profil",
      "Améliorer la fiabilité du score",
      "Adapter ton plan plus précisément",
    ],
  },
  row1k: {
    body: "Référence rapide pour estimer ton cardio intense et calibrer les autres tests.",
    bullets: [
      "Ancrer ton score cardio intense",
      "Comparer force / moteur",
      "Fiabiliser le Hybrid Score",
    ],
  },
  run5k: {
    body: "Utile pour séparer moteur court d’endurance réelle sur le terrain.",
    bullets: [
      "Mesurer endurance extérieure",
      "Ajuster le profil HYROX / hybride",
      "Croiser avec tes données rameur",
    ],
  },
  pullups: {
    body: "Indicateur simple de force relative haut du corps et de résistance musculaire.",
    bullets: [
      "Compléter le pilier force / résistance",
      "Mieux cadrer le volume tirage",
    ],
  },
};

export function NextTestContent() {
  const params = useSearchParams();
  const retestAnchor = params.get("retestAnchor")?.trim() ?? "";
  const retestOk = retestAnchor.length > 0 && isUuid(retestAnchor);
  const raw = params.get("test") ?? "row2k";
  const key = performanceTestKeyFromQuery(raw);
  const proto = TEST_PROTOCOLS[key];
  const extra = EXTRA[key] ?? {
    body: proto.measures,
    bullets: [
      ...proto.protocol.slice(0, 3),
      "Améliorer la fiabilité du score",
    ],
  };

  return (
    <div className="space-y-8">
      <div>
        <p className="text-xs font-medium uppercase tracking-widest text-muted">
          Pourquoi ce test ?
        </p>
        <h1 className="text-display mt-2 text-3xl font-semibold text-foreground">
          Test recommandé : {proto.title}
        </h1>
      </div>

      {retestOk ? (
        <Card className="border-neon/25 bg-neon/5">
          <CardContent className="p-5 space-y-3 text-sm text-muted">
            <p className="font-medium text-foreground">Retest depuis un bilan enregistré</p>
            <p>
              Tu enchaînes à partir du snapshot cloud{" "}
              <Link
                href={`/bilans/${encodeURIComponent(retestAnchor)}`}
                className="text-neon hover:underline"
              >
                ouvrir ce bilan
              </Link>
              . Mets à jour tes performances, puis enregistre un nouveau bilan depuis{" "}
              <Link href="/bilans" className="text-neon hover:underline">
                Mes bilans
              </Link>{" "}
              (<span className="text-foreground/90">Enregistrer retest</span> lie automatiquement au
              dernier bilan cloud).
            </p>
            <p>
              <Button asChild variant="outline" size="sm" className="rounded-lg">
                <Link
                  href={`/bilans?remind=${encodeURIComponent(retestAnchor)}`}
                >
                  Programmer un rappel e-mail
                </Link>
              </Button>
            </p>
          </CardContent>
        </Card>
      ) : null}

      <div className="grid gap-8 lg:grid-cols-2 lg:items-start">
        <Card>
          <CardContent className="p-6 space-y-6">
            <p className="leading-relaxed text-muted">{extra.body}</p>
            <div>
              <p className="mb-3 text-sm font-semibold text-foreground">
                Ce que ce test va améliorer :
              </p>
              <ul className="list-disc space-y-2 pl-5 text-sm text-muted">
                {extra.bullets.map((b) => (
                  <li key={b}>{b}</li>
                ))}
              </ul>
            </div>
            <p className="text-xs text-muted">
              Saisie : {proto.inputHint}
            </p>
            <Button asChild variant="default" className="rounded-xl">
              <Link href="/results">J&apos;ai compris, retour aux résultats</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden border-border bg-surface/90">
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.07]"
            style={{
              backgroundImage: `linear-gradient(rgba(82,255,114,0.9) 1px, transparent 1px),
                linear-gradient(90deg, rgba(82,255,114,0.9) 1px, transparent 1px)`,
              backgroundSize: "24px 24px",
            }}
          />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_70%_0%,rgba(82,255,114,0.12),transparent_50%)]" />
          <CardContent className="relative space-y-5 p-6">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="secondary" className="font-medium">
                {proto.category}
              </Badge>
              <Badge variant="outline">{proto.estimatedMinutes}</Badge>
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-muted">
                Matériel
              </p>
              <p className="mt-1 text-sm text-foreground/90">{proto.equipment}</p>
            </div>
            <div>
              <p className="mb-2 text-xs font-medium uppercase tracking-wider text-muted">
                Protocole (aperçu)
              </p>
              <ol className="list-decimal space-y-2 pl-4 text-sm text-muted marker:text-neon marker:font-semibold">
                {proto.protocol.slice(0, 3).map((step) => (
                  <li key={step}>{step}</li>
                ))}
                {proto.protocol.length > 3 ? (
                  <li className="list-none pl-0 text-muted/80">
                    … et {proto.protocol.length - 3} étape
                    {proto.protocol.length - 3 > 1 ? "s" : ""} sur la fiche
                    complète.
                  </li>
                ) : null}
              </ol>
            </div>
            <div className="rounded-xl border border-neon/20 bg-neon/5 p-4">
              <p className="text-xs font-medium uppercase tracking-wider text-neon/90">
                Impact score
              </p>
              <p className="mt-2 text-sm leading-relaxed text-foreground/90">
                {proto.scoreImpact}
              </p>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
              <Button asChild className="rounded-xl">
                <Link href={performancesHrefFocused(proto.id)}>
                  Saisir mes performances
                </Link>
              </Button>
              <Button asChild variant="outline" className="rounded-xl border-border">
                <Link href={`/tests#${proto.id}`}>Fiche protocole complète</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <MedicalDisclaimer />
    </div>
  );
}
