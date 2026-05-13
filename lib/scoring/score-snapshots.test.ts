import { describe, expect, it } from "vitest";
import {
  buildScoreSnapshotsExport,
  mergeScoreSnapshotEntries,
  mergeScoreSnapshotsImportPure,
  parseScoreSnapshotEntry,
  parseScoreSnapshotsImportPayload,
  type ScoreSnapshotEntry,
} from "./score-snapshots";

const e = (savedAt: string, hybrid: number, rel: number, athleticAge = 32): ScoreSnapshotEntry => ({
  savedAt,
  hybridScore: hybrid,
  reliabilityPct: rel,
  realAge: 30,
  athleticAge,
  goal: "crossfit",
});

describe("buildScoreSnapshotsExport", () => {
  it("ordonne les entrées du plus ancien au plus récent et fixe les métadonnées", () => {
    const entries = [e("2026-01-02T00:00:00Z", 60, 50), e("2026-01-01T00:00:00Z", 55, 48)];
    const out = buildScoreSnapshotsExport(entries);
    expect(out.format).toBe("athlete-compass-score-snapshots");
    expect(out.version).toBe(1);
    expect(typeof out.exportedAt).toBe("string");
    expect(out.entries).toHaveLength(2);
    expect(out.entries[0].savedAt).toBe("2026-01-01T00:00:00Z");
    expect(out.entries[1].savedAt).toBe("2026-01-02T00:00:00Z");
  });
});

describe("mergeScoreSnapshotEntries", () => {
  it("ajoute en tête et respecte le max", () => {
    const prev = [e("2026-01-02T00:00:00Z", 60, 50)];
    const out = mergeScoreSnapshotEntries(prev, e("2026-01-03T00:00:00Z", 61, 55), 2, 90_000);
    expect(out).toHaveLength(2);
    expect(out[0].hybridScore).toBe(61);
  });

  it("ignore un doublon proche (même score + fiabilité)", () => {
    const prev = [e("2026-01-01T12:00:00Z", 70, 40)];
    const out = mergeScoreSnapshotEntries(prev, e("2026-01-01T12:00:30Z", 70, 40), 10, 90_000);
    expect(out).toEqual(prev);
  });

  it("accepte le même score après la fenêtre de dédup", () => {
    const prev = [e("2026-01-01T12:00:00Z", 70, 40)];
    const out = mergeScoreSnapshotEntries(prev, e("2026-01-01T14:00:00Z", 70, 40), 10, 90_000);
    expect(out).toHaveLength(2);
    expect(out[0].savedAt).toBe("2026-01-01T14:00:00Z");
  });
});

describe("parseScoreSnapshotEntry", () => {
  it("accepte une entrée valide et refuse un goal inconnu", () => {
    const row = {
      savedAt: "2026-01-01T00:00:00Z",
      hybridScore: 60,
      reliabilityPct: 50,
      realAge: 30,
      goal: "hyrox",
    };
    expect(parseScoreSnapshotEntry(row)?.goal).toBe("hyrox");
    expect(parseScoreSnapshotEntry({ ...row, goal: "triathlon" })).toBeNull();
    expect(parseScoreSnapshotEntry(null)).toBeNull();
  });
});

describe("parseScoreSnapshotsImportPayload", () => {
  it("refuse un format ou une version incorrects", () => {
    expect(parseScoreSnapshotsImportPayload({}).ok).toBe(false);
    expect(parseScoreSnapshotsImportPayload({ format: "other", version: 1, entries: [] }).ok).toBe(
      false,
    );
    expect(
      parseScoreSnapshotsImportPayload({
        format: "athlete-compass-score-snapshots",
        version: 2,
        entries: [],
      }).ok,
    ).toBe(false);
  });

  it("accepte un export v1 et filtre les lignes invalides", () => {
    const payload = {
      format: "athlete-compass-score-snapshots" as const,
      version: 1 as const,
      exportedAt: "2026-01-01T00:00:00Z",
      entries: [
        e("2026-01-01T00:00:00Z", 55, 40),
        { savedAt: "x", hybridScore: NaN, reliabilityPct: 1, realAge: 1, goal: "crossfit" },
      ],
    };
    const r = parseScoreSnapshotsImportPayload(payload);
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.entries).toHaveLength(1);
  });
});

describe("mergeScoreSnapshotsImportPure", () => {
  it("fusionne les entrées entrantes (plus récent d’abord) avec la série courante", () => {
    const current = [e("2026-01-03T00:00:00Z", 62, 52)];
    const incoming = [e("2026-01-01T00:00:00Z", 58, 45), e("2026-01-02T00:00:00Z", 60, 48)];
    const out = mergeScoreSnapshotsImportPure(current, incoming);
    expect(out.map((x) => x.savedAt)).toContain("2026-01-03T00:00:00Z");
    expect(out.map((x) => x.savedAt)).toContain("2026-01-02T00:00:00Z");
    expect(out.map((x) => x.savedAt)).toContain("2026-01-01T00:00:00Z");
  });
});
