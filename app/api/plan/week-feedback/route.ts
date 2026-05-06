import { NextResponse } from "next/server";
import { postPlanWeekFeedbackSchema } from "@/lib/plans/plan-week-feedback-schema";
import { createAdminSupabase } from "@/lib/supabase/admin-client";
import { getUserIdFromSupabaseAccessToken } from "@/lib/supabase/verify-access-token";

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

  const parsed = postPlanWeekFeedbackSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: "validation_error", issues: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const row = parsed.data;
  const { error } = await supabase.from("plan_week_feedback").insert({
    user_id: userId,
    client_sync_id: row.clientSyncId,
    fingerprint: row.fingerprint,
    week_index: row.weekIndex,
    fatigue: row.fatigue,
    sessions_completed: row.sessionsCompleted ?? null,
    note: row.note ?? null,
    plan_instance_id: row.planInstanceId ?? null,
  });

  if (error) {
    console.error("[plan/week-feedback]", error);
    return NextResponse.json(
      { ok: false, error: "insert_failed", message: error.message },
      { status: 500 },
    );
  }

  return NextResponse.json({ ok: true });
}
