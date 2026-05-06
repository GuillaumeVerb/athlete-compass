"use client";

import type { PlanWeek } from "@/lib/plans/plan-types";
import { createBrowserSupabase } from "@/lib/supabase/browser-client";
import { loadPlanClientSyncId, savePlanClientSyncId } from "@/lib/storage";
import { isUuid } from "@/lib/uuid";

export type PlanCloudHistoryRow = {
  id: string;
  createdAt: string;
  fingerprint: string;
  userId: string | null;
  clientSyncId: string | null;
  purchaseId: string | null;
};

export type PlanCloudSyncResult =
  | {
      ok: true;
      clientSyncId: string;
      serverId?: string;
      linkedUser?: boolean;
      linkedPurchase?: boolean;
    }
  | { ok: false; skipped: true; reason?: string };

export async function getSupabaseAccessToken(): Promise<string | null> {
  const sb = createBrowserSupabase();
  if (!sb) return null;
  const { data } = await sb.auth.getSession();
  return data.session?.access_token ?? null;
}

/** Abonnement pour rafraîchir l’UI quand la session Supabase change. */
export function subscribeSupabaseSession(
  onChange: (hasSession: boolean) => void,
): () => void {
  const sb = createBrowserSupabase();
  if (!sb) {
    onChange(false);
    return () => {};
  }
  void sb.auth.getSession().then(({ data }) => {
    onChange(Boolean(data.session));
  });
  const { data } = sb.auth.onAuthStateChange((_event, session) => {
    onChange(Boolean(session));
  });
  return () => {
    data.subscription.unsubscribe();
  };
}

function authHeaders(token: string | null): HeadersInit {
  if (!token) return {};
  return { Authorization: `Bearer ${token}` };
}

/** Envoie le plan au serveur (Supabase) — `user_id` si session Supabase active. */
export async function syncPlanWeeksToCloud(
  weeks: PlanWeek[],
  fingerprint: string,
): Promise<PlanCloudSyncResult> {
  const token = await getSupabaseAccessToken();
  const existing = loadPlanClientSyncId();
  const res = await fetch("/api/plan/snapshot", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...authHeaders(token),
    },
    body: JSON.stringify({
      weeks,
      fingerprint,
      ...(existing ? { clientSyncId: existing } : {}),
    }),
  });

  let data: Record<string, unknown>;
  try {
    data = (await res.json()) as Record<string, unknown>;
  } catch {
    return { ok: false, skipped: true, reason: "invalid_response" };
  }

  if (data.skipped === true || data.reason === "supabase_admin_not_configured") {
    return { ok: false, skipped: true, reason: "supabase_admin_not_configured" };
  }

  if (!res.ok || data.ok !== true) {
    return {
      ok: false,
      skipped: true,
      reason: typeof data.error === "string" ? data.error : "request_failed",
    };
  }

  const returnedSync =
    typeof data.clientSyncId === "string" ? data.clientSyncId.trim() : "";
  if (returnedSync) {
    savePlanClientSyncId(returnedSync);
  }

  return {
    ok: true,
    clientSyncId: returnedSync,
    serverId: typeof data.id === "string" ? data.id : undefined,
    linkedUser: data.linkedUser === true,
    linkedPurchase: data.linkedPurchase === true,
  };
}

/** Historique : session Supabase seule, ou `sync` seul, ou les deux (union côté serveur). */
export async function fetchPlanCloudHistory(
  clientSyncId?: string | null,
): Promise<PlanCloudHistoryRow[]> {
  const token = await getSupabaseAccessToken();
  const params = new URLSearchParams({ limit: "20" });
  const sid = clientSyncId?.trim();
  if (sid && isUuid(sid)) {
    params.set("sync", sid);
  }

  const res = await fetch(`/api/plan/history?${params}`, {
    headers: authHeaders(token),
  });

  if (res.status === 401) {
    return [];
  }

  const data = (await res.json()) as {
    ok?: boolean;
    items?: Array<{
      id: string;
      createdAt: string;
      fingerprint: string;
      userId?: string | null;
      clientSyncId?: string | null;
      purchaseId?: string | null;
    }>;
  };

  if (!data.ok || !Array.isArray(data.items)) return [];

  return data.items.map((row) => ({
    id: row.id,
    createdAt: row.createdAt,
    fingerprint: row.fingerprint,
    userId: row.userId ?? null,
    clientSyncId: row.clientSyncId ?? null,
    purchaseId: row.purchaseId ?? null,
  }));
}
