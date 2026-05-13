import type { PurchaseProductKey } from "@/lib/future/cloud-types";
import { createAdminSupabase } from "@/lib/supabase/admin-client";

export type PurchaseReceiptLine = {
  createdAt: string;
  amountCents: number;
  currency: string;
  productKey: PurchaseProductKey;
};

const KEYS = new Set<PurchaseProductKey>(["bilan_9", "plan_19", "pack_29"]);

/**
 * Ligne « dernier achat » pour l’écran rapport (historique minimal V2).
 * Retourne null si pas d’admin Supabase ou pas de ligne `paid` pour cette session.
 */
export async function fetchPurchaseReceiptLine(
  stripeCheckoutSessionId: string,
): Promise<PurchaseReceiptLine | null> {
  const s = createAdminSupabase();
  if (!s) return null;
  const { data, error } = await s
    .from("purchases")
    .select("created_at, amount_cents, currency, product_key")
    .eq("stripe_checkout_session_id", stripeCheckoutSessionId)
    .eq("status", "paid")
    .maybeSingle();
  if (error || !data) return null;
  const pk = data.product_key as string;
  if (!KEYS.has(pk as PurchaseProductKey)) return null;
  return {
    createdAt: String(data.created_at),
    amountCents: Number(data.amount_cents) || 0,
    currency: String(data.currency || "eur"),
    productKey: pk as PurchaseProductKey,
  };
}
