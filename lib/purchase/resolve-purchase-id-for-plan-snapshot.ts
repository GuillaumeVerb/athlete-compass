import { cookies } from "next/headers";
import type { PurchaseProductKey } from "@/lib/future/cloud-types";
import { createAdminSupabase } from "@/lib/supabase/admin-client";
import {
  REPORT_UNLOCK_COOKIE,
  verifyReportUnlock,
} from "@/lib/purchase/report-unlock-cookie";

function productIncludesPlanSnapshot(key: PurchaseProductKey): boolean {
  return key === "plan_19" || key === "pack_29";
}

/**
 * Si le navigateur a un cookie de déblocage rapport valide pour un achat
 * « plan » ou « pack », retourne l’`id` interne `purchases` pour lier `plan_instances`.
 */
export async function resolvePurchaseIdForPlanSnapshot(): Promise<string | null> {
  const cookieStore = await cookies();
  const raw = cookieStore.get(REPORT_UNLOCK_COOKIE)?.value;
  if (!raw) return null;

  const payload = verifyReportUnlock(raw);
  if (!payload || !productIncludesPlanSnapshot(payload.productKey)) {
    return null;
  }

  const supabase = createAdminSupabase();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("purchases")
    .select("id")
    .eq("stripe_checkout_session_id", payload.sessionId)
    .maybeSingle();

  if (error || !data?.id) return null;
  return data.id as string;
}
