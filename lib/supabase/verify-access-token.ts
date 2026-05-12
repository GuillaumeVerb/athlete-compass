import { createClient, type SupabaseClient } from "@supabase/supabase-js";

function createAnonAuthClient(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();
  if (!url || !anon) return null;
  return createClient(url, anon, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

/** Résout id + email à partir d’un access_token JWT (clé anon, sans session persistante). */
export async function getSupabaseUserFromAccessToken(
  accessToken: string,
): Promise<{ id: string; email: string | null } | null> {
  const supabase = createAnonAuthClient();
  if (!supabase) return null;
  const { data, error } = await supabase.auth.getUser(accessToken);
  if (error || !data.user) return null;
  return { id: data.user.id, email: data.user.email ?? null };
}

/** Résout l’utilisateur à partir d’un access_token JWT (clé anon, sans session persistante). */
export async function getUserIdFromSupabaseAccessToken(
  accessToken: string,
): Promise<string | null> {
  const u = await getSupabaseUserFromAccessToken(accessToken);
  return u?.id ?? null;
}
