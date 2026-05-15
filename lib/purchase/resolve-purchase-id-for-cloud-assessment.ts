import { cookies } from "next/headers";
import type { SupabaseClient } from "@supabase/supabase-js";
import { bearerMatchesPurchase } from "@/lib/purchase/pdf-access";
import {
  REPORT_UNLOCK_COOKIE,
  verifyReportUnlock,
} from "@/lib/purchase/report-unlock-cookie";

/**
 * Si le navigateur a un cookie de déblocage rapport valide pour un achat `paid`,
 * et que le JWT correspond à l’achat (`user_id` ou email), retourne `purchases.id`
 * pour lier le bilan cloud.
 */
export async function resolvePurchaseIdForCloudAssessment(args: {
  supabase: SupabaseClient;
  jwtUserId: string;
  jwtEmail: string | null;
}): Promise<string | null> {
  const cookieStore = await cookies();
  const raw = cookieStore.get(REPORT_UNLOCK_COOKIE)?.value;
  const unlock = raw ? verifyReportUnlock(raw) : null;
  if (!unlock) return null;

  const { data: purchase, error } = await args.supabase
    .from("purchases")
    .select("id, user_id, customer_email, status")
    .eq("stripe_checkout_session_id", unlock.sessionId)
    .maybeSingle();

  if (error || !purchase || purchase.status !== "paid") return null;

  if (
    !bearerMatchesPurchase({
      jwtUserId: args.jwtUserId,
      jwtEmail: args.jwtEmail,
      purchaseUserId: purchase.user_id as string | null | undefined,
      purchaseEmail: purchase.customer_email as string | null,
    })
  ) {
    return null;
  }

  return purchase.id as string;
}
