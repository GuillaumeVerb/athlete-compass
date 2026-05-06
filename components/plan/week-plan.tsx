"use client";

import { useEffect, useState, startTransition } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { PlanSession, PlanWeek } from "@/lib/plans/generate-plan";
import { sessionKindLabelFr } from "@/lib/plans/generate-plan";
import {
  loadPlanProgressEntry,
  savePlanProgressObjective,
  savePlanProgressSession,
} from "@/lib/plans/plan-progress-storage";
import { performancesHrefFocused } from "@/lib/performance/performance-focus";
import { defaultPerformanceKeysForSessionKind } from "@/lib/plans/session-performance-links";
import { TEST_PROTOCOLS } from "@/lib/tests/test-protocols";
import {
  PlanWeekFeedbackCard,
  type PlanFeedbackContext,
} from "@/components/plan/plan-week-feedback-card";

function blocksForDisplay(s: PlanSession) {
  return Array.isArray(s.blocks) ? s.blocks : [];
}

type ProgressEntry = {
  objectiveChecks: boolean[];
  sessionDone: boolean[];
};

function emptyEntry(objectiveCount: number, sessionCount: number): ProgressEntry {
  return {
    objectiveChecks: Array.from({ length: objectiveCount }, () => false),
    sessionDone: Array.from({ length: sessionCount }, () => false),
  };
}

function initialByWeek(
  planFingerprint: string | null,
  weeks: PlanWeek[],
): Record<number, ProgressEntry> {
  if (!planFingerprint) {
    const next: Record<number, ProgressEntry> = {};
    for (const w of weeks) {
      next[w.week] = emptyEntry(
        w.objectiveChecks.length,
        w.sessions.length,
      );
    }
    return next;
  }
  const next: Record<number, ProgressEntry> = {};
  for (const w of weeks) {
    next[w.week] = loadPlanProgressEntry(
      planFingerprint,
      w.week,
      w.objectiveChecks.length,
      w.sessions.length,
    );
  }
  return next;
}

