import { NextResponse } from "next/server";
import { createAdminSupabase } from "@/lib/supabase/admin-client";
import { getUserIdFromSupabaseAccessToken } from "@/lib/supabase/verify-access-token";
import { isUuid } from "@/lib/uuid";

export const runtime = "nodejs";

async function userIdFromBearer(req: Request): Promise<string | null> {
  const h = req.headers.get("authorization");
  if (!h?.toLowerCase().startsWith("bearer ")) return null;
  const jwt = h.slice(7).trim();
  if (!jwt) return null;
  return getUserIdFromSupabaseAccessToken(jwt);
}

export async function PATCH(
  req: Request,
  ctx: { params: Promise<{ id: string }> },
) {
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

  const { id } = await ctx.params;
  if (!isUuid(id)) {
    return NextResponse.json({ ok: false, error: "invalid_id" }, { status: 400 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  const action =
    body && typeof body === "object" && "action" in body
      ? (body as { action?: unknown }).action
      : undefined;
  if (action !== "cancel") {
    return NextResponse.json({ ok: false, error: "unsupported_action" }, { status: 400 });
  }

  const now = new Date().toISOString();
  const { data, error } = await supabase
    .from("retest_reminders")
    .update({ cancelled_at: now })
    .eq("id", id)
    .eq("user_id", userId)
    .is("sent_at", null)
    .is("cancelled_at", null)
    .select("id")
    .maybeSingle();

  if (error) {
    console.error("[retest-reminders PATCH]", error);
    return NextResponse.json(
      { ok: false, error: "update_failed", message: error.message },
      { status: 500 },
    );
  }

  if (!data) {
    return NextResponse.json(
      { ok: false, error: "not_found_or_not_cancellable" },
      { status: 409 },
    );
  }

  return NextResponse.json({ ok: true });
}
