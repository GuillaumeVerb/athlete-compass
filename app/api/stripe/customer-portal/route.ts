import { cookies } from "next/headers";
import { z } from "zod";
import { appBaseUrl, isStripeCheckoutConfigured } from "@/lib/env/cloud-ready";
import { gatePaidPurchaseForPdf, resolvePdfPurchaseForBearer } from "@/lib/purchase/pdf-access";
import {
  REPORT_UNLOCK_COOKIE,
  verifyReportUnlock,
} from "@/lib/purchase/report-unlock-cookie";
import { createAdminSupabase } from "@/lib/supabase/admin-client";
import { getStripe } from "@/lib/stripe/server";
import { getSupabaseUserFromAccessToken } from "@/lib/supabase/verify-access-token";

export const runtime = "nodejs";

const bodySchema = z.object({
  stripeCheckoutSessionId: z.string().min(8),
});

async function authorizeCustomerPortalAccess(args: {
  stripeCheckoutSessionId: string;
  cookieSessionId: string | null;
  bearerToken: string | null;
}): Promise<boolean> {
  const sid = args.stripeCheckoutSessionId;
  if (args.cookieSessionId && args.cookieSessionId === sid) {
    const gate = await gatePaidPurchaseForPdf(sid);
    return gate !== "deny_revoked";
  }
  if (args.bearerToken) {
    const user = await getSupabaseUserFromAccessToken(args.bearerToken);
    if (!user?.id) return false;
    const r = await resolvePdfPurchaseForBearer({
      stripeCheckoutSessionId: sid,
      userId: user.id,
      email: user.email,
    });
    return r.ok;
  }
  return false;
}

/**
 * POST JSON `{ stripeCheckoutSessionId }` — cookie déblocage rapport **ou** Bearer Supabase
 * (même règles que PDF). Retourne `{ url }` vers le Customer Portal Stripe.
 */
export async function POST(req: Request) {
  if (!isStripeCheckoutConfigured()) {
    return Response.json(
      { error: "stripe_disabled", message: "Stripe n’est pas configuré." },
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
    return Response.json({ error: "invalid_body" }, { status: 400 });
  }

  const stripeCheckoutSessionId = parsed.data.stripeCheckoutSessionId.trim();

  const cookieStore = await cookies();
  const token = cookieStore.get(REPORT_UNLOCK_COOKIE)?.value;
  const unlock = token ? verifyReportUnlock(token) : null;
  const cookieSessionId = unlock?.sessionId ?? null;

  const authHeader = req.headers.get("authorization");
  const bearer =
    authHeader?.toLowerCase().startsWith("bearer ") ? authHeader.slice(7).trim() : null;

  const ok = await authorizeCustomerPortalAccess({
    stripeCheckoutSessionId,
    cookieSessionId,
    bearerToken: bearer,
  });
  if (!ok) {
    return Response.json(
      {
        error: "forbidden",
        message:
          "Accès refusé — ouvre le rapport depuis ce navigateur après paiement, ou envoie un Bearer Supabase lié à l’achat.",
      },
      { status: 403 },
    );
  }

  const admin = createAdminSupabase();
  let customerId: string | null = null;

  if (admin) {
    const { data: row } = await admin
      .from("purchases")
      .select("stripe_customer_id")
      .eq("stripe_checkout_session_id", stripeCheckoutSessionId)
      .maybeSingle();
    const cid = row?.stripe_customer_id;
    if (typeof cid === "string" && cid.startsWith("cus_")) {
      customerId = cid.trim();
    }
  }

  if (!customerId) {
    try {
      const session = await stripe.checkout.sessions.retrieve(stripeCheckoutSessionId);
      const c = session.customer;
      if (typeof c === "string" && c.startsWith("cus_")) {
        customerId = c;
      } else if (c && typeof c === "object" && "id" in c) {
        const id = String((c as { id: unknown }).id);
        if (id.startsWith("cus_")) customerId = id;
      }
    } catch {
      return Response.json(
        { error: "stripe_session_error", message: "Session Stripe introuvable." },
        { status: 404 },
      );
    }
  }

  if (!customerId) {
    return Response.json(
      {
        error: "no_stripe_customer",
        message: "Aucun client Stripe (cus_…) pour cette session — contacte le support.",
      },
      { status: 422 },
    );
  }

  if (admin && customerId) {
    await admin
      .from("purchases")
      .update({ stripe_customer_id: customerId })
      .eq("stripe_checkout_session_id", stripeCheckoutSessionId)
      .is("stripe_customer_id", null);
  }

  const base = appBaseUrl();
  const returnUrl = `${base}/report`;

  try {
    const portal = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: returnUrl,
    });
    if (!portal.url) {
      return Response.json({ error: "no_portal_url" }, { status: 500 });
    }
    return Response.json({ url: portal.url });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "portal_error";
    console.error("[stripe customer portal]", msg);
    return Response.json(
      {
        error: "portal_create_failed",
        message:
          "Impossible d’ouvrir le portail — active le Customer Portal dans le dashboard Stripe (voir docs/V2_A_FAIRE.md).",
      },
      { status: 502 },
    );
  }
}
