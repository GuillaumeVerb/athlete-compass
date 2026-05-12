import { z } from "zod";
import { appBaseUrl, isStripeCheckoutConfigured } from "@/lib/env/cloud-ready";
import { insertPendingCheckoutSnapshot } from "@/lib/purchase/checkout-snapshot-db";
import type { PurchaseProductKey } from "@/lib/future/cloud-types";
import { checkoutSnapshotBodySchema } from "@/lib/purchase/snapshot-schema";
import type { ReportSnapshotV1 } from "@/lib/purchase/report-snapshot-types";
import { computeScoreResult } from "@/lib/scoring";
import { createAdminSupabase } from "@/lib/supabase/admin-client";
import { getStripe } from "@/lib/stripe/server";
import { getSupabaseUserFromAccessToken } from "@/lib/supabase/verify-access-token";

export const runtime = "nodejs";

const bodySchema = z.object({
  productKey: z.enum(["bilan_9", "plan_19", "pack_29"]),
  snapshot: checkoutSnapshotBodySchema.optional(),
  /** Si session Supabase active : relié à l’achat (`metadata` Stripe → `purchases.user_id`). */
  supabaseAccessToken: z.string().min(1).optional(),
});

const PRICE_ENV_KEY: Record<PurchaseProductKey, string> = {
  bilan_9: "STRIPE_PRICE_BILAN_9",
  plan_19: "STRIPE_PRICE_PLAN_19",
  pack_29: "STRIPE_PRICE_PACK_29",
};

/**
 * POST JSON `{ "productKey", "snapshot"?, "supabaseAccessToken"? }`
 * → session Stripe ; si Supabase + snapshot valides, `snapshot_id` en metadata.
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

  const { productKey, snapshot: snapshotBody, supabaseAccessToken } = parsed.data;
  const envKey = PRICE_ENV_KEY[productKey];
  const priceId = process.env[envKey]?.trim();
  if (!priceId) {
    return Response.json(
      { error: "missing_price", env: envKey },
      { status: 500 },
    );
  }

  const base = appBaseUrl();

  const metadata: Record<string, string> = { productKey };

  if (supabaseAccessToken) {
    const user = await getSupabaseUserFromAccessToken(supabaseAccessToken);
    if (user?.id) metadata.supabase_user_id = user.id;
  }

  const admin = createAdminSupabase();
  if (snapshotBody && admin) {
    const result = computeScoreResult(
      snapshotBody.profile,
      snapshotBody.performance,
    );
    const payload: ReportSnapshotV1 = {
      version: 1,
      profile: snapshotBody.profile,
      performance: snapshotBody.performance,
      result,
      savedAt: new Date().toISOString(),
    };
    const snapshotId = await insertPendingCheckoutSnapshot(payload);
    if (snapshotId) {
      metadata.snapshot_id = snapshotId;
    }
  }

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    locale: "fr",
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${base}/api/purchase/complete?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${base}/pricing?checkout=cancel`,
    billing_address_collection: "auto",
    metadata,
  });

  if (!session.url) {
    return Response.json({ error: "no_checkout_url" }, { status: 500 });
  }

  return Response.json({ url: session.url, sessionId: session.id });
}
