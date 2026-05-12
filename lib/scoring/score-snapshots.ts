import type { PrimaryGoal, PerformanceInput, UserProfile } from "@/lib/types";
import { computeScoreResult } from "./index";

export const SCORE_SNAPSHOTS_CHANGED_EVENT = "ac-score-snapshots-changed";

const KEY = "ac_score_snapshots_v1";
const MAX_ENTRIES = 30;
/** Ignore un doublon si même score + fiabilité dans cette fenêtre (double submit). */
const DEDUPE_WINDOW_MS = 90_000;

export type ScoreSnapshotEntry = {
  savedAt: string;
  hybridScore: number;
  reliabilityPct: number;
  realAge: number;
  /** Absent sur les tout premiers snapshots (avant ce champ) ; requis pour la courbe âge athl. */
  athleticAge?: number;
  goal: PrimaryGoal;
};

type StoreV1 = { v: 1; entries: ScoreSnapshotEntry[] };

/** Enveloppe d’export JSON (sauvegarde / transfert manuel). */
export type ScoreSnapshotsExportV1 = {
  format: "athlete-compass-score-snapshots";
  version: 1;
  exportedAt: string;
  entries: ScoreSnapshotEntry[];
};

/** Tri chronologique croissant pour un fichier lisible. */
export function buildScoreSnapshotsExport(entries: ScoreSnapshotEntry[]): ScoreSnapshotsExportV1 {
  const sorted = [...entries].sort(
    (a, b) => new Date(a.savedAt).getTime() - new Date(b.savedAt).getTime(),
  );
  return {
    format: "athlete-compass-score-snapshots",
    version: 1,
    exportedAt: new Date().toISOString(),
    entries: sorted,
  };
}

/** Vide le stockage local et notifie les écrans (ex. Résultats). */
export function clearScoreSnapshots(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(KEY);
  window.dispatchEvent(new CustomEvent(SCORE_SNAPSHOTS_CHANGED_EVENT));
}

/** Fusion pure (tests) : tête + entrée + dédup proche + plafond. */
export function mergeScoreSnapshotEntries(
  prev: ScoreSnapshotEntry[],
  entry: ScoreSnapshotEntry,
  max: number,
  dedupeWindowMs: number,
): ScoreSnapshotEntry[] {
  const [head, ...rest] = prev;
  if (head) {
    const sameScore =
      head.hybridScore === entry.hybridScore && head.reliabilityPct === entry.reliabilityPct;
    if (sameScore) {
      const dt = new Date(entry.savedAt).getTime() - new Date(head.savedAt).getTime();
      if (dt >= 0 && dt < dedupeWindowMs) return prev;
    }
  }
  return [entry, ...prev].slice(0, max);
}

export function loadScoreSnapshots(): ScoreSnapshotEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as Partial<StoreV1>;
    if (parsed.v !== 1 || !Array.isArray(parsed.entries)) return [];
    return parsed.entries.filter(
      (e): e is ScoreSnapshotEntry =>
        typeof e?.savedAt === "string" &&
        typeof e?.hybridScore === "number" &&
        typeof e?.reliabilityPct === "number" &&
        typeof e?.realAge === "number" &&
        typeof e?.goal === "string",
    );
  } catch {
    return [];
  }
}

function saveSnapshots(entries: ScoreSnapshotEntry[]): void {
  if (typeof window === "undefined") return;
  const payload: StoreV1 = { v: 1, entries };
  localStorage.setItem(KEY, JSON.stringify(payload));
  window.dispatchEvent(new CustomEvent(SCORE_SNAPSHOTS_CHANGED_EVENT));
}

/** À appeler après une sauvegarde performances réussie (navigateur). */
export function recordScoreSnapshot(profile: UserProfile, perf: PerformanceInput): void {
  if (typeof window === "undefined") return;
  const r = computeScoreResult(profile, perf);
  const entry: ScoreSnapshotEntry = {
    savedAt: new Date().toISOString(),
    hybridScore: r.hybridScore,
    reliabilityPct: r.reliabilityPct,
    realAge: r.realAge,
    athleticAge: r.athleticAge,
    goal: profile.goal,
  };
  const prev = loadScoreSnapshots();
  const next = mergeScoreSnapshotEntries(prev, entry, MAX_ENTRIES, DEDUPE_WINDOW_MS);
  if (next === prev) return;
  saveSnapshots(next);
}
