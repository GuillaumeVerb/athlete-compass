import { z } from "zod";
import { linkSupabaseUserToPaidPurchase } from "@/lib/purchase/link-user-to-purchase";
import { getSupabaseUserFromAccessToken } from "@/lib/supabase/verify-access-token";

export const runtime = "nodejs";

const bodySchema = z.object({
  stripeCheckoutSessionId: z.string().min(8),
});

/**
 * POST JSON `{ stripeCheckoutSessionId }` + `Authorization: Bearer <access_token Supabase>`
 * → pose `purchases.user_id` si achat `paid`, `user_id` vide, et email Stripe = email du compte.
 */
export async function POST(req: Request) {
  const authHeader = req.headers.get("authorization");
  const bearer =
    authHeader?.toLowerCase().startsWith("bearer ") ? authHeader.slice(7).trim() : null;
  if (!bearer) {
    return Response.json(
      { error: "missing_bearer", message: "Authorization: Bearer <access_token> requis." },
      { status: 401 },
    );
  }

  const user = await getSupabaseUserFromAccessToken(bearer);
  if (!user?.id) {
    return Response.json(
      { error: "invalid_token", message: "JWT Supabase invalide ou expiré." },
      { status: 401 },
    );
  }

  let json: unknown;
  try {
    json = await req.json();
  } catch {
    return Response.json({ error: "invalid_json" }, { status: 400 });
  }

  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    return Response.json({ error: "invalid_body", details: parsed.error.flatten() }, { status: 400 });
  }

  const result = await linkSupabaseUserToPaidPurchase({
    stripeCheckoutSessionId: parsed.data.stripeCheckoutSessionId,
    supabaseUserId: user.id,
    supabaseUserEmail: user.email,
  });

  if (result.status === "linked") {
    return Response.json({ ok: true, linked: true });
  }
  if (result.status === "already_linked") {
    return Response.json({ ok: true, linked: false, alreadyLinked: true });
  }

  const messages: Record<string, string> = {
    not_found: "Aucun achat pour cette session Stripe.",
    not_paid: "Cet achat n’est pas au statut payé.",
    email_mismatch: "L’email du compte ne correspond pas à l’email de facture de l’achat.",
    user_already_set: "Cet achat est déjà lié à un autre compte.",
    admin_unavailable: "Base indisponible (configuration serveur).",
    db_error: "Erreur lecture / écriture base.",
    update_failed: "Mise à jour impossible.",
    race_or_conflict: "Conflit de liaison — réessaie ou contacte le support.",
    invalid_input: "Paramètres invalides.",
  };

  return Response.json(
    {
      error: result.code,
      message: messages[result.code] ?? result.code,
    },
    { status: result.http },
  );
}
