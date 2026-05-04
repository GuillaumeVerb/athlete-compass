import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { isSupabaseAdminConfigured } from "@/lib/env/cloud-ready";

/**
 * Client service-role — routes serveur / webhooks uniquement.
 * null si non configuré (ne jamais exposer cette clé au client).
 */
export function createAdminSupabase(): SupabaseClient | null {
  if (!isSupabaseAdminConfigured()) return null;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
