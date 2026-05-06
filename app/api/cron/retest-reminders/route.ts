import { NextResponse } from "next/server";
import { sendRetestReminderEmail } from "@/lib/email/send-retest-reminder-email";
import { isResendEmailConfigured } from "@/lib/env/cloud-ready";
import { createAdminSupabase } from "@/lib/supabase/admin-client";

export const runtime = "nodejs";

function authorizeCron(req: Request): boolean {
  const secret = process.env.CRON_SECRET?.trim();
  if (!secret) return false;
  const h = req.headers.get("authorization");
  return h === `Bearer ${secret}`;
}

type ReminderRow = {
  id: string;
  user_id: string;
  anchor_assessment_id: string;
  due_at: string;
};

/**
 * Traite les rappels retest dus (e-mail Resend + `sent_at`).
 * Déclencher via cron hébergeur : `POST /api/cron/retest-reminders` avec
 * `Authorization: Bearer $CRON_SECRET`.
 */
export async function POST(req: Request) {
  if (!authorizeCron(req)) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }

  const supabase = createAdminSupabase();
  if (!supabase) {
    return NextResponse.json(
      { ok: false, error: "supabase_admin_not_configured" },
      { status: 503 },
    );
  }

  if (!isResendEmailConfigured()) {
    return NextResponse.json({
      ok: true,
      processed: 0,
      note: "resend_not_configured",
    });
  }

  const nowIso = new Date().toISOString();
  const { data: rows, error } = await supabase
    .from("retest_reminders")
    .select("id, user_id, anchor_assessment_id, due_at")
    .is("sent_at", null)
    .is("cancelled_at", null)
    .lte("due_at", nowIso)
    .order("due_at", { ascending: true })
    .limit(40);

  if (error) {
    console.error("[cron/retest-reminders]", error);
    return NextResponse.json(
      { ok: false, error: "query_failed", message: error.message },
      { status: 500 },
    );
  }

  const list = (rows ?? []) as ReminderRow[];
  let sent = 0;
  const errors: string[] = [];

  for (const row of list) {
    const { data: userData, error: userErr } = await supabase.auth.admin.getUserById(
      row.user_id,
    );
    if (userErr || !userData?.user?.email) {
      errors.push(`${row.id}:no_email`);
      continue;
    }

    const email = await sendRetestReminderEmail({
      to: userData.user.email,
      anchorAssessmentId: row.anchor_assessment_id,
      reminderId: row.id,
    });

    if (!email.sent && !email.skipped && email.error) {
      errors.push(`${row.id}:${email.error.slice(0, 80)}`);
      continue;
    }

    if (email.skipped && !email.sent) {
      errors.push(`${row.id}:send_skipped`);
      continue;
    }

    const { error: upErr } = await supabase
      .from("retest_reminders")
      .update({ sent_at: new Date().toISOString() })
      .eq("id", row.id)
      .is("sent_at", null)
      .is("cancelled_at", null);

    if (upErr) {
      console.error("[cron/retest-reminders] mark sent", upErr);
      errors.push(`${row.id}:mark_sent_failed`);
      continue;
    }

    sent += 1;
  }

  return NextResponse.json({
    ok: true,
    scanned: list.length,
    sent,
    errors: errors.length > 0 ? errors : undefined,
  });
}

/** Vercel Cron peut appeler GET — même garde que POST. */
export async function GET(req: Request) {
  return POST(req);
}
