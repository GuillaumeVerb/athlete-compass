import type { PurchaseProductKey } from "@/lib/future/cloud-types";

export function productKeyLabelFr(k: PurchaseProductKey): string {
  switch (k) {
    case "bilan_9":
      return "Bilan complet";
    case "plan_19":
      return "Plan 4 semaines";
    case "pack_29":
      return "Pack complet";
    default: {
      const _x: never = k;
      return _x;
    }
  }
}
