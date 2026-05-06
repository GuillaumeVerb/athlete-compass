import { NextResponse } from "next/server";
import { isUuid } from "@/lib/uuid";
import { qualityLabelFr, scoreToQuality } from "@/lib/scoring/utils";
import { createAdminSupabase } from "@/lib/supabase/admin-client";
import { getUserIdFromSupabaseAccessToken } from "@/lib/supabase/verify-access-token";
import type { NextBestMovePlan, PerformanceInput, ScoreBreakdown, UserProfile } from "@/lib/types";

export const runtime = "nodejs";

async function userIdFromBearer(req: Request): Promise<string | null> {
  const h = req.headers.get("authorization");
  if (!h?.toLowerCase().startsWith("bearer ")) return null;
  const jwt = h.slice(7).trim();
  if (!jwt) return null;
  return getUserIdFromSupabaseAccessToken(jwt);
}

export async function GET(
  _req: Request,
  context: { params: Promise<{ id: string }> },
) {
  const { id: rawId } = await context.params;
  const id = rawId?.trim() ?? "";
  if (!isUuid(id)) {
    return NextResponse.json({ ok: false, error: "invalid_id" }, { status: 400 });
  }

  const supabase = createAdminSupabase();
  if (!supabase) {
    return NextResponse.json(
      { ok: false, skipped: true, error: "supabase_admin_not_configured" },
      { status: 200 },
    );
  }

  const userId = await userIdFromBearer(_req);
  if (!userId) {
    return NextResponse.json({ ok: false, error: "auth_required" }, { status: 401 });
  }

  const { data, error } = await supabase
    .from("assessments")
    .select(
      "id, created_at, hybrid_score, athletic_age, reliability_pct, profile_label, profile_key, limiter, next_best_move, breakdown, goals_4_weeks, performance_snapshot, profile_snapshot, source, previous_assessment_id",
    )
    .eq("id", id)
    .eq("user_id", userId)
    .maybeSingle();

  if (error) {
    console.error("[assessments/[id] GET]", error);
    return NextResponse.json(
      { ok: false, error: "query_failed", message: error.message },
      { status: 500 },
    );
  }

  if (!data) {
    return NextResponse.json({ ok: false, error: "not_found" }, { status: 404 });
  }

  const hybridScore = Number(data.hybrid_score);
  const q = scoreToQuality(hybridScore);

  return NextResponse.json({
    ok: true,
    assessment: {
      id: data.id as string,
      createdAt: data.created_at as string,
      hybridScore,
      hybridLabel: qualityLabelFr(q),
      athleticAge: Number(data.athletic_age),
      reliabilityPct: Number(data.reliability_pct),
      profileLabel: data.profile_label as string,
      profileKey: data.profile_key as string,
      limiter: data.limiter as string,
      nextBestMovePlan: data.next_best_move as NextBestMovePlan,
      breakdown: data.breakdown as ScoreBreakdown,
      goals4Weeks: data.goals_4_weeks as string[],
      performanceSnapshot: data.performance_snapshot as PerformanceInput,
      profileSnapshot: data.profile_snapshot as UserProfile,
      source: (data.source as string) ?? "manual",
      previousAssessmentId:
        (data.previous_assessment_id as string | null) ?? null,
    },
  });
}
