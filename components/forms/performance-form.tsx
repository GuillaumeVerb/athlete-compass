"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import type { PerformanceInput } from "@/lib/types";
import { DEMO_PERFORMANCE } from "@/lib/mock-data";
import { loadPerformance, savePerformance } from "@/lib/storage";
import { buildPerformanceInputFromForm } from "@/lib/performance/build-performance-input-from-form";
import { PERFORMANCE_FORM_FIELDS } from "@/lib/performance/performance-form-fields";
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

const ICON_BY_KEY: Record<
  keyof PerformanceInput,
  typeof Activity
> = {
  row1k: Activity,
  row2k: Waves,
  run5k: Footprints,
  pullups: Grip,
  frontSquat5: Weight,
  ohp5: Dumbbell,
  deadlift5: Weight,
  burpees50: HeartPulse,
  farmerCarry: Grip,
  hollowHold: Timer,
};

const fields = PERFORMANCE_FORM_FIELDS.map((f) => ({
  ...f,
  icon: ICON_BY_KEY[f.key],
}));

export function PerformanceForm({
  initial,
}: {
  initial: PerformanceInput | null;
}) {
  const router = useRouter();
  const [formError, setFormError] = useState<string | null>(null);
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
    queueMicrotask(() => {
      const p = loadPerformance();
      if (!p) return;
      const next: Record<string, string> = {};
      for (const f of fields) {
        const v = p[f.key];
        next[f.key] =
          v == null ? "" : typeof v === "number" ? String(v) : (v as string);
      }
      setValues((prev) => ({ ...prev, ...next }));
    });
  }, []);

  function setField(key: string, val: string) {
    setFormError(null);
    setValues((s) => ({ ...s, [key]: val }));
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormError(null);
    const built = buildPerformanceInputFromForm(values);
    if (!built.ok) {
      setFormError(built.error);
      return;
    }
    savePerformance(built.data);
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
      {formError ? (
        <p className="rounded-xl border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {formError}
        </p>
      ) : null}
      <div className="flex flex-wrap gap-4 justify-end">
        <Button type="submit" size="lg" className="rounded-2xl px-10">
          Voir mes résultats
        </Button>
      </div>
    </form>
  );
}
