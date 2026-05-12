import { cookies } from "next/headers";
import { buildReportPdf } from "@/lib/report/build-report-pdf";
import { fetchUnlockReportSnapshot } from "@/lib/purchase/fetch-unlock-report-snapshot";
import {
  gatePaidPurchaseForPdf,
  resolvePdfPurchaseForBearer,
} from "@/lib/purchase/pdf-access";
import {
  REPORT_UNLOCK_COOKIE,
  verifyReportUnlock,
} from "@/lib/purchase/report-unlock-cookie";
import type { PurchaseProductKey } from "@/lib/future/cloud-types";
import { getSupabaseUserFromAccessToken } from "@/lib/supabase/verify-access-token";

export const runtime = "nodejs";

/**
 * GET — PDF synthétique du rapport débloqué.
 *
 * Auth :
 * - **Cookie** `ac_report_unlock` (parcours navigateur après paiement) + achat `paid` si ligne présente.
 * - **Bearer** JWT Supabase + query `session_id` = id session Checkout : email JWT = `purchases.customer_email`.
 */
export async function GET(req: Request) {
  const url = new URL(req.url);
  const sessionIdParam = url.searchParams.get("session_id");

  const authHeader = req.headers.get("authorization");
  const bearer =
    authHeader?.toLowerCase().startsWith("bearer ") ? authHeader.slice(7).trim() : null;

  const cookieStore = await cookies();
  const token = cookieStore.get(REPORT_UNLOCK_COOKIE)?.value;
  const unlock = token ? verifyReportUnlock(token) : null;

  let sessionId: string;
  let productKey: PurchaseProductKey;

  if (unlock) {
    const gate = await gatePaidPurchaseForPdf(unlock.sessionId);
    if (gate === "deny_revoked") {
      return new Response("Accès refusé — achat non valide ou remboursé.", {
        status: 403,
        headers: { "Content-Type": "text/plain; charset=utf-8" },
      });
    }
    sessionId = unlock.sessionId;
    productKey = unlock.productKey;
  } else if (bearer && sessionIdParam) {
    const user = await getSupabaseUserFromAccessToken(bearer);
    const resolved = await resolvePdfPurchaseForBearer({
      stripeCheckoutSessionId: sessionIdParam,
      email: user?.email,
    });
    if (!resolved.ok) {
      return new Response(
        "Accès refusé — JWT invalide, session inconnue, ou email du compte différent de l’email d’achat Stripe.",
        {
          status: 403,
          headers: { "Content-Type": "text/plain; charset=utf-8" },
        },
      );
    }
    sessionId = sessionIdParam;
    productKey = resolved.productKey;
  } else {
    return new Response(
      "Accès refusé — cookie de déblocage absent ou expiré. Alternative API : Authorization: Bearer <access_token Supabase> et query ?session_id=<id_session_checkout>.",
      {
        status: 401,
        headers: { "Content-Type": "text/plain; charset=utf-8" },
      },
    );
  }

  const snapshot = await fetchUnlockReportSnapshot(sessionId);
  if (!snapshot) {
    return new Response(
      "Aucun bilan serveur pour cette session — complète le checkout avec snapshot ou ouvre le rapport depuis le même navigateur après paiement.",
      { status: 404, headers: { "Content-Type": "text/plain; charset=utf-8" } },
    );
  }

  const bytes = await buildReportPdf({
    productKey,
    snapshot,
  });

  const body = new Uint8Array(bytes.byteLength);
  body.set(bytes);
  return new Response(body, {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition":
        'attachment; filename="rapport-athlete-compass-aperçu.pdf"',
      "Cache-Control": "private, no-store",
    },
  });
}
