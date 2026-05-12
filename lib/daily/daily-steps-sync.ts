"use client";

import type { UserProfile } from "@/lib/types";
import { fetchDailyStepsFromCloud } from "@/lib/daily/daily-steps-api-client";
import {
  loadDailyActivityStore,
  mergeDailyActivityFromCloud,
} from "@/lib/daily/daily-activity-storage";

/** GET cloud → merge local. Retourne `true` si le store a changé. */
export async function pullDailyStepsFromCloud(profile: UserProfile): Promise<boolean> {
  const res = await fetchDailyStepsFromCloud();
  if (!res.ok) return false;
  if (res.rows.length === 0) return false;
  const before = JSON.stringify(loadDailyActivityStore(profile));
  mergeDailyActivityFromCloud(profile, res.rows);
  const after = JSON.stringify(loadDailyActivityStore(profile));
  return before !== after;
}
