import { createAdminSupabase } from "@/lib/supabase/admin-client";
import {
  isSupabaseReportPdfPersistenceConfigured,
  reportPdfStorageBucketName,
} from "@/lib/env/cloud-ready";

const OBJECT_FILE = "rapport-aperçu-v1.pdf";

/** Chemin objet dans le bucket (identifiant Stripe reste ASCII sûr). */
export function reportPdfStorageObjectPath(stripeCheckoutSessionId: string): string {
  return `${stripeCheckoutSessionId}/${OBJECT_FILE}`;
}

/**
 * Si `premium_reports.pdf_url` pointe vers un objet existant, retourne les octets PDF.
 * Sinon null (génération nécessaire).
 */
export async function loadPersistedReportPdfIfAny(
  stripeCheckoutSessionId: string,
): Promise<Uint8Array | null> {
  if (!isSupabaseReportPdfPersistenceConfigured()) return null;
  const bucket = reportPdfStorageBucketName()!;
  const supabase = createAdminSupabase();
  if (!supabase) return null;

  const { data: row, error: selErr } = await supabase
    .from("premium_reports")
    .select("pdf_url")
    .eq("stripe_checkout_session_id", stripeCheckoutSessionId)
    .maybeSingle();
  if (selErr || !row?.pdf_url || typeof row.pdf_url !== "string") return null;
  const path = row.pdf_url.trim();
  if (!path) return null;

  const { data: blob, error: dlErr } = await supabase.storage.from(bucket).download(path);
  if (dlErr || !blob) return null;
  const ab = await blob.arrayBuffer();
  return new Uint8Array(ab);
}

/**
 * Écrit le PDF dans Storage et met à jour `premium_reports.pdf_url` (ligne existante uniquement).
 * Silencieux si config absente, pas de ligne premium_reports, ou erreur upload.
 */
export async function persistGeneratedReportPdf(
  stripeCheckoutSessionId: string,
  pdfBytes: Uint8Array,
): Promise<void> {
  if (!isSupabaseReportPdfPersistenceConfigured()) return;
  const bucket = reportPdfStorageBucketName()!;
  const supabase = createAdminSupabase();
  if (!supabase) return;

  const { data: row, error: selErr } = await supabase
    .from("premium_reports")
    .select("pdf_url")
    .eq("stripe_checkout_session_id", stripeCheckoutSessionId)
    .maybeSingle();
  if (selErr || !row) return;
  if (row.pdf_url && String(row.pdf_url).trim()) return;

  const path = reportPdfStorageObjectPath(stripeCheckoutSessionId);
  const body = Buffer.from(pdfBytes);

  const { error: upErr } = await supabase.storage.from(bucket).upload(path, body, {
    contentType: "application/pdf",
    upsert: true,
  });
  if (upErr) {
    console.error("[report pdf storage upload]", upErr.message);
    return;
  }

  const updated_at = new Date().toISOString();
  const { error: patchErr } = await supabase
    .from("premium_reports")
    .update({ pdf_url: path, updated_at })
    .eq("stripe_checkout_session_id", stripeCheckoutSessionId);
  if (patchErr) {
    console.error("[report pdf premium_reports pdf_url]", patchErr.message);
  }
}
