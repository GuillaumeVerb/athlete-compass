"use client";

import { createBrowserSupabase } from "@/lib/supabase/browser-client";
import type { PostDailyStepsBody } from "@/lib/daily/daily-steps-post-schema";
import { todayLocalDateKey, type CloudDailyStepRow } from "@/lib/daily/daily-activity-storage";
import { defaultDailyStepsPullRange } from "@/lib/daily/daily-steps-pull-range";

async function bearer(): Promise<string | null> {
  const supabase = createBrowserSupabase();
  if (!supabase) return null;
  const { data } = await supabase.auth.getSession();
  return data.session?.access_token ?? null;
}

/** Envoie les pas du jour sur Supabase (no-op si pas de session ou admin non configuré). */
export async function postDailyStepsToCloud(
  body: PostDailyStepsBody,
): Promise<{ ok: true } | { ok: false; error: string; skipped?: boolean }> {
  const token = await bearer();
  if (!token) return { ok: false, error: "no_session" };
  const res = await fetch("/api/daily/steps", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  });
  let data: Record<string, unknown>;
  try {
    data = (await res.json()) as Record<string, unknown>;
  } catch {
    return { ok: false, error: "invalid_response" };
  }
  if (data.skipped === true) {
    return { ok: false, error: "supabase_admin_not_configured", skipped: true };
  }
  if (data.ok === true) return { ok: true };
  return {
    ok: false,
    error: typeof data.error === "string" ? data.error : "request_failed",
  };
}

export type FetchDailyStepsResult =
  | { ok: true; rows: CloudDailyStepRow[] }
  | { ok: false; error: string; skipped?: boolean };

/** Récupère une plage de jours (fuseau local pour `to` par défaut). */
export async function fetchDailyStepsFromCloud(
  from?: string,
  to?: string,
): Promise<FetchDailyStepsResult> {
  const token = await bearer();
  if (!token) return { ok: false, error: "no_session" };
  const toQ = to ?? todayLocalDateKey();
  const fromQ = from ?? defaultDailyStepsPullRange(toQ).from;
  const params = new URLSearchParams({ from: fromQ, to: toQ });
  const res = await fetch(`/api/daily/steps?${params.toString()}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  let data: Record<string, unknown>;
  try {
    data = (await res.json()) as Record<string, unknown>;
  } catch {
    return { ok: false, error: "invalid_response" };
  }
  if (data.skipped === true) {
    return { ok: false, error: "supabase_admin_not_configured", skipped: true };
  }
  if (res.ok && data.ok === true && Array.isArray(data.rows)) {
    return { ok: true, rows: data.rows as CloudDailyStepRow[] };
  }
  return {
    ok: false,
    error: typeof data.error === "string" ? data.error : "request_failed",
  };
}

export type PostBatchResult =
  | { ok: true; count: number }
  | { ok: false; error: string; skipped?: boolean };

const BATCH_CHUNK = 60;

/** Upsert jusqu’à 90 pas / requête, découpé en chunks côté client. */
export async function postDailyStepsBatchToCloud(
  rows: PostDailyStepsBody[],
): Promise<PostBatchResult> {
  if (rows.length === 0) return { ok: true, count: 0 };
  const token = await bearer();
  if (!token) return { ok: false, error: "no_session" };
  let total = 0;
  for (let i = 0; i < rows.length; i += BATCH_CHUNK) {
    const chunk = rows.slice(i, i + BATCH_CHUNK);
    const res = await fetch("/api/daily/steps/batch", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ rows: chunk }),
    });
    let data: Record<string, unknown>;
    try {
      data = (await res.json()) as Record<string, unknown>;
    } catch {
      return { ok: false, error: "invalid_response" };
    }
    if (data.skipped === true) {
      return { ok: false, error: "supabase_admin_not_configured", skipped: true };
    }
    if (data.ok !== true) {
      return {
        ok: false,
        error: typeof data.error === "string" ? data.error : "request_failed",
      };
    }
    total += typeof data.count === "number" ? data.count : chunk.length;
  }
  return { ok: true, count: total };
}
