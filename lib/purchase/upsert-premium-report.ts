import type { PurchaseProductKey } from "@/lib/future/cloud-types";
import { createAdminSupabase } from "@/lib/supabase/admin-client";
import type { ReportSnapshotV1 } from "@/lib/purchase/report-snapshot-types";
import { buildPremiumReportJsonV1 } from "@/lib/purchase/premium-report-json";

/**
 * Upsert idempotent dans `public.premium_reports` après un achat payé.
 * Sans snapshot (checkout sans body profil/perfs), on n’écrit rien — le rapport
 * reste recalculé côté client / localStorage.
 */
export async function upsertPremiumReportFromPurchase(
  stripeCheckoutSessionId: string,
  productKey: PurchaseProductKey,
  snapshot: ReportSnapshotV1 | null | undefined,
): Promise<{ ok: boolean; skipped: boolean; error?: string }> {
  const supabase = createAdminSupabase();
  if (!supabase) return { ok: true, skipped: true };
  if (!snapshot) return { ok: true, skipped: true };

  const report_json = buildPremiumReportJsonV1(productKey, snapshot);
  const updated_at = new Date().toISOString();

  const { error } = await supabase.from("premium_reports").upsert(
    {
      stripe_checkout_session_id: stripeCheckoutSessionId,
      product_key: productKey,
      status: "ready",
      report_json,
      pdf_url: null,
      updated_at,
    },
    { onConflict: "stripe_checkout_session_id" },
  );

  if (error) {
    console.error("[premium_reports upsert]", error.message);
    return { ok: false, skipped: false, error: error.message };
  }
  return { ok: true, skipped: false };
}
