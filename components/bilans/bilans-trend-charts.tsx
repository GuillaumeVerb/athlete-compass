"use client";

import { useMemo, type ReactNode } from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { AssessmentListItemClient } from "@/lib/assessments/assessments-api-client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function BilansTrendCharts({ items }: { items: AssessmentListItemClient[] }) {
  const chartData = useMemo(() => {
    return [...items]
      .sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
      )
      .map((r) => ({
        t: new Date(r.createdAt).getTime(),
        hybrid: r.hybridScore,
        athletic: r.athleticAge,
        reliability: r.reliabilityPct,
      }));
  }, [items]);

  if (chartData.length < 2) {
    return (
      <Card className="border-border bg-surface/40">
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Évolution</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted">
            Enregistre au moins <span className="text-foreground">deux bilans</span> pour afficher
            les courbes Hybrid Score, âge athlétique et fiabilité dans le temps.
          </p>
        </CardContent>
      </Card>
    );
  }

  const athVals = chartData.map((d) => d.athletic);
  const athMin = Math.floor(Math.min(...athVals) - 1);
  const athMax = Math.ceil(Math.max(...athVals) + 1);
  const relMin = Math.max(0, Math.floor(Math.min(...chartData.map((d) => d.reliability)) - 5));
  const relMax = Math.min(100, Math.ceil(Math.max(...chartData.map((d) => d.reliability)) + 5));

  const tickDate = (ts: number) =>
    new Date(ts).toLocaleDateString("fr-FR", { month: "short", day: "numeric" });

  const tooltipLabel = (ts: number) =>
    new Date(ts).toLocaleString("fr-FR", {
      dateStyle: "medium",
      timeStyle: "short",
    });

  return (
    <Card className="border-border bg-surface/40">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Évolution (cloud)</CardTitle>
        <p className="text-xs text-muted">
          Ordre chronologique — du plus ancien au plus récent parmi les bilans chargés.
        </p>
      </CardHeader>
      <CardContent className="grid gap-6 lg:grid-cols-3">
        <ChartBlock title="Hybrid Score /100">
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={chartData} margin={{ top: 8, right: 12, left: -18, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
              <XAxis
                type="number"
                dataKey="t"
                domain={["dataMin", "dataMax"]}
                tickFormatter={(v) => tickDate(v as number)}
                stroke="rgba(255,255,255,0.35)"
                fontSize={10}
                tickMargin={6}
              />
              <YAxis
                domain={[0, 100]}
                stroke="rgba(255,255,255,0.35)"
                fontSize={10}
                width={36}
              />
              <Tooltip
                labelFormatter={(v) => tooltipLabel(v as number)}
                formatter={(value) => [`${value ?? ""}`, "Hybrid"]}
                contentStyle={{
                  background: "rgba(18,18,22,0.96)",
                  border: "1px solid rgba(255,255,255,0.12)",
                  borderRadius: "12px",
                  fontSize: "12px",
                }}
              />
              <Line
                type="monotone"
                dataKey="hybrid"
                stroke="rgba(82,255,114,0.9)"
                strokeWidth={2}
                dot={{ r: 3, fill: "rgba(82,255,114,0.95)" }}
                name="Hybrid"
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartBlock>
        <ChartBlock title="Âge athlétique (ans)">
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={chartData} margin={{ top: 8, right: 12, left: -18, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
              <XAxis
                type="number"
                dataKey="t"
                domain={["dataMin", "dataMax"]}
                tickFormatter={(v) => tickDate(v as number)}
                stroke="rgba(255,255,255,0.35)"
                fontSize={10}
                tickMargin={6}
              />
              <YAxis
                domain={[athMin, athMax]}
                stroke="rgba(255,255,255,0.35)"
                fontSize={10}
                width={36}
              />
              <Tooltip
                labelFormatter={(v) => tooltipLabel(v as number)}
                formatter={(value) => [`${value ?? ""}`, "Âge athl."]}
                contentStyle={{
                  background: "rgba(18,18,22,0.96)",
                  border: "1px solid rgba(255,255,255,0.12)",
                  borderRadius: "12px",
                  fontSize: "12px",
                }}
              />
              <Line
                type="monotone"
                dataKey="athletic"
                stroke="rgba(251, 191, 36, 0.95)"
                strokeWidth={2}
                dot={{ r: 3, fill: "rgba(251, 191, 36, 0.95)" }}
                name="Âge athl."
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartBlock>
        <ChartBlock title="Fiabilité %">
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={chartData} margin={{ top: 8, right: 12, left: -18, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
              <XAxis
                type="number"
                dataKey="t"
                domain={["dataMin", "dataMax"]}
                tickFormatter={(v) => tickDate(v as number)}
                stroke="rgba(255,255,255,0.35)"
                fontSize={10}
                tickMargin={6}
              />
              <YAxis
                domain={[relMin, relMax]}
                stroke="rgba(255,255,255,0.35)"
                fontSize={10}
                width={36}
              />
              <Tooltip
                labelFormatter={(v) => tooltipLabel(v as number)}
                formatter={(value) => [`${value ?? ""}%`, "Fiabilité"]}
                contentStyle={{
                  background: "rgba(18,18,22,0.96)",
                  border: "1px solid rgba(255,255,255,0.12)",
                  borderRadius: "12px",
                  fontSize: "12px",
                }}
              />
              <Line
                type="monotone"
                dataKey="reliability"
                stroke="rgba(147, 197, 253, 0.95)"
                strokeWidth={2}
                dot={{ r: 3, fill: "rgba(147, 197, 253, 0.95)" }}
                name="Fiabilité"
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartBlock>
      </CardContent>
    </Card>
  );
}

function ChartBlock({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="space-y-2">
      <p className="text-[11px] font-medium uppercase tracking-wider text-muted">{title}</p>
      {children}
    </div>
  );
}
