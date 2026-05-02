"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import type { PerformanceInput } from "@/lib/types";
import { DEMO_PERFORMANCE } from "@/lib/mock-data";
import { loadPerformance, savePerformance } from "@/lib/storage";
import { TestProtocolMini } from "@/components/tests/test-protocol-mini";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Activity,
  Dumbbell,
  Footprints,
  Grip,
  HeartPulse,
  Timer,
  Waves,
  Weight,
} from "lucide-react";

const fields: {
  key: keyof PerformanceInput;
  title: string;
  unit: string;
  placeholder?: string;
  icon: typeof Activity;
  type: "time" | "number" | "text";
}[] = [
  {
    key: "row1k",
    title: "1 km rameur",
    unit: "mm:ss",
    placeholder: "03:32",
    icon: Activity,
    type: "time",
  },
  {
    key: "row2k",
    title: "2 km rameur",
    unit: "mm:ss",
    placeholder: "07:15",
    icon: Waves,
    type: "time",
  },
  {
    key: "run5k",
    title: "5 km course",
    unit: "mm:ss",
    placeholder: "24:20",
    icon: Footprints,
    type: "time",
  },
  {
    key: "pullups",
    title: "Tractions strictes",
    unit: "reps",
    icon: Grip,
    type: "number",
  },
  {
    key: "frontSquat5",
    title: "Front squat ×5",
    unit: "kg",
    icon: Weight,
    type: "number",
  },
  {
    key: "ohp5",
    title: "Développé militaire ×5",
    unit: "kg",
    icon: Dumbbell,
    type: "number",
  },
  {
    key: "deadlift5",
    title: "Deadlift ×5",
    unit: "kg",
    icon: Weight,
    type: "number",
  },
  {
    key: "burpees50",
    title: "50 burpees",
    unit: "mm:ss",
    placeholder: "08:45",
    icon: HeartPulse,
    type: "time",
  },
  {
    key: "farmerCarry",
    title: "Farmer carry",
    unit: "m / s",
    placeholder: "40/35",
    icon: Grip,
    type: "text",
  },
  {
    key: "hollowHold",
    title: "Hollow hold",
    unit: "mm:ss",
    placeholder: "01:20",
    icon: Timer,
    type: "time",
  },
];

export function PerformanceForm({
  initial,
}: {
  initial: PerformanceInput | null;
}) {
  const router = useRouter();
  const base = useMemo(() => initial ?? DEMO_PERFORMANCE, [initial]);
  const [values, setValues] = useState<Record<string, string>>(() => {
    const o: Record<string, string> = {};
    for (const f of fields) {
      const v = base[f.key];
      if (v == null) o[f.key] = "";
      else o[f.key] = typeof v === "number" ? String(v) : v;
    }
    return o;
  });

  useEffect(() => {
    const p = loadPerformance();
    if (!p) return;
    const next: Record<string, string> = {};
    for (const f of fields) {
      const v = p[f.key];
      next[f.key] =
        v == null ? "" : typeof v === "number" ? String(v) : (v as string);
    }
    setValues((prev) => ({ ...prev, ...next }));
  }, []);

  function setField(key: string, val: string) {
    setValues((s) => ({ ...s, [key]: val }));
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const out: PerformanceInput = {};
    for (const f of fields) {
      const raw = values[f.key]?.trim();
      if (!raw) continue;
      if (f.type === "number") {
        const n = Number(raw.replace(",", "."));
        if (Number.isFinite(n)) (out as Record<string, number>)[f.key] = n;
      } else {
        (out as Record<string, string>)[f.key] = raw;
      }
    }
    savePerformance(out);
    router.push("/results");
  }

  return (
    <form onSubmit={onSubmit} className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <p className="max-w-xl text-sm text-muted">
          Besoin du détail d&apos;un test ? Consulte les{" "}
          <Link href="/tests" className="text-neon hover:underline">
            protocoles standardisés
          </Link>
          .
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {fields.map(({ key, title, unit, placeholder, icon: Icon, type }) => (
          <Card key={key} className="border-border bg-surface/80 p-5">
            <div className="flex items-start gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-neon/25 bg-neon/10 text-neon">
                <Icon className="h-5 w-5" />
              </span>
              <div className="min-w-0 flex-1 space-y-2">
                <div>
                  <div className="text-sm font-semibold text-foreground">{title}</div>
                  <div className="text-[11px] font-medium uppercase tracking-wider text-muted">
                    {unit}
                  </div>
                </div>
                <Label className="sr-only" htmlFor={key}>
                  {title}
                </Label>
                <Input
                  id={key}
                  placeholder={placeholder}
                  value={values[key] ?? ""}
                  onChange={(e) => setField(key, e.target.value)}
                  inputMode={type === "number" ? "decimal" : "text"}
                />
                <TestProtocolMini testId={key} />
              </div>
            </div>
          </Card>
        ))}
      </div>
      <p className="text-sm text-muted">
        Tu peux laisser des champs vides : nous calculons un score provisoire et
        un pourcentage de fiabilité.
      </p>
      <div className="flex flex-wrap gap-4 justify-end">
        <Button type="submit" size="lg" className="rounded-2xl px-10">
          Voir mes résultats
        </Button>
      </div>
    </form>
  );
}
