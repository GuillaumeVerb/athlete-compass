import { NextResponse } from "next/server";
import { findRecentAssessmentDuplicate } from "@/lib/assessments/recent-assessment-dedupe";
import { createAssessmentBodySchema } from "@/lib/assessments/create-assessment-schema";
import { purchaseProductKeyFromEmbed } from "@/lib/purchase/purchase-product-key-from-embed";
import { resolvePurchaseIdForCloudAssessment } from "@/lib/purchase/resolve-purchase-id-for-cloud-assessment";
import { computeScoreResult } from "@/lib/scoring";
import { createAdminSupabase } from "@/lib/supabase/admin-client";
import { getSupabaseUserFromAccessToken } from "@/lib/supabase/verify-access-token";

export const runtime = "nodejs";

async function authUserFromBearer(
  req: Request,
): Promise<{ id: string; email: string | null } | null> {
  const h = req.headers.get("authorization");
  if (!h?.toLowerCase().startsWith("bearer ")) return null;
  const jwt = h.slice(7).trim();
  if (!jwt) return null;
  return getSupabaseUserFromAccessToken(jwt);
}

export async function GET(req: Request) {
  const supabase = createAdminSupabase();
  if (!supabase) {
    return NextResponse.json(
      { ok: false, skipped: true, items: [] },
      { status: 200 },
    );
  }

  const auth = await authUserFromBearer(req);
  if (!auth) {
    return NextResponse.json(
      { ok: false, error: "auth_required" },
      { status: 401 },
    );
  }

  const { searchParams } = new URL(req.url);
  const limitRaw = searchParams.get("limit");
  const limit = Math.min(50, Math.max(1, Number(limitRaw) || 20));

  const { data, error } = await supabase
    .from("assessments")
    .select(
      "id, created_at, hybrid_score, athletic_age, reliability_pct, profile_label, limiter, source, previous_assessment_id, purchase_id, purchases(product_key)",
    )
    .eq("user_id", auth.id)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("[assessments GET]", error);
    return NextResponse.json(
      { ok: false, error: "query_failed", message: error.message },
      { status: 500 },
    );
  }

  return NextResponse.json({
    ok: true,
    items: (data ?? []).map((row) => ({
      id: row.id as string,
      createdAt: row.created_at as string,
      hybridScore: Number(row.hybrid_score),
      athleticAge: Number(row.athletic_age),
      reliabilityPct: Number(row.reliability_pct),
      profileLabel: row.profile_label as string,
      limiter: row.limiter as string,
      source: (row.source as string) ?? "manual",
      previousAssessmentId:
        (row.previous_assessment_id as string | null) ?? null,
      purchaseProductKey: purchaseProductKeyFromEmbed(
        (row as { purchases?: unknown }).purchases,
      ),
    })),
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

  const auth = await authUserFromBearer(req);
  if (!auth) {
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

  const parsed = createAssessmentBodySchema.safeParse(body);
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

  const { profile, performance, source, previousAssessmentId } = parsed.data;

  if (previousAssessmentId) {
    const { data: prev, error: prevErr } = await supabase
      .from("assessments")
      .select("id")
      .eq("id", previousAssessmentId)
      .eq("user_id", auth.id)
      .maybeSingle();

    if (prevErr || !prev) {
      return NextResponse.json(
        { ok: false, error: "previous_assessment_not_found" },
        { status: 400 },
      );
    }
  }

  const result = computeScoreResult(profile, performance);

  const duplicate = await findRecentAssessmentDuplicate({
    supabase,
    userId: auth.id,
    hybridScore: result.hybridScore,
    athleticAge: result.athleticAge,
    reliabilityPct: result.reliabilityPct,
  });
  if (duplicate) {
    return NextResponse.json({
      ok: true,
      deduplicated: true,
      id: duplicate.id,
      createdAt: duplicate.createdAt,
      hybridScore: result.hybridScore,
      athleticAge: result.athleticAge,
      reliabilityPct: result.reliabilityPct,
      profileLabel: result.profileLabel,
      profileKey: result.profileId,
      limiter: result.limiter,
    });
  }

  const purchaseId = await resolvePurchaseIdForCloudAssessment({
    supabase,
    jwtUserId: auth.id,
    jwtEmail: auth.email,
  });

  const { data: inserted, error: insertErr } = await supabase
    .from("assessments")
    .insert({
      user_id: auth.id,
      purchase_id: purchaseId,
      hybrid_score: result.hybridScore,
      athletic_age: result.athleticAge,
      reliability_pct: result.reliabilityPct,
      profile_label: result.profileLabel,
      profile_key: result.profileId,
      limiter: result.limiter,
      next_best_move: result.nextBestMovePlan,
      breakdown: result.breakdown,
      goals_4_weeks: result.goals4Weeks,
      performance_snapshot: performance,
      profile_snapshot: profile,
      source: source ?? "manual",
      previous_assessment_id: previousAssessmentId ?? null,
    })
    .select("id, created_at")
    .single();

  if (insertErr || !inserted) {
    console.error("[assessments POST]", insertErr);
    return NextResponse.json(
      {
        ok: false,
        error: "insert_failed",
        message: insertErr?.message ?? "unknown",
      },
      { status: 500 },
    );
  }

  return NextResponse.json({
    ok: true,
    id: inserted.id as string,
    createdAt: inserted.created_at as string,
    hybridScore: result.hybridScore,
    athleticAge: result.athleticAge,
    reliabilityPct: result.reliabilityPct,
    profileLabel: result.profileLabel,
    profileKey: result.profileId,
    limiter: result.limiter,
  });
}
