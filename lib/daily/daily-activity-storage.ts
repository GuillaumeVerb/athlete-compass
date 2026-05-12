"use client";

import type { UserProfile } from "@/lib/types";

const KEY = "ac_daily_activity_v1";

/** Objectif initial si l’utilisateur n’a rien enregistré — neutre, pas lié au profil. */
export const DEFAULT_STEPS_GOAL = 10_000;

export type DailyActivityStoreV1 = {
  v: 1;
  /** Pas relevés par jour calendaire local `YYYY-MM-DD`. */
  stepsByDay: Record<string, number>;
  /** Objectif pas / jour (modifiable). */
  stepsGoal: number;
};

/** Date locale `YYYY-MM-DD` (fuseau du navigateur). */
export function todayLocalDateKey(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function emptyStore(): DailyActivityStoreV1 {
  return {
    v: 1,
    stepsByDay: {},
    stepsGoal: DEFAULT_STEPS_GOAL,
  };
}

function normalizeGoal(n: number): number {
  if (!Number.isFinite(n)) return DEFAULT_STEPS_GOAL;
  return Math.min(80_000, Math.max(2000, Math.round(n)));
}

export function loadDailyActivityStore(_profile: UserProfile): DailyActivityStoreV1 {
  if (typeof window === "undefined") {
    return emptyStore();
  }
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return emptyStore();
    const parsed = JSON.parse(raw) as Partial<DailyActivityStoreV1>;
    if (parsed.v !== 1) return emptyStore();

    const stepsByDay: Record<string, number> = {};
    if (parsed.stepsByDay && typeof parsed.stepsByDay === "object") {
      for (const [k, v] of Object.entries(parsed.stepsByDay)) {
        if (!/^\d{4}-\d{2}-\d{2}$/.test(k)) continue;
        const n = Number(v);
        if (!Number.isFinite(n) || n < 0 || n > 300_000) continue;
        stepsByDay[k] = Math.round(n);
      }
    }

    const stepsGoal =
      typeof parsed.stepsGoal === "number" && Number.isFinite(parsed.stepsGoal)
        ? normalizeGoal(parsed.stepsGoal)
        : DEFAULT_STEPS_GOAL;

    return { v: 1, stepsByDay, stepsGoal };
  } catch {
    return emptyStore();
  }
}

export function saveDailyActivityStore(store: DailyActivityStoreV1): void {
  if (typeof window === "undefined") return;
  const stepsByDay: Record<string, number> = {};
  for (const [k, v] of Object.entries(store.stepsByDay)) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(k)) continue;
    if (!Number.isFinite(v) || v < 0 || v > 300_000) continue;
    stepsByDay[k] = Math.round(v);
  }
  const payload: DailyActivityStoreV1 = {
    v: 1,
    stepsByDay,
    stepsGoal: Math.min(80_000, Math.max(2000, Math.round(store.stepsGoal))),
  };
  localStorage.setItem(KEY, JSON.stringify(payload));
}

/**
 * Met à jour le store (pas du jour et/ou objectif).
 * `steps` absent : ne change pas la valeur du jour courant.
 */
export function patchDailyActivityStore(
  _profile: UserProfile,
  patch: { steps?: number; stepsGoal?: number },
): DailyActivityStoreV1 {
  const prev = loadDailyActivityStore(_profile);
  const day = todayLocalDateKey();
  const stepsByDay = { ...prev.stepsByDay };
  if (typeof patch.steps === "number" && Number.isFinite(patch.steps)) {
    const s = Math.max(0, Math.min(300_000, Math.round(patch.steps)));
    stepsByDay[day] = s;
  }
  const stepsGoal =
    typeof patch.stepsGoal === "number" && Number.isFinite(patch.stepsGoal)
      ? normalizeGoal(patch.stepsGoal)
      : prev.stepsGoal;
  const next: DailyActivityStoreV1 = { v: 1, stepsByDay, stepsGoal };
  saveDailyActivityStore(next);
  return next;
}

/** Fusionne des lignes CSV (jour → pas) dans le store local. */
export function importStepsRows(
  profile: UserProfile,
  rows: { day: string; steps: number }[],
): DailyActivityStoreV1 {
  const prev = loadDailyActivityStore(profile);
  const stepsByDay = { ...prev.stepsByDay };
  for (const r of rows) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(r.day)) continue;
    if (!Number.isFinite(r.steps)) continue;
    const s = Math.max(0, Math.min(300_000, Math.round(r.steps)));
    stepsByDay[r.day] = s;
  }
  const next: DailyActivityStoreV1 = { v: 1, stepsByDay, stepsGoal: prev.stepsGoal };
  saveDailyActivityStore(next);
  return next;
}
