import { describe, expect, it } from "vitest";
import { mergeScoreSnapshotEntries, type ScoreSnapshotEntry } from "./score-snapshots";

const e = (savedAt: string, hybrid: number, rel: number, athleticAge = 32): ScoreSnapshotEntry => ({
  savedAt,
  hybridScore: hybrid,
  reliabilityPct: rel,
  realAge: 30,
  athleticAge,
  goal: "crossfit",
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
