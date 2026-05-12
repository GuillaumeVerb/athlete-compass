"use client";

import { useEffect, useRef } from "react";
import { DEMO_PROFILE } from "@/lib/mock-data";
import { loadProfile } from "@/lib/storage";
import { pullDailyStepsFromCloud } from "@/lib/daily/daily-steps-sync";

/**
 * Au montage (quand `ready`), tire les pas depuis le cloud et fusionne le store local.
 * Appeler `onRevised` si des données ont été appliquées.
 */
export function useDailyStepsCloudPull(ready: boolean, onRevised: () => void): void {
  const onRevisedRef = useRef(onRevised);
  onRevisedRef.current = onRevised;

  useEffect(() => {
    if (!ready) return;
    let cancelled = false;
    void (async () => {
      const profile = loadProfile() ?? DEMO_PROFILE;
      const changed = await pullDailyStepsFromCloud(profile);
      if (!cancelled && changed) onRevisedRef.current();
    })();
    return () => {
      cancelled = true;
    };
  }, [ready]);
}
