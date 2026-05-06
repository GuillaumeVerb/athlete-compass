"use client";

import type { PlanWeek } from "@/lib/plans/generate-plan";
import type { PlanWeekFatigue } from "@/lib/future/cloud-types";
import { DEMO_PERFORMANCE, DEMO_PROFILE } from "@/lib/mock-data";
import {
  loadPerformance,
  loadProfile,
} from "@/lib/storage";
import { createBrowserSupabase } from "@/lib/supabase/browser-client";

async function bearer(): Promise<string | null> {
  const supabase = createBrowserSupabase();
  if (!supabase) return null;
  const { data } = await supabase.auth.getSession();
  return data.session?.access_token ?? null;
}

export async function postPlanWeekFeedback(input: {
  clientSyncId: string;
  fingerprint: string;
  weekIndex: number;
  fatigue: PlanWeekFatigue;
  sessionsCompleted?: number;
  note?: string;
  planInstanceId?: string;
}): Promise<{ ok: true } | { ok: false; error: string }> {
  const token = await bearer();
  if (!token) return { ok: false, error: "no_session" };
  const res = await fetch("/api/plan/week-feedback", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(input),
  });
  let data: Record<string, unknown>;
  try {
    data = (await res.json()) as Record<string, unknown>;
  } catch {
    return { ok: false, error: "invalid_response" };
  }
  if (data.skipped === true || data.ok !== true) {
    return {
      ok: false,
      error:
        typeof data.reason === "string"
          ? data.reason
          : typeof data.error === "string"
            ? data.error
            : "request_failed",
    };
  }
  return { ok: true };
}

export async function postPlanAdapt(input: {
  clientSyncId: string;
  previousPlanInstanceId?: string;
}): Promise<
  | {
      ok: true;
      weeks: PlanWeek[];
      fingerprint: string;
      planInstanceId: string | null;
      clientSyncId?: string;
    }
  | { ok: false; error: string }
> {
  const token = await bearer();
  if (!token) return { ok: false, error: "no_session" };
  const profile = loadProfile() ?? DEMO_PROFILE;
  const performance = loadPerformance() ?? DEMO_PERFORMANCE;
  const res = await fetch("/api/plan/adapt", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      profile,
      performance,
      clientSyncId: input.clientSyncId,
      previousPlanInstanceId: input.previousPlanInstanceId,
    }),
  });
  if (!res.ok) {
    const t = await res.text().catch(() => "");
    return { ok: false, error: t || `http_${res.status}` };
  }
  const outer = (await res.json()) as Record<string, unknown>;
  if (outer.skipped === true || outer.ok !== true) {
    return {
      ok: false,
      error:
        typeof outer.reason === "string"
          ? outer.reason
          : typeof outer.error === "string"
            ? outer.error
            : "request_failed",
    };
  }
  const json = outer as {
    weeks?: PlanWeek[];
    fingerprint?: string;
    planInstanceId?: string | null;
    clientSyncId?: string;
  };
  if (!json.weeks || !json.fingerprint) {
    return { ok: false, error: "invalid_response" };
  }
  return {
    ok: true,
    weeks: json.weeks,
    fingerprint: json.fingerprint,
    planInstanceId: json.planInstanceId ?? null,
    clientSyncId:
      typeof json.clientSyncId === "string" ? json.clientSyncId : undefined,
  };
}
