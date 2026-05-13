import { createAdminSupabase } from "@/lib/supabase/admin-client";
import { normalizeEmailForPurchase } from "@/lib/purchase/pdf-access";

export type LinkUserToPurchaseResult =
  | { status: "linked" }
  | { status: "already_linked" }
  | { status: "error"; code: string; http: number };

export type PurchaseRowForUserLink = {
  status: string;
  user_id: string | null;
  customer_email: string | null;
};

/**
 * Règles métier (sans I/O) : peut-on poser `user_id` sur cette ligne ?
 * @internal exporté pour tests Vitest.
 */
export function gatePurchaseUserLink(
  row: PurchaseRowForUserLink | null,
  jwtUserId: string,
  jwtEmail: string | null,
): LinkUserToPurchaseResult | { status: "commit"; userId: string } {
  if (!row) return { status: "error", code: "not_found", http: 404 };
  if (row.status !== "paid") return { status: "error", code: "not_paid", http: 403 };

  const uid = jwtUserId.trim();
  if (!uid) return { status: "error", code: "invalid_input", http: 400 };

  const existing =
    typeof row.user_id === "string" && row.user_id.trim().length > 0
      ? row.user_id.trim()
      : null;
  if (existing) {
    if (existing === uid) return { status: "already_linked" };
    return { status: "error", code: "user_already_set", http: 403 };
  }

  const pe = normalizeEmailForPurchase(row.customer_email);
  const je = normalizeEmailForPurchase(jwtEmail);
  if (!je || !pe || je !== pe) {
    return { status: "error", code: "email_mismatch", http: 403 };
  }

  return { status: "commit", userId: uid };
}

/**
 * Rattache `purchases.user_id` au compte Supabase si l’achat est `paid`, `user_id`
 * encore vide, et l’email facture Stripe = email du JWT (normalisé).
 */
export async function linkSupabaseUserToPaidPurchase(args: {
  stripeCheckoutSessionId: string;
  supabaseUserId: string;
  supabaseUserEmail: string | null;
}): Promise<LinkUserToPurchaseResult> {
  const admin = createAdminSupabase();
  if (!admin) return { status: "error", code: "admin_unavailable", http: 503 };

  const sid = args.stripeCheckoutSessionId.trim();
  if (!sid) return { status: "error", code: "invalid_input", http: 400 };

  const { data: row, error } = await admin
    .from("purchases")
    .select("status, user_id, customer_email")
    .eq("stripe_checkout_session_id", sid)
    .maybeSingle();

  if (error) return { status: "error", code: "db_error", http: 500 };

  const mapped: PurchaseRowForUserLink | null = row
    ? {
        status: String((row as { status: string }).status),
        user_id: ((row as { user_id: unknown }).user_id as string | null) ?? null,
        customer_email: ((row as { customer_email: unknown }).customer_email as string | null) ?? null,
      }
    : null;

  const gated = gatePurchaseUserLink(mapped, args.supabaseUserId, args.supabaseUserEmail);
  if (gated.status !== "commit") return gated;

  const uid = gated.userId;
  const { data: updated, error: upErr } = await admin
    .from("purchases")
    .update({ user_id: uid })
    .eq("stripe_checkout_session_id", sid)
    .eq("status", "paid")
    .is("user_id", null)
    .select("user_id");

  if (upErr) return { status: "error", code: "update_failed", http: 500 };
  if (updated && updated.length > 0) return { status: "linked" };

  const { data: again, error: rErr } = await admin
    .from("purchases")
    .select("user_id")
    .eq("stripe_checkout_session_id", sid)
    .maybeSingle();
  if (rErr) return { status: "error", code: "db_error", http: 500 };
  const u2 =
    typeof again?.user_id === "string" && again.user_id.trim().length > 0
      ? again.user_id.trim()
      : null;
  if (u2 === uid) return { status: "already_linked" };
  return { status: "error", code: "race_or_conflict", http: 409 };
}
