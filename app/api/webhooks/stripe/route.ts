import Stripe from "stripe";
import { upsertPurchaseRow } from "@/lib/purchase/upsert-purchase";
import { getStripe } from "@/lib/stripe/server";

export const runtime = "nodejs";

/**
 * Webhook Stripe — nécessite `STRIPE_WEBHOOK_SECRET` + `STRIPE_SECRET_KEY`.
 * V2 : persister `purchases` / `premium_reports` via `createAdminSupabase()`.
 */
export async function POST(req: Request) {
  const stripe = getStripe();
  const secret = process.env.STRIPE_WEBHOOK_SECRET?.trim();
  if (!stripe || !secret) {
    return Response.json(
      {
        error: "webhook_disabled",
        message:
          "Configure STRIPE_SECRET_KEY et STRIPE_WEBHOOK_SECRET (voir docs/V2_SETUP.md).",
      },
      { status: 503 },
    );
  }

  const rawBody = await req.text();
  const sig = req.headers.get("stripe-signature");
  if (!sig) {
    return Response.json({ error: "missing_signature" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, sig, secret);
  } catch (err) {
    const message = err instanceof Error ? err.message : "invalid_payload";
    return Response.json({ error: "signature_verification_failed", message }, { status: 400 });
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      await upsertPurchaseRow(session);
      break;
    }
    default:
      break;
  }

  return Response.json({ received: true });
}
