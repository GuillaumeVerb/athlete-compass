import type { PrimaryGoal } from "@/lib/types";
import { goalLabelFr, topGoalWeightsForDisplay } from "@/lib/scoring/goal-hybrid-copy";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function GoalHybridExplainer({ goal }: { goal: PrimaryGoal }) {
  const top = topGoalWeightsForDisplay(goal, 3);
  return (
    <Card className="border-border bg-surface/90 shadow-[0_0_0_1px_rgba(82,255,114,0.08)]">
      <CardHeader className="pb-2">
        <div className="flex flex-wrap items-center gap-2">
          <CardTitle className="text-base text-foreground">
            Ton objectif pèse sur le Hybrid Score
          </CardTitle>
          <Badge variant="secondary" className="text-[10px]">
            {goalLabelFr(goal)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3 text-sm text-muted">
        <p className="leading-relaxed">
          Le Hybrid Score est une{" "}
          <strong className="text-foreground">moyenne pondérée</strong> des
          piliers que tu as remplis. Les poids changent selon ton objectif : on
          valorise ce qui compte le plus pour ce type de perf.
        </p>
        <ul className="space-y-2">
          {top.map((row) => (
            <li
              key={row.key}
              className="flex items-center justify-between gap-3 rounded-lg border border-border bg-background/50 px-3 py-2"
            >
              <span className="text-foreground">{row.label}</span>
              <span className="font-semibold tabular-nums text-neon">
                {row.weightPct}%
              </span>
            </li>
          ))}
        </ul>
        <p className="text-xs text-muted">
          Les piliers sans données ne comptent pas dans le dénominateur : le
          pourcentage affiché est le poids « théorique » de l’objectif.
        </p>
      </CardContent>
    </Card>
  );
}
