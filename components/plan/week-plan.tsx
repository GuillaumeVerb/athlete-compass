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
            className="rounded-lg data-[state=active]:text-[#52ff72]"
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
                  className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[#252a36] bg-[#12151c]/80 px-4 py-3"
                >
                  <span className="text-sm font-medium text-white">
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
                  <p className="text-sm text-[#c5cad8]">{w.objective}</p>
                  <ul className="text-sm text-[#9aa3b8] space-y-2">
                    {w.objectiveChecks.map((c) => (
                      <li key={c} className="flex gap-2">
                        <input type="checkbox" className="mt-1 accent-[#52ff72]" />
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
                  <p className="text-sm text-[#c5cad8]">{w.focus}</p>
                  <p className="text-display text-2xl font-semibold text-[#f5b942] mt-3">
                    {w.coherencePct}%
                  </p>
                  <p className="text-xs text-[#6b7289] mt-1">
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
