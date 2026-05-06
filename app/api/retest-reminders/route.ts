import { NextResponse } from "next/server";
import { createRetestReminderBodySchema } from "@/lib/assessments/retest-reminder-schema";
import { createAdminSupabase } from "@/lib/supabase/admin-client";
import { getUserIdFromSupabaseAccessToken } from "@/lib/supabase/verify-access-token";

export const runtime = "nodejs";

async function userIdFromBearer(req: Request): Promise<string | null> {
  const h = req.headers.get("authorization");
  if (!h?.toLowerCase().startsWith("bearer ")) return null;
  const jwt = h.slice(7).trim();
  if (!jwt) return null;
  return getUserIdFromSupabaseAccessToken(jwt);
}

function mapRow(row: Record<string, unknown>) {
  return {
    id: row.id as string,
    createdAt: row.created_at as string,
    anchorAssessmentId: row.anchor_assessment_id as string,
    dueAt: row.due_at as string,
    channel: row.channel as string,
    sentAt: (row.sent_at as string | null) ?? null,
    cancelledAt: (row.cancelled_at as string | null) ?? null,
  };
}

export async function GET(req: Request) {
  const supabase = createAdminSupabase();
  if (!supabase) {
    return NextResponse.json(
      { ok: false, skipped: true, items: [] },
      { status: 200 },
    );
  }

  const userId = await userIdFromBearer(req);
  if (!userId) {
    return NextResponse.json(
      { ok: false, error: "auth_required" },
      { status: 401 },
    );
  }

  const { data, error } = await supabase
    .from("retest_reminders")
    .select(
      "id, created_at, anchor_assessment_id, due_at, channel, sent_at, cancelled_at",
    )
    .eq("user_id", userId)
    .order("due_at", { ascending: true })
    .limit(50);

  if (error) {
    console.error("[retest-reminders GET]", error);
    return NextResponse.json(
      { ok: false, error: "query_failed", message: error.message },
      { status: 500 },
    );
  }

  return NextResponse.json({
    ok: true,
    items: (data ?? []).map((r) => mapRow(r as Record<string, unknown>)),
  });
}

export async function POST(req: Request) {
  const supabase = createAdminSupabase();
  if (!supabase) {
    return NextResponse.json(
      { ok: false, skipped: true, reason: "supabase_admin_not_configured" },
      { status: 200 },
    );
  }

  const userId = await userIdFromBearer(req);
  if (!userId) {
    return NextResponse.json(
      { ok: false, error: "auth_required" },
      { status: 401 },
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  const parsed = createRetestReminderBodySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      {
        ok: false,
        error: "invalid_body",
        issues: parsed.error.flatten().fieldErrors,
      },
      { status: 400 },
    );
  }

  const { anchorAssessmentId, dueInDays } = parsed.data;

  const { data: anchor, error: anchorErr } = await supabase
    .from("assessments")
    .select("id")
    .eq("id", anchorAssessmentId)
    .eq("user_id", userId)
    .maybeSingle();

  if (anchorErr || !anchor) {
    return NextResponse.json(
      { ok: false, error: "anchor_assessment_not_found" },
      { status: 400 },
    );
  }

  const dueAt = new Date(Date.now() + dueInDays * 86_400_000).toISOString();

  const { data: inserted, error: insErr } = await supabase
    .from("retest_reminders")
    .insert({
      user_id: userId,
      anchor_assessment_id: anchorAssessmentId,
      due_at: dueAt,
      channel: "email",
    })
    .select("id, due_at")
    .single();

  if (insErr || !inserted) {
    console.error("[retest-reminders POST]", insErr);
    return NextResponse.json(
      { ok: false, error: "insert_failed", message: insErr?.message },
      { status: 500 },
    );
  }

  return NextResponse.json({
    ok: true,
    id: inserted.id as string,
    dueAt: inserted.due_at as string,
  });
}
