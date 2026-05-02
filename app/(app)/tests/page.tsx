import Link from "next/link";
import { TEST_PROTOCOL_LIST } from "@/lib/tests/test-protocols";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MedicalDisclaimer } from "@/components/disclaimer";
import { Badge } from "@/components/ui/badge";

export default function TestsProtocolsPage() {
  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-display text-3xl font-semibold tracking-tight text-foreground">
          Protocoles de tests
        </h1>
        <p className="mt-2 max-w-2xl text-muted">
          Référence standardisée pour chaque test V1 : comment le passer, quoi
          saisir, et comment il influence ton score.
        </p>
      </div>

      <div className="flex flex-wrap gap-3 text-sm">
        <Link href="/performances" className="text-neon hover:underline">
          ← Retour aux performances
        </Link>
      </div>

      <div className="space-y-8">
        {TEST_PROTOCOL_LIST.map((p) => (
          <div key={p.id} id={p.id} className="scroll-mt-24">
            <Card className="border-border bg-surface/80">
            <CardHeader className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <CardTitle className="text-xl">{p.title}</CardTitle>
                <Badge variant="secondary">{p.category}</Badge>
                <Badge variant="outline">{p.estimatedMinutes}</Badge>
              </div>
              <p className="text-sm text-muted">
                Matériel : <span className="text-foreground/90">{p.equipment}</span>
              </p>
            </CardHeader>
            <CardContent className="space-y-5 text-sm text-muted">
              <div>
                <p className="mb-2 font-medium text-foreground">Protocole</p>
                <ol className="list-decimal space-y-2 pl-4 marker:text-neon">
                  {p.protocol.map((step) => (
                    <li key={step}>{step}</li>
                  ))}
                </ol>
              </div>
              <div className="rounded-xl border border-border bg-background/50 p-4">
                <p className="mb-1 text-xs font-medium uppercase tracking-wider text-muted">
                  Résultat à entrer
                </p>
                <p className="text-foreground/90">{p.inputHint}</p>
              </div>
              <div>
                <p className="mb-2 font-medium text-amber">Erreurs fréquentes</p>
                <ul className="list-disc space-y-1 pl-4 text-muted">
                  {p.commonMistakes.map((m) => (
                    <li key={m}>{m}</li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="mb-1 font-medium text-foreground">Impact sur le score</p>
                <p className="text-muted">{p.scoreImpact}</p>
              </div>
            </CardContent>
          </Card>
          </div>
        ))}
      </div>

      <MedicalDisclaimer />
    </div>
  );
}
