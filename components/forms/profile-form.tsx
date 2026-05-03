"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type {
  ConstraintKey,
  PrimaryGoal,
  TrainingFrequency,
  UserProfile,
} from "@/lib/types";
import { profileSchema } from "@/lib/schemas";
import { DEMO_PROFILE } from "@/lib/mock-data";
import { loadProfile, saveProfile } from "@/lib/storage";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

const goals: { id: PrimaryGoal; title: string; hint: string }[] = [
  {
    id: "crossfit",
    title: "Physique Crossfiter",
    hint: "Polyvalence, moteur, force relative",
  },
  { id: "hyrox", title: "HYROX", hint: "Course + stations, pacing" },
  { id: "recomp", title: "Recomposition", hint: "Sèche & performance" },
  { id: "endurance", title: "Endurance", hint: "Volume, moteur long" },
  {
    id: "strength_aesthetics",
    title: "Force & esthétique",
    hint: "Hypertrophie + charges",
  },
];

const freqs: { id: TrainingFrequency; label: string }[] = [
  { id: "1-2", label: "1–2 jours" },
  { id: "3", label: "3 jours" },
  { id: "4-5", label: "4–5 jours" },
  { id: "6+", label: "6+ jours" },
];

const constraintOptions: { id: ConstraintKey; label: string }[] = [
  { id: "light_legs", label: "Moins charger les cuisses" },
  { id: "no_running", label: "Pas de course" },
  { id: "commercial_gym", label: "Salle classique" },
  { id: "3_days_max", label: "≤ 3 jours / semaine" },
  { id: "short_sessions", label: "Séances courtes" },
];

export function ProfileForm({ initial }: { initial: UserProfile | null }) {
  const router = useRouter();
  const defaults = useMemo(() => initial ?? DEMO_PROFILE, [initial]);

  const [age, setAge] = useState(String(defaults.age));
  const [sex, setSex] = useState<UserProfile["sex"]>(defaults.sex);
  const [heightCm, setHeightCm] = useState(String(defaults.heightCm));
  const [weightKg, setWeightKg] = useState(String(defaults.weightKg));
  const [waistCm, setWaistCm] = useState(
    defaults.waistCm != null ? String(defaults.waistCm) : "",
  );
  const [goal, setGoal] = useState<PrimaryGoal>(defaults.goal);
  const [frequency, setFrequency] = useState<TrainingFrequency>(
    defaults.frequency,
  );
  const [constraints, setConstraints] = useState<ConstraintKey[]>(
    defaults.constraints ?? [],
  );
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    queueMicrotask(() => {
      const p = loadProfile();
      if (!p) return;
      setAge(String(p.age));
      setSex(p.sex);
      setHeightCm(String(p.heightCm));
      setWeightKg(String(p.weightKg));
      setWaistCm(p.waistCm != null ? String(p.waistCm) : "");
      setGoal(p.goal);
      setFrequency(p.frequency);
      setConstraints(p.constraints ?? []);
    });
  }, []);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const parsed = profileSchema.safeParse({
      age,
      sex,
      heightCm,
      weightKg,
      waistCm: waistCm || undefined,
      goal,
      frequency,
    });
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Formulaire invalide");
      return;
    }
    const v = parsed.data;
    const existing = loadProfile();
    const profile: UserProfile = {
      age: v.age,
      sex: v.sex,
      heightCm: v.heightCm,
      weightKg: v.weightKg,
      waistCm: v.waistCm,
      goal: v.goal,
      frequency: v.frequency,
      equipment: existing?.equipment ?? DEMO_PROFILE.equipment,
      constraints,
    };
    saveProfile(profile);
    setError(null);
    router.push("/performances");
  }

  return (
    <form onSubmit={onSubmit} className="space-y-8">
      <div className="grid gap-8 lg:grid-cols-2">
        <Card className="p-6">
          <h2 className="text-display mb-4 text-lg font-semibold text-foreground">
            Identité & anthropométrie
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="age">Âge</Label>
              <Input
                id="age"
                inputMode="numeric"
                value={age}
                onChange={(e) => setAge(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Sexe</Label>
              <div className="flex gap-2">
                {(["homme", "femme", "autre"] as const).map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setSex(s)}
                    className={cn(
                      "flex-1 rounded-xl border px-3 py-2 text-sm capitalize transition-colors",
                      sex === s
                        ? "border-neon/50 bg-neon/10 text-neon"
                        : "border-border bg-background text-muted hover:border-foreground/20",
                    )}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="h">Taille (cm)</Label>
              <Input
                id="h"
                inputMode="numeric"
                value={heightCm}
                onChange={(e) => setHeightCm(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="w">Poids (kg)</Label>
              <Input
                id="w"
                inputMode="decimal"
                value={weightKg}
                onChange={(e) => setWeightKg(e.target.value)}
              />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="waist">Tour de taille (cm) — optionnel</Label>
              <Input
                id="waist"
                inputMode="numeric"
                value={waistCm}
                onChange={(e) => setWaistCm(e.target.value)}
                placeholder="ex. 84"
              />
            </div>
          </div>
        </Card>

        <div className="space-y-6">
          <Card className="p-6">
            <h2 className="text-display mb-4 text-lg font-semibold text-foreground">
              Objectif principal
            </h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {goals.map((g) => (
                <button
                  key={g.id}
                  type="button"
                  onClick={() => setGoal(g.id)}
                  className={cn(
                    "rounded-2xl border p-4 text-left transition-all",
                    goal === g.id
                      ? "border-neon/45 bg-neon/10 neon-border"
                      : "border-border bg-background/60 hover:border-foreground/20",
                  )}
                >
                  <div className="text-sm font-semibold text-foreground">
                    {g.title}
                  </div>
                  <div className="mt-1 text-xs text-muted">{g.hint}</div>
                </button>
              ))}
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-display mb-4 text-lg font-semibold text-foreground">
              Fréquence d&apos;entraînement
            </h2>
            <div className="flex flex-wrap gap-2">
              {freqs.map((f) => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setFrequency(f.id)}
                  className={cn(
                    "rounded-xl border px-4 py-2.5 text-sm transition-colors",
                    frequency === f.id
                      ? "border-neon/50 bg-neon/10 text-neon"
                      : "border-border text-muted hover:border-foreground/20",
                  )}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-display mb-2 text-lg font-semibold text-foreground">
              Contraintes (optionnel)
            </h2>
            <p className="mb-4 text-xs text-muted">
              Utilisées pour contextualiser les équivalences machines et les
              suggestions.
            </p>
            <div className="flex flex-wrap gap-2">
              {constraintOptions.map((c) => {
                const on = constraints.includes(c.id);
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() =>
                      setConstraints((prev) =>
                        prev.includes(c.id)
                          ? prev.filter((x) => x !== c.id)
                          : [...prev, c.id],
                      )
                    }
                    className={cn(
                      "rounded-xl border px-3 py-2 text-xs transition-colors",
                      on
                        ? "border-amber/50 bg-amber/10 text-amber"
                        : "border-border text-muted hover:border-foreground/20",
                    )}
                  >
                    {c.label}
                  </button>
                );
              })}
            </div>
          </Card>
        </div>
      </div>

      {error ? (
        <p className="text-sm text-red-400" role="alert">
          {error}
        </p>
      ) : null}

      <div className="flex justify-end">
        <Button type="submit" size="lg" className="rounded-2xl px-10">
          Suivant
        </Button>
      </div>
    </form>
  );
}
