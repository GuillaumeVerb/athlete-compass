import { NextResponse } from "next/server";
import { appBaseUrl } from "@/lib/env/cloud-ready";
import { sendPurchaseConfirmationEmail } from "@/lib/email/send-purchase-confirmation";
import { purchaseInsertFromSession } from "@/lib/purchase/purchase-insert";
import {
  REPORT_UNLOCK_COOKIE,
  REPORT_UNLOCK_MAX_AGE,
  signReportUnlock,
} from "@/lib/purchase/report-unlock-cookie";
import { upsertPurchaseRow } from "@/lib/purchase/upsert-purchase";
import { getStripe } from "@/lib/stripe/server";

export const runtime = "nodejs";

/**
 * Retour Stripe success_url : vérifie la session, persiste l’achat (Supabase si
 * dispo), pose un cookie httpOnly pour débloquer `/report`, puis redirige.
 */
export async function GET(req: Request) {
  const base = appBaseUrl();
  const fail = new URL("/pricing?checkout=fail", base);

  const { searchParams } = new URL(req.url);
  const sessionId = searchParams.get("session_id");
  if (!sessionId) {
    return NextResponse.redirect(fail);
  }

  const stripe = getStripe();
  if (!stripe) {
    return NextResponse.redirect(fail);
  }

  let session: Awaited<ReturnType<typeof stripe.checkout.sessions.retrieve>>;
  try {
    session = await stripe.checkout.sessions.retrieve(sessionId);
  } catch {
    return NextResponse.redirect(fail);
  }

  if (session.payment_status !== "paid") {
    return NextResponse.redirect(fail);
  }

  await upsertPurchaseRow(session);

  const row = purchaseInsertFromSession(session);
  if (!row) {
    return NextResponse.redirect(fail);
  }

  const to =
    session.customer_details?.email ?? session.customer_email ?? null;
  void sendPurchaseConfirmationEmail({
    to,
    sessionId: session.id,
    productKey: row.product_key,
  }).catch((err) => console.error("[purchase confirmation email]", err));

  const token = signReportUnlock(session.id, row.product_key);
  const ok = new URL("/report", base);
  ok.searchParams.set("unlocked", "1");
  const res = NextResponse.redirect(ok);

  if (token) {
    res.cookies.set({
      name: REPORT_UNLOCK_COOKIE,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: REPORT_UNLOCK_MAX_AGE,
      path: "/",
    });
  }

  return res;
}
