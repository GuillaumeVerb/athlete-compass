"use client";

import { useEffect } from "react";
import { DEMO_PROFILE } from "@/lib/mock-data";
import { loadProfile } from "@/lib/storage";
import { createBrowserSupabase } from "@/lib/supabase/browser-client";
import { runPullDailyStepsFromCloud } from "@/lib/daily/daily-steps-sync";

/** Pull cloud une fois au chargement de l’app (session Supabase uniquement). */
export function DailyStepsCloudBootstrap() {
  useEffect(() => {
    let cancelled = false;
    void (async () => {
      const supabase = createBrowserSupabase();
      if (!supabase) return;
      const { data } = await supabase.auth.getSession();
      if (!data.session || cancelled) return;
      const profile = loadProfile() ?? DEMO_PROFILE;
      await runPullDailyStepsFromCloud(profile);
    })();
    return () => {
      cancelled = true;
    };
  }, []);
  return null;
}
