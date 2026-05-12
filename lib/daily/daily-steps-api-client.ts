"use client";

import { createBrowserSupabase } from "@/lib/supabase/browser-client";
import type { PostDailyStepsBody } from "@/lib/daily/daily-steps-post-schema";

async function bearer(): Promise<string | null> {
  const supabase = createBrowserSupabase();
  if (!supabase) return null;
  const { data } = await supabase.auth.getSession();
  return data.session?.access_token ?? null;
}

/** Envoie les pas du jour sur Supabase (no-op si pas de session ou admin non configuré). */
export async function postDailyStepsToCloud(
  body: PostDailyStepsBody,
): Promise<
  { ok: true } | { ok: false; error: string; skipped?: boolean }
> {
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
