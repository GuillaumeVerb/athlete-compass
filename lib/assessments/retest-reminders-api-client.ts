"use client";

import { getSupabaseAccessToken } from "@/lib/plans/sync-plan-cloud-client";

function authHeaders(token: string): HeadersInit {
  return { Authorization: `Bearer ${token}` };
}

export type RetestReminderListItem = {
  id: string;
  createdAt: string;
  anchorAssessmentId: string;
  dueAt: string;
  channel: string;
  sentAt: string | null;
  cancelledAt: string | null;
};

export async function fetchRetestReminders(): Promise<
  | { ok: true; items: RetestReminderListItem[] }
  | { ok: false; error: "no_session" | "auth_required" | "skipped" | "failed"; items: [] }
> {
  const token = await getSupabaseAccessToken();
  if (!token) return { ok: false, error: "no_session", items: [] };

  const res = await fetch("/api/retest-reminders", { headers: authHeaders(token) });
  const data = (await res.json()) as {
    ok?: boolean;
    skipped?: boolean;
    items?: RetestReminderListItem[];
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

export async function postRetestReminder(input: {
  anchorAssessmentId: string;
  dueInDays?: number;
}): Promise<
  | { ok: true; id: string; dueAt: string }
  | { ok: false; error: string; skipped?: boolean }
> {
  const token = await getSupabaseAccessToken();
  if (!token) return { ok: false, error: "no_session" };

  const res = await fetch("/api/retest-reminders", {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeaders(token) },
    body: JSON.stringify(input),
  });
  const data = (await res.json()) as {
    ok?: boolean;
    skipped?: boolean;
    id?: string;
    dueAt?: string;
    error?: string;
    reason?: string;
  };

  if (data.skipped) {
    return { ok: false, error: data.reason ?? "skipped", skipped: true };
  }
  if (!res.ok || !data.ok || !data.id || !data.dueAt) {
    return {
      ok: false,
      error: typeof data.error === "string" ? data.error : "failed",
    };
  }
  return { ok: true, id: data.id, dueAt: data.dueAt };
}

export async function cancelRetestReminder(
  id: string,
): Promise<{ ok: true } | { ok: false; error: string; skipped?: boolean }> {
  const token = await getSupabaseAccessToken();
  if (!token) return { ok: false, error: "no_session" };

  const res = await fetch(`/api/retest-reminders/${encodeURIComponent(id)}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json", ...authHeaders(token) },
    body: JSON.stringify({ action: "cancel" }),
  });
  const data = (await res.json()) as {
    ok?: boolean;
    skipped?: boolean;
    error?: string;
    reason?: string;
  };

  if (data.skipped) {
    return { ok: false, error: data.reason ?? "skipped", skipped: true };
  }
  if (!res.ok || !data.ok) {
    return { ok: false, error: data.error ?? "failed" };
  }
  return { ok: true };
}
