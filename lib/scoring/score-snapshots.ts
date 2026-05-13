import type { PrimaryGoal, PerformanceInput, UserProfile } from "@/lib/types";
import { computeScoreResult } from "./index";

const PRIMARY_GOAL_SET = new Set<string>([
  "crossfit",
  "hyrox",
  "recomp",
  "endurance",
  "strength_aesthetics",
]);

function isPrimaryGoalString(s: string): s is PrimaryGoal {
  return PRIMARY_GOAL_SET.has(s);
}

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

/** Valide une entrée JSON (export ou stockage interne). */
export function parseScoreSnapshotEntry(e: unknown): ScoreSnapshotEntry | null {
  if (!e || typeof e !== "object") return null;
  const o = e as Record<string, unknown>;
  if (typeof o.savedAt !== "string") return null;
  if (typeof o.hybridScore !== "number" || !Number.isFinite(o.hybridScore)) return null;
  if (typeof o.reliabilityPct !== "number" || !Number.isFinite(o.reliabilityPct)) return null;
  if (typeof o.realAge !== "number" || !Number.isFinite(o.realAge)) return null;
  if (typeof o.goal !== "string" || !isPrimaryGoalString(o.goal)) return null;
  const athleticAge =
    typeof o.athleticAge === "number" && Number.isFinite(o.athleticAge) ? o.athleticAge : undefined;
  const entry: ScoreSnapshotEntry = {
    savedAt: o.savedAt,
    hybridScore: o.hybridScore,
    reliabilityPct: o.reliabilityPct,
    realAge: o.realAge,
    goal: o.goal,
  };
  if (athleticAge !== undefined) entry.athleticAge = athleticAge;
  return entry;
}

/** Parse un fichier exporté (`buildScoreSnapshotsExport`). */
export function parseScoreSnapshotsImportPayload(
  data: unknown,
): { ok: true; entries: ScoreSnapshotEntry[] } | { ok: false; error: string } {
  if (!data || typeof data !== "object") {
    return { ok: false, error: "Fichier invalide ou vide." };
  }
  const o = data as Record<string, unknown>;
  if (o.format !== "athlete-compass-score-snapshots") {
    return { ok: false, error: "Format non reconnu (export Athlete Compass attendu)." };
  }
  if (o.version !== 1) {
    return { ok: false, error: "Version d’export non prise en charge." };
  }
  if (!Array.isArray(o.entries)) {
    return { ok: false, error: "Champ « entries » manquant ou invalide." };
  }
  const entries = o.entries
    .map((row) => parseScoreSnapshotEntry(row))
    .filter((row): row is ScoreSnapshotEntry => row != null);
  if (entries.length === 0) {
    return { ok: false, error: "Aucune entrée valide dans le fichier." };
  }
  return { ok: true, entries };
}

/** Fusion import + série existante (pur, testable sans `localStorage`). */
export function mergeScoreSnapshotsImportPure(
  current: ScoreSnapshotEntry[],
  incoming: ScoreSnapshotEntry[],
): ScoreSnapshotEntry[] {
  let acc = [...current];
  const sorted = [...incoming].sort(
    (a, b) => new Date(b.savedAt).getTime() - new Date(a.savedAt).getTime(),
  );
  for (const e of sorted) {
    acc = mergeScoreSnapshotEntries(acc, e, MAX_ENTRIES, DEDUPE_WINDOW_MS);
  }
  return acc;
}

export function loadScoreSnapshots(): ScoreSnapshotEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as Partial<StoreV1>;
    if (parsed.v !== 1 || !Array.isArray(parsed.entries)) return [];
    return parsed.entries
      .map((row) => parseScoreSnapshotEntry(row))
      .filter((row): row is ScoreSnapshotEntry => row != null);
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

/** Fusionne dans le stockage navigateur. Retourne `true` si le stockage a changé. */
export function applyScoreSnapshotsImport(incoming: ScoreSnapshotEntry[]): boolean {
  if (typeof window === "undefined") return false;
  const prev = loadScoreSnapshots();
  const next = mergeScoreSnapshotsImportPure(prev, incoming);
  if (JSON.stringify(prev) === JSON.stringify(next)) return false;
  saveSnapshots(next);
  return true;
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
