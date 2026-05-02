import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { NextBestMovePlan } from "@/lib/types";

export function NextBestMoveCard({ plan }: { plan: NextBestMovePlan }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Prochaine meilleure action</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">
        <p className="text-display text-base font-semibold text-amber">
          {plan.title}
        </p>
        <div>
          <p className="text-[10px] font-medium uppercase tracking-wider text-muted">
            Pourquoi
          </p>
          <p className="mt-1 leading-relaxed text-muted">{plan.reason}</p>
        </div>
        <div>
          <p className="text-[10px] font-medium uppercase tracking-wider text-muted">
            Action
          </p>
          <p className="mt-1 leading-relaxed text-foreground">{plan.action}</p>
        </div>
        <div className="grid gap-3 border-t border-border pt-2 sm:grid-cols-2">
          <div>
            <p className="text-[10px] font-medium uppercase text-muted">Fréquence</p>
            <p className="mt-1 text-muted">{plan.frequency}</p>
          </div>
          <div>
            <p className="text-[10px] font-medium uppercase text-muted">Impact attendu</p>
            <p className="mt-1 text-muted">{plan.impact}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
