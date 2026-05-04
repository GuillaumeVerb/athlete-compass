import { cookies } from "next/headers";
import { buildReportPdf } from "@/lib/report/build-report-pdf";
import { fetchUnlockReportSnapshot } from "@/lib/purchase/fetch-unlock-report-snapshot";
import {
  REPORT_UNLOCK_COOKIE,
  verifyReportUnlock,
} from "@/lib/purchase/report-unlock-cookie";

export const runtime = "nodejs";

/**
 * GET — PDF synthétique du rapport débloqué (cookie `ac_report_unlock` requis).
 * Données : `premium_reports` puis repli `purchases.report_snapshot`.
 */
export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get(REPORT_UNLOCK_COOKIE)?.value;
  const unlock = token ? verifyReportUnlock(token) : null;
  if (!unlock) {
    return new Response("Accès refusé — rapport non débloqué.", {
      status: 401,
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  }

  const snapshot = await fetchUnlockReportSnapshot(unlock.sessionId);
  if (!snapshot) {
    return new Response(
      "Aucun bilan serveur pour cette session — complète le checkout avec snapshot ou ouvre le rapport depuis le même navigateur après paiement.",
      { status: 404, headers: { "Content-Type": "text/plain; charset=utf-8" } },
    );
  }

  const bytes = await buildReportPdf({
    productKey: unlock.productKey,
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
