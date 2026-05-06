"use client";

import type { PlanWeek } from "@/lib/plans/plan-types";
import { parsePlanWeeksPayload } from "@/lib/plans/validate-plan-weeks";
import type { PerformanceInput, UserProfile } from "@/lib/types";

const PROFILE_KEY = "ac_profile_v1";
const PERF_KEY = "ac_performance_v1";
const PLAN_SNAPSHOT_KEY = "ac_plan_snapshot_v1";
/** UUID stable pour regrouper les plans côté Supabase (V3) — conservé au-delà du snapshot local. */
const PLAN_CLIENT_SYNC_KEY = "ac_plan_client_sync_v1";

/** Dernier `plan_instances.id` renvoyé par le serveur après sync (V4 / audit). */
const PLAN_LAST_INSTANCE_KEY = "ac_plan_last_instance_id_v1";

export type PlanSnapshotV1 = {
  v: 1;
  fingerprint: string;
  savedAt: string;
  weeks: PlanWeek[];
};

function isPlanSnapshotV1(raw: unknown): raw is PlanSnapshotV1 {
  if (!raw || typeof raw !== "object") return false;
  const o = raw as Record<string, unknown>;
  if (o.v !== 1) return false;
  if (typeof o.fingerprint !== "string" || !o.fingerprint) return false;
  if (typeof o.savedAt !== "string") return false;
  return parsePlanWeeksPayload(o.weeks) != null;
}

/** Invalide le plan figé : prochaine visite `/plan` régénère selon profil + scoring. */
export function clearPlanSnapshot() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(PLAN_SNAPSHOT_KEY);
  localStorage.removeItem(PLAN_LAST_INSTANCE_KEY);
}

export function loadProfile(): UserProfile | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(PROFILE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as UserProfile;
  } catch {
    return null;
  }
}

export function saveProfile(p: UserProfile) {
  if (typeof window === "undefined") return;
  localStorage.setItem(PROFILE_KEY, JSON.stringify(p));
  clearPlanSnapshot();
}

export function loadPerformance(): PerformanceInput | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(PERF_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as PerformanceInput;
  } catch {
    return null;
  }
}

export function savePerformance(p: PerformanceInput) {
  if (typeof window === "undefined") return;
  localStorage.setItem(PERF_KEY, JSON.stringify(p));
  clearPlanSnapshot();
}

export function loadPlanSnapshot(): PlanSnapshotV1 | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(PLAN_SNAPSHOT_KEY);
    if (!raw) return null;
    const parsed: unknown = JSON.parse(raw);
    return isPlanSnapshotV1(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

export function savePlanSnapshot(weeks: PlanWeek[], fingerprint: string) {
  if (typeof window === "undefined") return;
  const payload: PlanSnapshotV1 = {
    v: 1,
    fingerprint,
    savedAt: new Date().toISOString(),
    weeks,
  };
  localStorage.setItem(PLAN_SNAPSHOT_KEY, JSON.stringify(payload));
}

export function loadPlanClientSyncId(): string | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(PLAN_CLIENT_SYNC_KEY);
    if (!raw) return null;
    const t = raw.trim();
    return t.length > 0 ? t : null;
  } catch {
    return null;
  }
}

export function savePlanClientSyncId(id: string) {
  if (typeof window === "undefined") return;
  localStorage.setItem(PLAN_CLIENT_SYNC_KEY, id);
}

export function loadPlanLastInstanceId(): string | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(PLAN_LAST_INSTANCE_KEY);
    if (!raw) return null;
    const t = raw.trim();
    return t.length > 0 ? t : null;
  } catch {
    return null;
  }
}

export function savePlanLastInstanceId(id: string | null) {
  if (typeof window === "undefined") return;
  if (id == null || id.trim() === "") {
    localStorage.removeItem(PLAN_LAST_INSTANCE_KEY);
    return;
  }
  localStorage.setItem(PLAN_LAST_INSTANCE_KEY, id.trim());
}
