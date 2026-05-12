"use client";

import { useEffect, useRef } from "react";
import { DEMO_PROFILE } from "@/lib/mock-data";
import { loadProfile } from "@/lib/storage";
import { runPullDailyStepsFromCloud, type PullDailyStepsResult } from "@/lib/daily/daily-steps-sync";

/**
 * Au montage (quand `ready`), tire les pas depuis le cloud et fusionne le store local.
 * `onRevised` si le store a changé ; `onSettled` après chaque tentative (succès ou échec).
 */
export function useDailyStepsCloudPull(
  ready: boolean,
  onRevised: () => void,
  onSettled?: (r: PullDailyStepsResult) => void,
): void {
  const onRevisedRef = useRef(onRevised);
  const onSettledRef = useRef(onSettled);
  onRevisedRef.current = onRevised;
  onSettledRef.current = onSettled;

  useEffect(() => {
    if (!ready) return;
    let cancelled = false;
    void (async () => {
      const profile = loadProfile() ?? DEMO_PROFILE;
      const r = await runPullDailyStepsFromCloud(profile);
      if (!cancelled) onSettledRef.current?.(r);
      if (!cancelled && r.ok && r.changed) onRevisedRef.current();
    })();
    return () => {
      cancelled = true;
    };
  }, [ready]);
}
