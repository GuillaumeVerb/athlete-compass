import { randomUUID } from "crypto";
import { NextResponse } from "next/server";
import { generateFourWeekPlan } from "@/lib/plans/generate-plan";
import { planGenerationFingerprint } from "@/lib/plans/plan-fingerprint";
import { postPlanAdaptSchema } from "@/lib/plans/plan-adapt-schema";
import { resolvePurchaseIdForPlanSnapshot } from "@/lib/purchase/resolve-purchase-id-for-plan-snapshot";
import { computeScoreResult } from "@/lib/scoring";
import { createAdminSupabase } from "@/lib/supabase/admin-client";
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
  const userId = await userIdFromRequest(req);
  if (!userId) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }

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

  const parsed = postPlanAdaptSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: "validation_error", issues: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const { profile, performance, clientSyncId, previousPlanInstanceId } = parsed.data;
  const result = computeScoreResult(profile, performance);
  const weeks = generateFourWeekPlan(profile, result, { forceRecoveryBias: true });
  const fingerprint = planGenerationFingerprint(profile, result, "adapt_recovery_v1");
  const syncId = clientSyncId && isUuid(clientSyncId) ? clientSyncId : randomUUID();
  const purchaseId = await resolvePurchaseIdForPlanSnapshot();

  const insertPayload: {
    client_sync_id: string;
    fingerprint: string;
    weeks: typeof weeks;
    user_id: string;
    purchase_id?: string;
  } = {
    client_sync_id: syncId,
    fingerprint,
    weeks,
    user_id: userId,
  };
  if (purchaseId) {
    insertPayload.purchase_id = purchaseId;
  }

  const { data: inserted, error: insErr } = await supabase
    .from("plan_instances")
    .insert(insertPayload)
    .select("id")
    .single();

  if (insErr || !inserted?.id) {
    console.error("[plan/adapt] insert plan_instances", insErr);
    return NextResponse.json(
      { ok: false, error: "insert_failed", message: insErr?.message },
      { status: 500 },
    );
  }

  const newId = inserted.id as string;

  if (previousPlanInstanceId && isUuid(previousPlanInstanceId)) {
    const { error: evErr } = await supabase.from("plan_adaptation_events").insert({
      user_id: userId,
      from_plan_instance_id: previousPlanInstanceId,
      to_plan_instance_id: newId,
      reason: "manual_regen",
      payload: { source: "adapt_recovery_v1" },
    });
    if (evErr) {
      console.error("[plan/adapt] plan_adaptation_events", evErr);
    }
  }

  return NextResponse.json({
    ok: true,
    weeks,
    fingerprint,
    planInstanceId: newId,
    clientSyncId: syncId,
  });
}
