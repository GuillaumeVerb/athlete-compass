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

export function bearerMatchesPurchase(args: {
  jwtUserId: string;
  jwtEmail: string | null | undefined;
  purchaseUserId: string | null | undefined;
  purchaseEmail: string | null | undefined;
}): boolean {
  const uid = args.jwtUserId.trim();
  if (!uid) return false;
  const puid =
    typeof args.purchaseUserId === "string" && args.purchaseUserId.trim().length > 0
      ? args.purchaseUserId.trim()
      : null;
  if (puid) return puid === uid;

  const e = normalizeEmailForPurchase(args.jwtEmail);
  const pe = normalizeEmailForPurchase(args.purchaseEmail);
  return Boolean(e && pe && e === pe);
}

/**
 * Accès PDF sans cookie : JWT Supabase + `session_id` = id session Checkout Stripe.
 * Autorisé si `purchases.user_id` correspond à l’utilisateur du JWT ; si `user_id` est absent en base, repli sur égalité des emails.
 */
export async function resolvePdfPurchaseForBearer(args: {
  stripeCheckoutSessionId: string;
  userId: string;
  email: string | null | undefined;
}): Promise<{ ok: true; productKey: PurchaseProductKey } | { ok: false }> {
  if (!args.userId.trim()) return { ok: false };

  const admin = createAdminSupabase();
  if (!admin) return { ok: false };

  const { data, error } = await admin
    .from("purchases")
    .select("status, customer_email, product_key, user_id")
    .eq("stripe_checkout_session_id", args.stripeCheckoutSessionId)
    .maybeSingle();

  if (error || !data) return { ok: false };
  if (data.status !== "paid") return { ok: false };

  if (
    !bearerMatchesPurchase({
      jwtUserId: args.userId,
      jwtEmail: args.email,
      purchaseUserId: data.user_id as string | null | undefined,
      purchaseEmail: data.customer_email as string | null,
    })
  ) {
    return { ok: false };
  }

  const pk = data.product_key;
  if (pk !== "bilan_9" && pk !== "plan_19" && pk !== "pack_29") return { ok: false };

  return { ok: true, productKey: pk };
}
