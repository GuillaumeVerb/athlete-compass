import { createAdminSupabase } from "@/lib/supabase/admin-client";

export type PremiumReportMeta = {
  status: "draft" | "ready" | "failed";
  pdfUrl: string | null;
  updatedAt: string;
};

export async function fetchPremiumReportMeta(
  stripeCheckoutSessionId: string,
): Promise<PremiumReportMeta | null> {
  const s = createAdminSupabase();
  if (!s) return null;
  const { data, error } = await s
    .from("premium_reports")
    .select("status, pdf_url, updated_at")
    .eq("stripe_checkout_session_id", stripeCheckoutSessionId)
    .maybeSingle();
  if (error || !data) return null;
  const status = data.status as PremiumReportMeta["status"];
  if (status !== "draft" && status !== "ready" && status !== "failed")
    return null;
  return {
    status,
    pdfUrl: (data.pdf_url as string | null) ?? null,
    updatedAt: String(data.updated_at),
  };
}
