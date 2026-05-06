"use client";

import type { AssessmentCompareDelta } from "@/lib/future/cloud-types";
import { getSupabaseAccessToken } from "@/lib/plans/sync-plan-cloud-client";
import type { NextBestMovePlan, PerformanceInput, ScoreBreakdown, UserProfile } from "@/lib/types";

function authHeaders(token: string): HeadersInit {
  return { Authorization: `Bearer ${token}` };
}

export type AssessmentListItemClient = {
  id: string;
  createdAt: string;
  hybridScore: number;
  athleticAge: number;
  reliabilityPct: number;
  profileLabel: string;
  limiter: string;
  source: string;
  previousAssessmentId: string | null;
};

export type AssessmentDetailClient = {
  id: string;
  createdAt: string;
  hybridScore: number;
  hybridLabel: string;
  athleticAge: number;
  reliabilityPct: number;
  profileLabel: string;
  profileKey: string;
  limiter: string;
  nextBestMovePlan: NextBestMovePlan;
  breakdown: ScoreBreakdown;
  goals4Weeks: string[];
  performanceSnapshot: PerformanceInput;
  profileSnapshot: UserProfile;
  source: string;
  previousAssessmentId: string | null;
};

export async function fetchAssessmentsList(limit = 20): Promise<
  | { ok: true; items: AssessmentListItemClient[] }
  | { ok: false; error: "no_session" | "auth_required" | "skipped" | "failed"; items?: [] }
> {
  const token = await getSupabaseAccessToken();
  if (!token) return { ok: false, error: "no_session", items: [] };

  const res = await fetch(`/api/assessments?limit=${limit}`, {
    headers: authHeaders(token),
  });
  const data = (await res.json()) as {
    ok?: boolean;
    skipped?: boolean;
    items?: AssessmentListItemClient[];
    error?: string;
  };

  if (data.skipped) return { ok: false, error: "skipped", items: [] };
  if (res.status === 401 || data.error === "auth_required") {
    return { ok: false, error: "auth_required", items: [] };
  }
  if (!res.ok || !data.ok || !Array.isArray(data.items)) {
    return { ok: false, error: "failed", items: [] };
  }
  return { ok: true, items: data.items };
}

export async function fetchAssessmentDetail(
  id: string,
): Promise<
  | { ok: true; assessment: AssessmentDetailClient }
  | { ok: false; error: string }
> {
  const token = await getSupabaseAccessToken();
  if (!token) return { ok: false, error: "no_session" };

  const res = await fetch(`/api/assessments/${encodeURIComponent(id)}`, {
    headers: authHeaders(token),
  });
  const data = (await res.json()) as {
    ok?: boolean;
    assessment?: AssessmentDetailClient;
    error?: string;
  };

  if (res.status === 404) return { ok: false, error: "not_found" };
  if (!res.ok || !data.ok || !data.assessment) {
    return { ok: false, error: data.error ?? "failed" };
  }
  return { ok: true, assessment: data.assessment };
}

export async function fetchAssessmentCompare(
  from: string,
  to: string,
): Promise<
  | { ok: true; delta: AssessmentCompareDelta }
  | { ok: false; error: string }
> {
  const token = await getSupabaseAccessToken();
  if (!token) return { ok: false, error: "no_session" };

  const q = new URLSearchParams({ from, to });
  const res = await fetch(`/api/assessments/compare?${q}`, {
    headers: authHeaders(token),
  });
  const data = (await res.json()) as {
    ok?: boolean;
    delta?: AssessmentCompareDelta;
    error?: string;
  };

  if (!res.ok || !data.ok || !data.delta) {
    return { ok: false, error: data.error ?? "failed" };
  }
  return { ok: true, delta: data.delta };
}

export async function postCurrentAssessment(body: {
  profile: UserProfile;
  performance: PerformanceInput;
  source?: "manual" | "retest_30d" | "import";
  previousAssessmentId?: string;
}): Promise<
  | { ok: true; id: string; createdAt: string }
  | { ok: false; error: string; skipped?: boolean }
> {
  const token = await getSupabaseAccessToken();
  if (!token) return { ok: false, error: "no_session" };

  const res = await fetch("/api/assessments", {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeaders(token) },
    body: JSON.stringify(body),
  });
  const data = (await res.json()) as {
    ok?: boolean;
    skipped?: boolean;
    id?: string;
    createdAt?: string;
    error?: string;
    reason?: string;
  };

  if (data.skipped) {
    return { ok: false, error: data.reason ?? "skipped", skipped: true };
  }
  if (!res.ok || !data.ok || !data.id || !data.createdAt) {
    return { ok: false, error: data.error ?? "failed" };
  }
  return { ok: true, id: data.id, createdAt: data.createdAt };
}
