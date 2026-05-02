"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import type { PerformanceInput } from "@/lib/types";
import { TEST_PROTOCOLS } from "@/lib/tests/test-protocols";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MedicalDisclaimer } from "@/components/disclaimer";

const EXTRA: Partial<
  Record<
    keyof PerformanceInput,
    { body: string; bullets: string[] }
  >
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
  const raw = params.get("test") ?? "row2k";
  const key = raw as keyof PerformanceInput;
  const proto = TEST_PROTOCOLS[key] ?? TEST_PROTOCOLS.row2k;
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
        <p className="text-xs uppercase tracking-widest text-[#6b7289]">
          Pourquoi ce test ?
        </p>
        <h1 className="text-display text-3xl font-semibold text-white mt-2">
          Test recommandé : {proto.title}
        </h1>
      </div>

      <div className="grid gap-8 lg:grid-cols-2 lg:items-start">
        <Card>
          <CardContent className="p-6 space-y-6">
            <p className="text-[#c5cad8] leading-relaxed">{extra.body}</p>
            <div>
              <p className="text-sm font-semibold text-white mb-3">
                Ce que ce test va améliorer :
              </p>
              <ul className="space-y-2 text-sm text-[#9aa3b8] list-disc pl-5">
                {extra.bullets.map((b) => (
                  <li key={b}>{b}</li>
                ))}
              </ul>
            </div>
            <p className="text-xs text-[#6b7289]">
              Saisie : {proto.inputHint}
            </p>
            <Button asChild variant="default" className="rounded-xl">
              <Link href="/results">J&apos;ai compris, retour aux résultats</Link>
            </Button>
          </CardContent>
        </Card>

        <div className="relative aspect-[4/3] rounded-2xl border border-[#252a36] overflow-hidden bg-gradient-to-br from-[#12151c] to-[#0a0c10]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(82,255,114,0.15),transparent_55%)]" />
          <p className="absolute bottom-4 left-4 text-sm text-[#8b92a6]">
            Visuel erg / salle (placeholder)
          </p>
        </div>
      </div>

      <MedicalDisclaimer />
    </div>
  );
}
