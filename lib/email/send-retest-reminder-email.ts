import { appBaseUrl } from "@/lib/env/cloud-ready";

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/**
 * E-mail « retest » (Resend). Idempotence via `Idempotency-Key` par rappel.
 * Sans Resend configuré : `skipped: true` (le cron ne marque pas comme envoyé).
 */
export async function sendRetestReminderEmail(input: {
  to: string | null | undefined;
  anchorAssessmentId: string;
  reminderId: string;
}): Promise<{ skipped: boolean; sent?: boolean; error?: string }> {
  const key = process.env.RESEND_API_KEY?.trim();
  const from = process.env.RESEND_FROM_EMAIL?.trim();
  if (!key || !from) return { skipped: true };

  const to = input.to?.trim();
  if (!to) return { skipped: true };

  const base = appBaseUrl();
  const nextTestUrl = `${base}/next-test?retestAnchor=${encodeURIComponent(input.anchorAssessmentId)}`;
  const bilansUrl = `${base}/bilans?remind=${encodeURIComponent(input.anchorAssessmentId)}`;

  const html = `
<p>C&apos;est l&apos;heure de ton <strong>retest</strong> Athlete Compass (rappel que tu as programmé).</p>
<p>Bilan de référence : <code style="font-size:12px">${escapeHtml(input.anchorAssessmentId)}</code></p>
<p><a href="${escapeHtml(nextTestUrl)}">Ouvrir le protocole retest</a> — ou <a href="${escapeHtml(bilansUrl)}">Mes bilans</a> pour enregistrer un nouveau snapshot.</p>
<p style="color:#666;font-size:12px">Réf. rappel : ${escapeHtml(input.reminderId)}</p>
`.trim();

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
      "Idempotency-Key": `retest-reminder-${input.reminderId}`,
    },
    body: JSON.stringify({
      from,
      to: [to],
      subject: "Athlete Compass — rappel retest",
      html,
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    return { skipped: false, error: text.slice(0, 400) };
  }
  return { skipped: false, sent: true };
}
