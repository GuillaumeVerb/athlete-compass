import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { PlanWeek } from "@/lib/plans/generate-plan";
import { sessionKindLabelFr } from "@/lib/plans/generate-plan";

export function WeekPlan({ weeks }: { weeks: PlanWeek[] }) {
  return (
    <Tabs defaultValue="1" className="w-full">
      <TabsList className="flex h-auto w-full flex-wrap justify-start gap-1 p-1">
        {weeks.map((w) => (
          <TabsTrigger
            key={w.week}
            value={String(w.week)}
            className="rounded-lg data-[state=active]:text-neon"
          >
            S{w.week}
          </TabsTrigger>
        ))}
      </TabsList>
      {weeks.map((w) => (
        <TabsContent key={w.week} value={String(w.week)}>
          <p className="text-display mt-3 text-sm font-medium text-foreground sm:text-base">
            Semaine {w.week} — {w.weekTheme}
          </p>
          <div className="mt-4 grid gap-6 lg:grid-cols-3">
            <div className="space-y-3 lg:col-span-2">
              {w.sessions.map((s) => (
                <div
                  key={`${w.week}-${s.title}-${s.kind}`}
                  className="space-y-3 rounded-xl border border-border bg-surface/80 p-4"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-foreground">{s.title}</p>
                      <p className="mt-1 text-xs text-muted">
                        {s.durationMin} min · {sessionKindLabelFr(s.kind)}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {s.tags.map((t) => (
                        <Badge key={t} variant="secondary">
                          {t}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <p className="text-xs leading-relaxed text-muted">{s.sessionObjective}</p>
                  <ul className="list-disc space-y-1 pl-4 text-xs text-muted">
                    {s.mainMoves.map((m) => (
                      <li key={m}>{m}</li>
                    ))}
                  </ul>
                  <p className="text-xs italic leading-relaxed text-muted/90">
                    {s.shortVersion}
                  </p>
                  {s.substitution ? (
                    <p className="border-t border-border pt-3 text-xs leading-relaxed text-amber/90">
                      ↪ {s.substitution}
                    </p>
                  ) : null}
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
                        <input
                          type="checkbox"
                          className="mt-1 accent-neon"
                          aria-label={c}
                        />
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
                  <Link
                    href="/equivalences"
                    className="mt-4 inline-block text-xs text-neon hover:underline"
                  >
                    Voir équivalences machines →
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
      ))}
    </Tabs>
  );
}
