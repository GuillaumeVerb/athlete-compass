import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { isSupabaseBrowserConfigured } from "@/lib/env/cloud-ready";

/** Client navigateur — null si variables publiques absentes (V1 locale). */
export function createBrowserSupabase(): SupabaseClient | null {
  if (!isSupabaseBrowserConfigured()) return null;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  return createClient(url, anon);
}
