"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import type { PerformanceInput } from "@/lib/types";
import { DEMO_PERFORMANCE, DEMO_PROFILE } from "@/lib/mock-data";
import { loadPerformance, loadProfile, savePerformance } from "@/lib/storage";
import { recordScoreSnapshot } from "@/lib/scoring/score-snapshots";
import { buildPerformanceInputFromForm } from "@/lib/performance/build-performance-input-from-form";
import { perfLoadNoteFormKey } from "@/lib/performance/performance-load-notes";
import { PERF_FOCUS_QUERY } from "@/lib/performance/performance-focus";
import { PERFORMANCE_FORM_FIELDS } from "@/lib/performance/performance-form-fields";
import { groupPerformanceFormFields } from "@/lib/performance/performance-form-sections";
import type { PerformanceTestKey } from "@/lib/tests/test-protocols";
import { cn } from "@/lib/utils";
import { TestProtocolMini } from "@/components/tests/test-protocol-mini";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Activity,
  Anchor,
  ArrowBigDown,
  ArrowBigUp,
  Bike,
  BicepsFlexed,
  Box,
  Brackets,
  Cable,
  ChevronsRight,
  CircleDot,
  Droplet,
  Dumbbell,
  Fan,
  Flame,
  Footprints,
  Grip,
  Hammer,
  HeartPulse,
  Infinity,
  Link2,
  Mountain,
  MoveVertical,
  Package,
  Route,
  Split,
  Square,
  Target,
  Timer,
  UserRound,
  Waves,
  Weight,
  Wind,
  Zap,
} from "lucide-react";

const ICON_BY_KEY: Record<keyof PerformanceInput, typeof Activity> = {
  row1k: Activity,
  skiErg500: Wind,
  run400m: Zap,
  row2k: Waves,
  run5k: Footprints,
  run10k: Route,
  swim400m: Droplet,
  run1kIncline: Mountain,
  bikeErg1k: Bike,
  bikeErg2k: CircleDot,
  skiErg2k: Wind,
  echoBikeCal1min: Fan,
  echoBike10cal: Fan,
  echoBike30cal: Fan,
  wallBall150: Target,
  pullups: Grip,
  dipsStrict: BicepsFlexed,
  hspuStrict: ArrowBigDown,
  muscleUp2min: Link2,
  toesToBar: MoveVertical,
  burpees50: HeartPulse,
  airSquat100: Activity,
  kbSwing100: Hammer,
  hybridDbChipper: Flame,
  doubleUnders1min: Infinity,
  pushupsStrict: UserRound,
  ropeClimb2min: Anchor,
  lunges2min: Footprints,
  frontSquat5: Weight,
  backSquat3: Dumbbell,
  bulgarianSplitSquat8: Split,
  benchPress5: Square,
  ohp5: ArrowBigUp,
  tbarRow10: Cable,
  deadlift5: Weight,
  boxJumpMaxCm: Box,
  farmerCarry: Grip,
  sandbagCarry: Package,
  sledCarry: ChevronsRight,
  hollowHold: Timer,
  lSitHold: Brackets,
  /** Non affiché — satisfait `Record<keyof PerformanceInput, …>`. */
  loadNotes: Activity,
};

const fieldsWithIcons = PERFORMANCE_FORM_FIELDS.map((f) => ({
  ...f,
  icon: ICON_BY_KEY[f.key],
}));

const groupedSections = groupPerformanceFormFields(fieldsWithIcons);

const FOCUS_KEYS = new Set<string>(
  fieldsWithIcons.map((f) => f.key as string),
);

function isPerfFocusKey(v: string | null): v is PerformanceTestKey {
  return v != null && FOCUS_KEYS.has(v);
}

