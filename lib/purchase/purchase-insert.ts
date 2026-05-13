import type Stripe from "stripe";
import { z } from "zod";
import type { PurchaseProductKey } from "@/lib/future/cloud-types";

const metaSchema = z
  .object({
    productKey: z.enum(["bilan_9", "plan_19", "pack_29"]),
    supabase_user_id: z.string().optional(),
  })
  .transform((o) => {
    const raw = o.supabase_user_id?.trim();
    const uuidOk = Boolean(raw && z.string().uuid().safeParse(raw).success);
    return {
      productKey: o.productKey,
      supabase_user_id: uuidOk ? raw : undefined,
    };
  });

export type PurchaseInsert = {
  stripe_checkout_session_id: string;
  stripe_payment_intent_id: string | null;
  stripe_customer_id: string | null;
  product_key: PurchaseProductKey;
  amount_cents: number;
  currency: string;
  status: "paid";
  customer_email: string | null;
  user_id: string | null;
};

/** Extrait `cus_…` depuis une session Checkout Stripe (string ou objet développé). */
export function stripeCustomerIdFromCheckoutSession(
  session: Stripe.Checkout.Session,
): string | null {
  const c = session.customer;
  if (typeof c === "string" && c.startsWith("cus_")) return c;
  if (c && typeof c === "object" && "id" in c) {
    const id = String((c as { id: unknown }).id);
    return id.startsWith("cus_") ? id : null;
  }
  return null;
}

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
    stripe_customer_id: stripeCustomerIdFromCheckoutSession(session),
    product_key: meta.data.productKey,
    amount_cents: session.amount_total ?? 0,
    currency: (session.currency ?? "eur").toLowerCase(),
    status: "paid",
    customer_email:
      session.customer_details?.email ?? session.customer_email ?? null,
    user_id: meta.data.supabase_user_id ?? null,
  };
}
