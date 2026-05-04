import type Stripe from "stripe";
import { z } from "zod";
import type { PurchaseProductKey } from "@/lib/future/cloud-types";

const metaSchema = z.object({
  productKey: z.enum(["bilan_9", "plan_19", "pack_29"]),
});

export type PurchaseInsert = {
  stripe_checkout_session_id: string;
  stripe_payment_intent_id: string | null;
  product_key: PurchaseProductKey;
  amount_cents: number;
  currency: string;
  status: "paid";
  customer_email: string | null;
};

export function purchaseInsertFromSession(
  session: Stripe.Checkout.Session,
): PurchaseInsert | null {
  const meta = metaSchema.safeParse(session.metadata ?? {});
  if (!meta.success) return null;
  const pi = session.payment_intent;
  const paymentIntentId =
    typeof pi === "string"
      ? pi
      : pi && typeof pi === "object" && "id" in pi
        ? String((pi as { id: string }).id)
        : null;
  return {
    stripe_checkout_session_id: session.id,
    stripe_payment_intent_id: paymentIntentId,
    product_key: meta.data.productKey,
    amount_cents: session.amount_total ?? 0,
    currency: (session.currency ?? "eur").toLowerCase(),
    status: "paid",
    customer_email:
      session.customer_details?.email ?? session.customer_email ?? null,
  };
}
