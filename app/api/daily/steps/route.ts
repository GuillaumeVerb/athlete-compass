import { NextResponse } from "next/server";
import { clampDailyStepsPullRange } from "@/lib/daily/daily-steps-pull-range";
import { postDailyStepsBodySchema } from "@/lib/daily/daily-steps-post-schema";
import { createAdminSupabase } from "@/lib/supabase/admin-client";
import { getUserIdFromSupabaseAccessToken } from "@/lib/supabase/verify-access-token";

async function userIdFromRequest(req: Request): Promise<string | null> {
  const h = req.headers.get("authorization");
  if (!h?.toLowerCase().startsWith("bearer ")) return null;
  const jwt = h.slice(7).trim();
  if (!jwt) return null;
  return getUserIdFromSupabaseAccessToken(jwt);
}

export async function GET(req: Request) {
  const userId = await userIdFromRequest(req);
  if (!userId) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }

  const supabase = createAdminSupabase();
  if (!supabase) {
    return NextResponse.json(
      { ok: false, skipped: true, reason: "supabase_admin_not_configured", rows: [] },
      { status: 200 },
    );
  }

  const url = new URL(req.url);
  const fromRaw = url.searchParams.get("from");
  const toRaw = url.searchParams.get("to");
  const fallbackTo = new Date().toISOString().slice(0, 10);
  const range = clampDailyStepsPullRange(fromRaw, toRaw, fallbackTo);
  if (!range.ok) {
    return NextResponse.json({ ok: false, error: range.error }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("daily_steps")
    .select("day, steps, steps_goal, updated_at")
    .eq("user_id", userId)
    .gte("day", range.from)
    .lte("day", range.to)
    .order("day", { ascending: true });

  if (error) {
    console.error("[daily/steps GET]", error);
    return NextResponse.json(
      { ok: false, error: "select_failed", message: error.message },
      { status: 500 },
    );
  }

  const rows = (data ?? []).map((r) => ({
    day: r.day as string,
    steps: r.steps as number,
    stepsGoal: r.steps_goal as number,
    updatedAt: r.updated_at as string,
  }));

  return NextResponse.json({ ok: true, rows });
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

  const parsed = postDailyStepsBodySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: "validation_error", issues: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const { day, steps, stepsGoal } = parsed.data;

  const { error } = await supabase.from("daily_steps").upsert(
    {
      user_id: userId,
      day,
      steps,
      steps_goal: stepsGoal,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "user_id,day" },
  );

  if (error) {
    console.error("[daily/steps]", error);
    return NextResponse.json(
      { ok: false, error: "upsert_failed", message: error.message },
      { status: 500 },
    );
  }

  return NextResponse.json({ ok: true });
}
