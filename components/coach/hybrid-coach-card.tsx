"use client";

import { useMemo, useState } from "react";
import { Sparkles } from "lucide-react";
import { COACH_QUICK_ACTIONS, coachQuickResponse, type CoachContext, type CoachQuickActionId } from "@/lib/coach/coach-responses";
import { cn } from "@/lib/utils";

type Props = {
  context: CoachContext;
};

export function HybridCoachCard({ context }: Props) {
  const [active, setActive] = useState<CoachQuickActionId | null>(null);
  const text = useMemo(
    () => (active ? coachQuickResponse(active, context) : ""),
    [active, context],
  );

  return (
    <section
      className="rounded-2xl border border-border bg-surface/70 p-5 sm:p-6"
      aria-labelledby="coach-heading"
    >
      <div className="flex items-start gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-neon/30 bg-neon/10 text-neon">
          <Sparkles className="h-5 w-5" aria-hidden />
        </span>
        <div className="min-w-0 flex-1">
          <h2 id="coach-heading" className="text-display text-lg font-semibold text-foreground">
            Coach hybride
          </h2>
          <p className="mt-1 text-xs text-muted">Réponses rapides — pas de chat libre, pas d’IA en V1.</p>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {COACH_QUICK_ACTIONS.map((a) => (
          <button
            key={a.id}
            type="button"
            onClick={() => setActive(a.id)}
            className={cn(
              "min-h-10 rounded-xl border px-3 py-2.5 text-left text-xs font-medium transition sm:text-sm",
              active === a.id
                ? "border-neon/50 bg-neon/15 text-neon"
                : "border-border bg-background/60 text-muted hover:border-neon/30 hover:text-foreground",
            )}
          >
            {a.label}
          </button>
        ))}
      </div>

      {active ? (
        <div className="mt-4 rounded-xl border border-border/80 bg-background/50 p-4 text-sm leading-relaxed text-foreground/90 whitespace-pre-line">
          {text}
        </div>
      ) : (
        <p className="mt-4 text-sm text-muted">Choisis une action pour afficher une recommandation.</p>
      )}

      <p className="mt-4 text-[10px] leading-snug text-muted/85">
        Démo V1 — « Débloquer le coach adaptatif » pourra lier au premium plus tard.
      </p>
    </section>
  );
}
