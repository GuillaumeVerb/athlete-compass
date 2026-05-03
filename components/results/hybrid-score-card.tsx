import { Progress } from "@/components/ui/progress";

export function HybridScoreCard({
  score,
  label,
}: {
  score: number;
  label: string;
}) {
  return (
    <div className="rounded-2xl border border-border bg-surface/90 p-6 lg:p-8">
      <p className="text-sm text-muted">Hybrid Score</p>
      <p className="mt-1 text-xs leading-relaxed text-muted/90">
        Moyenne des piliers renseignés : force, cardio intense, endurance,
        résistance musculaire, core.
      </p>
      <div className="mt-2 flex items-end gap-2">
        <span className="text-display text-5xl font-semibold text-neon sm:text-6xl">
          {score}
        </span>
        <span className="mb-2 text-xl text-muted">/100</span>
      </div>
      <p className="mt-2 text-sm font-medium text-foreground">Niveau : {label}</p>
      <div className="mt-6">
        <Progress value={score} />
      </div>
    </div>
  );
}
