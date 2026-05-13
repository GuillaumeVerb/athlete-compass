import {
  isCronSecretConfigured,
  isResendEmailConfigured,
  isStripeCheckoutConfigured,
  isStripeSecretConfigured,
  isStripeWebhookConfigured,
  isSupabaseAdminConfigured,
  isSupabaseBrowserConfigured,
  isSupabaseReportPdfPersistenceConfigured,
} from "@/lib/env/cloud-ready";

/** GET — état des intégrations (aucun secret exposé). */
export async function GET() {
  return Response.json({
    supabaseBrowser: isSupabaseBrowserConfigured(),
    supabaseAdmin: isSupabaseAdminConfigured(),
    stripeSecret: isStripeSecretConfigured(),
    stripeWebhook: isStripeWebhookConfigured(),
    stripeCheckout: isStripeCheckoutConfigured(),
    resendEmail: isResendEmailConfigured(),
    cronRetestReminders: isCronSecretConfigured(),
    reportPdfStorage: isSupabaseReportPdfPersistenceConfigured(),
  });
}
