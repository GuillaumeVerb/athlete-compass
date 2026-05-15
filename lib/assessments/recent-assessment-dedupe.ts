import type { SupabaseClient } from "@supabase/supabase-js";

const DEFAULT_WINDOW_MS = 120_000;

export type RecentAssessmentDuplicate = { id: string; createdAt: string };

/**
 * Évite les doubles clics : même triple score pour le même utilisateur dans une fenêtre courte.
 */
export async function findRecentAssessmentDuplicate(args: {
  supabase: SupabaseClient;
  userId: string;
  hybridScore: number;
  athleticAge: number;
  reliabilityPct: number;
  windowMs?: number;
}): Promise<RecentAssessmentDuplicate | null> {
  const windowMs = args.windowMs ?? DEFAULT_WINDOW_MS;
  const since = new Date(Date.now() - windowMs).toISOString();

  const { data, error } = await args.supabase
    .from("assessments")
    .select("id, created_at, hybrid_score, athletic_age, reliability_pct")
    .eq("user_id", args.userId)
    .gte("created_at", since)
    .order("created_at", { ascending: false })
    .limit(15);

  if (error || !data?.length) return null;

  for (const row of data) {
    if (
      Number(row.hybrid_score) === args.hybridScore &&
      Number(row.athletic_age) === args.athleticAge &&
      Number(row.reliability_pct) === args.reliabilityPct
    ) {
      return { id: row.id as string, createdAt: row.created_at as string };
    }
  }
  return null;
}
