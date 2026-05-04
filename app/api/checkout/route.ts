import { z } from "zod";
import { appBaseUrl, isStripeCheckoutConfigured } from "@/lib/env/cloud-ready";
import type { PurchaseProductKey } from "@/lib/future/cloud-types";
import { getStripe } from "@/lib/stripe/server";

export const runtime = "nodejs";

const bodySchema = z.object({
  productKey: z.enum(["bilan_9", "plan_19", "pack_29"]),
});

const PRICE_ENV_KEY: Record<PurchaseProductKey, string> = {
  bilan_9: "STRIPE_PRICE_BILAN_9",
  plan_19: "STRIPE_PRICE_PLAN_19",
  pack_29: "STRIPE_PRICE_PACK_29",
};

/**
 * POST JSON `{ "productKey": "bilan_9" | "plan_19" | "pack_29" }`
 * → `{ "url": "https://checkout.stripe.com/..." }` si Stripe + Price IDs sont configurés.
 * Sinon 503 (V1 inchangée côté UI).
 */
export async function POST(req: Request) {
  if (!isStripeCheckoutConfigured()) {
    return Response.json(
      {
        error: "checkout_disabled",
        message:
          "Configure STRIPE_SECRET_KEY et STRIPE_PRICE_* (voir docs/V2_SETUP.md).",
      },
      { status: 503 },
    );
  }

  const stripe = getStripe();
  if (!stripe) {
    return Response.json({ error: "stripe_unavailable" }, { status: 503 });
  }

  let json: unknown;
  try {
    json = await req.json();
  } catch {
    return Response.json({ error: "invalid_json" }, { status: 400 });
  }

  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    return Response.json(
      { error: "validation", issues: parsed.error.flatten().fieldErrors },
      { status: 400 },
    );
  }

  const { productKey } = parsed.data;
  const envKey = PRICE_ENV_KEY[productKey];
  const priceId = process.env[envKey]?.trim();
  if (!priceId) {
    return Response.json(
      { error: "missing_price", env: envKey },
      { status: 500 },
    );
  }

  const base = appBaseUrl();

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${base}/api/purchase/complete?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${base}/pricing?checkout=cancel`,
    metadata: { productKey },
  });

  if (!session.url) {
    return Response.json({ error: "no_checkout_url" }, { status: 500 });
  }

  return Response.json({ url: session.url, sessionId: session.id });
}
