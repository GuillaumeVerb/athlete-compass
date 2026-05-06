import { randomUUID } from "crypto";
import { NextResponse } from "next/server";
import { createAdminSupabase } from "@/lib/supabase/admin-client";
import { parsePlanWeeksPayload } from "@/lib/plans/validate-plan-weeks";
import { resolvePurchaseIdForPlanSnapshot } from "@/lib/purchase/resolve-purchase-id-for-plan-snapshot";
import { getUserIdFromSupabaseAccessToken } from "@/lib/supabase/verify-access-token";
import { isUuid } from "@/lib/uuid";

async function userIdFromRequest(req: Request): Promise<string | null> {
  const h = req.headers.get("authorization");
  if (!h?.toLowerCase().startsWith("bearer ")) return null;
  const jwt = h.slice(7).trim();
  if (!jwt) return null;
  return getUserIdFromSupabaseAccessToken(jwt);
}

export async function POST(req: Request) {
  const supabase = createAdminSupabase();
  if (!supabase) {
    return NextResponse.json(
      { ok: false, skipped: true, reason: "supabase_admin_not_configured" },
      { status: 200 },
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  if (!body || typeof body !== "object") {
    return NextResponse.json({ ok: false, error: "invalid_body" }, { status: 400 });
  }

  const o = body as Record<string, unknown>;
  const fingerprint =
    typeof o.fingerprint === "string" ? o.fingerprint.trim() : "";
  if (!fingerprint) {
    return NextResponse.json({ ok: false, error: "missing_fingerprint" }, { status: 400 });
  }

  const weeks = parsePlanWeeksPayload(o.weeks);
  if (!weeks) {
    return NextResponse.json({ ok: false, error: "invalid_weeks" }, { status: 400 });
  }

  const clientSyncId =
    typeof o.clientSyncId === "string" && isUuid(o.clientSyncId)
      ? o.clientSyncId
      : randomUUID();

  const userId = await userIdFromRequest(req);
  const purchaseId = await resolvePurchaseIdForPlanSnapshot();

  const insertPayload: {
    client_sync_id: string;
    fingerprint: string;
    weeks: typeof weeks;
    user_id?: string;
    purchase_id?: string;
  } = {
    client_sync_id: clientSyncId,
    fingerprint,
    weeks,
  };
  if (userId) {
    insertPayload.user_id = userId;
  }
  if (purchaseId) {
    insertPayload.purchase_id = purchaseId;
  }

  const { data, error } = await supabase
    .from("plan_instances")
    .insert(insertPayload)
    .select("id")
    .single();

  if (error) {
    console.error("[plan/snapshot]", error);
    return NextResponse.json(
      { ok: false, error: "insert_failed", message: error.message },
      { status: 500 },
    );
  }

  return NextResponse.json({
    ok: true,
    id: data.id,
    clientSyncId,
    linkedUser: Boolean(userId),
    linkedPurchase: Boolean(purchaseId),
  });
}
