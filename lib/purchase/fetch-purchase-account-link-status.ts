import { createAdminSupabase } from "@/lib/supabase/admin-client";

export type PurchaseAccountLinkStatus =
  | { kind: "unavailable" }
  | { kind: "no_row" }
  | { kind: "linked" }
  | { kind: "linkable" };

/**
 * Indique si `purchases.user_id` est déjà renseigné (pour masquer le CTA liaison).
 */
export async function fetchPurchaseAccountLinkStatus(
  stripeCheckoutSessionId: string,
): Promise<PurchaseAccountLinkStatus> {
  const admin = createAdminSupabase();
  if (!admin) return { kind: "unavailable" };

  const { data, error } = await admin
    .from("purchases")
    .select("user_id")
    .eq("stripe_checkout_session_id", stripeCheckoutSessionId)
    .maybeSingle();

  if (error) return { kind: "unavailable" };
  if (!data) return { kind: "no_row" };

  const uid = data.user_id;
  if (typeof uid === "string" && uid.trim().length > 0) return { kind: "linked" };
  return { kind: "linkable" };
}
