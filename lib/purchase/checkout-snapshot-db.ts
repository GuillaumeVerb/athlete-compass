import { randomUUID } from "crypto";
import { createAdminSupabase } from "@/lib/supabase/admin-client";
import type { ReportSnapshotV1 } from "@/lib/purchase/report-snapshot-types";

export async function insertPendingCheckoutSnapshot(
  payload: ReportSnapshotV1,
): Promise<string | null> {
  const s = createAdminSupabase();
  if (!s) return null;
  const id = randomUUID();
  const { error } = await s.from("checkout_snapshots").insert({
    id,
    payload,
  });
  if (error) {
    console.error("[checkout_snapshots insert]", error.message);
    return null;
  }
  return id;
}

export async function takePendingCheckoutSnapshot(
  snapshotId: string,
): Promise<ReportSnapshotV1 | null> {
  const s = createAdminSupabase();
  if (!s) return null;
  const { data, error } = await s
    .from("checkout_snapshots")
    .select("payload")
    .eq("id", snapshotId)
    .maybeSingle();
  if (error || !data?.payload) return null;
  await s.from("checkout_snapshots").delete().eq("id", snapshotId);
  return data.payload as ReportSnapshotV1;
}
