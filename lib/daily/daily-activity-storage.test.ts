import { describe, expect, it } from "vitest";
import {
  DEFAULT_STEPS_GOAL,
  applyCloudStepRowsToStoreState,
  type DailyActivityStoreV1,
} from "./daily-activity-storage";

describe("daily-activity-storage", () => {
  it("objectif par défaut neutre (10 000 pas)", () => {
    expect(DEFAULT_STEPS_GOAL).toBe(10_000);
  });

  it("applyCloudStepRowsToStoreState fusionne les jours et prend l’objectif le plus récent", () => {
    const prev: DailyActivityStoreV1 = {
      v: 1,
      stepsByDay: { "2026-05-01": 100 },
      stepsGoal: 8000,
    };
    const next = applyCloudStepRowsToStoreState(prev, [
      { day: "2026-05-01", steps: 9000, stepsGoal: 10_000, updatedAt: "2026-05-02T10:00:00Z" },
      { day: "2026-05-03", steps: 5000, stepsGoal: 12_000, updatedAt: "2026-05-04T12:00:00Z" },
    ]);
    expect(next.stepsByDay["2026-05-01"]).toBe(9000);
    expect(next.stepsByDay["2026-05-03"]).toBe(5000);
    expect(next.stepsGoal).toBe(12_000);
  });
});
