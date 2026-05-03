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
    queueMicrotask(() => {
      const p = loadProfile();
      setLightLegs(!!p?.constraints?.includes("light_legs"));
    });
  }, []);

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-display text-3xl font-semibold text-foreground">
          Équivalences machines
        </h1>
        <p className="mt-2 max-w-2xl text-muted">
          Remplace un erg ou un bloc tout en gardant l’intention de la séance :
          intensité, durée, pattern de fatigue.
        </p>
      </div>

      <EquivalenceLightLegsBanner />

      <p className="max-w-3xl border-l-2 border-neon/40 pl-4 text-xs leading-relaxed text-muted">
        {EQUIVALENCES_PRACTICAL_NOTE}
      </p>

      <p className="max-w-3xl text-sm leading-relaxed text-muted">
        {LIGHT_LEGS_INTRO}
      </p>

      <section className="space-y-4">
        <h2 className="text-display text-xl font-semibold text-foreground">
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
        <h2 className="text-display text-xl font-semibold text-foreground">
          Table d’équivalences
        </h2>
        <EquivalenceTable rows={EQUIVALENCE_TABLE_ROWS} />
      </section>

      <section className="space-y-4">
        <h2 className="text-display text-xl font-semibold text-foreground">
          Ce que le remplacement change
        </h2>
        <div className="grid gap-4 md:grid-cols-2">
          {SWAP_INSIGHTS.map((s) => (
            <Card key={s.title} className="border-border bg-surface/80">
              <CardHeader className="pb-2">
                <CardTitle className="text-base text-neon">{s.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-relaxed text-muted">{s.body}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-display text-xl font-semibold text-foreground">
          Salle classique — substitutions
        </h2>
        <div className="divide-y divide-border overflow-hidden rounded-2xl border border-border">
          {COMMERCIAL_GYM_ALTERNATIVES.map((row) => (
            <div
              key={row.movement}
              className="grid gap-2 bg-background/40 px-4 py-3 text-sm sm:grid-cols-[160px_1fr]"
            >
              <span className="font-medium text-foreground">{row.movement}</span>
              <span className="text-muted">{row.alternatives}</span>
            </div>
          ))}
        </div>
      </section>

      <div className="flex flex-col gap-4 rounded-2xl border border-border bg-surface-elevated/60 p-5 sm:flex-row sm:items-center">
        <p className="flex-1 text-sm text-muted">
          Version complète : tables longues, charges relatives et intégration
          automatique dans ton plan — prévu côté premium.
        </p>
        <Button variant="secondary" className="shrink-0 rounded-xl" disabled>
          <Lock className="h-4 w-4" />
          Débloquer toutes les équivalences
        </Button>
      </div>

      <p className="text-sm">
        <Link href="/tests" className="text-neon hover:underline">
          ← Protocoles de tests
        </Link>
      </p>

      <MedicalDisclaimer />
    </div>
  );
}
