"use client";

import type { UserProfile } from "@/lib/types";
import { fetchDailyStepsFromCloud } from "@/lib/daily/daily-steps-api-client";
import {
  loadDailyActivityStore,
  mergeDailyActivityFromCloud,
} from "@/lib/daily/daily-activity-storage";
import { writeDailyStepsSyncMeta } from "@/lib/daily/daily-steps-sync-meta";

export type PullDailyStepsResult =
  | { ok: true; changed: boolean; rowsReceived: number }
  | { ok: false; reason: "no_session" | "skipped_admin" | "fetch_failed"; detail?: string };

/** GET cloud → merge local + méta synchro. */
export async function runPullDailyStepsFromCloud(profile: UserProfile): Promise<PullDailyStepsResult> {
  try {
    const res = await fetchDailyStepsFromCloud();
    if (!res.ok) {
      if (res.skipped) {
        writeDailyStepsSyncMeta({ lastPullError: "skipped_admin" });
        return { ok: false, reason: "skipped_admin" };
      }
      if (res.error === "no_session") {
        writeDailyStepsSyncMeta({ lastPullError: "no_session" });
        return { ok: false, reason: "no_session" };
      }
      writeDailyStepsSyncMeta({ lastPullError: res.error });
      return { ok: false, reason: "fetch_failed", detail: res.error };
    }

    const rows = res.rows;
    if (rows.length === 0) {
      writeDailyStepsSyncMeta({
        lastPullAtIso: new Date().toISOString(),
        lastPullError: null,
      });
      return { ok: true, changed: false, rowsReceived: 0 };
    }

    const before = JSON.stringify(loadDailyActivityStore(profile));
    mergeDailyActivityFromCloud(profile, rows);
    const after = JSON.stringify(loadDailyActivityStore(profile));
    writeDailyStepsSyncMeta({
      lastPullAtIso: new Date().toISOString(),
      lastPullError: null,
    });
    return { ok: true, changed: before !== after, rowsReceived: rows.length };
  } catch (e) {
    const msg = e instanceof Error ? e.message : "network_error";
    writeDailyStepsSyncMeta({ lastPullError: msg });
    return { ok: false, reason: "fetch_failed", detail: msg };
  }
}

/** @deprecated Utiliser `runPullDailyStepsFromCloud`. */
export async function pullDailyStepsFromCloud(profile: UserProfile): Promise<boolean> {
  const r = await runPullDailyStepsFromCloud(profile);
  return r.ok && r.changed;
}
