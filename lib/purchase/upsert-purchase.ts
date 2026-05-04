import type Stripe from "stripe";
import { createAdminSupabase } from "@/lib/supabase/admin-client";
import { purchaseInsertFromSession } from "@/lib/purchase/purchase-insert";

/**
 * Upsert idempotent dans `public.purchases` si Supabase admin est configuré.
 */
export async function upsertPurchaseRow(
  session: Stripe.Checkout.Session,
): Promise<{ ok: boolean; skippedNoDb: boolean; error?: string }> {
  const supabase = createAdminSupabase();
  const row = purchaseInsertFromSession(session);
  if (!row) return { ok: false, skippedNoDb: false, error: "metadata_invalid" };
  if (!supabase) return { ok: true, skippedNoDb: true };

  const { error } = await supabase.from("purchases").upsert(row, {
    onConflict: "stripe_checkout_session_id",
  });
  if (error) {
    console.error("[purchases upsert]", error.message);
    return { ok: false, skippedNoDb: false, error: error.message };
  }
  return { ok: true, skippedNoDb: false };
}
