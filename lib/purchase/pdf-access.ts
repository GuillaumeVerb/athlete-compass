import type { PurchaseProductKey } from "@/lib/future/cloud-types";
import { createAdminSupabase } from "@/lib/supabase/admin-client";

export function normalizeEmailForPurchase(e: string | null | undefined): string | null {
  if (!e || typeof e !== "string") return null;
  const t = e.trim().toLowerCase();
  return t.length ? t : null;
}

/**
 * Si une ligne `purchases` existe pour cette session, elle doit être `paid`
 * (sinon remboursement / annulation).
 * Absence de ligne : on ne bloque pas (cookie encore valide, synchro DB en cours).
 */
export async function gatePaidPurchaseForPdf(
  stripeCheckoutSessionId: string,
): Promise<"allow" | "deny_revoked" | "skip"> {
  const admin = createAdminSupabase();
  if (!admin) return "skip";

  const { data, error } = await admin
    .from("purchases")
    .select("status")
    .eq("stripe_checkout_session_id", stripeCheckoutSessionId)
    .maybeSingle();

  if (error) return "skip";
  if (!data) return "allow";
  return data.status === "paid" ? "allow" : "deny_revoked";
}

/**
 * Accès PDF sans cookie : JWT Supabase + `session_id` = id session Checkout Stripe,
 * avec égalité stricte (normalisée) entre email JWT et `purchases.customer_email`.
 */
export async function resolvePdfPurchaseForBearer(args: {
  stripeCheckoutSessionId: string;
  email: string | null | undefined;
}): Promise<{ ok: true; productKey: PurchaseProductKey } | { ok: false }> {
  const e = normalizeEmailForPurchase(args.email);
  if (!e) return { ok: false };

  const admin = createAdminSupabase();
  if (!admin) return { ok: false };

  const { data, error } = await admin
    .from("purchases")
    .select("status, customer_email, product_key")
    .eq("stripe_checkout_session_id", args.stripeCheckoutSessionId)
    .maybeSingle();

  if (error || !data) return { ok: false };
  if (data.status !== "paid") return { ok: false };

  const pe = normalizeEmailForPurchase(data.customer_email as string | null);
  if (!pe || pe !== e) return { ok: false };

  const pk = data.product_key;
  if (pk !== "bilan_9" && pk !== "plan_19" && pk !== "pack_29") return { ok: false };

  return { ok: true, productKey: pk };
}
