import { createAdminSupabase } from "@/lib/supabase/admin-client";
import { fetchPurchaseReportSnapshot } from "@/lib/purchase/fetch-purchase-snapshot";
import { parsePremiumReportJsonV1 } from "@/lib/purchase/parse-premium-report-json";
import type { ReportSnapshotV1 } from "@/lib/purchase/report-snapshot-types";

/**
 * Bilan serveur pour une session Checkout : d’abord **`premium_reports.report_json`**
 * (canonique), sinon **`purchases.report_snapshot`**.
 */
export async function fetchUnlockReportSnapshot(
  stripeCheckoutSessionId: string,
): Promise<ReportSnapshotV1 | null> {
  const admin = createAdminSupabase();
  if (!admin) {
    return fetchPurchaseReportSnapshot(stripeCheckoutSessionId);
  }

  const { data: pr, error: prErr } = await admin
    .from("premium_reports")
    .select("report_json")
    .eq("stripe_checkout_session_id", stripeCheckoutSessionId)
    .maybeSingle();

  if (!prErr && pr?.report_json) {
    const parsed = parsePremiumReportJsonV1(pr.report_json);
    if (parsed) return parsed.snapshot;
  }

  return fetchPurchaseReportSnapshot(stripeCheckoutSessionId);
}
