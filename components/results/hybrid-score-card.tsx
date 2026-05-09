import { Progress } from "@/components/ui/progress";

export function HybridScoreCard({
  score,
  label,
}: {
  score: number;
  label: string;
}) {
  return (
    <div className="rounded-2xl border border-border/90 bg-gradient-to-b from-surface/95 to-surface/80 p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] lg:p-8">
      <p className="text-sm text-muted">Hybrid Score</p>
      <p className="mt-1 text-xs leading-relaxed text-muted/90">
        Ton score global combine force, cardio, endurance, résistance musculaire
        et core.
      </p>
      <div className="mt-2 flex items-end gap-2">
        <span className="text-display text-5xl font-semibold tracking-tight text-neon drop-shadow-[0_0_28px_rgba(82,255,114,0.28)] sm:text-6xl">
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
