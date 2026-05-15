import type { PurchaseProductKey } from "@/lib/future/cloud-types";

/** Parse `purchases(product_key)` depuis une ligne Supabase embed. */
export function purchaseProductKeyFromEmbed(purchases: unknown): PurchaseProductKey | null {
  if (!purchases || typeof purchases !== "object") return null;
  const pk = (purchases as { product_key?: unknown }).product_key;
  if (pk === "bilan_9" || pk === "plan_19" || pk === "pack_29") return pk;
  return null;
}
