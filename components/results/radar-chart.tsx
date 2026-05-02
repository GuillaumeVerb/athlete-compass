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
    <div className="h-[320px] w-full rounded-2xl border border-border bg-background/60 p-4">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="75%" data={data}>
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
