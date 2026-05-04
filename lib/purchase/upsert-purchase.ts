import type Stripe from "stripe";
import { createAdminSupabase } from "@/lib/supabase/admin-client";
import { takePendingCheckoutSnapshot } from "@/lib/purchase/checkout-snapshot-db";
import { purchaseInsertFromSession } from "@/lib/purchase/purchase-insert";
import type { ReportSnapshotV1 } from "@/lib/purchase/report-snapshot-types";

type PurchaseRow = ReturnType<typeof purchaseInsertFromSession> & {
  report_snapshot?: ReportSnapshotV1;
};

/**
 * Upsert idempotent dans `public.purchases` si Supabase admin est configuré.
 * Récupère un snapshot en attente via `metadata.snapshot_id` (Stripe) sans
 * écraser un `report_snapshot` déjà persisté si l’événement est rejoué.
 */
export async function upsertPurchaseRow(
  session: Stripe.Checkout.Session,
): Promise<{ ok: boolean; skippedNoDb: boolean; error?: string }> {
  const base = purchaseInsertFromSession(session);
  if (!base) return { ok: false, skippedNoDb: false, error: "metadata_invalid" };

  const supabase = createAdminSupabase();
  if (!supabase) return { ok: true, skippedNoDb: true };

  const snapshotId = session.metadata?.snapshot_id;
  let incoming: ReportSnapshotV1 | null = null;
  if (snapshotId && typeof snapshotId === "string") {
    incoming = await takePendingCheckoutSnapshot(snapshotId);
  }

  const { data: existing } = await supabase
    .from("purchases")
    .select("report_snapshot")
    .eq("stripe_checkout_session_id", base.stripe_checkout_session_id)
    .maybeSingle();

  const existingSnap = existing?.report_snapshot as ReportSnapshotV1 | null | undefined;
  const reportSnapshot = incoming ?? existingSnap ?? undefined;

  const row: PurchaseRow = { ...base };
  if (reportSnapshot) row.report_snapshot = reportSnapshot;

  const { error } = await supabase.from("purchases").upsert(row, {
    onConflict: "stripe_checkout_session_id",
  });
  if (error) {
    console.error("[purchases upsert]", error.message);
    return { ok: false, skippedNoDb: false, error: error.message };
  }
  return { ok: true, skippedNoDb: false };
}
