import { createAdminSupabase } from "@/lib/supabase/admin-client";
import type { ReportSnapshotV1 } from "@/lib/purchase/report-snapshot-types";

export async function fetchPurchaseReportSnapshot(
  stripeCheckoutSessionId: string,
): Promise<ReportSnapshotV1 | null> {
  const s = createAdminSupabase();
  if (!s) return null;
  const { data, error } = await s
    .from("purchases")
    .select("report_snapshot")
    .eq("stripe_checkout_session_id", stripeCheckoutSessionId)
    .eq("status", "paid")
    .maybeSingle();
  if (error || !data?.report_snapshot) return null;
  const snap = data.report_snapshot as ReportSnapshotV1;
  if (snap.version !== 1) return null;
  return snap;
}
