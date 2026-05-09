import type { TrainingDebtResult } from "@/lib/scoring/training-debt";
import { cn } from "@/lib/utils";

const labels: Record<TrainingDebtResult["primaryDebt"], string> = {
  cardio: "Dette cardio",
  force: "Dette force",
  endurance: "Dette endurance",
  muscular_endurance: "Dette résistance musculaire",
  recovery: "Dette récupération",
  mobility: "Dette mobilité / core",
  coherence: "Dette cohérence",
  legs: "Dette jambes",
};

export function TrainingDebtCard({ debt }: { debt: TrainingDebtResult }) {
  const badge =
    debt.severity === "high"
      ? "border-amber/40 bg-amber/15 text-amber"
      : debt.severity === "moderate"
        ? "border-border bg-surface-elevated text-muted"
        : "border-neon/25 bg-neon/10 text-neon";

  return (
    <section
      className="rounded-2xl border border-border bg-surface/70 p-5 sm:p-6"
      aria-labelledby="debt-heading"
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 id="debt-heading" className="text-display text-lg font-semibold text-foreground">
          Training Debt
        </h2>
        <span className={cn("rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-wide", badge)}>
          {debt.severity === "high" ? "Élevée" : debt.severity === "moderate" ? "Modérée" : "Faible"}
        </span>
      </div>
      <p className="mt-1 text-xs font-medium uppercase tracking-wide text-muted">{labels[debt.primaryDebt]}</p>
      <p className="mt-3 text-sm leading-relaxed text-muted">{debt.explanation}</p>
      <p className="mt-3 text-sm font-medium text-foreground">{debt.recommendedCorrection}</p>
      <ul className="mt-3 list-disc space-y-1 pl-5 text-xs text-muted">
        {debt.avoidThisWeek.map((x) => (
          <li key={x}>{x}</li>
        ))}
      </ul>
    </section>
  );
}
