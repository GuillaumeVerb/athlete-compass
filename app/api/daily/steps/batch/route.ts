import { NextResponse } from "next/server";
import { postDailyStepsBatchBodySchema } from "@/lib/daily/daily-steps-batch-schema";
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

  const parsed = postDailyStepsBatchBodySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: "validation_error", issues: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const now = new Date().toISOString();
  const payload = parsed.data.rows.map((row) => ({
    user_id: userId,
    day: row.day,
    steps: row.steps,
    steps_goal: row.stepsGoal,
    updated_at: now,
  }));

  const { error } = await supabase.from("daily_steps").upsert(payload, { onConflict: "user_id,day" });

  if (error) {
    console.error("[daily/steps/batch]", error);
    return NextResponse.json(
      { ok: false, error: "upsert_failed", message: error.message },
      { status: 500 },
    );
  }

  return NextResponse.json({ ok: true, count: payload.length });
}
