import { NextResponse } from "next/server";
import { isUuid } from "@/lib/uuid";
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

export async function GET(req: Request) {
  const supabase = createAdminSupabase();
  if (!supabase) {
    return NextResponse.json(
      { ok: false, skipped: true, error: "supabase_admin_not_configured" },
      { status: 200 },
    );
  }

  const userId = await userIdFromBearer(req);
  if (!userId) {
    return NextResponse.json({ ok: false, error: "auth_required" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const from = searchParams.get("from")?.trim() ?? "";
  const to = searchParams.get("to")?.trim() ?? "";
  if (!isUuid(from) || !isUuid(to)) {
    return NextResponse.json({ ok: false, error: "invalid_params" }, { status: 400 });
  }
  if (from === to) {
    return NextResponse.json({ ok: false, error: "same_id" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("assessments")
    .select(
      "id, created_at, hybrid_score, athletic_age, reliability_pct, limiter",
    )
    .in("id", [from, to])
    .eq("user_id", userId);

  if (error) {
    console.error("[assessments/compare GET]", error);
    return NextResponse.json(
      { ok: false, error: "query_failed", message: error.message },
      { status: 500 },
    );
  }

  const rows = data ?? [];
  if (rows.length !== 2) {
    return NextResponse.json(
      { ok: false, error: "not_found_or_forbidden" },
      { status: 404 },
    );
  }

  const sorted = [...rows].sort(
    (a, b) =>
      new Date(a.created_at as string).getTime() -
      new Date(b.created_at as string).getTime(),
  );
  const older = sorted[0]!;
  const newer = sorted[1]!;

  const hybridScoreDelta =
    Number(newer.hybrid_score) - Number(older.hybrid_score);
  const athleticAgeDelta =
    Number(newer.athletic_age) - Number(older.athletic_age);
  const reliabilityPctDelta =
    Number(newer.reliability_pct) - Number(older.reliability_pct);
  const limiterChanged = older.limiter !== newer.limiter;

  return NextResponse.json({
    ok: true,
    delta: {
      hybridScoreDelta,
      athleticAgeDelta,
      reliabilityPctDelta,
      limiterChanged,
      fromAssessmentId: older.id as string,
      toAssessmentId: newer.id as string,
    },
    /** Ordre chronologique (plus ancien → plus récent) pour l’UI. */
    order: {
      olderId: older.id as string,
      newerId: newer.id as string,
    },
  });
}
