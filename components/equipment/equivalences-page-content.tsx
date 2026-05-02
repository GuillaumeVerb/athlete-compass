"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  COMMERCIAL_GYM_ALTERNATIVES,
  EQUIVALENCE_TABLE_ROWS,
  EQUIVALENCES_PRACTICAL_NOTE,
  LIGHT_LEGS_INTRO,
  MACHINE_CARDS,
  SWAP_INSIGHTS,
} from "@/lib/equipment/equivalences";
import { EquivalenceCard } from "@/components/equipment/equivalence-card";
import { EquivalenceTable } from "@/components/equipment/equivalence-table";
import { EquivalenceLightLegsBanner } from "@/components/equipment/equivalence-light-legs-banner";
import { MedicalDisclaimer } from "@/components/disclaimer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Lock } from "lucide-react";
import { loadProfile } from "@/lib/storage";

export function EquivalencesPageContent() {
  const [lightLegs, setLightLegs] = useState(false);

  useEffect(() => {
    const p = loadProfile();
    setLightLegs(!!p?.constraints?.includes("light_legs"));
  }, []);

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-display text-3xl font-semibold text-white">
          Équivalences machines
        </h1>
        <p className="text-[#9aa3b8] mt-2 max-w-2xl">
          Remplace un erg ou un bloc tout en gardant l’intention de la séance :
          intensité, durée, pattern de fatigue.
        </p>
      </div>

      <EquivalenceLightLegsBanner />

      <p className="text-xs text-[#6b7289] max-w-3xl leading-relaxed border-l-2 border-[#52ff72]/40 pl-4">
        {EQUIVALENCES_PRACTICAL_NOTE}
      </p>

      <p className="text-sm text-[#9aa3b8] max-w-3xl leading-relaxed">
        {LIGHT_LEGS_INTRO}
      </p>

      <section className="space-y-4">
        <h2 className="text-display text-xl font-semibold text-white">
          Machines & usages
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {MACHINE_CARDS.map((c) => (
            <EquivalenceCard
              key={c.id}
              card={c}
              highlightLightLegs={lightLegs}
            />
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-display text-xl font-semibold text-white">
          Table d’équivalences
        </h2>
        <EquivalenceTable rows={EQUIVALENCE_TABLE_ROWS} />
      </section>

      <section className="space-y-4">
        <h2 className="text-display text-xl font-semibold text-white">
          Ce que le remplacement change
        </h2>
        <div className="grid gap-4 md:grid-cols-2">
          {SWAP_INSIGHTS.map((s) => (
            <Card key={s.title} className="border-[#252a36] bg-[#12151c]/80">
              <CardHeader className="pb-2">
                <CardTitle className="text-base text-[#52ff72]">{s.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-[#9aa3b8] leading-relaxed">{s.body}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-display text-xl font-semibold text-white">
          Salle classique — substitutions
        </h2>
        <div className="rounded-2xl border border-[#252a36] divide-y divide-[#252a36] overflow-hidden">
          {COMMERCIAL_GYM_ALTERNATIVES.map((row) => (
            <div
              key={row.movement}
              className="grid gap-2 sm:grid-cols-[160px_1fr] px-4 py-3 bg-[#0a0c10]/40 text-sm"
            >
              <span className="font-medium text-white">{row.movement}</span>
              <span className="text-[#c5cad8]">{row.alternatives}</span>
            </div>
          ))}
        </div>
      </section>

      <div className="flex flex-col sm:flex-row sm:items-center gap-4 rounded-2xl border border-[#252a36] bg-[#181c26]/60 p-5">
        <p className="text-sm text-[#9aa3b8] flex-1">
          Version complète : tables longues, charges relatives et intégration
          automatique dans ton plan — prévu côté premium.
        </p>
        <Button variant="secondary" className="rounded-xl shrink-0" disabled>
          <Lock className="h-4 w-4" />
          Débloquer toutes les équivalences
        </Button>
      </div>

      <p className="text-sm">
        <Link href="/tests" className="text-[#52ff72] hover:underline">
          ← Protocoles de tests
        </Link>
      </p>

      <MedicalDisclaimer />
    </div>
  );
}
