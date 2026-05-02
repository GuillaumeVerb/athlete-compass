import Link from "next/link";
import { TEST_PROTOCOL_LIST } from "@/lib/tests/test-protocols";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MedicalDisclaimer } from "@/components/disclaimer";
import { Badge } from "@/components/ui/badge";

export default function TestsProtocolsPage() {
  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-display text-3xl font-semibold text-white tracking-tight">
          Protocoles de tests
        </h1>
        <p className="text-[#9aa3b8] mt-2 max-w-2xl">
          Référence standardisée pour chaque test V1 : comment le passer, quoi
          saisir, et comment il influence ton score.
        </p>
      </div>

      <div className="flex flex-wrap gap-3 text-sm">
        <Link href="/performances" className="text-[#52ff72] hover:underline">
          ← Retour aux performances
        </Link>
      </div>

      <div className="space-y-8">
        {TEST_PROTOCOL_LIST.map((p) => (
          <div key={p.id} id={p.id} className="scroll-mt-24">
            <Card className="border-[#252a36] bg-[#12151c]/80">
            <CardHeader className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <CardTitle className="text-xl">{p.title}</CardTitle>
                <Badge variant="secondary">{p.category}</Badge>
                <Badge variant="outline">{p.estimatedMinutes}</Badge>
              </div>
              <p className="text-sm text-[#8b92a6]">
                Matériel : <span className="text-[#c5cad8]">{p.equipment}</span>
              </p>
            </CardHeader>
            <CardContent className="space-y-5 text-sm text-[#c5cad8]">
              <div>
                <p className="font-medium text-white mb-2">Protocole</p>
                <ol className="list-decimal space-y-2 pl-4 marker:text-[#52ff72]">
                  {p.protocol.map((step) => (
                    <li key={step}>{step}</li>
                  ))}
                </ol>
              </div>
              <div className="rounded-xl border border-[#252a36] bg-[#0a0c10]/50 p-4">
                <p className="text-xs uppercase tracking-wider text-[#6b7289] mb-1">
                  Résultat à entrer
                </p>
                <p>{p.inputHint}</p>
              </div>
              <div>
                <p className="font-medium text-[#f5b942] mb-2">Erreurs fréquentes</p>
                <ul className="list-disc space-y-1 pl-4 text-[#9aa3b8]">
                  {p.commonMistakes.map((m) => (
                    <li key={m}>{m}</li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="font-medium text-white mb-1">Impact sur le score</p>
                <p className="text-[#9aa3b8]">{p.scoreImpact}</p>
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
