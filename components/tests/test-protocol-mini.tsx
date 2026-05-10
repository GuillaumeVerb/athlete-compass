import Link from "next/link";
import { ChevronRight } from "lucide-react";
import type { PerformanceTestKey } from "@/lib/tests/test-protocols";
import { TEST_PROTOCOLS } from "@/lib/tests/test-protocols";

export function TestProtocolMini({ testId }: { testId: PerformanceTestKey }) {
  const p = TEST_PROTOCOLS[testId];
  return (
    <details className="group mt-3 border-t border-border pt-3">
      <summary className="flex cursor-pointer list-none items-center gap-1 text-xs font-medium text-neon hover:underline [&::-webkit-details-marker]:hidden">
        <ChevronRight className="h-3.5 w-3.5 shrink-0 transition-transform group-open:rotate-90" />
        Comment faire ce test ?
      </summary>
      <div className="mt-3 space-y-3 text-xs leading-relaxed text-muted">
        <p>
          <span className="font-medium text-foreground/90">Mesure :</span>{" "}
          {p.measures}
        </p>
        <ol className="list-decimal space-y-1.5 pl-4 marker:text-muted/80">
          {p.protocol.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ol>
        <p>
          <span className="font-medium text-foreground/90">Saisie :</span>{" "}
          {p.inputHint}
        </p>
        <p>
          <span className="font-medium text-amber/90">À éviter :</span>{" "}
          {p.commonMistakes.join(" · ")}
        </p>
        <p className="italic text-muted/80">{p.scoreImpact}</p>
        <Link
          href={`/tests#${testId}`}
          className="inline-block font-medium text-neon underline-offset-2 hover:underline"
        >
          Fiche complète →
        </Link>
      </div>
    </details>
  );
}
