import type { FutureAthleticAgeResult } from "@/lib/scoring/future-athletic-age";
import { Lock } from "lucide-react";

type Props = {
  data: FutureAthleticAgeResult;
  /** Si true, contenu flouté / teaser premium. */
  locked?: boolean;
};

export function FutureAthleticAgeCard({ data, locked = true }: Props) {
  return (
    <section
      className="relative overflow-hidden rounded-2xl border border-amber/35 bg-gradient-to-br from-amber/10 via-amber/5 to-background p-5 sm:p-6"
      aria-labelledby="faa-heading"
    >
      {locked ? (
        <div className="pointer-events-none absolute inset-0 z-10 flex flex-col items-center justify-center gap-2 rounded-2xl bg-background/55 backdrop-blur-sm">
          <span className="flex h-12 w-12 items-center justify-center rounded-full border border-amber/40 bg-amber/15 text-amber shadow-[0_0_24px_-8px_rgba(245,184,46,0.45)]">
            <Lock className="h-5 w-5" aria-hidden />
          </span>
          <p className="text-xs font-semibold text-foreground">Projection premium</p>
          <p className="max-w-xs px-4 text-center text-[11px] leading-relaxed text-muted">
            Aperçu partiel : débloque le rapport complet pour voir la projection sur
            4–8 semaines.
          </p>
        </div>
      ) : null}
      <h2 id="faa-heading" className="text-display text-lg font-semibold text-foreground">
        Âge athlétique futur
      </h2>
      <p className="mt-2 text-xs text-muted">
        Projection indicative basée sur tes performances déclarées. Ce n’est pas une mesure biologique.
      </p>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <div>
          <p className="text-[11px] uppercase tracking-wide text-muted">Actuel</p>
          <p className="text-display text-2xl font-semibold text-foreground">{data.currentAthleticAge} ans</p>
        </div>
        <div>
          <p className="text-[11px] uppercase tracking-wide text-muted">Projection</p>
          <p className="text-display text-2xl font-semibold text-neon">{data.projectedAthleticAge} ans</p>
        </div>
      </div>
      <p className="mt-3 text-sm text-muted">{data.explanation}</p>
      <ul className="mt-3 list-disc space-y-1 pl-5 text-xs text-muted">
        {data.requiredMilestones.map((m) => (
          <li key={m}>{m}</li>
        ))}
      </ul>
      <p className="mt-3 text-[11px] text-muted">Confiance : {data.confidence}</p>
    </section>
  );
}
