const KEY = "ac_daily_steps_sync_v1";

export type DailyStepsSyncMeta = {
  /** ISO 8601 — dernière tentative de pull réussie (même si rien à fusionner). */
  lastPullAtIso: string | null;
  /** Code machine ou message court ; effacé au prochain pull OK. */
  lastPullError: string | null;
};

export function readDailyStepsSyncMeta(): DailyStepsSyncMeta {
  if (typeof window === "undefined") {
    return { lastPullAtIso: null, lastPullError: null };
  }
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return { lastPullAtIso: null, lastPullError: null };
    const o = JSON.parse(raw) as Partial<DailyStepsSyncMeta>;
    return {
      lastPullAtIso: typeof o.lastPullAtIso === "string" ? o.lastPullAtIso : null,
      lastPullError: typeof o.lastPullError === "string" ? o.lastPullError : null,
    };
  } catch {
    return { lastPullAtIso: null, lastPullError: null };
  }
}

export function writeDailyStepsSyncMeta(patch: Partial<DailyStepsSyncMeta>): void {
  if (typeof window === "undefined") return;
  const prev = readDailyStepsSyncMeta();
  const next: DailyStepsSyncMeta = {
    lastPullAtIso: patch.lastPullAtIso !== undefined ? patch.lastPullAtIso : prev.lastPullAtIso,
    lastPullError: patch.lastPullError !== undefined ? patch.lastPullError : prev.lastPullError,
  };
  localStorage.setItem(KEY, JSON.stringify(next));
}

export function formatLastPullFr(iso: string | null): string {
  if (!iso) return "Jamais";
  try {
    return new Date(iso).toLocaleString("fr-FR", { dateStyle: "short", timeStyle: "short" });
  } catch {
    return "—";
  }
}