export function PerformanceForm({
  initial,
}: {
  initial: PerformanceInput | null;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const didScrollFocus = useRef(false);
  const [pulseKey, setPulseKey] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const base = useMemo(() => initial ?? DEMO_PERFORMANCE, [initial]);
  const [values, setValues] = useState<Record<string, string>>(() => {
    const o: Record<string, string> = {};
    for (const f of fieldsWithIcons) {
      const v = base[f.key];
      if (v == null) o[f.key] = "";
      else o[f.key] = typeof v === "number" ? String(v) : v;
      if (f.optionalLoad) {
        const fk = perfLoadNoteFormKey(f.optionalLoad.noteKey);
        const lv = base.loadNotes?.[f.optionalLoad.noteKey];
        o[fk] = lv == null ? "" : String(lv);
      }
    }
    return o;
  });

  useEffect(() => {
    queueMicrotask(() => {
      const p = loadPerformance();
      if (!p) return;
      const next: Record<string, string> = {};
      for (const f of fieldsWithIcons) {
        const v = p[f.key];
        next[f.key] =
          v == null ? "" : typeof v === "number" ? String(v) : (v as string);
        if (f.optionalLoad) {
          const fk = perfLoadNoteFormKey(f.optionalLoad.noteKey);
          const lv = p.loadNotes?.[f.optionalLoad.noteKey];
          next[fk] = lv == null ? "" : String(lv);
        }
      }
      setValues((prev) => ({ ...prev, ...next }));
    });
  }, []);

  useEffect(() => {
    const raw = searchParams.get(PERF_FOCUS_QUERY);
    if (raw == null) return;

    const stripFocusFromUrl = () => {
      const next = new URLSearchParams(searchParams.toString());
      next.delete(PERF_FOCUS_QUERY);
      const q = next.toString();
      router.replace(q ? `/performances?${q}` : "/performances", { scroll: false });
    };

    if (!isPerfFocusKey(raw)) {
      stripFocusFromUrl();
      return;
    }

    if (didScrollFocus.current) return;
    didScrollFocus.current = true;

    const id = `perf-field-${raw}`;
    const run = () => {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
        setPulseKey(raw);
        window.setTimeout(() => setPulseKey(null), 2200);
      }
      stripFocusFromUrl();
    };

    queueMicrotask(() => {
      requestAnimationFrame(() => {
        requestAnimationFrame(run);
      });
    });
  }, [searchParams, router]);

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
    recordScoreSnapshot(loadProfile() ?? DEMO_PROFILE, built.data);
    router.push("/daily");
  }

  return (
    <form onSubmit={onSubmit} className="min-w-0 space-y-8">
      <div className="flex min-w-0 flex-wrap items-center justify-between gap-4">
        <p className="min-w-0 max-w-xl text-sm leading-relaxed text-muted">
          Besoin du détail d&apos;un test ? Consulte les{" "}
          <Link href="/tests" className="text-neon hover:underline">
            protocoles standardisés
          </Link>
          .
        </p>
      </div>
      {groupedSections.map(({ sectionId, title, blurb, fields }) => (
        <section key={sectionId} className="space-y-4">
          <div className="max-w-3xl">
            <h2 className="text-lg font-semibold tracking-tight text-foreground">
              {title}
            </h2>
            <p className="mt-1 text-sm text-muted">{blurb}</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {fields.map((field) => {
              const {
                key,
                title: fieldTitle,
                unit,
                placeholder,
                icon: Icon,
                type,
                optionalLoad,
              } = field;
              const loadFormKey = optionalLoad
                ? perfLoadNoteFormKey(optionalLoad.noteKey)
                : null;
              return (
              <div key={key} id={`perf-field-${key}`} className="scroll-mt-24">
                <Card
                  className={cn(
                    "border-border bg-surface/80 p-5 transition-[box-shadow,ring] duration-500",
                    pulseKey === key &&
                      "ring-2 ring-neon/45 shadow-[0_0_32px_-6px_rgba(82,255,114,0.45)]",
                  )}
                >
                <div className="flex items-start gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-neon/25 bg-neon/10 text-neon">
                    <Icon className="h-5 w-5" />
                  </span>
                  <div className="min-w-0 flex-1 space-y-2">
                    <div>
                      <div className="text-sm font-semibold text-foreground">
                        {fieldTitle}
                      </div>
                      <div className="text-[11px] font-medium uppercase tracking-wider text-muted">
                        {unit}
                      </div>
                    </div>
                    <Label className="sr-only" htmlFor={key}>
                      {fieldTitle}
                    </Label>
                    <Input
                      id={key}
                      placeholder={placeholder}
                      value={values[key] ?? ""}
                      onChange={(e) => setField(key, e.target.value)}
                      inputMode={type === "number" ? "decimal" : "text"}
                    />
                    <TestProtocolMini testId={key} />
                    {optionalLoad && loadFormKey ? (
                      <div className="space-y-1.5 border-t border-border/60 pt-2">
                        <div className="text-[11px] font-medium uppercase tracking-wider text-muted">
                          {optionalLoad.unit}
                        </div>
                        <Label
                          className="text-xs font-normal text-muted"
                          htmlFor={loadFormKey}
                        >
                          {optionalLoad.label}
                        </Label>
                        <Input
                          id={loadFormKey}
                          placeholder={optionalLoad.placeholder}
                          value={values[loadFormKey] ?? ""}
                          onChange={(e) =>
                            setField(loadFormKey, e.target.value)
                          }
                          inputMode="decimal"
                          className="h-9"
                        />
                      </div>
                    ) : null}
                  </div>
                </div>
                </Card>
              </div>
            );
            })}
          </div>
        </section>
      ))}
      <p className="text-sm text-muted">
        Tu peux laisser des champs vides : nous calculons un score provisoire et
        un pourcentage de fiabilité.
      </p>
      {formError ? (
        <p
          role="alert"
          className="break-words rounded-xl border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive"
        >
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
