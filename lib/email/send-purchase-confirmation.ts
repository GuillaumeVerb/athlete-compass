import { appBaseUrl } from "@/lib/env/cloud-ready";
import type { PurchaseProductKey } from "@/lib/future/cloud-types";
import { productKeyLabelFr } from "@/lib/purchase/product-key-label";

export function isResendEmailConfigured(): boolean {
  return !!(
    process.env.RESEND_API_KEY?.trim() &&
    process.env.RESEND_FROM_EMAIL?.trim()
  );
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/**
 * Email transactionnel post-achat (Resend). Idempotence côté Resend via
 * `Idempotency-Key` (webhook + complete peuvent tous deux appeler).
 */
export async function sendPurchaseConfirmationEmail(input: {
  to: string | null | undefined;
  sessionId: string;
  productKey: PurchaseProductKey;
}): Promise<{ skipped: boolean; sent?: boolean; error?: string }> {
  const key = process.env.RESEND_API_KEY?.trim();
  const from = process.env.RESEND_FROM_EMAIL?.trim();
  if (!key || !from) return { skipped: true };

  const to = input.to?.trim();
  if (!to) return { skipped: true };

  const base = appBaseUrl();
  const label = productKeyLabelFr(input.productKey);
  const reportUrl = `${base}/report`;

  const html = `
<p>Merci pour ton achat.</p>
<p><strong>${escapeHtml(label)}</strong> — accès rapport : <a href="${escapeHtml(reportUrl)}">ouvrir ton rapport</a>.</p>
<p style="color:#666;font-size:12px">Réf. paiement : ${escapeHtml(input.sessionId)}</p>
`.trim();

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
      "Idempotency-Key": `purchase-confirm-${input.sessionId}`,
    },
    body: JSON.stringify({
      from,
      to: [to],
      subject: `Athlete Compass — ${label} confirmé`,
      html,
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    return { skipped: false, error: text.slice(0, 400) };
  }
  return { skipped: false, sent: true };
}
