"use client";

import {
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
} from "recharts";
import type { ScoreBreakdown } from "@/lib/types";

const LABELS: Record<keyof ScoreBreakdown, string> = {
  force: "Force",
  cardioIntense: "Cardio intense",
  endurance: "Endurance",
  muscularEndurance: "Rés. musculaire",
  coreCarry: "Core & carry",
};

export function ResultsRadarChart({ breakdown }: { breakdown: ScoreBreakdown }) {
  const data = (
    [
      ["force", breakdown.force],
      ["cardioIntense", breakdown.cardioIntense],
      ["endurance", breakdown.endurance],
      ["muscularEndurance", breakdown.muscularEndurance],
      ["coreCarry", breakdown.coreCarry],
    ] as const
  ).map(([k, v]) => ({
    subject: LABELS[k],
    score: v ?? 0,
    fullMark: 100,
  }));

  return (
    <div className="h-[min(72vw,280px)] min-h-60 w-full max-w-full overflow-hidden rounded-2xl border border-border/80 bg-gradient-to-b from-surface/80 to-background/70 p-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] sm:h-80 sm:min-h-0 sm:p-4">
      <ResponsiveContainer width="100%" height="100%" minHeight={220}>
        <RadarChart cx="50%" cy="50%" outerRadius="68%" data={data}>
          <PolarGrid stroke="rgba(255,255,255,0.08)" />
          <PolarRadiusAxis
            angle={30}
            domain={[0, 100]}
            tick={{ fill: "var(--color-muted)", fontSize: 10 }}
            tickCount={5}
          />
          <PolarAngleAxis
            dataKey="subject"
            tick={{ fill: "var(--color-muted)", fontSize: 11 }}
          />
          <Radar
            name="Score"
            dataKey="score"
            stroke="var(--color-neon)"
            fill="var(--color-neon)"
            fillOpacity={0.35}
            strokeWidth={2}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
