/**
 * Indique si les intégrations cloud / paiement sont configurées.
 * La V1 fonctionne sans aucune de ces variables.
 */

export function isSupabaseBrowserConfigured(): boolean {
  return !!(
    process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim()
  );
}

export function isSupabaseAdminConfigured(): boolean {
  return !!(
    process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() &&
    process.env.SUPABASE_SERVICE_ROLE_KEY?.trim()
  );
}

export function isStripeSecretConfigured(): boolean {
  return !!process.env.STRIPE_SECRET_KEY?.trim();
}

/** Checkout utilisable : clé Stripe + les trois Price IDs catalogue. */
export function isStripeCheckoutConfigured(): boolean {
  return (
    isStripeSecretConfigured() &&
    !!process.env.STRIPE_PRICE_BILAN_9?.trim() &&
    !!process.env.STRIPE_PRICE_PLAN_19?.trim() &&
    !!process.env.STRIPE_PRICE_PACK_29?.trim()
  );
}

/** Email post-achat (Resend) — optionnel. */
export function isResendEmailConfigured(): boolean {
  return !!(
    process.env.RESEND_API_KEY?.trim() &&
    process.env.RESEND_FROM_EMAIL?.trim()
  );
}

export function appBaseUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_APP_URL?.trim();
  if (explicit) return explicit.replace(/\/$/, "");
  const vercel = process.env.VERCEL_URL?.trim();
  if (vercel) return `https://${vercel.replace(/\/$/, "")}`;
  return "http://localhost:3000";
}
