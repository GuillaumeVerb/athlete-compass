import { NextResponse } from "next/server";
import { createAdminSupabase } from "@/lib/supabase/admin-client";
import { getUserIdFromSupabaseAccessToken } from "@/lib/supabase/verify-access-token";
import { isUuid } from "@/lib/uuid";

export async function GET(req: Request) {
  const supabase = createAdminSupabase();
  if (!supabase) {
    return NextResponse.json(
      { ok: false, skipped: true, items: [] },
      { status: 200 },
    );
  }

  const { searchParams } = new URL(req.url);
  const syncRaw = searchParams.get("sync");
  const sync = syncRaw && isUuid(syncRaw) ? syncRaw.trim() : null;

  const limitRaw = searchParams.get("limit");
  const limit = Math.min(50, Math.max(1, Number(limitRaw) || 20));

  const authHeader = req.headers.get("authorization");
  let userId: string | null = null;
  if (authHeader?.toLowerCase().startsWith("bearer ")) {
    const jwt = authHeader.slice(7).trim();
    if (jwt) {
      userId = await getUserIdFromSupabaseAccessToken(jwt);
    }
  }

  let query = supabase
    .from("plan_instances")
    .select("id, created_at, fingerprint, user_id, client_sync_id, purchase_id")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (userId) {
    if (sync) {
      query = query.or(
        `user_id.eq."${userId}",client_sync_id.eq."${sync}"`,
      );
    } else {
      query = query.eq("user_id", userId);
    }
  } else {
    if (!sync) {
      return NextResponse.json(
        { ok: false, error: "sync_or_auth_required" },
        { status: 401 },
      );
    }
    query = query.eq("client_sync_id", sync);
  }

  const { data, error } = await query;

  if (error) {
    console.error("[plan/history]", error);
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
      fingerprint: row.fingerprint as string,
      userId: (row.user_id as string | null) ?? null,
      clientSyncId: (row.client_sync_id as string | null) ?? null,
      purchaseId: (row.purchase_id as string | null) ?? null,
    })),
  });
}