export function WeekPlan({
  weeks,
  planFingerprint,
  planFeedback,
}: {
  weeks: PlanWeek[];
  planFingerprint: string | null;
  planFeedback: PlanFeedbackContext | null;
}) {
  const [byWeek, setByWeek] = useState<Record<number, ProgressEntry>>(() =>
    initialByWeek(planFingerprint, weeks),
  );

  useEffect(() => {
    startTransition(() => {
      setByWeek(initialByWeek(planFingerprint, weeks));
    });
  }, [planFingerprint, weeks]);

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
          <p className="mt-1 text-xs text-muted">
            {w.sessions.length} séance{w.sessions.length > 1 ? "s" : ""} cette semaine
            (selon ta fréquence déclarée).
          </p>
          <div className="mt-4 grid gap-6 lg:grid-cols-3">
            <div className="space-y-4 lg:col-span-2">
              {w.sessions.map((s, sessionIdx) => {
                const blocks = blocksForDisplay(s);
                const perfKeys =
                  Array.isArray(s.relatedPerformanceKeys) &&
                  s.relatedPerformanceKeys.length > 0
                    ? s.relatedPerformanceKeys
                    : defaultPerformanceKeysForSessionKind(s.kind);
                const entry = byWeek[w.week] ?? emptyEntry(
                  w.objectiveChecks.length,
                  w.sessions.length,
                );
                const sessionChecked =
                  entry.sessionDone[sessionIdx] ?? false;
                return (
                  <div
                    key={`${w.week}-${s.title}-${s.kind}-${sessionIdx}`}
                    className="space-y-4 rounded-xl border border-border bg-surface/80 p-4"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-[11px] font-medium uppercase tracking-wider text-muted">
                          Séance {sessionIdx + 1} / {w.sessions.length}
                        </p>
                        <p className="text-sm font-semibold text-foreground">{s.title}</p>
                        <p className="mt-1 text-xs text-muted">
                          {s.durationMin} min · {sessionKindLabelFr(s.kind)}
                        </p>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {(s.tags ?? []).map((t) => (
                          <Badge key={t} variant="secondary">
                            {t}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <p className="text-xs leading-relaxed text-muted">{s.sessionObjective}</p>
                    {blocks.length === 0 ? (
                      <p className="text-xs text-muted">
                        Détail de séance indisponible — actualise la page ou régénère
                        depuis le profil.
                      </p>
                    ) : (
                      <div className="space-y-4">
                        {blocks.map((block) => (
                          <div key={block.label}>
                            <p className="text-[11px] font-semibold uppercase tracking-wider text-neon/85">
                              {block.label}
                            </p>
                            <ul className="mt-2 space-y-2">
                              {(block.exercises ?? []).map((ex) => (
                                <li
                                  key={`${block.label}-${ex.name}`}
                                  className="rounded-lg border border-border/70 bg-background/45 px-3 py-2.5"
                                >
                                  <span className="text-sm font-medium text-foreground">
                                    {ex.name}
                                  </span>
                                  <span className="mt-1 block text-xs leading-relaxed text-muted">
                                    {ex.prescription}
                                  </span>
                                  {ex.cue ? (
                                    <span className="mt-1.5 block text-xs italic leading-relaxed text-muted/85">
                                      {ex.cue}
                                    </span>
                                  ) : null}
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    )}
                    {perfKeys.length > 0 ? (
                      <div className="rounded-lg border border-neon/20 bg-neon/5 px-3 py-3">
                        <p className="text-[11px] font-semibold uppercase tracking-wider text-neon/90">
                          Saisie des performances
                        </p>
                        <p className="mt-1 text-xs text-muted">
                          Ouvre directement le bon champ sur Performances :
                        </p>
                        <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1.5">
                          {perfKeys.map((key) => (
                            <Link
                              key={key}
                              href={performancesHrefFocused(key)}
                              className="text-xs text-neon hover:underline"
                            >
                              {TEST_PROTOCOLS[key]?.title ?? key}
                            </Link>
                          ))}
                        </div>
                      </div>
                    ) : null}
                    <p className="border-t border-border pt-3 text-xs italic leading-relaxed text-muted/90">
                      {s.shortVersion}
                    </p>
                    {s.substitution ? (
                      <p className="border-t border-border pt-3 text-xs leading-relaxed text-amber/90">
                        ↪ {s.substitution}
                      </p>
                    ) : null}
                    <label className="flex cursor-pointer items-start gap-2 border-t border-border pt-3 text-xs text-muted">
                      <input
                        type="checkbox"
                        className="mt-0.5 accent-neon"
                        checked={sessionChecked}
                        disabled={!planFingerprint}
                        onChange={(e) => {
                          const checked = e.target.checked;
                          if (!planFingerprint) return;
                          savePlanProgressSession(
                            planFingerprint,
                            w.week,
                            sessionIdx,
                            checked,
                            w.objectiveChecks.length,
                            w.sessions.length,
                          );
                          setByWeek((prev) => {
                            const cur =
                              prev[w.week] ??
                              loadPlanProgressEntry(
                                planFingerprint,
                                w.week,
                                w.objectiveChecks.length,
                                w.sessions.length,
                              );
                            const nextSess = [...cur.sessionDone];
                            nextSess[sessionIdx] = checked;
                            return {
                              ...prev,
                              [w.week]: {
                                ...cur,
                                sessionDone: nextSess,
                              },
                            };
                          });
                        }}
                        aria-label={`Séance ${sessionIdx + 1} suivie`}
                      />
                      <span>Séance suivie (suivi local sur cet appareil)</span>
                    </label>
                  </div>
                );
              })}
            </div>
            <div className="space-y-4 lg:sticky lg:top-4 lg:self-start">
              <Card>
                <CardHeader>
                  <CardTitle>Objectif de la semaine</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-muted">{w.objective}</p>
                  <ul className="space-y-2 text-sm text-muted">
                    {w.objectiveChecks.map((c, idx) => {
                      const objEntry = byWeek[w.week] ?? emptyEntry(
                        w.objectiveChecks.length,
                        w.sessions.length,
                      );
                      const checked = objEntry.objectiveChecks[idx] ?? false;
                      return (
                        <li key={c} className="flex gap-2">
                          <input
                            type="checkbox"
                            className="mt-1 accent-neon"
                            aria-label={c}
                            checked={checked}
                            disabled={!planFingerprint}
                            onChange={(e) => {
                              const nextChecked = e.target.checked;
                              if (!planFingerprint) return;
                              savePlanProgressObjective(
                                planFingerprint,
                                w.week,
                                idx,
                                nextChecked,
                                w.objectiveChecks.length,
                                w.sessions.length,
                              );
                              setByWeek((prev) => {
                                const cur =
                                  prev[w.week] ??
                                  loadPlanProgressEntry(
                                    planFingerprint,
                                    w.week,
                                    w.objectiveChecks.length,
                                    w.sessions.length,
                                  );
                                const nextObj = [...cur.objectiveChecks];
                                nextObj[idx] = nextChecked;
                                return {
                                  ...prev,
                                  [w.week]: {
                                    ...cur,
                                    objectiveChecks: nextObj,
                                  },
                                };
                              });
                            }}
                          />
                          <span>{c}</span>
                        </li>
                      );
                    })}
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
              <PlanWeekFeedbackCard
                weekNum={w.week}
                fingerprint={planFingerprint}
                ctx={planFeedback}
                sessionsCount={w.sessions.length}
              />
            </div>
          </div>
        </TabsContent>
      ))}
    </Tabs>
  );
}
