import { NextResponse } from "next/server";
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
