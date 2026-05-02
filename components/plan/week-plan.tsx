import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { PlanWeek } from "@/lib/plans/generate-plan";

export function WeekPlan({ weeks }: { weeks: PlanWeek[] }) {
  return (
    <Tabs defaultValue="1" className="w-full">
      <TabsList className="w-full flex flex-wrap h-auto gap-1 p-1 justify-start">
        {weeks.map((w) => (
          <TabsTrigger
            key={w.week}
            value={String(w.week)}
            className="rounded-lg data-[state=active]:text-neon"
          >
            Semaine {w.week}
          </TabsTrigger>
        ))}
      </TabsList>
      {weeks.map((w) => (
        <TabsContent key={w.week} value={String(w.week)}>
          <div className="grid gap-6 lg:grid-cols-3 mt-2">
            <div className="lg:col-span-2 space-y-3">
              {w.sessions.map((s) => (
                <div
                  key={s.title}
                  className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-surface/80 px-4 py-3"
                >
                  <span className="text-sm font-medium text-foreground">
                    {s.title}
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {s.tags.map((t) => (
                      <Badge key={t} variant="secondary">
                        {t}
                      </Badge>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Objectif de la semaine</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-muted">{w.objective}</p>
                  <ul className="space-y-2 text-sm text-muted">
                    {w.objectiveChecks.map((c) => (
                      <li key={c} className="flex gap-2">
                        <input type="checkbox" className="mt-1 accent-neon" />
                        <span>{c}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Focus & cohérence</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted">{w.focus}</p>
                  <p className="text-display mt-3 text-2xl font-semibold text-amber">
                    {w.coherencePct}%
                  </p>
                  <p className="mt-1 text-xs text-muted">
                    Score de cohérence prévu (démo)
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
      ))}
    </Tabs>
  );
}
