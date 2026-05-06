import { createClient } from "@supabase/supabase-js";

/** Résout l’utilisateur à partir d’un access_token JWT (clé anon, sans session persistante). */
export async function getUserIdFromSupabaseAccessToken(
  accessToken: string,
): Promise<string | null> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();
  if (!url || !anon) return null;

  const supabase = createClient(url, anon, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const { data, error } = await supabase.auth.getUser(accessToken);
  if (error || !data.user) return null;
  return data.user.id;
}
